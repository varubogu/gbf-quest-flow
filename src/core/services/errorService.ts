import type { AppError, ErrorFactory } from '@/types/error.types';
import { ErrorSeverity, ErrorType } from '@/types/error.types';
import useErrorStore from '@/core/stores/errorStore';

/**
 * エラーファクトリサービス
 * アプリケーション固有のエラーを作成するためのファクトリ関数を提供します
 */
export const errorFactory: ErrorFactory = {
  /**
   * バリデーションエラーを作成します
   * @param message エラーメッセージ
   * @param details 追加の詳細情報
   * @returns AppError
   */
  createValidationError: (message: string, details?: Record<string, unknown>): AppError => ({
    type: ErrorType.VALIDATION,
    severity: ErrorSeverity.WARNING,
    message,
    details,
    timestamp: new Date(),
    recoverable: true,
  }),

  /**
   * ネットワークエラーを作成します
   * @param originalError 元のエラー
   * @param details 追加の詳細情報
   * @returns AppError
   */
  createNetworkError: (originalError: Error, details?: Record<string, unknown>): AppError => ({
    type: ErrorType.NETWORK,
    severity: ErrorSeverity.ERROR,
    message: `ネットワークエラーが発生しました: ${originalError.message}`,
    originalError,
    details,
    timestamp: new Date(),
    recoverable: false,
  }),

  /**
   * ファイル操作エラーを作成します
   * @param originalError 元のエラー
   * @param details 追加の詳細情報
   * @returns AppError
   */
  createFileOperationError: (originalError: Error, details?: Record<string, unknown>): AppError => ({
    type: ErrorType.FILE_OPERATION,
    severity: ErrorSeverity.ERROR,
    message: `ファイル操作エラーが発生しました: ${originalError.message}`,
    originalError,
    details,
    timestamp: new Date(),
    recoverable: true,
  }),

  /**
   * 不明なエラーを作成します
   * @param originalError 元のエラー
   * @returns AppError
   */
  createUnknownError: (originalError: Error): AppError => ({
    type: ErrorType.UNKNOWN,
    severity: ErrorSeverity.CRITICAL,
    message: `予期しないエラーが発生しました: ${originalError.message}`,
    originalError,
    timestamp: new Date(),
    recoverable: false,
  }),
};

/**
 * エラーメッセージをフォーマットします
 * @param error AppError
 * @returns フォーマットされたエラーメッセージ
 */
export const formatErrorMessage = (error: AppError): string => {
  const severityText = error.severity ? error.severity.toUpperCase() : 'ERROR';
  let formattedMessage = `[${severityText}] ${error.message}`;

  if (error.details) {
    const detailsStr = Object.entries(error.details)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
    formattedMessage += `\n詳細: ${detailsStr}`;
  }

  if (error.originalError?.stack) {
    formattedMessage += `\nスタックトレース: ${error.originalError.stack}`;
  }

  return formattedMessage;
};

/**
 * エラーをコンソールに出力します（開発環境用）
 * @param error AppError
 */
export const logError = (error: AppError): void => {
  console.error(`[${error.type}] ${error.message}`, {
    severity: error.severity,
    details: error.details,
    timestamp: error.timestamp,
    originalError: error.originalError,
  });
};

/**
 * バリデーションエラーを表示します
 * @param message エラーメッセージ
 * @param details 追加の詳細情報
 */
export function displayValidationError(message: string, details?: Record<string, unknown>): void {
  const error = errorFactory.createValidationError(message, details);
  useErrorStore.getState().showError(error);
}

/**
 * ネットワークエラーを表示します
 * @param originalError 元のエラー
 * @param details 追加の詳細情報
 */
export function displayNetworkError(originalError: Error, details?: Record<string, unknown>): void {
  const error = errorFactory.createNetworkError(originalError, details);
  useErrorStore.getState().showError(error);
}

/**
 * ファイル操作エラーを表示します
 * @param originalError 元のエラー
 * @param details 追加の詳細情報
 * @param recoveryAction リカバリーアクション
 */
export function displayFileOperationError(
  originalError: Error,
  details?: Record<string, unknown>,
  recoveryAction?: () => Promise<void>
): void {
  const error = errorFactory.createFileOperationError(originalError, details);
  if (recoveryAction) {
    error.recoveryAction = recoveryAction;
  }
  useErrorStore.getState().showError(error);
}

/**
 * 不明なエラーを表示します
 * @param originalError 元のエラー
 */
export function displayUnknownError(originalError: Error): void {
  const error = errorFactory.createUnknownError(originalError);
  useErrorStore.getState().showError(error);
}

/**
 * カスタムエラーを表示します
 * @param error カスタムエラー
 */
export function displayCustomError(error: AppError): void {
  useErrorStore.getState().showError(error);
}

/**
 * エラーをクリアします
 */
export function clearErrorDisplay(): void {
  useErrorStore.getState().clearError();
}

/**
 * リカバリーアクションを実行します
 */
export async function executeErrorRecoveryAction(): Promise<void> {
  await useErrorStore.getState().executeRecoveryAction();
}

/**
 * try-catchブロックでエラーをハンドリングするためのヘルパー関数
 * @param fn 実行する関数
 * @param errorHandler エラーハンドラー
 * @returns 関数の戻り値
 */
export async function handleWithTryCatch<T>(
  fn: () => Promise<T>,
  errorHandler?: (_error: Error) => void
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Error) {
      if (errorHandler) {
        errorHandler(error);
      } else {
        displayUnknownError(error);
      }
    } else {
      const unknownError = new Error('不明なエラーが発生しました');
      displayUnknownError(unknownError);
    }
    return undefined;
  }
}