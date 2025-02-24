import { renderHook } from '@testing-library/react/pure';
import { useActionCellState } from './useActionCellState';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useActionCellState', () => {
  const mockContent = 'test content';
  const mockOnFocus = vi.fn();

  beforeEach(() => {
    mockOnFocus.mockClear();
  });

  it('初期状態が正しく設定されること', () => {
    const { result } = renderHook(() => useActionCellState({ content: mockContent }));
    expect(result.current.isEditing).toBe(false);
    expect(result.current.value).toBe(mockContent);
  });

  it('contentが変更された場合、valueが更新されること', () => {
    const { result, rerender } = renderHook(
      ({ content }) => useActionCellState({ content }),
      { initialProps: { content: mockContent } }
    );

    const newContent = 'new content';
    rerender({ content: newContent });
    expect(result.current.value).toBe(newContent);
  });

  it('isEditingがtrueになった時、onFocusが呼ばれること', async () => {
    const { result } = renderHook(() =>
      useActionCellState({ content: mockContent, onFocus: mockOnFocus })
    );

    // テキストエリアのrefをモック
    const mockTextarea = document.createElement('textarea');
    result.current.textareaRef.current = mockTextarea;

    result.current.setIsEditing(true);

    // useEffectの実行を待つ
    await vi.waitFor(() => {
      expect(mockOnFocus).toHaveBeenCalled();
    });
  });

  it('isEditingがtrueになった時、テキストエリアにフォーカスが当たること', async () => {
    const { result } = renderHook(() => useActionCellState({ content: mockContent }));

    // テキストエリアのrefをモック
    const mockTextarea = document.createElement('textarea');
    const mockFocus = vi.fn();
    mockTextarea.focus = mockFocus;
    result.current.textareaRef.current = mockTextarea;

    result.current.setIsEditing(true);

    // useEffectの実行を待つ
    await vi.waitFor(() => {
      expect(mockFocus).toHaveBeenCalled();
    });
  });

  it('adjustTextareaHeightが正しく動作すること', () => {
    const { result } = renderHook(() => useActionCellState({ content: mockContent }));

    // テキストエリアのrefをモック
    const mockTextarea = document.createElement('textarea');
    Object.defineProperty(mockTextarea, 'scrollHeight', { value: 100 });
    result.current.textareaRef.current = mockTextarea;

    result.current.adjustTextareaHeight();

    // 一度autoに設定された後、scrollHeightに基づいて高さが設定されることを確認
    expect(mockTextarea.style.height).toBe('100px');
  });
});