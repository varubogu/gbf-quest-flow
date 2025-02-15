import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmptyLayout } from './EmptyLayout';
import { loadSlugData } from '@/lib/functions';
import { renderWithI18n } from '@/test/i18n-test-utils';

vi.mock('@/lib/functions', () => ({
  loadSlugData: vi.fn(),
}));

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

  it('URLパラメータにdがある場合、loadSlugDataが呼ばれる', () => {
    // URLSearchParamsのモック
    const mockSearchParams = new URLSearchParams('?d=test-slug');
    Object.defineProperty(window, 'location', {
      value: { search: mockSearchParams.toString() },
      writable: true
    });

    renderWithI18n(<EmptyLayout />);
    expect(loadSlugData).toHaveBeenCalledWith('test-slug');
  });
});