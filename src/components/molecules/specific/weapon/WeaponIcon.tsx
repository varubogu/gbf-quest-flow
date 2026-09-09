import React, { memo } from 'react';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';
import { HybridSuggestInput } from '@/components/molecules/common/HybridSuggestInput';
import { rememberName, suggestNames } from '@/core/facades/suggestFacade';

interface WeaponIconProps {
  name: string;
  isEditing: boolean;
  onChange: (_value: string) => void;
  'aria-label'?: string;
}

export const WeaponIcon: React.FC<WeaponIconProps> = memo(
  ({ name, isEditing, onChange, 'aria-label': ariaLabel }) => {
    return (
      <td className={tableCellBaseStyle} role="cell">
        {isEditing ? (
          <HybridSuggestInput
            value={name}
            onChange={onChange}
            onSuggest={(query) => suggestNames('weapon', query, name ? [name] : [])}
            onRemember={(value) => rememberName('weapon', value)}
            aria-label={ariaLabel}
            placeholder={ariaLabel}
          />
        ) : (
          <span role="text" aria-label={ariaLabel}>
            {name}
          </span>
        )}
      </td>
    );
  }
);
