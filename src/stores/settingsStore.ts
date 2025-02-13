import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppSettings } from "@/types/settings";

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        language: "日本語",
        buttonAlignment: "右",
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: "app-settings",
    }
  )
);

export default useSettingsStore;