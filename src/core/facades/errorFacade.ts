import type { AppError } from '@/types/error.types';
import { errorFactory } from '@/core/services/errorService';
import useErrorStore from '@/core/stores/errorStore';

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
    const error = errorFactory.createValidationError(message, details);
    useErrorStore.getState().showError(error);
  },

  /**
   * ネットワークエラーを表示します
   * @param originalError 元のエラー
   * @param details 追加の詳細情報
   */
  showNetworkError: (originalError: Error, details?: Record<string, unknown>): void => {
    const error = errorFactory.createNetworkError(originalError, details);
    useErrorStore.getState().showError(error);
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
    const error = errorFactory.createFileOperationError(originalError, details);
    if (recoveryAction) {
      error.recoveryAction = recoveryAction;
    }
    useErrorStore.getState().showError(error);
  },

  /**
   * 不明なエラーを表示します
   * @param originalError 元のエラー
   */
  showUnknownError: (originalError: Error): void => {
    const error = errorFactory.createUnknownError(originalError);
    useErrorStore.getState().showError(error);
  },

  /**
   * カスタムエラーを表示します
   * @param error カスタムエラー
   */
  showCustomError: (error: AppError): void => {
    useErrorStore.getState().showError(error);
  },

  /**
   * エラーをクリアします
   */
  clearError: (): void => {
    useErrorStore.getState().clearError();
  },

  /**
   * リカバリーアクションを実行します
   */
  executeRecoveryAction: async (): Promise<void> => {
    await useErrorStore.getState().executeRecoveryAction();
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
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Error) {
        if (errorHandler) {
          errorHandler(error);
        } else {
          errorFacade.showUnknownError(error);
        }
      } else {
        const unknownError = new Error('不明なエラーが発生しました');
        errorFacade.showUnknownError(unknownError);
      }
      return undefined;
    }
  }
};