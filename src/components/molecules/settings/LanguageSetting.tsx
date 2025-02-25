import { useTranslation } from 'react-i18next';
import useSettingsStore from '@/stores/settingsStore';
import { SettingItem } from '../SettingItem';
import type { JSX } from 'react';

// 言語設定の型定義
type Language = '日本語' | 'English';

// 言語設定の配列
const LANGUAGES: { value: Language; translationKey: string }[] = [
  { value: '日本語', translationKey: 'japanese' },
  { value: 'English', translationKey: 'english' },
  // 新しい言語を追加する場合は、ここに追加するだけでOK
  // 例: { value: '中文', translationKey: 'chinese' },
];

export function LanguageSetting(): JSX.Element {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettingsStore();

  return (
    <SettingItem labelKey="language">
      <div className="flex flex-wrap gap-4">
        {LANGUAGES.map(({ value, translationKey }) => (
          <label key={value} className="inline-flex items-center">
            <input
              type="radio"
              name="language"
              value={value}
              checked={settings.language === value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSettings({ language: e.target.value as Language })}
              className="form-radio"
            />
            <span className="ml-2">{t(translationKey)}</span>
          </label>
        ))}
      </div>
    </SettingItem>
  );
}