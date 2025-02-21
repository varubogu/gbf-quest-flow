import React, { memo } from 'react';
import { textInputBaseStyle } from '@/components/atoms/IconTextButton';
import { tableCellBaseStyle } from '@/components/atoms/TableStyles';

interface CharacterIconProps {
  name: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  'aria-label'?: string;
}

export const CharacterIcon: React.FC<CharacterIconProps> = memo(({
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
        />
      ) : (
        <span role="text" aria-label={ariaLabel}>
          {name}
        </span>
      )}
    </td>
  );
});