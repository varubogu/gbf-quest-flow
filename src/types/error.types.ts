/* eslint-disable @typescript-eslint/no-unused-vars */
// エラーの種類を定義する列挙型
export enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  FILE_OPERATION = 'file_operation',
  UNKNOWN = 'unknown',
}

// エラーの重要度を定義する列挙型
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}
/* eslint-enable @typescript-eslint/no-unused-vars */

// アプリケーション固有のエラー情報
export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  originalError?: Error;
  details?: Record<string, unknown> | undefined;
  timestamp: Date;
  recoverable: boolean;
  recoveryAction?: () => Promise<void>;
}

// エラーを作成するためのファクトリ関数の型
export type ErrorFactory = {
  createValidationError: (_message: string, _details?: Record<string, unknown>) => AppError;
  createNetworkError: (_originalError: Error, _details?: Record<string, unknown>) => AppError;
  createFileOperationError: (_originalError: Error, _details?: Record<string, unknown>) => AppError;
  createUnknownError: (_originalError: Error) => AppError;
};