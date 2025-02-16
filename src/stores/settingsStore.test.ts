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
import i18n from '@/i18n';

describe('settingsStore', () => {
  beforeEach(() => {
    // テストごとにストアをリセット
    useSettingsStore.getState().updateSettings({
      language: '日本語',
      buttonAlignment: '右',
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
});
