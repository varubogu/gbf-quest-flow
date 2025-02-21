import React from 'react';
import { textInputBaseStyle } from '@/components/atoms/IconTextButton';
import { tableCellBaseStyle } from '@/components/atoms/TableStyles';

interface CharacterIconProps {
  name: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export const CharacterIcon: React.FC<CharacterIconProps> = ({
  name,
  isEditing,
  onChange,
}) => {
  return (
    <td className={tableCellBaseStyle}>
      {isEditing ? (
        <input
          type="text"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          className={textInputBaseStyle}
        />
      ) : (
        name
      )}
    </td>
  );
};