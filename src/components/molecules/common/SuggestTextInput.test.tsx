import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SuggestTextInput, SuggestItem } from './SuggestTextInput';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';

describe('SuggestTextInput', () => {
  const mockSuggestions: SuggestItem[] = [
    { id: '1', label: 'アイテム1' },
    { id: '2', label: 'アイテム2' },
    { id: '3', label: 'テスト3' },
    { id: '4', label: 'テスト4' },
    { id: '5', label: 'サンプル5' },
  ];

  const mockOnSuggest = vi.fn().mockImplementation((query: string) => {
    return mockSuggestions.filter(item =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  });

  const mockOnChange = vi.fn();
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
    vi.useRealTimers();
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
    const user = userEvent.setup({ delay: null });

    render(
      <SuggestTextInput
        placeholder="テスト入力"
        onSuggest={mockOnSuggest}
        onChange={mockOnChange}
        debounceMs={0} // テスト用に遅延を0に設定
      />
    );

    const input = screen.getByPlaceholderText('テスト入力');
    await user.type(input, 'テスト');

    expect(mockOnChange).toHaveBeenCalledWith('テスト');
    expect(mockOnSuggest).toHaveBeenCalledWith('テスト');

    // タイマーを進める
    vi.runAllTimers();

    // サジェストが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('テスト3')).toBeDefined();
      expect(screen.getByText('テスト4')).toBeDefined();
    });
  });

  it('サジェストアイテムをクリックすると選択される', async () => {
    const user = userEvent.setup({ delay: null });

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
    await user.type(input, 'テスト');

    // タイマーを進める
    vi.runAllTimers();

    // サジェストアイテムをクリック
    await waitFor(async () => {
      const suggestionItem = screen.getByText('テスト3');
      await user.click(suggestionItem);
    });

    expect(mockOnSelect).toHaveBeenCalledWith({ id: '3', label: 'テスト3' });
    expect(mockOnChange).toHaveBeenCalledWith('テスト3');
  });

  it('キーボード操作でサジェストを選択できる', async () => {
    const user = userEvent.setup({ delay: null });

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
    await user.type(input, 'テスト');

    // タイマーを進める
    vi.runAllTimers();

    // 下矢印キーを押して最初のアイテムを選択
    await waitFor(async () => {
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
    });

    expect(mockOnSelect).toHaveBeenCalledWith({ id: '3', label: 'テスト3' });
    expect(mockOnChange).toHaveBeenCalledWith('テスト3');
  });

  it('Escapeキーでサジェストを閉じることができる', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <SuggestTextInput
        placeholder="テスト入力"
        onSuggest={mockOnSuggest}
        onChange={mockOnChange}
        debounceMs={0}
      />
    );

    const input = screen.getByPlaceholderText('テスト入力');
    await user.type(input, 'テスト');

    // タイマーを進める
    vi.runAllTimers();

    // サジェストが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('テスト3')).toBeDefined();
    });

    // Escapeキーを押してサジェストを閉じる
    await user.keyboard('{Escape}');

    // サジェストが閉じられることを確認
    await waitFor(() => {
      expect(screen.queryByText('テスト3')).toBeNull();
    });
  });

  it('maxSuggestionsを超えるサジェストは表示されない', async () => {
    const user = userEvent.setup({ delay: null });
    const manyMockSuggestions: SuggestItem[] = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      label: `テストアイテム${i + 1}`
    }));

    const manyMockOnSuggest = vi.fn().mockReturnValue(manyMockSuggestions);

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
    await user.type(input, 'テスト');

    // タイマーを進める
    vi.runAllTimers();

    // 最大3つのサジェストのみ表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('テストアイテム1')).toBeDefined();
      expect(screen.getByText('テストアイテム2')).toBeDefined();
      expect(screen.getByText('テストアイテム3')).toBeDefined();
      expect(screen.queryByText('テストアイテム4')).toBeNull();
    });
  });
});