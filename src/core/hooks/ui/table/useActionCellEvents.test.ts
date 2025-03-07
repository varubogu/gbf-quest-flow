import { renderHook } from '@testing-library/react/pure';
import { useActionCellEvents, type UseTableCellEventsResult } from './useActionCellEvents';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';

interface UseActionCellErrorResult {
  handlePasteError: (_error: unknown) => void;
  handleValidationError: (_message: string) => void;
}

// モックの設定
const mockHandlePasteError = vi.fn();
const mockHandleValidationError = vi.fn();
vi.mock('./useActionCellError', () => ({
  useActionCellError: (): UseActionCellErrorResult => ({
    handlePasteError: mockHandlePasteError,
    handleValidationError: mockHandleValidationError,
  }),
}));

// tableDataParserのモック
vi.mock('@/lib/utils/tableDataParser', () => ({
  parseTabSeparatedText: vi.fn(() => [['value1', 'value2', 'value3']]),
  convertToGenericRows: vi.fn(() => [{ action: 'value1' }]),
}));

// Record<string, string>を満たすテストデータ型
type TestData = Record<string, string>;

describe('useActionCellEvents', () => {
  const defaultProps = {
    content: 'test content',
    value: 'test value',
    isEditable: true,
    field: 'action',
    onChange: vi.fn(),
    onPasteRows: vi.fn(),
    setIsEditing: vi.fn(),
    setValue: vi.fn(),
    adjustTextareaHeight: vi.fn(),
    settings: { actionTableClickType: 'single' as const },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleClick', () => {
    it('編集可能な場合、編集モードを開始すること', () => {
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(defaultProps));
      result.current.handleClick();
      expect(defaultProps.setIsEditing).toHaveBeenCalledWith(true);
    });

    it('編集不可の場合、編集モードを開始しないこと', () => {
      const props = { ...defaultProps, isEditable: false };
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(props));
      result.current.handleClick();
      expect(defaultProps.setIsEditing).not.toHaveBeenCalled();
    });
  });

  describe('handleBlur', () => {
    it('値が変更された場合、onChangeを呼び出すこと', () => {
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(defaultProps));
      result.current.handleBlur();
      expect(defaultProps.setIsEditing).toHaveBeenCalledWith(false);
      expect(defaultProps.onChange).toHaveBeenCalledWith('test value');
    });

    it('値が変更されていない場合、onChangeを呼び出さないこと', () => {
      const props = { ...defaultProps, value: 'test content' };
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(props));
      result.current.handleBlur();
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });
  });

  describe('handleKeyDown', () => {
    it('Enterキーで編集を完了すること', () => {
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(defaultProps));
      const event = new KeyboardEvent('keydown', { key: 'Enter' } as KeyboardEventInit);
      result.current.handleKeyDown(event as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
      expect(defaultProps.setIsEditing).toHaveBeenCalledWith(false);
    });

    it('Shift+Enterの場合、編集を継続すること', () => {
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(defaultProps));
      const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true } as KeyboardEventInit);
      result.current.handleKeyDown(event as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
      expect(defaultProps.setIsEditing).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });

    it('Escapeキーで編集をキャンセルすること', () => {
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(defaultProps));
      const event = new KeyboardEvent('keydown', { key: 'Escape' } as KeyboardEventInit);
      result.current.handleKeyDown(event as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
      expect(defaultProps.setValue).toHaveBeenCalledWith('test content');
      expect(defaultProps.setIsEditing).toHaveBeenCalledWith(false);
    });
  });

  describe('handleChange', () => {
    it('値を更新し、高さを調整すること', () => {
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(defaultProps));
      const event = { target: { value: 'new value' } } as React.ChangeEvent<HTMLTextAreaElement>;
      result.current.handleChange(event);
      expect(defaultProps.setValue).toHaveBeenCalledWith('new value');
      expect(defaultProps.adjustTextareaHeight).toHaveBeenCalled();
    });
  });

  describe('handlePaste', () => {
    it('タブ区切りテキストを適切に処理すること', () => {
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(defaultProps));
      const event = {
        preventDefault: vi.fn(),
        clipboardData: {
          getData: () => 'value1\tvalue2\tvalue3',
        },
      } as unknown as React.ClipboardEvent<HTMLTextAreaElement>;
      result.current.handlePaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(defaultProps.onPasteRows).toHaveBeenCalled();
    });

    it('空のデータの場合、エラーを表示すること', () => {
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(defaultProps));
      const event = {
        clipboardData: {
          getData: () => '',
        },
      } as unknown as React.ClipboardEvent<HTMLTextAreaElement>;
      result.current.handlePaste(event);
      expect(mockHandleValidationError).toHaveBeenCalledWith('noValidRows');
    });

    it('複数行のテキストを適切に処理すること', () => {
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(defaultProps));
      const event = {
        preventDefault: vi.fn(),
        clipboardData: {
          getData: () => 'line1\nline2\nline3',
        },
      } as unknown as React.ClipboardEvent<HTMLTextAreaElement>;
      result.current.handlePaste(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(defaultProps.onPasteRows).toHaveBeenCalledWith([
        { action: 'line1' },
        { action: 'line2' },
        { action: 'line3' },
      ]);
    });

    it('単一行のテキストは通常の貼り付け処理を行うこと', () => {
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(defaultProps));
      const event = {
        preventDefault: vi.fn(),
        clipboardData: {
          getData: () => 'single line',
        },
      } as unknown as React.ClipboardEvent<HTMLTextAreaElement>;
      result.current.handlePaste(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(defaultProps.onPasteRows).not.toHaveBeenCalled();
    });

    it('エラー発生時に適切にハンドリングすること', () => {
      const { result } = renderHook((): UseTableCellEventsResult => useActionCellEvents<TestData>(defaultProps));
      const event = {
        preventDefault: vi.fn(),
        clipboardData: {
          getData: () => {
            throw new Error('test error');
          },
        },
      } as unknown as React.ClipboardEvent<HTMLTextAreaElement>;
      result.current.handlePaste(event);
      expect(mockHandlePasteError).toHaveBeenCalledWith(new Error('test error'));
    });
  });
});