import { displayUnknownError } from './errorDisplayService';

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

/**
 * 同期処理のエラーをハンドリングするためのヘルパー関数
 * @param {function(): T} fn 実行する関数
 * @param {function(_error: Error): void} errorHandler エラーハンドラー
 * @type {T} 関数の戻り値の型
 * @returns {T} 関数の戻り値
 */
export function handleSyncWithTryCatch<T>(
  fn: () => T,
  errorHandler?: (_error: Error) => void
): T | undefined {
  try {
    return fn();
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