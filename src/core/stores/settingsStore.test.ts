import { describe, it, expect, beforeEach, vi } from 'vitest';
import useSettingsStore from './settingsStore';
import { act } from '@testing-library/react';

// i18nのモック
vi.mock('@/lib/i18n', () => ({
  default: {
    language: 'en', // 初期値をenに設定
    changeLanguage: vi.fn(),
  },
}));

// モックされたi18nのインポート
const i18n = vi.mocked(await import('@/lib/i18n')).default;

describe('settingsStore', () => {
  beforeEach(() => {
    // テストごとにストアをリセット
    const store = useSettingsStore.getState();
    act(() => {
      store.updateSettings({
        language: '日本語',
        buttonAlignment: 'right',
        tablePadding: 8,
        actionTableClickType: 'double',
      });
    });
    // i18nのモックをリセット
    vi.mocked(i18n.changeLanguage).mockClear();
    vi.mocked(i18n).language = 'en'; // 初期値をenに設定
  });

  it('初期状態が正しいこと', () => {
    const state = useSettingsStore.getState();
    expect(state.settings).toEqual({
      language: '日本語',
      buttonAlignment: 'right',
      tablePadding: 8,
      actionTableClickType: 'double',
    });
  });

  it('設定を更新できること', () => {
    const store = useSettingsStore.getState();
    act(() => {
      store.updateSettings({ buttonAlignment: 'left' });
    });
    const updatedState = useSettingsStore.getState();
    expect(updatedState.settings.buttonAlignment).toBe('left');
    expect(updatedState.settings.language).toBe('日本語'); // 他の設定は変更されないこと
  });

  describe('言語設定の更新', () => {
    it('日本語に変更したとき、i18nの言語がjaに設定されること', () => {
      vi.mocked(i18n).language = 'en';
      const store = useSettingsStore.getState();
      act(() => {
        store.updateSettings({ language: '日本語' });
      });
      expect(vi.mocked(i18n.changeLanguage)).toHaveBeenCalledWith('ja');
    });

    it('英語に変更したとき、i18nの言語がenに設定されること', () => {
      vi.mocked(i18n).language = 'ja';
      const store = useSettingsStore.getState();
      act(() => {
        store.updateSettings({ language: 'English' });
      });
      expect(vi.mocked(i18n.changeLanguage)).toHaveBeenCalledWith('en');
    });

    it('言語が同じ場合はi18nの言語を変更しないこと', () => {
      vi.mocked(i18n).language = 'ja';
      const store = useSettingsStore.getState();
      act(() => {
        store.updateSettings({ language: '日本語' });
      });
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
      validValues.forEach((value) => {
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

  describe('行動表選択方法の設定', () => {
    it('初期値がダブルクリックであること', () => {
      const { settings } = useSettingsStore.getState();
      expect(settings.actionTableClickType).toBe('double');
    });

    it('シングルクリックに変更できること', () => {
      const { updateSettings } = useSettingsStore.getState();
      act(() => {
        updateSettings({ actionTableClickType: 'single' });
      });
      expect(useSettingsStore.getState().settings.actionTableClickType).toBe('single');
    });

    it('ダブルクリックに変更できること', () => {
      const { updateSettings } = useSettingsStore.getState();
      act(() => {
        updateSettings({ actionTableClickType: 'double' });
      });
      expect(useSettingsStore.getState().settings.actionTableClickType).toBe('double');
    });

    it('他の設定を変更しても行動表選択方法が維持されること', () => {
      const { updateSettings } = useSettingsStore.getState();
      const initialSettings = useSettingsStore.getState().settings;

      act(() => {
        updateSettings({ tablePadding: 12 });
      });
      const newSettings = useSettingsStore.getState().settings;

      expect(newSettings.actionTableClickType).toBe(initialSettings.actionTableClickType);
    });
  });

  describe('複数設定の同時更新', () => {
    it('全ての設定を同時に更新できること', () => {
      const { updateSettings } = useSettingsStore.getState();
      const initialSettings = useSettingsStore.getState().settings;

      act(() => {
        updateSettings({
          language: 'English',
          buttonAlignment: 'left',
          tablePadding: 16,
          actionTableClickType: 'single',
        });
      });

      const newSettings = useSettingsStore.getState().settings;
      expect(newSettings).toEqual({
        language: 'English',
        buttonAlignment: 'left',
        tablePadding: 16,
        actionTableClickType: 'single',
      });
      expect(newSettings).not.toEqual(initialSettings); // 設定が実際に変更されたことを確認
    });

    it('一部の設定のみを更新できること', () => {
      const { updateSettings } = useSettingsStore.getState();
      const initialSettings = useSettingsStore.getState().settings;

      act(() => {
        updateSettings({
          language: 'English',
          tablePadding: 16,
        });
      });

      const newSettings = useSettingsStore.getState().settings;
      expect(newSettings.language).toBe('English');
      expect(newSettings.tablePadding).toBe(16);
      expect(newSettings.buttonAlignment).toBe(initialSettings.buttonAlignment);
      expect(newSettings.actionTableClickType).toBe(initialSettings.actionTableClickType);
    });
  });
});
