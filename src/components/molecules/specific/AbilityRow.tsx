import React from 'react';
import type { JobAbility } from '@/types/types';
import {
  textInputBaseStyle,
  textareaBaseStyle,
} from '@/components/atoms/common/IconTextButton';
import { useTranslation } from 'react-i18next';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';
import { useAutoResizeTextArea } from '@/core/hooks/ui/base/useAutoResizeTextArea';

interface AbilityRowProps {
  ability: JobAbility;
  index: number;
  isEditing: boolean;
  totalAbilities: number;
  onAbilityChange: (_index: number, _field: keyof JobAbility, _value: string) => void;
}

export const AbilityRow: React.FC<AbilityRowProps> = ({
  ability,
  index,
  isEditing,
  totalAbilities,
  onAbilityChange
}) => {
  const { t } = useTranslation();
  const abilityNoteRef = useAutoResizeTextArea(ability.note);

  return (
    <tr>
      {index === 0 && (
        <th className={tableCellBaseStyle} rowSpan={totalAbilities}>
          {t('characterAbilities')}
        </th>
      )}
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <input
            type="text"
            value={ability.name}
            onChange={(e) => onAbilityChange(index, 'name', e.target.value)}
            className={textInputBaseStyle}
          />
        ) : (
          ability.name
        )}
      </td>
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <textarea
            ref={abilityNoteRef}
            value={ability.note}
            onChange={(e) => onAbilityChange(index, 'note', e.target.value)}
            className={textareaBaseStyle}
          />
        ) : (
          ability.note.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < ability.note.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))
        )}
      </td>
    </tr>
  );
};