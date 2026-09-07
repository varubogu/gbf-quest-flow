import React from 'react';
import type { JobAbility } from '@/types/types';
import { textareaBaseStyle } from '@/components/atoms/common/IconTextButton';
import { useTranslation } from 'react-i18next';
import { HybridSuggestInput } from '@/components/molecules/common/HybridSuggestInput';
import type { SuggestItem } from '@/types/suggest';
import { suggestAbilities } from '@/core/facades/suggestFacade';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';
import { useAutoResizeTextArea } from '@/core/hooks/ui/base/useAutoResizeTextArea';

interface AbilityRowProps {
  ability: JobAbility;
  index: number;
  isEditing: boolean;
  totalAbilities: number;
  jobKey?: string;
  onAbilityChange: (_index: number, _field: keyof JobAbility, _value: string) => void;
  onAbilitySelect?: (_index: number, _item: SuggestItem) => void;
}

export const AbilityRow: React.FC<AbilityRowProps> = ({
  ability,
  index,
  isEditing,
  totalAbilities,
  jobKey,
  onAbilityChange,
  onAbilitySelect,
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
          <HybridSuggestInput
            value={ability.name}
            onChange={(value) => onAbilityChange(index, 'name', value)}
            onSelectItem={(item) => onAbilitySelect?.(index, item)}
            onSuggest={(query) => suggestAbilities(t, query, jobKey)}
            aria-label={t('characterAbilities') as string}
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
