import { useTranslation } from 'react-i18next';
import { updateSettings } from '@/core/facades/settingsStoreFacade';
import useSettingsStore, { type SettingsStore } from '@/core/stores/settingsStore'
import { SettingItem } from '@/components/molecules/common/SettingItem';
import type { JSX } from 'react';
import type { ButtonAlignment } from '@/types/types';

// ボタン配置設定の配列
const BUTTON_ALIGNMENTS: { value: ButtonAlignment; translationKey: string }[] = [
  { value: 'left', translationKey: 'left' },
  { value: 'right', translationKey: 'right' },
];

export function ButtonAlignmentSetting(): JSX.Element {
  const { t } = useTranslation();
  const settings = useSettingsStore((state: SettingsStore) => state.settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateSettings({
      buttonAlignment: e.target.value as ButtonAlignment,
    });
  };

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
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">{t(translationKey)}</span>
          </label>
        ))}
      </div>
    </SettingItem>
  );
}