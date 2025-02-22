import React, { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Member } from '@/types/models';
import { CharacterIcon } from '@/components/molecules/Character/CharacterIcon';
import { SkillDisplay } from '@/components/molecules/Character/SkillDisplay';
import { tableCellBaseStyle } from '@/components/atoms/TableStyles';
import { textInputBaseStyle } from '@/components/atoms/IconTextButton';

interface CharacterFormProps {
  position: 'front' | 'back';
  members: Member[];
  isEditing: boolean;
  onMemberChange: (_position: 'front' | 'back', _index: number, _field: keyof Member, _value: string) => void;
}

export const CharacterForm: React.FC<CharacterFormProps> = memo(({
  position,
  members,
  isEditing,
  onMemberChange,
}) => {
  const { t } = useTranslation();

  const handleChange = useCallback((index: number, field: keyof Member) => (value: string) => {
    onMemberChange(position, index, field, value);
  }, [position, onMemberChange]);

  const handleAwakeTypeChange = useCallback((index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onMemberChange(position, index, 'awaketype', e.target.value);
  }, [position, onMemberChange]);

  return (
    <>
      {members.map((char, index) => (
        <tr key={`${position}-${index}`} role="row">
          {index === 0 && (
            <td
              className={tableCellBaseStyle}
              rowSpan={members.length}
              role="cell"
              aria-label={t(position === 'front' ? 'characterFront' : 'characterBack') as string}
            >
              {t(position === 'front' ? 'characterFront' : 'characterBack') as string}
            </td>
          )}
          <CharacterIcon
            name={char.name}
            isEditing={isEditing}
            onChange={handleChange(index, 'name')}
            aria-label={t('characterName') as string}
          />
          <SkillDisplay
            text={char.note}
            isEditing={isEditing}
            onChange={handleChange(index, 'note')}
            aria-label={t('characterUsage') as string}
          />
          <td className={tableCellBaseStyle} role="cell">
            {isEditing ? (
              <input
                type="text"
                value={char.awaketype}
                onChange={handleAwakeTypeChange(index)}
                className={textInputBaseStyle}
                maxLength={4}
                aria-label={t('characterAwakening') as string}
              />
            ) : (
              char.awaketype
            )}
          </td>
          <SkillDisplay
            text={char.accessories}
            isEditing={isEditing}
            onChange={handleChange(index, 'accessories')}
            aria-label={t('characterAccessories') as string}
          />
          <SkillDisplay
            text={char.limitBonus}
            isEditing={isEditing}
            onChange={handleChange(index, 'limitBonus')}
            aria-label={t('characterLimitBonus') as string}
          />
        </tr>
      ))}
    </>
  );
});