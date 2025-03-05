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
      settings: {
        language: '日本語',
        buttonAlignment: 'right',
        tablePadding: 8,
        actionTableClickType: 'double',
      },
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

export default useSettingsStore;
