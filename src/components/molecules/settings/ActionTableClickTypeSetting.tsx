import { useTranslation } from 'react-i18next';
import useSettingsStore from '@/stores/settingsStore';
import { SettingItem } from '../SettingItem';

// クリックタイプの型定義
type ClickType = 'single' | 'double';

// クリックタイプ設定の配列
const CLICK_TYPES: { value: ClickType; translationKey: string }[] = [
  { value: 'single', translationKey: 'singleClick' },
  { value: 'double', translationKey: 'doubleClick' },
];

export function ActionTableClickTypeSetting() {
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
              onChange={(e) => updateSettings({ actionTableClickType: e.target.value as ClickType })}
              className="form-radio"
            />
            <span className="ml-2">{t(translationKey)}</span>
          </label>
        ))}
      </div>
    </SettingItem>
  );
}