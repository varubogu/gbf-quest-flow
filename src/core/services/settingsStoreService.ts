import type { AppSettings } from '@/types/settings';
import useSettingsStore from '@/core/stores/settingsStore';
import i18n from '@/lib/i18n';

/**
 * 設定ストアのサービス
 *
 * このサービスは、設定ストアの更新処理を担当します。
 * ビジネスロジックをここに集約することで、ファサードやコンポーネントから
 * ロジックを分離し、テストや保守性を向上させます。
 */
export class SettingsStoreService {
  /**
   * 設定を更新する
   * @param newSettings 更新する設定
   */
  updateSettings(newSettings: Partial<AppSettings>): void {
    // 言語設定が変更された場合、i18nextの言語も変更
    if (newSettings.language) {
      const newLang = newSettings.language === '日本語' ? 'ja' : 'en';
      if (i18n.language !== newLang) {
        i18n.changeLanguage(newLang);
      }
    }

    // ストアの更新
    useSettingsStore.getState().updateSettings(newSettings);
  }
}

// 初期言語設定を適用（初回のみ）
const initialSettings = useSettingsStore.getState().settings;
const initialLang = initialSettings.language === '日本語' ? 'ja' : 'en';
if (i18n.language !== initialLang) {
  i18n.changeLanguage(initialLang);
}

// シングルトンインスタンスをエクスポート
export const settingsStoreService = new SettingsStoreService();