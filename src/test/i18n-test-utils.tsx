import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { vi } from 'vitest';
import type { ReactNode } from 'react';

// i18nのモック
vi.mock('react-i18next', () => ({
  // Trans and Translation components
  Trans: ({ children }: { children: unknown }): unknown => children,
  Translation: ({ children }: { children: unknown }): unknown => children,
  // hooks
  useTranslation: (): {
    t: (_key: string) => string;
    i18n: {
      changeLanguage: () => void;
      language: string;
    };
  } => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'ja',
    },
  }),
  // init
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
  // HOCs
  withTranslation: () => (Component: unknown): unknown => Component,
  // Provider
  I18nextProvider: ({ children }: { children: ReactNode }): ReactNode => children,
}));

// i18nextのモック
vi.mock('@/lib/i18n', () => ({
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

// モック用のi18nextインスタンス
const mockI18n = {
  language: 'ja',
  changeLanguage: vi.fn(),
  t: (key: string) => key,
  exists: vi.fn(() => true),
  options: {
    fallbackLng: ['en'],
    debug: false,
  },
};

// テストヘルパー関数
export const renderWithI18n = (ui: React.ReactElement): RenderResult => {
  // I18nextProviderをモックしているため、直接レンダリングする
  return render(ui);
};
