import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HybridSuggestInput } from './HybridSuggestInput';

describe('HybridSuggestInput', () => {
  it('候補を選ぶと onChange が呼ばれる', async () => {
    const onChange = vi.fn();
    render(
      <HybridSuggestInput
        value=""
        onChange={onChange}
        onSuggest={() => [{ id: '1', label: 'ベルセルク' }]}
        aria-label="ジョブ"
        debounceMs={0}
      />
    );

    const input = screen.getByLabelText('ジョブ');
    fireEvent.focus(input);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(screen.getByRole('option')).toHaveTextContent('ベルセルク');
    fireEvent.click(screen.getByRole('option'));
    expect(onChange).toHaveBeenCalledWith('ベルセルク');
  });
});
