import * as React from 'react';
import { cn } from '@/utils/cn';
import { Text } from '../atoms/Text';
import type { Action } from '@/types/models';
import { textInputBaseStyle, textareaBaseStyle } from '@/components/atoms/IconTextButton';
import useSettingsStore from '@/stores/settingsStore';
import { useAlignmentStyle } from '@/hooks/useAlignmentStyle';
import { useTableCellBaseStyle } from '@/hooks/useTableCellBaseStyle';
import { useTableCellStateStyle } from '@/hooks/useTableCellStateStyle';
import { useActionCellEvents } from '@/hooks/useActionCellEvents';
import { useActionCellState } from '@/hooks/useActionCellState';

interface ActionCellProps {
  content: string;
  isCurrentRow?: boolean;
  isHeader?: boolean;
  isEditable?: boolean;
  onChange?: (_: string) => void;
  onPasteRows?: (_: Partial<Action>[]) => void;
  field?: keyof Action;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

export const ActionCell: React.FC<ActionCellProps> = ({
  content,
  isCurrentRow = false,
  isHeader = false,
  isEditable = false,
  onChange,
  onPasteRows,
  field,
  alignment = 'left',
  className = '',
}) => {
  const { settings } = useSettingsStore();
  const { getAlignmentClass } = useAlignmentStyle();
  const { getBaseClassName, getBasePadding } = useTableCellBaseStyle();
  const { getStateClassName, getTextVariant } = useTableCellStateStyle();

  const {
    isEditing,
    setIsEditing,
    value,
    setValue,
    textareaRef,
    adjustTextareaHeight,
  } = useActionCellState({ content });

  const {
    handleClick,
    handleBlur,
    handleKeyDown,
    handleChange,
    handlePaste,
  } = useActionCellEvents({
    content,
    value,
    isEditable,
    field,
    onChange,
    onPasteRows,
    setIsEditing,
    setValue,
    adjustTextareaHeight,
    settings,
  });

  return (
    <div
      className={cn(
        getBaseClassName({ isHeader, className }),
        getStateClassName({ isCurrentRow }),
        getAlignmentClass(alignment)
      )}
      style={getBasePadding()}
      onClick={handleClick}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className={cn(
            'w-full bg-white border border-gray-400 rounded px-1 resize-none overflow-hidden',
            'text-sm leading-normal font-normal',
            getAlignmentClass(alignment),
            isHeader ? textInputBaseStyle : textareaBaseStyle
          )}
          rows={1}
        />
      ) : (
        <Text variant={getTextVariant({ isCurrentRow, isHeader })}>
          <pre
            className={cn(
              'whitespace-pre-wrap font-sans text-sm leading-normal',
              getAlignmentClass(alignment)
            )}
          >
            {content}
          </pre>
        </Text>
      )}
    </div>
  );
};
