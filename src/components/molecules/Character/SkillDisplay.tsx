import React, { memo } from 'react';
import { textareaBaseStyle } from '@/components/atoms/IconTextButton';
import { useAutoResizeTextArea } from '@/core/hooks/ui/base/useAutoResizeTextArea';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';

interface SkillDisplayProps {
  text: string;
  isEditing: boolean;
  onChange: (_value: string) => void;
  'aria-label'?: string;
}

export const SkillDisplay: React.FC<SkillDisplayProps> = memo(({
  text,
  isEditing,
  onChange,
  'aria-label': ariaLabel,
}) => {
  const textareaRef = useAutoResizeTextArea(text);

  return (
    <td className={tableCellBaseStyle} role="cell">
      {isEditing ? (
        <textarea
          ref={textareaRef}
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