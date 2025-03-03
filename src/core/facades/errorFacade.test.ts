import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorFacade } from './errorFacade';
import * as errorService from '@/core/services/errorService';
import type { AppError } from '@/types/error.types';
import { ErrorType, ErrorSeverity } from '@/types/error.types';

// errorServiceのモック
vi.mock('@/core/services/errorService', () => ({
  displayValidationError: vi.fn(),
  displayNetworkError: vi.fn(),
  displayFileOperationError: vi.fn(),
  displayUnknownError: vi.fn(),
  displayCustomError: vi.fn(),
  clearErrorDisplay: vi.fn(),
  executeErrorRecoveryAction: vi.fn().mockResolvedValue(undefined),
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

      expect(errorService.displayValidationError).toHaveBeenCalledTimes(1);
      expect(errorService.displayValidationError).toHaveBeenCalledWith(message, details);
    });
  });

  describe('showNetworkError', () => {
    it('displayNetworkErrorを正しいパラメータで呼び出すこと', () => {
      const originalError = new Error('接続に失敗しました');
      const details = { url: 'https://example.com' };

      errorFacade.showNetworkError(originalError, details);

      expect(errorService.displayNetworkError).toHaveBeenCalledTimes(1);
      expect(errorService.displayNetworkError).toHaveBeenCalledWith(originalError, details);
    });
  });

  describe('showFileOperationError', () => {
    it('displayFileOperationErrorを正しいパラメータで呼び出すこと', () => {
      const originalError = new Error('ファイルが見つかりません');
      const details = { path: '/path/to/file' };
      const recoveryAction = async (): Promise<void> => { /* 何もしない */ };

      errorFacade.showFileOperationError(originalError, details, recoveryAction);

      expect(errorService.displayFileOperationError).toHaveBeenCalledTimes(1);
      expect(errorService.displayFileOperationError).toHaveBeenCalledWith(originalError, details, recoveryAction);
    });
  });

  describe('showUnknownError', () => {
    it('displayUnknownErrorを正しいパラメータで呼び出すこと', () => {
      const originalError = new Error('予期しないエラー');

      errorFacade.showUnknownError(originalError);

      expect(errorService.displayUnknownError).toHaveBeenCalledTimes(1);
      expect(errorService.displayUnknownError).toHaveBeenCalledWith(originalError);
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

      expect(errorService.displayCustomError).toHaveBeenCalledTimes(1);
      expect(errorService.displayCustomError).toHaveBeenCalledWith(customError);
    });
  });

  describe('clearError', () => {
    it('clearErrorDisplayを呼び出すこと', () => {
      errorFacade.clearError();

      expect(errorService.clearErrorDisplay).toHaveBeenCalledTimes(1);
    });
  });

  describe('executeRecoveryAction', () => {
    it('executeErrorRecoveryActionを呼び出すこと', async () => {
      await errorFacade.executeRecoveryAction();

      expect(errorService.executeErrorRecoveryAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('tryCatch', () => {
    it('handleWithTryCatchを正しいパラメータで呼び出すこと', async () => {
      const fn = async (): Promise<string> => 'success';
      const errorHandler = vi.fn();
      const expectedResult = 'success';

      vi.mocked(errorService.handleWithTryCatch).mockResolvedValue(expectedResult);

      const result = await errorFacade.tryCatch(fn, errorHandler);

      expect(errorService.handleWithTryCatch).toHaveBeenCalledTimes(1);
      expect(errorService.handleWithTryCatch).toHaveBeenCalledWith(fn, errorHandler);
      expect(result).toBe(expectedResult);
    });
  });
});