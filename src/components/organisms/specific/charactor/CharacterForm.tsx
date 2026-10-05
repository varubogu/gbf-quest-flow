import React, { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { CharacterPosition, Member } from '@/types/models';
import { CharacterIcon } from '@/components/molecules/specific/character/CharacterIcon';
import { SkillDisplay } from '@/components/molecules/specific/character/SkillDisplay';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';
import { HybridSuggestInput } from '@/components/molecules/common/HybridSuggestInput';
import { suggestAwakeTypes } from '@/core/facades/suggestFacade';

interface CharacterFormProps {
  position: CharacterPosition;
  members: Member[];
  isEditing: boolean;
  onMemberChange: (
    _position: CharacterPosition,
    _index: number,
    _field: keyof Member,
    _value: string
  ) => void;
}

type HandleChange = (_index: number, _field: keyof Member) => (_value: string) => void;

export const CharacterForm: React.FC<CharacterFormProps> = memo(
  ({ position, members, isEditing, onMemberChange }) => {
    const { t } = useTranslation();

    const handleChange: HandleChange = useCallback(
      (index, field) => (value) => {
        onMemberChange(position, index, field, value);
      },
      [position, onMemberChange]
    );

    return (
      <>
        {members.map((char, index) => (
          <tr key={`${position}-${index}`} role="row">
            {index === 0 && (
              <th
                className={tableCellBaseStyle}
                rowSpan={members.length}
                role="cell"
                aria-label={t(position === 'front' ? 'characterFront' : 'characterBack') as string}
              >
                {t(position === 'front' ? 'characterFront' : 'characterBack') as string}
              </th>
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
                <HybridSuggestInput
                  value={char.awaketype}
                  onChange={handleChange(index, 'awaketype')}
                  onSuggest={(query) => suggestAwakeTypes(t, query)}
                  maxLength={8}
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
  }
);
