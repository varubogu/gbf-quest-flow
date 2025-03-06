import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummonIcon } from './SummonIcon';
import { SummonNote } from './SummonNote';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';
import type { Summon } from '@/types/types';

interface MainSummonSectionProps {
  summon: Summon;
  isEditing: boolean;
  onSummonChange: (_field: keyof Summon, _value: string) => void;
}

export const MainSummonSection: React.FC<MainSummonSectionProps> = ({
  summon,
  isEditing,
  onSummonChange
}) => {
  const { t } = useTranslation();

  return (
    <tr>
      <th className={tableCellBaseStyle}>{t('summonMain')}</th>
      <SummonIcon
        name={summon.name}
        isEditing={isEditing}
        onChange={(value) => onSummonChange('name', value)}
        aria-label={t('summonName') as string}
      />
      <SummonNote
        note={summon.note}
        isEditing={isEditing}
        onChange={(value) => onSummonChange('note', value)}
        aria-label={t('overview') as string}
      />
    </tr>
  );
};