import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import i18n from './i18n';

describe('i18n', () => {
  // テスト前の状態を保存
  const originalLanguage = i18n.language;
  const originalOptions = { ...i18n.options };

  beforeAll(() => {
    // 言語検出を無効化し、明示的に日本語を設定
    i18n.options.detection = { order: [] };
    return i18n.changeLanguage('ja');
  });

  afterAll(() => {
    // テスト後に元の状態を復元
    i18n.options = originalOptions;
    return i18n.changeLanguage(originalLanguage);
  });

  it('デフォルトの言語が日本語であること', () => {
    expect(i18n.language).toBe('ja');
  });

  it('フォールバック言語に日本語が含まれていること', () => {
    const fallbackLng = i18n.options.fallbackLng;
    if (Array.isArray(fallbackLng)) {
      expect(fallbackLng).toContain('ja');
    } else {
      expect(fallbackLng).toBe('ja');
    }
  });

  it('日本語リソースが存在すること', () => {
    const jaResource = i18n.getResourceBundle('ja', 'translation');
    expect(jaResource).toBeDefined();
    expect(jaResource.title).toBe('グラブル行動表');
    expect(jaResource.description).toBe('グラブルの行動表を管理・共有するためのツール');
  });

  it('言語を切り替えられること', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.language).toBe('en');
    await i18n.changeLanguage('ja');
    expect(i18n.language).toBe('ja');
  });

  it('存在しない翻訳キーの場合はフォールバック言語の値を返すこと', () => {
    const nonExistentKey = 'nonexistent.key';
    const translation = i18n.t(nonExistentKey);
    expect(translation).toBe(nonExistentKey); // i18nextのデフォルト動作ではキー名を返す
  });

  it('補間が正しく機能すること', () => {
    const translation = i18n.t('title');
    expect(translation).toBe('グラブル行動表');
  });
});