import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { SuggestTextInput, type SuggestItem } from './SuggestTextInput';
import { describe, it, expect, afterEach, vi } from 'vitest';

describe('SuggestTextInput', () => {
  const mockSuggestions: SuggestItem[] = [
    { id: '1', label: 'アイテム1' },
    { id: '2', label: 'アイテム2' },
    { id: '3', label: 'テスト3' },
    { id: '4', label: 'テスト4' },
    { id: '5', label: 'サンプル5' },
  ];

  const mockOnSuggest = vi.fn().mockImplementation(async (query: string) => {
    const filtered = mockSuggestions.filter(item =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
    return Promise.resolve(filtered);
  });

  const mockOnChange = vi.fn();
  const mockOnSelect = vi.fn();

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('正しくレンダリングされる', () => {
    render(
      <SuggestTextInput
        placeholder="テスト入力"
        onSuggest={mockOnSuggest}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('テスト入力');
    expect(input).toBeDefined();
    expect(input.tagName).toBe('INPUT');
  });

  it('入力時にサジェストが表示される', async () => {
    render(
      <SuggestTextInput
        placeholder="テスト入力"
        onSuggest={mockOnSuggest}
        onChange={mockOnChange}
        debounceMs={0}
      />
    );

    const input = screen.getByPlaceholderText('テスト入力');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'テスト' } });
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(mockOnChange).toHaveBeenCalledWith('テスト');
    expect(mockOnSuggest).toHaveBeenCalledWith('テスト');

    // サジェストが表示されることを確認
    const items = await screen.findAllByRole('option');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('テスト3');
    expect(items[1]).toHaveTextContent('テスト4');
  });

  it('サジェストアイテムをクリックすると選択される', async () => {
    render(
      <SuggestTextInput
        placeholder="テスト入力"
        onSuggest={mockOnSuggest}
        onChange={mockOnChange}
        onSelect={mockOnSelect}
        debounceMs={0}
      />
    );

    const input = screen.getByPlaceholderText('テスト入力');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'テスト' } });
      await vi.advanceTimersByTimeAsync(1000);
    });

    const items = await screen.findAllByRole('option');
    const suggestionItem = items[0];

    await act(async () => {
      fireEvent.click(suggestionItem);
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(mockOnSelect).toHaveBeenCalledWith({ id: '3', label: 'テスト3' });
    expect(mockOnChange).toHaveBeenCalledWith('テスト3');
  });

  it('キーボード操作でサジェストを選択できる', async () => {
    render(
      <SuggestTextInput
        placeholder="テスト入力"
        onSuggest={mockOnSuggest}
        onChange={mockOnChange}
        onSelect={mockOnSelect}
        debounceMs={0}
      />
    );

    const input = screen.getByPlaceholderText('テスト入力');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'テスト' } });
      await vi.advanceTimersByTimeAsync(2000);
    });

    await screen.findAllByRole('option');

    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      await vi.advanceTimersByTimeAsync(100);
    });

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
      await vi.advanceTimersByTimeAsync(200);
    });

    expect(mockOnSelect).toHaveBeenCalledWith({ id: '3', label: 'テスト3' });
    expect(mockOnChange).toHaveBeenCalledWith('テスト3');
  });

  it('Escapeキーでサジェストを閉じることができる', async () => {
    render(
      <SuggestTextInput
        placeholder="テスト入力"
        onSuggest={mockOnSuggest}
        onChange={mockOnChange}
        debounceMs={0}
      />
    );

    const input = screen.getByPlaceholderText('テスト入力');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'テスト' } });
      await vi.advanceTimersByTimeAsync(0);
    });

    const items = await screen.findAllByRole('option');
    expect(items).toHaveLength(2);

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Escape' });
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(screen.queryByRole('option')).toBeNull();
  });

  it('maxSuggestionsを超えるサジェストは表示されない', async () => {
    const manyMockSuggestions: SuggestItem[] = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      label: `テストアイテム${i + 1}`
    }));

    const manyMockOnSuggest = vi.fn().mockImplementation(async () => {
      return Promise.resolve(manyMockSuggestions);
    });

    render(
      <SuggestTextInput
        placeholder="テスト入力"
        onSuggest={manyMockOnSuggest}
        onChange={mockOnChange}
        maxSuggestions={3}
        debounceMs={0}
      />
    );

    const input = screen.getByPlaceholderText('テスト入力');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'テスト' } });
      await vi.advanceTimersByTimeAsync(0);
    });

    const items = await screen.findAllByRole('option');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('テストアイテム1');
    expect(items[1]).toHaveTextContent('テストアイテム2');
    expect(items[2]).toHaveTextContent('テストアイテム3');
  });
});