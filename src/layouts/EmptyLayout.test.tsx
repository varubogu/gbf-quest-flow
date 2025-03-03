import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmptyLayout } from './EmptyLayout';
import { renderWithI18n } from '@/test/i18n-test-utils';

describe('EmptyLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('データなしメッセージとボタンが表示される', () => {
    renderWithI18n(<EmptyLayout />);
    expect(screen.getByText('noDataLoaded')).toBeInTheDocument();
    expect(screen.getByText('newData')).toBeInTheDocument();
    expect(screen.getByText('loadData')).toBeInTheDocument();
  });
});
