import type { AppSettings } from '@/types/settings';
import { settingsStoreService } from '@/core/services/settingsStoreService';

/**
 * 設定の更新を行う関数
 * @param newSettings 更新する設定
 */
export function updateSettings(newSettings: Partial<AppSettings>): void {
  settingsStoreService.updateSettings(newSettings);
}
