import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Summon, SummonType } from '@/types/types';
import { SummonIcon } from '@/components/molecules/Summon/SummonIcon';
import { SummonNote } from '@/components/molecules/Summon/SummonNote';
import { useSummonForm } from '@/hooks/domain/summons/useSummonForm';

interface SummonFormProps {
  type: SummonType;
  summons: Summon[];
  isEditing: boolean;
}

export const SummonForm = memo(({ type, summons, isEditing }: SummonFormProps) => {
  const { t } = useTranslation();
  const handleSummonChange = useSummonForm();

  return (
    <table role="table" aria-label={t(`summon.${type}Label`) as string}>
      <thead>
        <tr role="row">
          <th role="columnheader" scope="col">{t('summon.name') as string}</th>
          <th role="columnheader" scope="col">{t('summon.note') as string}</th>
        </tr>
      </thead>
      <tbody>
        {summons.map((summon, index) => (
          <tr key={index} role="row">
            <SummonIcon
              name={summon.name}
              isEditing={isEditing}
              onChange={(value) => handleSummonChange(type, index, 'name', value)}
              aria-label={t('summon.nameLabel') as string}
            />
            <SummonNote
              note={summon.note}
              isEditing={isEditing}
              onChange={(value) => handleSummonChange(type, index, 'note', value)}
              aria-label={t('summon.noteLabel') as string}
            />
          </tr>
        ))}
      </tbody>
    </table>
  );
});