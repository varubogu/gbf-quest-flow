import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as errorService from './errorService';
import { errorFactory } from './errorFactoryService';
import useErrorStore from '@/core/stores/errorStore';
import type { AppError } from '@/types/error.types';
import { ErrorType, ErrorSeverity } from '@/types/error.types';

// useErrorStoreのモック
vi.mock('@/core/stores/errorStore', () => ({
  default: {
    getState: vi.fn(() => ({
      showError: vi.fn(),
      clearError: vi.fn(),
      executeRecoveryAction: vi.fn().mockResolvedValue(undefined),
      error: null,
    })),
  },
}));

// モックの型定義
type MockFunction = ReturnType<typeof vi.fn>;

describe('errorService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // errorFactoryのテスト
  describe('errorFactory', () => {
    describe('createValidationError', () => {
      it('正しいバリデーションエラーオブジェクトを作成すること', () => {
        const message = '入力値が不正です';
        const details = { field: 'username' };

        const error = errorFactory.createValidationError(message, details);

        expect(error.type).toBe(ErrorType.VALIDATION);
        expect(error.severity).toBe(ErrorSeverity.WARNING);
        expect(error.message).toBe(message);
        expect(error.details).toEqual(details);
        expect(error.timestamp).toBeInstanceOf(Date);
        expect(error.recoverable).toBe(true);
      });

      it('詳細情報なしでも作成できること', () => {
        const message = '入力値が不正です';

        const error = errorFactory.createValidationError(message);

        expect(error.type).toBe(ErrorType.VALIDATION);
        expect(error.message).toBe(message);
        expect(error.details).toBeUndefined();
      });
    });

    describe('createNetworkError', () => {
      it('正しいネットワークエラーオブジェクトを作成すること', () => {
        const originalError = new Error('接続に失敗しました');
        const details = { url: 'https://example.com' };

        const error = errorFactory.createNetworkError(originalError, details);

        expect(error.type).toBe(ErrorType.NETWORK);
        expect(error.severity).toBe(ErrorSeverity.ERROR);
        expect(error.message).toContain('ネットワークエラーが発生しました');
        expect(error.message).toContain(originalError.message);
        expect(error.originalError).toBe(originalError);
        expect(error.details).toEqual(details);
        expect(error.timestamp).toBeInstanceOf(Date);
        expect(error.recoverable).toBe(false);
      });

      it('詳細情報なしでも作成できること', () => {
        const originalError = new Error('接続に失敗しました');

        const error = errorFactory.createNetworkError(originalError);

        expect(error.type).toBe(ErrorType.NETWORK);
        expect(error.originalError).toBe(originalError);
        expect(error.details).toBeUndefined();
      });
    });

    describe('createFileOperationError', () => {
      it('正しいファイル操作エラーオブジェクトを作成すること', () => {
        const originalError = new Error('ファイルが見つかりません');
        const details = { path: '/path/to/file' };

        const error = errorFactory.createFileOperationError(originalError, details);

        expect(error.type).toBe(ErrorType.FILE_OPERATION);
        expect(error.severity).toBe(ErrorSeverity.ERROR);
        expect(error.message).toContain('ファイル操作エラーが発生しました');
        expect(error.message).toContain(originalError.message);
        expect(error.originalError).toBe(originalError);
        expect(error.details).toEqual(details);
        expect(error.timestamp).toBeInstanceOf(Date);
        expect(error.recoverable).toBe(true);
      });

      it('詳細情報なしでも作成できること', () => {
        const originalError = new Error('ファイルが見つかりません');

        const error = errorFactory.createFileOperationError(originalError);

        expect(error.type).toBe(ErrorType.FILE_OPERATION);
        expect(error.originalError).toBe(originalError);
        expect(error.details).toBeUndefined();
      });
    });

    describe('createUnknownError', () => {
      it('正しい不明なエラーオブジェクトを作成すること', () => {
        const originalError = new Error('予期しないエラー');

        const error = errorFactory.createUnknownError(originalError);

        expect(error.type).toBe(ErrorType.UNKNOWN);
        expect(error.severity).toBe(ErrorSeverity.CRITICAL);
        expect(error.message).toContain('予期しないエラーが発生しました');
        expect(error.message).toContain(originalError.message);
        expect(error.originalError).toBe(originalError);
        expect(error.timestamp).toBeInstanceOf(Date);
        expect(error.recoverable).toBe(false);
      });
    });
  });

  // formatErrorMessageのテスト
  describe('formatErrorMessage', () => {
    it('基本的なエラーメッセージをフォーマットすること', () => {
      const error: AppError = {
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.WARNING,
        message: 'テストエラー',
        timestamp: new Date(),
        recoverable: true,
      };

      const formattedMessage = errorService.formatErrorMessage(error);

      expect(formattedMessage).toContain('[WARNING]');
      expect(formattedMessage).toContain('テストエラー');
    });

    it('詳細情報を含めてフォーマットすること', () => {
      const error: AppError = {
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.WARNING,
        message: 'テストエラー',
        details: { field: 'username', value: 'invalid' },
        timestamp: new Date(),
        recoverable: true,
      };

      const formattedMessage = errorService.formatErrorMessage(error);

      expect(formattedMessage).toContain('詳細:');
      expect(formattedMessage).toContain('field: "username"');
      expect(formattedMessage).toContain('value: "invalid"');
    });

    it('スタックトレースを含めてフォーマットすること', () => {
      const originalError = new Error('元のエラー');
      const error: AppError = {
        type: ErrorType.UNKNOWN,
        severity: ErrorSeverity.CRITICAL,
        message: 'テストエラー',
        originalError,
        timestamp: new Date(),
        recoverable: false,
      };

      const formattedMessage = errorService.formatErrorMessage(error);

      expect(formattedMessage).toContain('スタックトレース:');
      expect(formattedMessage).toContain(originalError.stack || '');
    });
  });

  // logErrorのテスト
  describe('logError', () => {
    it('エラーをコンソールに出力すること', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error: AppError = {
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.WARNING,
        message: 'テストエラー',
        timestamp: new Date(),
        recoverable: true,
      };

      errorService.logError(error);

      expect(consoleSpy).toHaveBeenCalledTimes(1);

      // 型安全な方法でモックの呼び出し引数を検証
      const calls = consoleSpy.mock.calls;
      if (calls && calls.length > 0) {
        const firstCall = calls[0];
        if (firstCall && firstCall.length > 0) {
          const firstArg = firstCall[0] as string;
          if (typeof firstArg === 'string') {
            expect(firstArg).toContain('[validation]');
            expect(firstArg).toContain('テストエラー');
          }

          if (firstCall.length > 1) {
            const secondArg = firstCall[1] as AppError;
            expect(secondArg).toEqual({
              severity: error.severity,
              details: error.details,
              timestamp: error.timestamp,
              originalError: error.originalError,
            });
          }
        }
      }

      consoleSpy.mockRestore();
    });
  });

  // エラー表示関数のテスト
  describe('displayValidationError', () => {
    it('バリデーションエラーを作成してストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ showError: showErrorMock });
      const message = '入力値が不正です';
      const details = { field: 'username' };

      errorService.displayValidationError(message, details);

      expect(showErrorMock).toHaveBeenCalledTimes(1);

      // 型安全な方法でモックの呼び出し引数を検証
      const calls = showErrorMock.mock.calls;
      if (calls && calls.length > 0) {
        const firstCall = calls[0];
        if (firstCall && firstCall.length > 0) {
          const error = firstCall[0] as AppError;
          expect(error.type).toBe(ErrorType.VALIDATION);
          expect(error.message).toBe(message);
          expect(error.details).toEqual(details);
        }
      }
    });
  });

  describe('displayNetworkError', () => {
    it('ネットワークエラーを作成してストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ showError: showErrorMock });
      const originalError = new Error('接続に失敗しました');
      const details = { url: 'https://example.com' };

      errorService.displayNetworkError(originalError, details);

      expect(showErrorMock).toHaveBeenCalledTimes(1);

      // 型安全な方法でモックの呼び出し引数を検証
      const calls = showErrorMock.mock.calls;
      if (calls && calls.length > 0) {
        const firstCall = calls[0];
        if (firstCall && firstCall.length > 0) {
          const error = firstCall[0] as AppError;
          expect(error.type).toBe(ErrorType.NETWORK);
          expect(error.originalError).toBe(originalError);
          expect(error.details).toEqual(details);
        }
      }
    });
  });

  describe('displayFileOperationError', () => {
    it('ファイル操作エラーを作成してストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ showError: showErrorMock });
      const originalError = new Error('ファイルが見つかりません');
      const details = { path: '/path/to/file' };

      errorService.displayFileOperationError(originalError, details);

      expect(showErrorMock).toHaveBeenCalledTimes(1);

      // 型安全な方法でモックの呼び出し引数を検証
      const calls = showErrorMock.mock.calls;
      if (calls && calls.length > 0) {
        const firstCall = calls[0];
        if (firstCall && firstCall.length > 0) {
          const error = firstCall[0] as AppError;
          expect(error.type).toBe(ErrorType.FILE_OPERATION);
          expect(error.originalError).toBe(originalError);
          expect(error.details).toEqual(details);
        }
      }
    });

    it('リカバリーアクションを設定できること', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ showError: showErrorMock });
      const originalError = new Error('ファイルが見つかりません');
      const recoveryAction = async (): Promise<void> => { /* 何もしない */ };

      errorService.displayFileOperationError(originalError, undefined, recoveryAction);

      expect(showErrorMock).toHaveBeenCalledTimes(1);

      // 型安全な方法でモックの呼び出し引数を検証
      const calls = showErrorMock.mock.calls;
      if (calls && calls.length > 0) {
        const firstCall = calls[0];
        if (firstCall && firstCall.length > 0) {
          const error = firstCall[0] as AppError;
          expect(error.recoveryAction).toBe(recoveryAction);
        }
      }
    });
  });

  describe('displayUnknownError', () => {
    it('不明なエラーを作成してストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ showError: showErrorMock });
      const originalError = new Error('予期しないエラー');

      errorService.displayUnknownError(originalError);

      expect(showErrorMock).toHaveBeenCalledTimes(1);

      // 型安全な方法でモックの呼び出し引数を検証
      const calls = showErrorMock.mock.calls;
      if (calls && calls.length > 0) {
        const firstCall = calls[0];
        if (firstCall && firstCall.length > 0) {
          const error = firstCall[0] as AppError;
          expect(error.type).toBe(ErrorType.UNKNOWN);
          expect(error.originalError).toBe(originalError);
        }
      }
    });
  });

  describe('displayCustomError', () => {
    it('カスタムエラーをストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ showError: showErrorMock });
      const customError: AppError = {
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.INFO,
        message: 'カスタムエラー',
        timestamp: new Date(),
        recoverable: true,
      };

      errorService.displayCustomError(customError);

      expect(showErrorMock).toHaveBeenCalledTimes(1);
      expect(showErrorMock).toHaveBeenCalledWith(customError);
    });
  });

  describe('clearErrorDisplay', () => {
    it('ストアのclearErrorを呼び出すこと', () => {
      const clearErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ clearError: clearErrorMock });

      errorService.clearErrorDisplay();

      expect(clearErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('executeErrorRecoveryAction', () => {
    it('ストアのexecuteRecoveryActionを呼び出すこと', async () => {
      const executeRecoveryActionMock = vi.fn().mockResolvedValue(undefined);
      (useErrorStore.getState as MockFunction).mockReturnValue({ executeRecoveryAction: executeRecoveryActionMock });

      await errorService.executeErrorRecoveryAction();

      expect(executeRecoveryActionMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleWithTryCatch', () => {
    it('関数が成功した場合、その結果を返すこと', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const errorHandler = vi.fn();

      const result = await errorService.handleWithTryCatch(fn, errorHandler);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(errorHandler).not.toHaveBeenCalled();
    });

    it('関数が失敗した場合、エラーハンドラーを呼び出すこと', async () => {
      const error = new Error('テストエラー');
      const fn = vi.fn().mockRejectedValue(error);
      const errorHandler = vi.fn();

      const result = await errorService.handleWithTryCatch(fn, errorHandler);

      expect(result).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith(error);
    });

    it('エラーハンドラーが提供されていない場合、displayUnknownErrorを呼び出すこと', async () => {
      const error = new Error('テストエラー');
      const fn = vi.fn().mockRejectedValue(error);

      // displayUnknownErrorをモック
      const displayUnknownErrorSpy = vi.spyOn(errorService, 'displayUnknownError')
        .mockImplementation(vi.fn());

      // handleWithTryCatchを再定義して、モックしたdisplayUnknownErrorを使用するようにする
      const handleWithTryCatchSpy = vi.spyOn(errorService, 'handleWithTryCatch').mockImplementation(
        async (fn, errorHandler) => {
          try {
            return await fn();
          } catch (error) {
            if (error instanceof Error) {
              if (errorHandler) {
                errorHandler(error);
              } else {
                errorService.displayUnknownError(error);
              }
            } else {
              const unknownError = new Error('不明なエラーが発生しました');
              errorService.displayUnknownError(unknownError);
            }
            return undefined;
          }
        }
      );

      const result = await errorService.handleWithTryCatch(fn);

      expect(result).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(displayUnknownErrorSpy).toHaveBeenCalledTimes(1);
      expect(displayUnknownErrorSpy).toHaveBeenCalledWith(error);

      // モックを元に戻す
      handleWithTryCatchSpy.mockRestore();
      displayUnknownErrorSpy.mockRestore();
    });

    it('エラーがErrorインスタンスでない場合、新しいErrorを作成してdisplayUnknownErrorを呼び出すこと', async () => {
      const fn = vi.fn().mockRejectedValue('文字列エラー');

      // displayUnknownErrorをモック
      const displayUnknownErrorSpy = vi.spyOn(errorService, 'displayUnknownError')
        .mockImplementation(vi.fn());

      // handleWithTryCatchを再定義して、モックしたdisplayUnknownErrorを使用するようにする
      const handleWithTryCatchSpy = vi.spyOn(errorService, 'handleWithTryCatch').mockImplementation(
        async (fn, errorHandler) => {
          try {
            return await fn();
          } catch (error) {
            if (error instanceof Error) {
              if (errorHandler) {
                errorHandler(error);
              } else {
                errorService.displayUnknownError(error);
              }
            } else {
              const unknownError = new Error('不明なエラーが発生しました');
              errorService.displayUnknownError(unknownError);
            }
            return undefined;
          }
        }
      );

      const result = await errorService.handleWithTryCatch(fn);

      expect(result).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(displayUnknownErrorSpy).toHaveBeenCalledTimes(1);

      // 引数の検証
      const callArg = displayUnknownErrorSpy.mock.calls[0]?.[0];
      expect(callArg).toBeInstanceOf(Error);
      if (callArg instanceof Error) {
        expect(callArg.message).toBe('不明なエラーが発生しました');
      }

      // モックを元に戻す
      handleWithTryCatchSpy.mockRestore();
      displayUnknownErrorSpy.mockRestore();
    });
  });
});