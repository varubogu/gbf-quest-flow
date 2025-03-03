import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setTitle } from './functions';

// モックの設定
vi.mock('@/core/stores/flowStore', () => ({
  default: {
    getState: vi.fn(() => ({
      setFlowData: vi.fn(),
    })),
  },
}));

// MSWを無効化するためのモック
vi.mock('@/test/mocks/server', () => ({
  server: {
    listen: vi.fn(),
    resetHandlers: vi.fn(),
    close: vi.fn(),
  },
}));

describe('functions', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    vi.resetAllMocks();
    document.title = '';
  });

  // 各テスト後にモックをリストア
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setTitle', () => {
    it('タイトルが指定されている場合、ベースタイトルとタイトルを結合して設定する', () => {
      // 実行
      setTitle('テストタイトル');

      // 検証
      expect(document.title).toBe('グラブル行動表 - テストタイトル');
    });

    it('タイトルが空文字の場合、ベースタイトルのみを設定する', () => {
      // 実行
      setTitle('');

      // 検証
      expect(document.title).toBe('グラブル行動表');
    });

    it('タイトルがnullまたはundefinedの場合、ベースタイトルのみを設定する', () => {
      // 実行
      // @ts-expect-error: テスト用に意図的にnullを渡す
      setTitle(null);

      // 検証
      expect(document.title).toBe('グラブル行動表');

      // 実行
      // @ts-expect-error: テスト用に意図的にundefinedを渡す
      setTitle(undefined);

      // 検証
      expect(document.title).toBe('グラブル行動表');
    });
  });
});