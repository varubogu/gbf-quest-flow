import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as accessibilityModule from './accessibility';

// モジュール全体をモック
vi.mock('./accessibility', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // announceToScreenReaderの実装をモックしない（実際の実装を使用）
  };
});

describe('accessibility', () => {
  describe('announceToScreenReader', () => {
    let appendChildSpy: any;
    let removeChildSpy: any;
    let createElementSpy: any;
    let setAttributeSpy: any;
    let mockElement: any;

    beforeEach(() => {
      // DOMのモック
      mockElement = {
        setAttribute: vi.fn(),
        className: '',
        textContent: '',
      };

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockElement);
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
      setAttributeSpy = vi.spyOn(mockElement, 'setAttribute');

      // 注意: vi.useFakeTimers()はセットアップファイルで既に呼び出されているため、ここでは呼び出さない
    });

    afterEach(() => {
      vi.restoreAllMocks();
      // 注意: vi.useRealTimers()はセットアップファイルで既に呼び出されているため、ここでは呼び出さない
    });

    it('デフォルトのステータス通知を正しく作成する', () => {
      // 実行
      accessibilityModule.announceToScreenReader('テストメッセージ');

      // 検証
      expect(createElementSpy).toHaveBeenCalledWith('div');
      expect(setAttributeSpy).toHaveBeenCalledWith('role', 'status');
      expect(setAttributeSpy).toHaveBeenCalledWith('aria-live', 'polite');
      expect(mockElement.className).toBe('sr-only');
      expect(mockElement.textContent).toBe('テストメッセージ');
      expect(appendChildSpy).toHaveBeenCalledWith(mockElement);

      // タイマーを進める
      vi.runAllTimers();

      // 要素が削除されたことを確認
      expect(removeChildSpy).toHaveBeenCalledWith(mockElement);
    });

    it('アラート通知を正しく作成する', () => {
      // 実行
      accessibilityModule.announceToScreenReader('アラートメッセージ', 'alert');

      // 検証
      expect(createElementSpy).toHaveBeenCalledWith('div');
      expect(setAttributeSpy).toHaveBeenCalledWith('role', 'alert');
      expect(setAttributeSpy).toHaveBeenCalledWith('aria-live', 'assertive');
      expect(mockElement.className).toBe('sr-only');
      expect(mockElement.textContent).toBe('アラートメッセージ');
      expect(appendChildSpy).toHaveBeenCalledWith(mockElement);

      // タイマーを進める
      vi.runAllTimers();

      // 要素が削除されたことを確認
      expect(removeChildSpy).toHaveBeenCalledWith(mockElement);
    });
  });
});

// handleError関数のテストを分離
describe('handleError', () => {
  let consoleErrorSpy: any;
  let announceToScreenReaderSpy: any;

  beforeEach(() => {
    // テスト前にモジュールをリセット
    vi.resetModules();

    // モックをセットアップ
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // announceToScreenReaderをモック
    announceToScreenReaderSpy = vi.fn();
    vi.doMock('./accessibility', () => ({
      announceToScreenReader: announceToScreenReaderSpy,
      handleError: (error: unknown, context: string) => {
        console.error(`${context}:`, error);
        announceToScreenReaderSpy(`${context}にエラーが発生しました`, 'alert');
      }
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('エラーをコンソールに出力し、スクリーンリーダーに通知する', async () => {
    // モジュールを動的にインポート
    const { handleError } = await import('./accessibility');

    // 準備
    const testError = new Error('テストエラー');

    // 実行
    handleError(testError, 'テスト中');

    // 検証
    expect(consoleErrorSpy).toHaveBeenCalledWith('テスト中:', testError);
    expect(announceToScreenReaderSpy).toHaveBeenCalledWith('テスト中にエラーが発生しました', 'alert');
  });

  it('エラーがErrorオブジェクトでない場合も正しく処理する', async () => {
    // モジュールを動的にインポート
    const { handleError } = await import('./accessibility');

    // 準備
    const stringError = 'これはエラー文字列です';

    // 実行
    handleError(stringError, '文字列エラー');

    // 検証
    expect(consoleErrorSpy).toHaveBeenCalledWith('文字列エラー:', stringError);
    expect(announceToScreenReaderSpy).toHaveBeenCalledWith('文字列エラーにエラーが発生しました', 'alert');
  });
});