import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSetting } from './LanguageSetting';
import { updateSettings } from '@/core/facades/settingsStoreFacade';
import type { SettingsStore } from '@/core/stores/settingsStore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// i18nextのモック
vi.mock('i18next', () => {
  const mockI18n = {
    use: vi.fn(),
    init: vi.fn(),
    language: 'ja',
    changeLanguage: vi.fn(),
    t: (key: string): string => key,
    exists: vi.fn(() => true),
    options: {
      fallbackLng: ['en'],
      debug: false,
    },
  };
  // use().use().init() のチェーン呼び出しに対応
  mockI18n.use.mockReturnValue(mockI18n);
  return { default: mockI18n };
});

// モックの作成
vi.mock('react-i18next', () => ({
  useTranslation: (): {
    t: (_key: string) => string;
    i18n: { changeLanguage: () => void };
  } => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// settingsStoreのモック（参照系）
const mockState = {
  settings: {
    language: '日本語',
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

describe('LanguageSetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('各言語オプションが表示されていることを確認', () => {
    render(<LanguageSetting />);

    expect(screen.getByLabelText('japanese')).toBeInTheDocument();
    expect(screen.getByLabelText('english')).toBeInTheDocument();
  });

  it('初期表示では1番目の言語（日本語）が選択されていることを確認', () => {
    render(<LanguageSetting />);
    const japaneseRadio = screen.getByLabelText('japanese') as HTMLInputElement;
    const englishRadio = screen.getByLabelText('english') as HTMLInputElement;

    // ストアの設定値（日本語）が選択されている
    expect(japaneseRadio.checked).toBe(true);
    expect(englishRadio.checked).toBe(false);
  });

  it('言語が変更されたときにupdateSettingsが呼び出されることを確認', () => {
    render(<LanguageSetting />);
    fireEvent.click(screen.getByLabelText('english'));

    expect(updateSettings).toHaveBeenCalledWith({
      language: 'English',
    });
  });
});
