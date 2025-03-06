import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorFacade } from './errorFacade';
import * as errorDisplayService from '@/core/services/errorDisplayService';
import * as errorHandlingService from '@/core/services/errorHandlingService';
import type { AppError } from '@/types/error.types';
import { ErrorType, ErrorSeverity } from '@/types/error.types';

// errorDisplayServiceのモック
vi.mock('@/core/services/errorDisplayService', () => ({
  displayValidationError: vi.fn(),
  displayNetworkError: vi.fn(),
  displayFileOperationError: vi.fn(),
  displayUnknownError: vi.fn(),
  displayCustomError: vi.fn(),
  clearErrorDisplay: vi.fn(),
  executeErrorRecoveryAction: vi.fn().mockResolvedValue(undefined),
}));

// errorHandlingServiceのモック
vi.mock('@/core/services/errorHandlingService', () => ({
  handleWithTryCatch: vi.fn(),
}));

describe('errorFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('showValidationError', () => {
    it('displayValidationErrorを正しいパラメータで呼び出すこと', () => {
      const message = '入力値が不正です';
      const details = { field: 'username' };

      errorFacade.showValidationError(message, details);

      expect(errorDisplayService.displayValidationError).toHaveBeenCalledTimes(1);
      expect(errorDisplayService.displayValidationError).toHaveBeenCalledWith(message, details);
    });
  });

  describe('showNetworkError', () => {
    it('displayNetworkErrorを正しいパラメータで呼び出すこと', () => {
      const originalError = new Error('接続に失敗しました');
      const details = { url: 'https://example.com' };

      errorFacade.showNetworkError(originalError, details);

      expect(errorDisplayService.displayNetworkError).toHaveBeenCalledTimes(1);
      expect(errorDisplayService.displayNetworkError).toHaveBeenCalledWith(originalError, details);
    });
  });

  describe('showFileOperationError', () => {
    it('displayFileOperationErrorを正しいパラメータで呼び出すこと', () => {
      const originalError = new Error('ファイルが見つかりません');
      const details = { path: '/path/to/file' };
      const recoveryAction = async (): Promise<void> => { /* 何もしない */ };

      errorFacade.showFileOperationError(originalError, details, recoveryAction);

      expect(errorDisplayService.displayFileOperationError).toHaveBeenCalledTimes(1);
      expect(errorDisplayService.displayFileOperationError).toHaveBeenCalledWith(originalError, details, recoveryAction);
    });
  });

  describe('showUnknownError', () => {
    it('displayUnknownErrorを正しいパラメータで呼び出すこと', () => {
      const originalError = new Error('予期しないエラー');

      errorFacade.showUnknownError(originalError);

      expect(errorDisplayService.displayUnknownError).toHaveBeenCalledTimes(1);
      expect(errorDisplayService.displayUnknownError).toHaveBeenCalledWith(originalError);
    });
  });

  describe('showCustomError', () => {
    it('displayCustomErrorを正しいパラメータで呼び出すこと', () => {
      const customError: AppError = {
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.INFO,
        message: 'カスタムエラー',
        timestamp: new Date(),
        recoverable: true,
      };

      errorFacade.showCustomError(customError);

      expect(errorDisplayService.displayCustomError).toHaveBeenCalledTimes(1);
      expect(errorDisplayService.displayCustomError).toHaveBeenCalledWith(customError);
    });
  });

  describe('clearError', () => {
    it('clearErrorDisplayを呼び出すこと', () => {
      errorFacade.clearError();

      expect(errorDisplayService.clearErrorDisplay).toHaveBeenCalledTimes(1);
    });
  });

  describe('executeRecoveryAction', () => {
    it('executeErrorRecoveryActionを呼び出すこと', async () => {
      await errorFacade.executeRecoveryAction();

      expect(errorDisplayService.executeErrorRecoveryAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('tryCatch', () => {
    it('handleWithTryCatchを正しいパラメータで呼び出すこと', async () => {
      const fn = async (): Promise<string> => 'success';
      const errorHandler = vi.fn();
      const expectedResult = 'success';

      vi.mocked(errorHandlingService.handleWithTryCatch).mockResolvedValue(expectedResult);

      const result = await errorFacade.tryCatch(fn, errorHandler);

      expect(errorHandlingService.handleWithTryCatch).toHaveBeenCalledTimes(1);
      expect(errorHandlingService.handleWithTryCatch).toHaveBeenCalledWith(fn, errorHandler);
      expect(result).toBe(expectedResult);
    });
  });
});