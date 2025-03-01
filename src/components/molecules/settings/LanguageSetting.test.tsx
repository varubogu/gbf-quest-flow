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
    changeLanguage: (_language: string) => void;
    language: string;
  };
}

// react-i18nextのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): UseTranslationResult => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'ja',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// モックの状態を保持するオブジェクト
const mockState = {
  settings: {
    language: '日本語',
  },
};

const mockUpdateSettings = vi.fn();

// settingsStoreFacadeのモック
vi.mock('@/core/facades/settingsStoreFacade', () => ({
  default: () => ({
    settings: mockState.settings,
    updateSettings: mockUpdateSettings,
  }),
}));

describe('LanguageSetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // テスト前にモックの状態をリセット
    mockState.settings = {
      language: '日本語',
    };
  });

  it('renders all language options', () => {
    render(<LanguageSetting />);

    // 各言語オプションが表示されていることを確認
    expect(screen.getByLabelText('japanese')).toBeInTheDocument();
    expect(screen.getByLabelText('english')).toBeInTheDocument();
  });

  it('shows correct selected language', () => {
    render(<LanguageSetting />);
    const japaneseRadio = screen.getByLabelText('japanese') as HTMLInputElement;
    const englishRadio = screen.getByLabelText('english') as HTMLInputElement;

    expect(japaneseRadio.checked).toBe(true);
    expect(englishRadio.checked).toBe(false);
  });

  it('calls updateSettings when language is changed', () => {
    render(<LanguageSetting />);
    fireEvent.click(screen.getByLabelText('english'));

    expect(mockUpdateSettings).toHaveBeenCalledWith({
      language: 'English',
    });
  });

  it('maintains correct checked state after language change', () => {
    // 英語が選択された状態でモックを更新
    mockState.settings = {
      language: 'English',
    };

    render(<LanguageSetting />);
    const japaneseRadio = screen.getByLabelText('japanese') as HTMLInputElement;
    const englishRadio = screen.getByLabelText('english') as HTMLInputElement;

    expect(japaneseRadio.checked).toBe(false);
    expect(englishRadio.checked).toBe(true);
  });
});