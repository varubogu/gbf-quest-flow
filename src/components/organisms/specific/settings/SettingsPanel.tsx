import { Button } from '@/components/atoms/common/Button';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSetting } from '../../../molecules/specific/settings/LanguageSetting';
import { ButtonAlignmentSetting } from '../../../molecules/specific/settings/ButtonAlignmentSetting';
import { TablePaddingSetting } from '../../../molecules/specific/settings/TablePaddingSetting';
import { ActionTableClickTypeSetting } from '../../../molecules/specific/settings/ActionTableClickTypeSetting';
import type { JSX } from 'react';
interface SettingsPanelProps {
  onBack: () => void;
}

export function SettingsPanel({ onBack }: SettingsPanelProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="mt-4">
      <Button variant="ghost" className="mb-4 gap-2" onClick={onBack}>
        <Menu className="h-4 w-4" />← {t('back')}
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