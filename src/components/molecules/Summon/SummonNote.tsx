import React, { memo } from 'react';
import { textareaBaseStyle } from '@/components/atoms/IconTextButton';
import { useAutoResizeTextArea } from '@/core/hooks/ui/base/useAutoResizeTextArea';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';

interface SummonNoteProps {
  note: string;
  isEditing: boolean;
  onChange: (_value: string) => void;
  'aria-label'?: string;
}

export const SummonNote: React.FC<SummonNoteProps> = memo(({
  note,
  isEditing,
  onChange,
  'aria-label': ariaLabel,
}) => {
  const textareaRef = useAutoResizeTextArea(note);

  return (
    <td className={tableCellBaseStyle} role="cell">
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={note}
          onChange={(e) => onChange(e.target.value)}
          className={textareaBaseStyle}
          aria-label={ariaLabel}
          placeholder={ariaLabel}
        />
      ) : (
        <span role="text" aria-label={ariaLabel}>
          {note.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < note.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      )}
    </td>
  );
});