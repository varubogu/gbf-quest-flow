import * as React from 'react';
import { cn } from '@/utils/cn';
import { Text } from '../atoms/Text';
import { useState, useRef, useEffect } from 'react';
import type { Action } from '@/types/models';
import { textInputBaseStyle, textareaBaseStyle } from '@/components/atoms/IconTextButton';
import useSettingsStore from '@/stores/settingsStore';
import { parseTabSeparatedText, convertToActions } from '@/utils/tableDataParser';
import { useAlignmentStyle } from '@/hooks/useAlignmentStyle';
import { useTableCellBaseStyle } from '@/hooks/useTableCellBaseStyle';
import { useTableCellStateStyle } from '@/hooks/useTableCellStateStyle';

type OnChangeCallback = (_: string) => void;
type OnPasteRowsCallback = (_: Partial<Action>[]) => void;

interface ActionCellProps {
  content: string;
  isCurrentRow?: boolean;
  isHeader?: boolean;
  isEditable?: boolean;
  onChange?: OnChangeCallback;
  onPasteRows?: OnPasteRowsCallback;
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
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { settings } = useSettingsStore();
  const { getAlignmentClass } = useAlignmentStyle();
  const { getBaseClassName, getBasePadding } = useTableCellBaseStyle();
  const { getStateClassName, getTextVariant } = useTableCellStateStyle();

  useEffect(() => {
    setValue(content || '');
  }, [content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const currentValue = textareaRef.current.value;
      if (currentValue) {
        textareaRef.current.setSelectionRange(currentValue.length, currentValue.length);
      }
      adjustTextareaHeight();
    }
  }, [isEditing]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleClick = () => {
    if (isEditable) {
      setIsEditing(true);
      return;
    }

    if (settings.actionTableClickType === 'single') {
      if (onChange) onChange(content);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange && value !== content) {
      onChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      setIsEditing(false);
      if (onChange && value !== content) {
        onChange(value);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setValue(content);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustTextareaHeight();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!onPasteRows || !field) return;

    const clipboardText = e.clipboardData.getData('text');

    if (clipboardText.includes('\t')) {
      e.preventDefault();
      try {
        const rows = parseTabSeparatedText(clipboardText);
        const actions = convertToActions(rows, field);
        onPasteRows(actions);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert('貼り付け処理中にエラーが発生しました');
        }
      }
    }
  };

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
