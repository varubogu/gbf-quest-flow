import { Button } from '@/components/atoms/common/Button';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSetting } from './LanguageSetting';
import { ButtonAlignmentSetting } from './ButtonAlignmentSetting';
import { TablePaddingSetting } from './TablePaddingSetting';
import { ActionTableClickTypeSetting } from './ActionTableClickTypeSetting';
import type { JSX } from 'react';

interface SettingsPanelProps {
  onBack: () => void;
}

export function SettingsPanel({ onBack }: SettingsPanelProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('back')}
      </Button>

      <div className="space-y-6">
        <LanguageSetting />
        <ButtonAlignmentSetting />
        <TablePaddingSetting />
        <ActionTableClickTypeSetting />
      </div>
    </div>
  );
}