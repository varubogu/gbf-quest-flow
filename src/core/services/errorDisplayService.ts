import type { AppError } from '@/types/error.types';
import useErrorStore from '@/core/stores/errorStore';
import { errorFactory } from './errorFactoryService';

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