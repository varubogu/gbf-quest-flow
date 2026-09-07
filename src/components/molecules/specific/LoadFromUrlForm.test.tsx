import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoadFromUrlForm } from './LoadFromUrlForm';
import { renderWithI18n } from '@/test/i18n-test-utils';
import { loadFlowFromQuery } from '@/core/facades/fileOperationFacade';

vi.mock('@/core/facades/fileOperationFacade', () => ({
  loadFlowFromQuery: vi.fn().mockResolvedValue(undefined),
}));

describe('LoadFromUrlForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('HTTPS URL をプロキシ読み込みに渡す', async () => {
    renderWithI18n(<LoadFromUrlForm />);
    fireEvent.change(screen.getByLabelText('loadFromUrl'), {
      target: { value: 'https://example.com/a.json' },
    });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(loadFlowFromQuery).toHaveBeenCalledWith({
        remoteUrl: 'https://example.com/a.json',
        dataId: null,
      });
    });
  });
});
