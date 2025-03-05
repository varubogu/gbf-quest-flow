import type { AppSettings } from '@/types/settings';
import { settingsStoreService } from '@/core/services/settingsStoreService';
import useSettingsStore from '@/core/stores/settingsStore';

/**
 * 設定の更新を行う関数
 * @param newSettings 更新する設定
 */
export function updateSettings(newSettings: Partial<AppSettings>): void {
  settingsStoreService.updateSettings(newSettings);
}

/**
 * 設定を参照するためのフック
 * コンポーネントはこのフックを使用して設定を参照します
 * @returns 現在の設定
 */
export function useSettings(): AppSettings {
  return useSettingsStore((state) => state.settings);
}
