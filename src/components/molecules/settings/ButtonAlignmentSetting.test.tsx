import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonAlignmentSetting } from './ButtonAlignmentSetting';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// モックの作成
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockUpdateSettings = vi.fn();
const mockUseSettingsStore = vi.fn(() => ({
  settings: {
    buttonAlignment: '左',
  },
  updateSettings: mockUpdateSettings,
}));

vi.mock('@/stores/settingsStore', () => ({
  default: () => mockUseSettingsStore(),
}));

describe('ButtonAlignmentSetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSettingsStore.mockImplementation(() => ({
      settings: {
        buttonAlignment: '左',
      },
      updateSettings: mockUpdateSettings,
    }));
  });

  it('renders all alignment options', () => {
    render(<ButtonAlignmentSetting />);

    // 各配置オプションが表示されていることを確認
    expect(screen.getByLabelText('left')).toBeInTheDocument();
    expect(screen.getByLabelText('right')).toBeInTheDocument();
  });

  it('shows correct selected alignment', () => {
    render(<ButtonAlignmentSetting />);
    const leftRadio = screen.getByLabelText('left') as HTMLInputElement;
    const rightRadio = screen.getByLabelText('right') as HTMLInputElement;

    expect(leftRadio.checked).toBe(true);
    expect(rightRadio.checked).toBe(false);
  });

  it('calls updateSettings when alignment is changed', () => {
    render(<ButtonAlignmentSetting />);
    const rightRadio = screen.getByLabelText('right');

    fireEvent.click(rightRadio);

    expect(mockUpdateSettings).toHaveBeenCalledWith({
      buttonAlignment: '右',
    });
  });

  it('maintains correct checked state after alignment change', () => {
    // 右寄せが選択された状態でモックを更新
    mockUseSettingsStore.mockImplementation(() => ({
      settings: {
        buttonAlignment: '右',
      },
      updateSettings: mockUpdateSettings,
    }));

    render(<ButtonAlignmentSetting />);
    const leftRadio = screen.getByLabelText('left') as HTMLInputElement;
    const rightRadio = screen.getByLabelText('right') as HTMLInputElement;

    expect(leftRadio.checked).toBe(false);
    expect(rightRadio.checked).toBe(true);
  });
});