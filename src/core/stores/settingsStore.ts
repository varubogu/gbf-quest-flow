import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '@/types/settings';

export interface SettingsStore {
  settings: AppSettings;
  updateSettings: (_newSettings: Partial<AppSettings>) => void;
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: initSettings(),
      updateSettings: (newSettings: Partial<AppSettings>): void => {
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

/**
 * 初期設定を返す
 * @returns 初期設定
 */
function initSettings(): AppSettings {
  return {
    language: '日本語',
    buttonAlignment: 'right',
    tablePadding: 8,
    actionTableClickType: 'double',
  };
}

export default useSettingsStore;
