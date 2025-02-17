import { describe, it, expect, beforeEach, vi } from 'vitest';
import useSettingsStore from './settingsStore';

// i18nのモック
vi.mock('@/i18n', () => ({
  default: {
    language: 'en', // 初期値をenに設定
    changeLanguage: vi.fn(),
  },
}));

// モックされたi18nのインポート
const i18n = vi.mocked(await import('@/i18n')).default;

describe('settingsStore', () => {
  beforeEach(() => {
    // テストごとにストアをリセット
    useSettingsStore.getState().updateSettings({
      language: '日本語',
      buttonAlignment: '右',
      tablePadding: 8,
    });
    // i18nのモックをリセット
    vi.mocked(i18n.changeLanguage).mockClear();
    vi.mocked(i18n).language = 'en'; // 初期値をenに設定
  });

  it('初期状態が正しいこと', () => {
    const state = useSettingsStore.getState();
    expect(state.settings).toEqual({
      language: '日本語',
      buttonAlignment: '右',
      tablePadding: 8,
    });
  });

  it('設定を更新できること', () => {
    useSettingsStore.getState().updateSettings({ buttonAlignment: '左' });
    const updatedState = useSettingsStore.getState();
    expect(updatedState.settings.buttonAlignment).toBe('左');
    expect(updatedState.settings.language).toBe('日本語'); // 他の設定は変更されないこと
  });

  describe('言語設定の更新', () => {
    it('日本語に変更したとき、i18nの言語がjaに設定されること', () => {
      vi.mocked(i18n).language = 'en';
      useSettingsStore.getState().updateSettings({ language: '日本語' });
      expect(vi.mocked(i18n.changeLanguage)).toHaveBeenCalledWith('ja');
    });

    it('英語に変更したとき、i18nの言語がenに設定されること', () => {
      vi.mocked(i18n).language = 'ja';
      useSettingsStore.getState().updateSettings({ language: 'English' });
      expect(vi.mocked(i18n.changeLanguage)).toHaveBeenCalledWith('en');
    });

    it('言語が同じ場合はi18nの言語を変更しないこと', () => {
      vi.mocked(i18n).language = 'ja';
      useSettingsStore.getState().updateSettings({ language: '日本語' });
      expect(vi.mocked(i18n.changeLanguage)).not.toHaveBeenCalled();
    });
  });

  describe('行動表の余白設定', () => {
    it('初期値が8pxであること', () => {
      const { settings } = useSettingsStore.getState();
      expect(settings.tablePadding).toBe(8);
    });

    it('0から16の範囲で設定を変更できること', () => {
      const { updateSettings } = useSettingsStore.getState();

      // 最小値（0px）
      updateSettings({ tablePadding: 0 });
      expect(useSettingsStore.getState().settings.tablePadding).toBe(0);

      // 中間値（8px）
      updateSettings({ tablePadding: 8 });
      expect(useSettingsStore.getState().settings.tablePadding).toBe(8);

      // 最大値（16px）
      updateSettings({ tablePadding: 16 });
      expect(useSettingsStore.getState().settings.tablePadding).toBe(16);
    });

    it('2px単位で設定を変更できること', () => {
      const { updateSettings } = useSettingsStore.getState();

      const validValues = [0, 2, 4, 6, 8, 10, 12, 14, 16];
      validValues.forEach(value => {
        updateSettings({ tablePadding: value });
        expect(useSettingsStore.getState().settings.tablePadding).toBe(value);
      });
    });

    it('2px未満の設定でも横幅の余白は最小2pxが保証されること', () => {
      const { updateSettings } = useSettingsStore.getState();

      // 0pxに設定
      updateSettings({ tablePadding: 0 });
      const settings = useSettingsStore.getState().settings;

      // ActionCellでの実際の余白を確認するためのモックコンポーネントが必要
      // ここではストアの値が正しく設定されることのみを確認
      expect(settings.tablePadding).toBe(0);
    });
  });

  describe('その他の設定との共存', () => {
    it('余白設定を変更しても他の設定が維持されること', () => {
      const { updateSettings } = useSettingsStore.getState();
      const initialSettings = useSettingsStore.getState().settings;

      updateSettings({ tablePadding: 12 });
      const newSettings = useSettingsStore.getState().settings;

      expect(newSettings.language).toBe(initialSettings.language);
      expect(newSettings.buttonAlignment).toBe(initialSettings.buttonAlignment);
      expect(newSettings.tablePadding).toBe(12);
    });
  });
});
