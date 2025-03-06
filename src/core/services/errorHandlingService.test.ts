import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleWithTryCatch, handleSyncWithTryCatch } from './errorHandlingService';
import { displayUnknownError } from './errorDisplayService';

// displayUnknownErrorのモック
vi.mock('./errorDisplayService', () => ({
  displayUnknownError: vi.fn(),
}));

describe('errorHandlingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleWithTryCatch', () => {
    it('正常に実行された場合は結果を返すこと', async () => {
      const result = 'テスト結果';
      const fn = vi.fn().mockResolvedValue(result);

      const actual = await handleWithTryCatch(fn);

      expect(actual).toBe(result);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(displayUnknownError).not.toHaveBeenCalled();
    });

    it('エラーが発生した場合はエラーハンドラーを呼び出すこと', async () => {
      const error = new Error('テストエラー');
      const fn = vi.fn().mockRejectedValue(error);
      const errorHandler = vi.fn();

      const actual = await handleWithTryCatch(fn, errorHandler);

      expect(actual).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith(error);
      expect(displayUnknownError).not.toHaveBeenCalled();
    });

    it('エラーハンドラーが指定されていない場合はdisplayUnknownErrorを呼び出すこと', async () => {
      const error = new Error('テストエラー');
      const fn = vi.fn().mockRejectedValue(error);

      const actual = await handleWithTryCatch(fn);

      expect(actual).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(displayUnknownError).toHaveBeenCalledWith(error);
    });

    it('Errorインスタンスでないエラーの場合は新しいErrorを作成すること', async () => {
      const fn = vi.fn().mockRejectedValue('文字列エラー');

      const actual = await handleWithTryCatch(fn);

      expect(actual).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(displayUnknownError).toHaveBeenCalledTimes(1);

      // 新しいErrorオブジェクトが作成されていることを確認
      const calls = (displayUnknownError as ReturnType<typeof vi.fn>).mock.calls;
      if (calls && calls.length > 0) {
        const firstCall = calls[0];
        if (firstCall && firstCall.length > 0) {
          const errorArg = firstCall[0] as Error;
          expect(errorArg).toBeInstanceOf(Error);
          expect(errorArg.message).toBe('不明なエラーが発生しました');
        }
      }
    });
  });

  describe('handleSyncWithTryCatch', () => {
    it('正常に実行された場合は結果を返すこと', () => {
      const result = 'テスト結果';
      const fn = vi.fn().mockReturnValue(result);

      const actual = handleSyncWithTryCatch(fn);

      expect(actual).toBe(result);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(displayUnknownError).not.toHaveBeenCalled();
    });

    it('エラーが発生した場合はエラーハンドラーを呼び出すこと', () => {
      const error = new Error('テストエラー');
      const fn = vi.fn().mockImplementation(() => {
        throw error;
      });
      const errorHandler = vi.fn();

      const actual = handleSyncWithTryCatch(fn, errorHandler);

      expect(actual).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith(error);
      expect(displayUnknownError).not.toHaveBeenCalled();
    });

    it('エラーハンドラーが指定されていない場合はdisplayUnknownErrorを呼び出すこと', () => {
      const error = new Error('テストエラー');
      const fn = vi.fn().mockImplementation(() => {
        throw error;
      });

      const actual = handleSyncWithTryCatch(fn);

      expect(actual).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(displayUnknownError).toHaveBeenCalledWith(error);
    });

    it('Errorインスタンスでないエラーの場合は新しいErrorを作成すること', () => {
      const fn = vi.fn().mockImplementation(() => {
        throw '文字列エラー';
      });

      const actual = handleSyncWithTryCatch(fn);

      expect(actual).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(displayUnknownError).toHaveBeenCalledTimes(1);

      // 新しいErrorオブジェクトが作成されていることを確認
      const calls = (displayUnknownError as ReturnType<typeof vi.fn>).mock.calls;
      if (calls && calls.length > 0) {
        const firstCall = calls[0];
        if (firstCall && firstCall.length > 0) {
          const errorArg = firstCall[0] as Error;
          expect(errorArg).toBeInstanceOf(Error);
          expect(errorArg.message).toBe('不明なエラーが発生しました');
        }
      }
    });
  });
});