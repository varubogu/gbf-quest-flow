import { Button } from '@/components/atoms/common/Button';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSetting } from '../../molecules/specific/settings/LanguageSetting';
import { ButtonAlignmentSetting } from '../../molecules/specific/settings/ButtonAlignmentSetting';
import { TablePaddingSetting } from '../../molecules/specific/settings/TablePaddingSetting';
import { ActionTableClickTypeSetting } from '../../molecules/specific/settings/ActionTableClickTypeSetting';
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