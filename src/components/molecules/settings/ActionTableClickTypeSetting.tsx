import { useTranslation } from 'react-i18next';
import useSettingsStore from '@/core/stores/settingsStore';
import { SettingItem } from '@/components/molecules/SettingItem';
import type { JSX } from 'react';
import type { ClickType } from '@/types/types';

// クリックタイプ設定の配列
const CLICK_TYPES: { value: ClickType; translationKey: string }[] = [
  { value: 'single', translationKey: 'singleClick' },
  { value: 'double', translationKey: 'doubleClick' },
];

export function ActionTableClickTypeSetting(): JSX.Element {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettingsStore();

  return (
    <SettingItem labelKey="actionTableClickType">
      <div className="flex flex-wrap gap-4">
        {CLICK_TYPES.map(({ value, translationKey }) => (
          <label key={value} className="inline-flex items-center">
            <input
              type="radio"
              name="actionTableClickType"
              value={value}
              checked={settings.actionTableClickType === value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSettings({ actionTableClickType: e.target.value as ClickType })}
              className="form-radio"
            />
            <span className="ml-2">{t(translationKey)}</span>
          </label>
        ))}
      </div>
    </SettingItem>
  );
}