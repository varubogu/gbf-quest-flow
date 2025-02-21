import React from 'react';
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

export const CharacterForm: React.FC<CharacterFormProps> = ({
  position,
  members,
  isEditing,
  onMemberChange,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {members.map((char, index) => (
        <tr key={`${position}-${index}`}>
          {index === 0 && (
            <td className={tableCellBaseStyle} rowSpan={members.length}>
              {t(position === 'front' ? 'characterFront' : 'characterBack')}
            </td>
          )}
          <CharacterIcon
            name={char.name}
            isEditing={isEditing}
            onChange={(value) => onMemberChange(position, index, 'name', value)}
          />
          <SkillDisplay
            text={char.note}
            isEditing={isEditing}
            onChange={(value) => onMemberChange(position, index, 'note', value)}
          />
          <td className={tableCellBaseStyle}>
            {isEditing ? (
              <input
                type="text"
                value={char.awaketype}
                onChange={(e) => onMemberChange(position, index, 'awaketype', e.target.value)}
                className={textInputBaseStyle}
                maxLength={4}
              />
            ) : (
              char.awaketype
            )}
          </td>
          <SkillDisplay
            text={char.accessories}
            isEditing={isEditing}
            onChange={(value) => onMemberChange(position, index, 'accessories', value)}
          />
          <SkillDisplay
            text={char.limitBonus}
            isEditing={isEditing}
            onChange={(value) => onMemberChange(position, index, 'limitBonus', value)}
          />
        </tr>
      ))}
    </>
  );
};