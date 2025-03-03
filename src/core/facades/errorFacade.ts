import type { AppError } from '@/types/error.types';
import {
  displayValidationError,
  displayNetworkError,
  displayFileOperationError,
  displayUnknownError,
  displayCustomError,
  clearErrorDisplay,
  executeErrorRecoveryAction,
  handleWithTryCatch
} from '@/core/services/errorService';

/**
 * エラーハンドリングファサード
 * アプリケーション全体でエラーハンドリングを簡単に使用するためのファサード
 */
export const errorFacade = {
  /**
   * バリデーションエラーを表示します
   * @param message エラーメッセージ
   * @param details 追加の詳細情報
   */
  showValidationError: (message: string, details?: Record<string, unknown>): void => {
    displayValidationError(message, details);
  },

  /**
   * ネットワークエラーを表示します
   * @param originalError 元のエラー
   * @param details 追加の詳細情報
   */
  showNetworkError: (originalError: Error, details?: Record<string, unknown>): void => {
    displayNetworkError(originalError, details);
  },

  /**
   * ファイル操作エラーを表示します
   * @param originalError 元のエラー
   * @param details 追加の詳細情報
   * @param recoveryAction リカバリーアクション
   */
  showFileOperationError: (
    originalError: Error,
    details?: Record<string, unknown>,
    recoveryAction?: () => Promise<void>
  ): void => {
    displayFileOperationError(originalError, details, recoveryAction);
  },

  /**
   * 不明なエラーを表示します
   * @param originalError 元のエラー
   */
  showUnknownError: (originalError: Error): void => {
    displayUnknownError(originalError);
  },

  /**
   * カスタムエラーを表示します
   * @param error カスタムエラー
   */
  showCustomError: (error: AppError): void => {
    displayCustomError(error);
  },

  /**
   * エラーをクリアします
   */
  clearError: (): void => {
    clearErrorDisplay();
  },

  /**
   * リカバリーアクションを実行します
   */
  executeRecoveryAction: async (): Promise<void> => {
    await executeErrorRecoveryAction();
  },

  /**
   * try-catchブロックでエラーをハンドリングするためのヘルパー関数
   * @param fn 実行する関数
   * @param errorHandler エラーハンドラー
   * @returns 関数の戻り値
   */
  tryCatch: async <T>(
    fn: () => Promise<T>,
    errorHandler?: (_error: Error) => void
  ): Promise<T | undefined> => {
    return handleWithTryCatch(fn, errorHandler);
  }
};