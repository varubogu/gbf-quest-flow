import useSettingsStoreFacade from '@/core/facades/settingsStoreFacade';
import { SettingItem } from '../SettingItem';
import type { JSX } from 'react';

export function TablePaddingSetting(): JSX.Element {
  const { settings, updateSettings } = useSettingsStoreFacade();

  return (
    <SettingItem labelKey="tablePadding">
      <div className="flex items-center">
        <input
          type="range"
          min="0"
          max="8"
          value={settings.tablePadding}
          onChange={(e) => updateSettings({ tablePadding: Number(e.target.value) })}
          className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="ml-4">{settings.tablePadding}</span>
      </div>
    </SettingItem>
  );
}