import { render, screen, fireEvent } from '@testing-library/react';
import { ActionTableClickTypeSetting } from './ActionTableClickTypeSetting';
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

// settingsStoreFacadeのモック
vi.mock('@/core/facades/settingsStoreFacade', () => {
  return {
    updateSettings: vi.fn(),
  };
});

// settingsStoreのモック
const mockState = {
  settings: {
    actionTableClickType: 'single',
  },
  updateSettings: vi.fn(),
} as unknown as SettingsStore;

vi.mock('@/core/stores/settingsStore', () => {
  return {
    default: (selector: (_state: SettingsStore) => unknown): unknown => selector(mockState),
  };
});

describe('ActionTableClickTypeSetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('各クリックタイプオプションが表示されていることを確認', () => {
    render(<ActionTableClickTypeSetting />);

    expect(screen.getByLabelText('singleClick')).toBeInTheDocument();
    expect(screen.getByLabelText('doubleClick')).toBeInTheDocument();
  });

  it('ストアの設定値（single）が選択されていることを確認', () => {
    render(<ActionTableClickTypeSetting />);
    const singleRadio = screen.getByLabelText('singleClick') as HTMLInputElement;
    const doubleRadio = screen.getByLabelText('doubleClick') as HTMLInputElement;

    expect(singleRadio.checked).toBe(true);
    expect(doubleRadio.checked).toBe(false);
  });

  it('クリックタイプが変更されたときにupdateSettingsが呼び出されることを確認', () => {
    render(<ActionTableClickTypeSetting />);
    fireEvent.click(screen.getByLabelText('doubleClick'));

    expect(updateSettings).toHaveBeenCalledWith({
      actionTableClickType: 'double',
    });
  });
});
