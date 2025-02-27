import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Text } from '../atoms/Text';
import type { Action, TableAlignment } from '@/types/types';
import useSettingsStore from '@/core/stores/settingsStore';
import { useAlignmentStyle } from '@/hooks/ui/base/useAlignmentStyle';
import { useTableCellBaseStyle } from '@/hooks/ui/table/useTableCellBaseStyle';
import { useTableCellStateStyle } from '@/hooks/ui/table/useTableCellStateStyle';
import { useActionCellEvents } from '@/hooks/ui/table/useActionCellEvents';
import { useActionCellState } from '@/hooks/ui/table/useActionCellState';
import { useTextareaStyle } from '@/hooks/ui/base/useTextareaStyle';

interface TableCellProps {
  content: string;
  isCurrentRow?: boolean;
  isHeader?: boolean;
  isEditable?: boolean;
  onChange?: (_: string) => void;
  onPasteRows?: ((_: Partial<Action>[]) => void) | undefined;
  field?: keyof Action;
  alignment?: TableAlignment;
  className?: string;
  'data-testid'?: string;
}

export const TableCell: React.FC<TableCellProps> = ({
  content,
  isCurrentRow = false,
  isHeader = false,
  isEditable = false,
  onChange,
  onPasteRows,
  field,
  alignment = 'left' as const,
  className = '',
  'data-testid': dataTestId,
}) => {
  const { settings } = useSettingsStore();
  const { getAlignmentClass } = useAlignmentStyle();
  const { getBaseClassName, getBasePadding } = useTableCellBaseStyle();
  const { getStateClassName, getTextVariant } = useTableCellStateStyle();
  const { getTextareaClassName } = useTextareaStyle();

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
    field: field as keyof Action,
    onChange,
    onPasteRows,
    setIsEditing,
    setValue,
    adjustTextareaHeight,
    settings,
  });

  return (
    <td
      className={cn(
        "border-b border-r border-gray-400 p-0.5",
        getBaseClassName({ isHeader, className }),
        getStateClassName({ isCurrentRow }),
        getAlignmentClass(alignment)
      )}
      style={getBasePadding()}
      onClick={handleClick}
      data-testid={dataTestId}
      data-field={field}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className={getTextareaClassName({ isHeader, alignment })}
          rows={1}
        />
      ) : (
        <Text variant={getTextVariant({ isCurrentRow, isHeader })}>
          {content}
        </Text>
      )}
    </td>
  );
};
