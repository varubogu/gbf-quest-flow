import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoadingLayout } from './LoadingLayout';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

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

describe('LoadingLayout', () => {
  it('ローディングメッセージが表示される', () => {
    render(
      <I18nextProvider i18n={i18next}>
        <LoadingLayout />
      </I18nextProvider>
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
  });
});