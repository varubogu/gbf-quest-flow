import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingLayout } from './LoadingLayout';
import { renderWithI18n } from '@/test/i18n-test-utils';

describe('LoadingLayout', () => {
  it('ローディングメッセージが表示される', () => {
    renderWithI18n(<LoadingLayout />);
    expect(screen.getByText('loading')).toBeInTheDocument();
  });
});