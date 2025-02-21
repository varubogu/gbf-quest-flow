import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSetting } from './LanguageSetting';
import useSettingsStore from '@/stores/settingsStore';
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

// react-i18nextのモック
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
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

vi.mock('@/stores/settingsStore');
const mockUpdateSettings = vi.fn();

describe('LanguageSetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトのモック実装
    vi.mocked(useSettingsStore).mockImplementation(() => ({
      settings: {
        language: '日本語',
      },
      updateSettings: mockUpdateSettings,
    }));
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
    vi.mocked(useSettingsStore).mockImplementation(() => ({
      settings: {
        language: 'English',
      },
      updateSettings: mockUpdateSettings,
    }));

    render(<LanguageSetting />);
    const japaneseRadio = screen.getByLabelText('japanese') as HTMLInputElement;
    const englishRadio = screen.getByLabelText('english') as HTMLInputElement;

    expect(japaneseRadio.checked).toBe(false);
    expect(englishRadio.checked).toBe(true);
  });
});