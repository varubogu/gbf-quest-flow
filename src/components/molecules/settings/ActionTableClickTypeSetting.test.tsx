import { render, screen, fireEvent } from '@testing-library/react';
import { ActionTableClickTypeSetting } from './ActionTableClickTypeSetting';
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
    actionTableClickType: 'single',
  },
  updateSettings: mockUpdateSettings,
}));

vi.mock('@/stores/settingsStore', () => ({
  default: () => mockUseSettingsStore(),
}));

describe('ActionTableClickTypeSetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSettingsStore.mockImplementation(() => ({
      settings: {
        actionTableClickType: 'single',
      },
      updateSettings: mockUpdateSettings,
    }));
  });

  it('renders all click type options', () => {
    render(<ActionTableClickTypeSetting />);

    // 各クリックタイプオプションが表示されていることを確認
    expect(screen.getByLabelText('singleClick')).toBeInTheDocument();
    expect(screen.getByLabelText('doubleClick')).toBeInTheDocument();
  });

  it('shows correct selected click type', () => {
    render(<ActionTableClickTypeSetting />);
    const singleClickRadio = screen.getByLabelText('singleClick') as HTMLInputElement;
    const doubleClickRadio = screen.getByLabelText('doubleClick') as HTMLInputElement;

    expect(singleClickRadio.checked).toBe(true);
    expect(doubleClickRadio.checked).toBe(false);
  });

  it('calls updateSettings when click type is changed', () => {
    render(<ActionTableClickTypeSetting />);
    fireEvent.click(screen.getByLabelText('doubleClick'));

    expect(mockUpdateSettings).toHaveBeenCalledWith({
      actionTableClickType: 'double',
    });
  });

  it('maintains correct checked state after click type change', () => {
    // ダブルクリックが選択された状態でモックを更新
    mockUseSettingsStore.mockImplementation(() => ({
      settings: {
        actionTableClickType: 'double',
      },
      updateSettings: mockUpdateSettings,
    }));

    render(<ActionTableClickTypeSetting />);
    const singleClickRadio = screen.getByLabelText('singleClick') as HTMLInputElement;
    const doubleClickRadio = screen.getByLabelText('doubleClick') as HTMLInputElement;

    expect(singleClickRadio.checked).toBe(false);
    expect(doubleClickRadio.checked).toBe(true);
  });
});