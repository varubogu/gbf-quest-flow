import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyLayout } from './EmptyLayout';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { loadSlugData } from '@/lib/functions';

vi.mock('@/lib/functions', () => ({
  loadSlugData: vi.fn(),
}));

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'ja',
    },
  }),
}));

describe('EmptyLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('データなしメッセージとボタンが表示される', () => {
    render(
      <I18nextProvider i18n={i18next}>
        <EmptyLayout />
      </I18nextProvider>
    );
    expect(screen.getByText('noDataLoaded')).toBeInTheDocument();
    expect(screen.getByText('createFlow')).toBeInTheDocument();
    expect(screen.getByText('loadFlow')).toBeInTheDocument();
  });

  it('URLパラメータにdがある場合、loadSlugDataが呼ばれる', () => {
    // URLSearchParamsのモック
    const mockSearchParams = new URLSearchParams('?d=test-slug');
    Object.defineProperty(window, 'location', {
      value: { search: mockSearchParams.toString() },
      writable: true
    });

    render(
      <I18nextProvider i18n={i18next}>
        <EmptyLayout />
      </I18nextProvider>
    );

    expect(loadSlugData).toHaveBeenCalledWith('test-slug');
  });
});