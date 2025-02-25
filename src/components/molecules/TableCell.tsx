import * as React from 'react';
import { cn } from '@/utils/cn';
import { Text } from '../atoms/Text';
import useSettingsStore from '@/stores/settingsStore';
import { useAlignmentStyle } from '@/hooks/ui/base/useAlignmentStyle';
import { useTableCellBaseStyle } from '@/hooks/ui/table/useTableCellBaseStyle';
import { useTableCellStateStyle } from '@/hooks/ui/table/useTableCellStateStyle';
import { useTableCellEvents } from '@/hooks/ui/table/useTableCellEvents';
import { useTableCellState } from '@/hooks/ui/table/useTableCellState';
import { useTextareaStyle } from '@/hooks/ui/base/useTextareaStyle';

interface TableCellProps {
  content: string;
  isCurrentRow?: boolean;
  isHeader?: boolean;
  isEditable?: boolean;
  onChange?: (_: string) => void;
  onPasteRows?: (_: any[]) => void;
  field?: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
  'data-testid'?: string;
  as?: 'div' | 'td';
}

export const TableCell: React.FC<TableCellProps> = ({
  content,
  isCurrentRow = false,
  isHeader = false,
  isEditable = false,
  onChange,
  onPasteRows,
  field,
  alignment = 'left',
  className = '',
  'data-testid': dataTestId,
  as = 'div',
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
  } = useTableCellState({ content });

  const {
    handleClick,
    handleBlur,
    handleKeyDown,
    handleChange,
    handlePaste,
  } = useTableCellEvents({
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

  const commonProps = {
    className: cn(
      as === 'td' ? "border-b border-r border-gray-400 p-0.5" : "",
      getBaseClassName({ isHeader, className }),
      getStateClassName({ isCurrentRow }),
      getAlignmentClass(alignment)
    ),
    style: getBasePadding(),
    onClick: handleClick,
    'data-testid': dataTestId,
    'data-field': field,
  };

  const content_element = isEditing ? (
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
  );

  return as === 'div'
    ? <div {...commonProps}>{content_element}</div>
    : <td {...commonProps}>{content_element}</td>;
};