import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSetting } from './LanguageSetting';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// i18nextのモック
vi.mock('i18next', () => ({
  default: {
    use: () => ({
      use: () => ({
        init: vi.fn(),
      }),
    }),
    language: 'ja',
    changeLanguage: vi.fn(),
    t: (key: string) => key,
    exists: vi.fn(() => true),
    options: {
      fallbackLng: ['en'],
      debug: false,
    },
  },
}));

interface UseTranslationResult {
  t: (_key: string) => string;
  i18n: {
    changeLanguage: (_lang: string) => void;
  };
}

// モックの作成
vi.mock('react-i18next', () => ({
  useTranslation: (): UseTranslationResult => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  }
}));

const mockUpdateSettings = vi.fn();
const mockUseSettingsStore = vi.fn(() => ({
  settings: {
    language: '日本語',
  },
  updateSettings: mockUpdateSettings,
}));

const mockUseSettingsStoreEnglish = vi.fn(() => ({
  settings: {
    language: 'English',
  },
  updateSettings: mockUpdateSettings,
}));

interface UseSettingsStoreResult {
  settings: {
    language: string;
  };
  updateSettings: () => void;
}

vi.mock('@/core/stores/settingsStore', () => ({
  default: (): UseSettingsStoreResult => mockUseSettingsStore(),
}));

vi.mock('@/core/facades/settingsStoreFacade', () => ({
  default: (): UseSettingsStoreResult => mockUseSettingsStore(),
}));


describe('LanguageSetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // テスト前にモックの状態をリセット
    mockUseSettingsStore().settings = {
      language: '日本語',
    };
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

    expect(japaneseRadio.checked).toBe(true);
    expect(englishRadio.checked).toBe(false);
  });

  it('言語が変更されたときにupdateSettingsが呼び出されることを確認', () => {
    render(<LanguageSetting />);
    fireEvent.click(screen.getByLabelText('english'));

    expect(mockUpdateSettings).toHaveBeenCalledWith({
      language: 'English',
    });
  });

  it('英語（2番目の項目）が選択された状態でモックを更新し、初期表示のテスト', () => {
    vi.mock('@/core/facades/settingsStoreFacade', () => ({
      default: (): UseSettingsStoreResult => mockUseSettingsStoreEnglish(),
    }));

    render(<LanguageSetting />);
    const japaneseRadio = screen.getByLabelText('japanese') as HTMLInputElement;
    const englishRadio = screen.getByLabelText('english') as HTMLInputElement;

    expect(japaneseRadio.checked).toBe(false);
    expect(englishRadio.checked).toBe(true);
  });
});