import { describe, it, expect, vi } from 'vitest';
import { errorFactory, formatErrorMessage, logError } from './errorFactoryService';
import type { AppError } from '@/types/error.types';
import { ErrorType, ErrorSeverity } from '@/types/error.types';

describe('errorFactoryService', () => {
  describe('createValidationError', () => {
    it('正しいバリデーションエラーオブジェクトを作成すること', () => {
      const message = '入力値が不正です';
      const details = { field: 'username' };

      const error = errorFactory.createValidationError(message, details);

      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.severity).toBe(ErrorSeverity.WARNING);
      expect(error.message).toBe(message);
      expect(error.details).toEqual(details);
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.recoverable).toBe(true);
    });

    it('詳細情報なしでも作成できること', () => {
      const message = '入力値が不正です';

      const error = errorFactory.createValidationError(message);

      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.message).toBe(message);
      expect(error.details).toBeUndefined();
    });
  });

  describe('createNetworkError', () => {
    it('正しいネットワークエラーオブジェクトを作成すること', () => {
      const originalError = new Error('接続に失敗しました');
      const details = { url: 'https://example.com' };

      const error = errorFactory.createNetworkError(originalError, details);

      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.message).toContain('ネットワークエラーが発生しました');
      expect(error.message).toContain(originalError.message);
      expect(error.originalError).toBe(originalError);
      expect(error.details).toEqual(details);
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.recoverable).toBe(false);
    });

    it('詳細情報なしでも作成できること', () => {
      const originalError = new Error('接続に失敗しました');

      const error = errorFactory.createNetworkError(originalError);

      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.originalError).toBe(originalError);
      expect(error.details).toBeUndefined();
    });
  });

  describe('createFileOperationError', () => {
    it('正しいファイル操作エラーオブジェクトを作成すること', () => {
      const originalError = new Error('ファイルが見つかりません');
      const details = { path: '/path/to/file' };

      const error = errorFactory.createFileOperationError(originalError, details);

      expect(error.type).toBe(ErrorType.FILE_OPERATION);
      expect(error.severity).toBe(ErrorSeverity.ERROR);
      expect(error.message).toContain('ファイル操作エラーが発生しました');
      expect(error.message).toContain(originalError.message);
      expect(error.originalError).toBe(originalError);
      expect(error.details).toEqual(details);
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.recoverable).toBe(true);
    });

    it('詳細情報なしでも作成できること', () => {
      const originalError = new Error('ファイルが見つかりません');

      const error = errorFactory.createFileOperationError(originalError);

      expect(error.type).toBe(ErrorType.FILE_OPERATION);
      expect(error.originalError).toBe(originalError);
      expect(error.details).toBeUndefined();
    });
  });

  describe('createUnknownError', () => {
    it('正しい不明なエラーオブジェクトを作成すること', () => {
      const originalError = new Error('予期しないエラー');

      const error = errorFactory.createUnknownError(originalError);

      expect(error.type).toBe(ErrorType.UNKNOWN);
      expect(error.severity).toBe(ErrorSeverity.CRITICAL);
      expect(error.message).toContain('予期しないエラーが発生しました');
      expect(error.message).toContain(originalError.message);
      expect(error.originalError).toBe(originalError);
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.recoverable).toBe(false);
    });
  });
});

describe('formatErrorMessage', () => {
  it('基本的なエラーメッセージをフォーマットすること', () => {
    const error: AppError = {
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.WARNING,
      message: 'テストエラー',
      timestamp: new Date(),
      recoverable: true,
    };

    const formattedMessage = formatErrorMessage(error);

    expect(formattedMessage).toContain('[WARNING]');
    expect(formattedMessage).toContain('テストエラー');
  });

  it('詳細情報を含めてフォーマットすること', () => {
    const error: AppError = {
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.WARNING,
      message: 'テストエラー',
      details: { field: 'username', value: 'invalid' },
      timestamp: new Date(),
      recoverable: true,
    };

    const formattedMessage = formatErrorMessage(error);

    expect(formattedMessage).toContain('詳細:');
    expect(formattedMessage).toContain('field: "username"');
    expect(formattedMessage).toContain('value: "invalid"');
  });

  it('スタックトレースを含めてフォーマットすること', () => {
    const originalError = new Error('元のエラー');
    const error: AppError = {
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.CRITICAL,
      message: 'テストエラー',
      originalError,
      timestamp: new Date(),
      recoverable: false,
    };

    const formattedMessage = formatErrorMessage(error);

    expect(formattedMessage).toContain('スタックトレース:');
    expect(formattedMessage).toContain(originalError.stack || '');
  });
});

describe('logError', () => {
  it('エラーをコンソールに出力すること', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error: AppError = {
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.WARNING,
      message: 'テストエラー',
      timestamp: new Date(),
      recoverable: true,
    };

    logError(error);

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    // 型安全な方法でモックの呼び出し引数を検証
    const calls = consoleSpy.mock.calls;
    if (calls && calls.length > 0) {
      const firstCall = calls[0];
      if (firstCall && firstCall.length > 0) {
        const firstArg = firstCall[0] as string;
        if (typeof firstArg === 'string') {
          expect(firstArg).toContain('[validation]');
          expect(firstArg).toContain('テストエラー');
        }

        if (firstCall.length > 1) {
          const secondArg = firstCall[1] as AppError;
          expect(secondArg).toEqual({
            severity: error.severity,
            details: error.details,
            timestamp: error.timestamp,
            originalError: error.originalError,
          });
        }
      }
    }

    consoleSpy.mockRestore();
  });
});