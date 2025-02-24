import React, { memo } from 'react';
import { textInputBaseStyle } from '@/components/atoms/IconTextButton';
import { tableCellBaseStyle } from '@/components/atoms/TableStyles';

interface SummonIconProps {
  name: string;
  isEditing: boolean;
  onChange: (_value: string) => void;
  'aria-label'?: string;
}

export const SummonIcon: React.FC<SummonIconProps> = memo(({
  name,
  isEditing,
  onChange,
  'aria-label': ariaLabel,
}) => {
  return (
    <td className={tableCellBaseStyle} role="cell">
      {isEditing ? (
        <input
          type="text"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          className={textInputBaseStyle}
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
});