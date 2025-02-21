import React from 'react';
import { textareaBaseStyle, useAutoResizeTextArea } from '@/components/atoms/IconTextButton';
import { tableCellBaseStyle } from '@/components/atoms/TableStyles';

interface SkillDisplayProps {
  text: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export const SkillDisplay: React.FC<SkillDisplayProps> = ({
  text,
  isEditing,
  onChange,
}) => {
  return (
    <td className={tableCellBaseStyle}>
      {isEditing ? (
        <textarea
          ref={useAutoResizeTextArea(text)}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          className={textareaBaseStyle}
        />
      ) : (
        text.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < text.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))
      )}
    </td>
  );
};