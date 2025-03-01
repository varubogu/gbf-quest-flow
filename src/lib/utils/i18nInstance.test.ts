import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { TOptions } from 'i18next';

// モックの設定
vi.mock('@/lib/i18n', () => {
  return {
    default: vi.fn().mockResolvedValue({
      t: vi.fn((key: string, options?: TOptions) => {
        if (options && options.count === 2) {
          return `translated:${key}:plural`;
        }
        return `translated:${key}`;
      }),
      language: 'ja',
    }),
  };
});

// テスト対象のモジュールをインポート
import { getI18n, getT, getCurrentLang } from './i18nInstance';

describe('i18nInstance', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    vi.clearAllMocks();

    // i18nInstanceモジュールをリロード
    vi.resetModules();
  });

  describe('getI18n', () => {
    it('i18nインスタンスを初期化して返す', async () => {
      // 実行
      const i18n = await getI18n();

      // 検証
      expect(i18n).toBeDefined();
      expect(i18n.language).toBe('ja');
      expect(typeof i18n.t).toBe('function');
    });

    it('既に初期化されている場合は同じインスタンスを返す', async () => {
      // 1回目の呼び出し
      const firstInstance = await getI18n();

      // 2回目の呼び出し
      const secondInstance = await getI18n();

      // 検証
      expect(secondInstance).toBe(firstInstance);
    });
  });

  describe('getT', () => {
    it('翻訳関数を返す', async () => {
      // 実行
      const t = await getT();

      // 検証
      expect(typeof t).toBe('function');

      // 翻訳関数のテスト
      const result = t('test.key');
      expect(result).toBe('translated:test.key');
    });

    it('オプション付きで翻訳関数を呼び出せる', async () => {
      // 実行
      const t = await getT();

      // 検証
      const result = t('test.key', { count: 2 });
      expect(result).toBe('translated:test.key:plural');
    });
  });

  describe('getCurrentLang', () => {
    it('現在の言語を返す', async () => {
      // 実行
      const lang = await getCurrentLang();

      // 検証
      expect(lang).toBe('ja');
    });

    it('言語が変更された場合、新しい言語を返す', async () => {
      // i18nインスタンスを取得
      const i18n = await getI18n();

      // 言語を変更
      Object.defineProperty(i18n, 'language', {
        value: 'en',
        writable: true,
      });

      // 実行
      const lang = await getCurrentLang();

      // 検証
      expect(lang).toBe('en');
    });
  });
});