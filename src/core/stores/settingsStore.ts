import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '@/types/settings';
import i18n from '@/lib/i18n';

export interface SettingsStore {
  settings: AppSettings;
  updateSettings: (_newSettings: Partial<AppSettings>) => void;
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        language: '日本語',
        buttonAlignment: 'right',
        tablePadding: 8,
        actionTableClickType: 'double',
      },
      updateSettings: (newSettings: Partial<AppSettings>): void => {
        // 言語設定が変更された場合、i18nextの言語も変更
        if (newSettings.language) {
          const newLang = newSettings.language === '日本語' ? 'ja' : 'en';
          if (i18n.language !== newLang) {
            i18n.changeLanguage(newLang);
          }
        }

        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: 'app-settings',
    }
  )
);

// 初期言語設定を適用（初回のみ）
const initialSettings = useSettingsStore.getState().settings;
const initialLang = initialSettings.language === '日本語' ? 'ja' : 'en';
if (i18n.language !== initialLang) {
  i18n.changeLanguage(initialLang);
}

export default useSettingsStore;
