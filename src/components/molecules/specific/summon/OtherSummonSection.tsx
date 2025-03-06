import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummonIcon } from './SummonIcon';
import { SummonNote } from './SummonNote';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';
import type { Summon } from '@/types/types';

interface OtherSummonSectionProps {
  summons: Summon[];
  isEditing: boolean;
  onSummonChange: (_index: number, _field: keyof Summon, _value: string) => void;
}

export const OtherSummonSection: React.FC<OtherSummonSectionProps> = ({
  summons,
  isEditing,
  onSummonChange
}) => {
  const { t } = useTranslation();

  if (summons.length === 0) return null;

  return (
    <>
      {summons.map((summon, index) => (
        <tr key={`other-${index}`}>
          {index === 0 && (
            <th
              className={tableCellBaseStyle}
              rowSpan={summons.length}
            >
              {t('summonNormal')}
            </th>
          )}
          <SummonIcon
            name={summon.name}
            isEditing={isEditing}
            onChange={(value) => onSummonChange(index, 'name', value)}
            aria-label={t('summonName') as string}
          />
          <SummonNote
            note={summon.note}
            isEditing={isEditing}
            onChange={(value) => onSummonChange(index, 'note', value)}
            aria-label={t('overview') as string}
          />
        </tr>
      ))}
    </>
  );
};