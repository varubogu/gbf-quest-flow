import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorFacade } from './errorFacade';
import useErrorStore from '@/core/stores/errorStore';
import type { AppError } from '@/types/error.types';
import { ErrorSeverity, ErrorType } from '@/types/error.types';

// モックの設定
vi.mock('@/core/stores/errorStore', () => ({
  default: {
    getState: vi.fn(() => ({
      showError: vi.fn(),
      clearError: vi.fn(),
      executeRecoveryAction: vi.fn(),
    })),
  },
}));

describe('errorFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('showValidationError', () => {
    it('バリデーションエラーを作成してストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as any).mockReturnValue({ showError: showErrorMock });

      errorFacade.showValidationError('入力値が不正です', { field: 'username' });

      expect(showErrorMock).toHaveBeenCalledTimes(1);
      const error = showErrorMock.mock.calls[0][0];
      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.severity).toBe(ErrorSeverity.WARNING);
      expect(error.message).toBe('入力値が不正です');
      expect(error.details).toEqual({ field: 'username' });
      expect(error.recoverable).toBe(true);
    });
  });

  describe('showNetworkError', () => {
    it('ネットワークエラーを作成してストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as any).mockReturnValue({ showError: showErrorMock });

      const originalError = new Error('接続に失敗しました');
      errorFacade.showNetworkError(originalError, { url: 'https://example.com' });

      expect(showErrorMock).toHaveBeenCalledTimes(1);
      const error = showErrorMock.mock.calls[0][0];
      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.message).toContain('ネットワークエラーが発生しました');
      expect(error.originalError).toBe(originalError);
      expect(error.details).toEqual({ url: 'https://example.com' });
      expect(error.recoverable).toBe(false);
    });
  });

  describe('showFileOperationError', () => {
    it('ファイル操作エラーを作成してストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as any).mockReturnValue({ showError: showErrorMock });

      const originalError = new Error('ファイルが見つかりません');
      const recoveryAction = vi.fn();
      errorFacade.showFileOperationError(originalError, { path: '/path/to/file' }, recoveryAction);

      expect(showErrorMock).toHaveBeenCalledTimes(1);
      const error = showErrorMock.mock.calls[0][0];
      expect(error.type).toBe(ErrorType.FILE_OPERATION);
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.message).toContain('ファイル操作エラーが発生しました');
      expect(error.originalError).toBe(originalError);
      expect(error.details).toEqual({ path: '/path/to/file' });
      expect(error.recoverable).toBe(true);
      expect(error.recoveryAction).toBe(recoveryAction);
    });
  });

  describe('showUnknownError', () => {
    it('不明なエラーを作成してストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as any).mockReturnValue({ showError: showErrorMock });

      const originalError = new Error('予期しないエラー');
      errorFacade.showUnknownError(originalError);

      expect(showErrorMock).toHaveBeenCalledTimes(1);
      const error = showErrorMock.mock.calls[0][0];
      expect(error.type).toBe(ErrorType.UNKNOWN);
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.message).toContain('予期しないエラーが発生しました');
      expect(error.originalError).toBe(originalError);
      expect(error.recoverable).toBe(false);
    });
  });

  describe('showCustomError', () => {
    it('カスタムエラーをストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as any).mockReturnValue({ showError: showErrorMock });

      const customError: AppError = {
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.INFO,
        message: 'カスタムエラー',
        timestamp: new Date(),
        recoverable: true,
      };
      errorFacade.showCustomError(customError);

      expect(showErrorMock).toHaveBeenCalledTimes(1);
      expect(showErrorMock).toHaveBeenCalledWith(customError);
    });
  });

  describe('clearError', () => {
    it('ストアのclearErrorを呼び出すこと', () => {
      const clearErrorMock = vi.fn();
      (useErrorStore.getState as any).mockReturnValue({ clearError: clearErrorMock });

      errorFacade.clearError();

      expect(clearErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('executeRecoveryAction', () => {
    it('ストアのexecuteRecoveryActionを呼び出すこと', async () => {
      const executeRecoveryActionMock = vi.fn().mockResolvedValue(undefined);
      (useErrorStore.getState as any).mockReturnValue({ executeRecoveryAction: executeRecoveryActionMock });

      await errorFacade.executeRecoveryAction();

      expect(executeRecoveryActionMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('tryCatch', () => {
    it('関数が成功した場合、その結果を返すこと', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const errorHandler = vi.fn();

      const result = await errorFacade.tryCatch(fn, errorHandler);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(errorHandler).not.toHaveBeenCalled();
    });

    it('関数が失敗した場合、エラーハンドラーを呼び出すこと', async () => {
      const error = new Error('テストエラー');
      const fn = vi.fn().mockRejectedValue(error);
      const errorHandler = vi.fn();

      const result = await errorFacade.tryCatch(fn, errorHandler);

      expect(result).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith(error);
    });

    it('エラーハンドラーが提供されていない場合、showUnknownErrorを呼び出すこと', async () => {
      const error = new Error('テストエラー');
      const fn = vi.fn().mockRejectedValue(error);
      const showUnknownErrorSpy = vi.spyOn(errorFacade, 'showUnknownError').mockImplementation(vi.fn());

      const result = await errorFacade.tryCatch(fn);

      expect(result).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(showUnknownErrorSpy).toHaveBeenCalledTimes(1);
      expect(showUnknownErrorSpy).toHaveBeenCalledWith(error);
    });

    it('エラーがErrorインスタンスでない場合、新しいErrorを作成してshowUnknownErrorを呼び出すこと', async () => {
      const fn = vi.fn().mockRejectedValue('文字列エラー');
      const showUnknownErrorSpy = vi.spyOn(errorFacade, 'showUnknownError').mockImplementation(vi.fn());

      const result = await errorFacade.tryCatch(fn);

      expect(result).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(showUnknownErrorSpy).toHaveBeenCalledTimes(1);
      expect(showUnknownErrorSpy.mock.calls[0][0].message).toBe('不明なエラーが発生しました');
    });
  });
});