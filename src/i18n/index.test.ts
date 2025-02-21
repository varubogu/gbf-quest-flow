import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import i18next from './index';

describe('i18n', () => {
  // テスト前の状態を保存
  const originalLanguage = i18next.language;
  const originalOptions = { ...i18next.options };

  beforeAll(() => {
    // 言語検出を無効化し、明示的に日本語を設定
    i18next.options.detection = { order: [] };
    return i18next.changeLanguage('ja');
  });

  afterAll(() => {
    // テスト後に元の状態を復元
    i18next.options = originalOptions;
    return i18next.changeLanguage(originalLanguage);
  });

  describe('単体テスト', () => {
    it('デフォルトの言語が日本語であること', () => {
      expect(i18next.language).toBe('ja');
    });

    it('フォールバック言語に日本語が含まれていること', () => {
      const fallbackLng = i18next.options.fallbackLng;
      if (Array.isArray(fallbackLng)) {
        expect(fallbackLng).toContain('ja');
      } else {
        expect(fallbackLng).toBe('ja');
      }
    });

    it('日本語リソースが存在すること', () => {
      const jaResource = i18next.getResourceBundle('ja', 'translation');
      expect(jaResource).toBeDefined();
      expect(jaResource.title).toBe('グラブル行動表');
      expect(jaResource.description).toBe('グラブルの行動表を管理・共有するためのツール');
    });

    it('英語リソースが存在すること', () => {
      const enResource = i18next.getResourceBundle('en', 'translation');
      expect(enResource).toBeDefined();
      expect(enResource.title).toBe('GBF Quest Flow');
      expect(enResource.description).toBe('A tool to manage and share quest flows for Granblue Fantasy');
    });

    it('存在しない翻訳キーの場合はフォールバック言語の値を返すこと', () => {
      const nonExistentKey = 'nonexistent.key';
      const translation = i18next.t(nonExistentKey);
      expect(translation).toBe(nonExistentKey); // i18nextのデフォルト動作ではキー名を返す
    });

    it('補間が正しく機能すること', () => {
      const message = 'エラーメッセージ';
      const translation = i18next.t('pasteError.specific', { message });
      expect(translation).toBe(`貼り付け処理中にエラーが発生しました: ${message}`);
    });
  });

  describe('結合テスト', () => {
    it('言語を切り替えられること', async () => {
      // 日本語から英語に切り替え
      await i18next.changeLanguage('en');
      expect(i18next.language).toBe('en');
      expect(i18next.t('title')).toBe('GBF Quest Flow');

      // 英語から日本語に切り替え
      await i18next.changeLanguage('ja');
      expect(i18next.language).toBe('ja');
      expect(i18next.t('title')).toBe('グラブル行動表');
    });

    it('分割されたリソースが正しく結合されていること', () => {
      // common
      expect(i18next.t('title')).toBe('グラブル行動表');
      // weapon
      expect(i18next.t('weaponCategory')).toBe('カテゴリ');
      // character
      expect(i18next.t('characterPosition')).toBe('ポジション');
      // summon
      expect(i18next.t('summonCategory')).toBe('カテゴリ');
    });
  });
});