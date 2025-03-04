import { create } from 'zustand';
import type { AppSettings } from '@/types/settings';
import useSettingsStore from '@/core/stores/settingsStore';

interface SettingsStoreFacade {
  settings: AppSettings;
  updateSettings: (_newSettings: Partial<AppSettings>) => void;
}

/**
 * 設定ストアのファサード
 *
 * このファサードは、設定ストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
const useSettingsStoreFacade = create((_set, _get): SettingsStoreFacade => {
  // 初期状態を設定
  const initialState = {
    settings: useSettingsStore.getState().settings,
  };

  return {
    // 状態（プロパティ）- SettingsStoreから初期化
    ...initialState,

    // SettingsStore関連のメソッド
    updateSettings: (newSettings: Partial<AppSettings>): void => {
      useSettingsStore.getState().updateSettings(newSettings);
    },
  };
});

export default useSettingsStoreFacade;