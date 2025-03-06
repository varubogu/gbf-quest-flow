import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  displayValidationError,
  displayNetworkError,
  displayFileOperationError,
  displayUnknownError,
  displayCustomError,
  clearErrorDisplay,
  executeErrorRecoveryAction,
} from './errorDisplayService';
import { errorFactory } from '@/core/services/errorFactoryService';
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

// errorFactoryのモック
vi.mock('@/core/services/errorFactoryService', () => ({
  errorFactory: {
    createValidationError: vi.fn((message: string, details: Record<string, unknown>) => ({
      type: ErrorType.VALIDATION,
      message,
      details,
    })),
    createNetworkError: vi.fn((originalError: Error, details: Record<string, unknown>) => ({
      type: ErrorType.NETWORK,
      message: `ネットワークエラーが発生しました: ${originalError.message}`,
      originalError,
      details,
    })),
    createFileOperationError: vi.fn((originalError: Error, details: Record<string, unknown>) => ({
      type: ErrorType.FILE_OPERATION,
      message: `ファイル操作エラーが発生しました: ${originalError.message}`,
      originalError,
      details,
    })),
    createUnknownError: vi.fn((originalError: Error) => ({
      type: ErrorType.UNKNOWN,
      message: `予期しないエラーが発生しました: ${originalError.message}`,
      originalError,
    })),
  },
  logError: vi.fn(),
}));

// モックの型定義
type MockFunction = ReturnType<typeof vi.fn>;

describe('errorDisplayService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('displayValidationError', () => {
    it('バリデーションエラーを作成してストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ showError: showErrorMock });
      const message = '入力値が不正です';
      const details = { field: 'username' };

      displayValidationError(message, details);

      expect(errorFactory.createValidationError).toHaveBeenCalledWith(message, details);
      expect(showErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('displayNetworkError', () => {
    it('ネットワークエラーを作成してストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ showError: showErrorMock });
      const originalError = new Error('接続に失敗しました');
      const details = { url: 'https://example.com' };

      displayNetworkError(originalError, details);

      expect(errorFactory.createNetworkError).toHaveBeenCalledWith(originalError, details);
      expect(showErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('displayFileOperationError', () => {
    it('ファイル操作エラーを作成してストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ showError: showErrorMock });
      const originalError = new Error('ファイルが見つかりません');
      const details = { path: '/path/to/file' };

      displayFileOperationError(originalError, details);

      expect(errorFactory.createFileOperationError).toHaveBeenCalledWith(originalError, details);
      expect(showErrorMock).toHaveBeenCalledTimes(1);
    });

    it('リカバリーアクションを設定できること', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ showError: showErrorMock });
      const originalError = new Error('ファイルが見つかりません');
      const details = { path: '/path/to/file' };
      const recoveryAction = async (): Promise<void> => { /* 何もしない */ };

      // モックの戻り値を設定
      (errorFactory.createFileOperationError as MockFunction).mockReturnValue({
        type: ErrorType.FILE_OPERATION,
        message: `ファイル操作エラーが発生しました: ${originalError.message}`,
        originalError,
        details,
      });

      displayFileOperationError(originalError, details, recoveryAction);

      expect(errorFactory.createFileOperationError).toHaveBeenCalledWith(originalError, details);
      expect(showErrorMock).toHaveBeenCalledTimes(1);

      // リカバリーアクションが設定されていることを確認
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

      displayUnknownError(originalError);

      expect(errorFactory.createUnknownError).toHaveBeenCalledWith(originalError);
      expect(showErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('displayCustomError', () => {
    it('カスタムエラーをストアに渡すこと', () => {
      const showErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ showError: showErrorMock });
      const customError: AppError = {
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.WARNING,
        message: 'カスタムエラー',
        timestamp: new Date(),
        recoverable: true,
      };

      displayCustomError(customError);

      expect(showErrorMock).toHaveBeenCalledWith(customError);
    });
  });

  describe('clearErrorDisplay', () => {
    it('ストアのclearErrorを呼び出すこと', () => {
      const clearErrorMock = vi.fn();
      (useErrorStore.getState as MockFunction).mockReturnValue({ clearError: clearErrorMock });

      clearErrorDisplay();

      expect(clearErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('executeErrorRecoveryAction', () => {
    it('ストアのexecuteRecoveryActionを呼び出すこと', async () => {
      const executeRecoveryActionMock = vi.fn().mockResolvedValue(undefined);
      (useErrorStore.getState as MockFunction).mockReturnValue({
        executeRecoveryAction: executeRecoveryActionMock,
      });

      await executeErrorRecoveryAction();

      expect(executeRecoveryActionMock).toHaveBeenCalledTimes(1);
    });
  });
});