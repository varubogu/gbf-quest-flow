import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { vi } from 'vitest';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

// モック用のi18nextインスタンス
const mockI18n = {
  language: 'ja',
  languages: ['ja', 'en'],
  changeLanguage: vi.fn(),
  t: (key: string): string => key,
  exists: vi.fn(() => true),
  options: {
    fallbackLng: ['en'],
    debug: false,
  },
  use: vi.fn().mockReturnThis(),
  init: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  getFixedT: vi.fn().mockImplementation(() => (key: string) => key),
  format: vi.fn().mockImplementation((value) => value),
  createInstance: vi.fn().mockReturnThis(),
  cloneInstance: vi.fn().mockReturnThis(),
  isInitialized: true,
  services: {
    resourceStore: {
      data: {},
    },
  },
  store: {
    data: {},
  },
  // i18n型に必要な追加のメソッド
  loadResources: vi.fn(),
  modules: { backend: {}, languageDetector: {} },
  getDataByLanguage: vi.fn(),
  hasLoadedNamespace: vi.fn().mockReturnValue(true),
};

// i18nのモック
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    // Trans and Translation components
    Trans: ({ children }: { children: unknown }): unknown => children,
    Translation: ({ children }: { children: unknown }): unknown => children,
    // hooks
    useTranslation: (): {
      t: (_key: string) => string;
      i18n: typeof mockI18n;
    } => ({
      t: (key: string) => key,
      i18n: mockI18n,
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
  };
});

// i18nextのモック
vi.mock('@/lib/i18n', () => ({
  default: mockI18n,
}));

// テストヘルパー関数
export const renderWithI18n = (ui: React.ReactElement): RenderResult => {
  // I18nextProviderでラップしてレンダリングする
  return render(
    <I18nextProvider i18n={mockI18n as any}>
      {ui}
    </I18nextProvider>
  );
};
