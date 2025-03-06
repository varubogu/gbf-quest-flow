import type { AppError, ErrorFactory } from '@/types/error.types';
import { ErrorSeverity, ErrorType } from '@/types/error.types';

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