import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonAlignmentSetting } from './ButtonAlignmentSetting';
import { updateSettings } from '@/core/facades/settingsStoreFacade';
import type { SettingsStore } from '@/core/stores/settingsStore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// モックの作成
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// settingsStoreのモック（参照系）
const mockState = {
  settings: {
    buttonAlignment: 'left',
  },
  updateSettings: vi.fn(),
} as unknown as SettingsStore;

vi.mock('@/core/stores/settingsStore', () => {
  return {
    default: (selector: (_state: SettingsStore) => unknown): unknown => selector(mockState),
  };
});

// settingsStoreFacadeのモック（更新系）
vi.mock('@/core/facades/settingsStoreFacade', () => {
  return {
    updateSettings: vi.fn(),
  };
});

describe('ButtonAlignmentSetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    // ストアの設定値（left）が選択されている
    expect(leftRadio.checked).toBe(true);
    expect(rightRadio.checked).toBe(false);
  });

  it('calls updateSettings when alignment is changed', () => {
    render(<ButtonAlignmentSetting />);
    const rightRadio = screen.getByLabelText('right');

    fireEvent.click(rightRadio);

    expect(updateSettings).toHaveBeenCalledWith({
      buttonAlignment: 'right',
    });
  });
});
