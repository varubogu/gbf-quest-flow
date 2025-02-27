import { useTranslation } from 'react-i18next';
import useSettingsStore from '@/core/stores/settingsStore';
import { SettingItem } from '@/components/molecules/SettingItem';
import type { JSX } from 'react';
import type { ButtonAlignment } from '@/types/types';

// ボタン配置設定の配列
const BUTTON_ALIGNMENTS: { value: ButtonAlignment; translationKey: string }[] = [
  { value: '左', translationKey: 'left' },
  { value: '右', translationKey: 'right' },
];

export function ButtonAlignmentSetting(): JSX.Element {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettingsStore();

  return (
    <SettingItem labelKey="buttonAlignment">
      <div className="flex flex-wrap gap-4">
        {BUTTON_ALIGNMENTS.map(({ value, translationKey }) => (
          <label key={value} className="inline-flex items-center">
            <input
              type="radio"
              name="buttonAlignment"
              value={value}
              checked={settings.buttonAlignment === value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSettings({ buttonAlignment: e.target.value as ButtonAlignment })}
              className="form-radio"
            />
            <span className="ml-2">{t(translationKey)}</span>
          </label>
        ))}
      </div>
    </SettingItem>
  );
}