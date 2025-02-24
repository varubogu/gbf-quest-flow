import { renderHook } from '@testing-library/react/pure';
import { useActionCellError } from './useActionCellError';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { message?: string }) => {
      if (key === 'pasteError.specific' && options?.message) {
        return `貼り付け処理中にエラーが発生しました: ${options.message}`;
      }
      if (key === 'pasteError.generic') {
        return '貼り付け処理中に予期せぬエラーが発生しました';
      }
      if (key === 'validationError' && options?.message) {
        return `入力エラー: ${options.message}`;
      }
      if (key === 'tooManyColumns') {
        return '貼り付ける列数が多すぎます';
      }
      if (key === 'noValidRows') {
        return '有効な行が見つかりません';
      }
      return key;
    },
  }),
}));

// alertのモック
const mockAlert = vi.fn();
vi.stubGlobal('alert', mockAlert);

describe('useActionCellError', () => {
  beforeEach(() => {
    mockAlert.mockClear();
  });

  describe('handlePasteError', () => {
    it('Error オブジェクトを適切に処理すること', () => {
      const { result } = renderHook(() => useActionCellError());
      result.current.handlePasteError(new Error('test error'));
      expect(mockAlert).toHaveBeenCalledWith(
        '貼り付け処理中にエラーが発生しました: test error'
      );
    });

    it('翻訳キーを含むエラーを適切に処理すること', () => {
      const { result } = renderHook(() => useActionCellError());
      result.current.handlePasteError(new Error('tooManyColumns'));
      expect(mockAlert).toHaveBeenCalledWith(
        '貼り付け処理中にエラーが発生しました: 貼り付ける列数が多すぎます'
      );
    });

    it('Error以外のオブジェクトを適切に処理すること', () => {
      const { result } = renderHook(() => useActionCellError());
      result.current.handlePasteError('unknown error');
      expect(mockAlert).toHaveBeenCalledWith('貼り付け処理中に予期せぬエラーが発生しました');
    });
  });

  describe('handleValidationError', () => {
    it('通常のメッセージを適切に処理すること', () => {
      const { result } = renderHook(() => useActionCellError());
      result.current.handleValidationError('test error');
      expect(mockAlert).toHaveBeenCalledWith('入力エラー: test error');
    });

    it('翻訳キーを適切に処理すること', () => {
      const { result } = renderHook(() => useActionCellError());
      result.current.handleValidationError('noValidRows');
      expect(mockAlert).toHaveBeenCalledWith('入力エラー: 有効な行が見つかりません');
    });
  });
});