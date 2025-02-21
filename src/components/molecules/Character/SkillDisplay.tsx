import React, { memo } from 'react';
import { textareaBaseStyle, useAutoResizeTextArea } from '@/components/atoms/IconTextButton';
import { tableCellBaseStyle } from '@/components/atoms/TableStyles';

interface SkillDisplayProps {
  text: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  'aria-label'?: string;
}

export const SkillDisplay: React.FC<SkillDisplayProps> = memo(({
  text,
  isEditing,
  onChange,
  'aria-label': ariaLabel,
}) => {
  return (
    <td className={tableCellBaseStyle} role="cell">
      {isEditing ? (
        <textarea
          ref={useAutoResizeTextArea(text)}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          className={textareaBaseStyle}
          aria-label={ariaLabel}
        />
      ) : (
        <span role="text" aria-label={ariaLabel}>
          {text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      )}
    </td>
  );
});