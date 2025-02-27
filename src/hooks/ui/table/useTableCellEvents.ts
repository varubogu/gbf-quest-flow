import * as React from 'react';
import { useCallback } from 'react';
import type { Settings } from '@/types/settings';
import { useTableCellError } from './useTableCellError';
import { parseTabSeparatedText } from '@/lib/utils/tableDataParser';
import { convertToItems } from '@/lib/utils/tableDataUtils';

interface TableCellEventProps {
  content: string;
  value: string;
  isEditable: boolean;
  field?: string;
  onChange?: ((_: string) => void) | undefined;
  onPasteRows?: ((_: string[]) => void) | undefined;
  setIsEditing: (_isEditing: boolean) => void;
  setValue: (_value: string) => void;
  adjustTextareaHeight: () => void;
  settings: Settings;
  fieldOrder?: string[];
}

export const useTableCellEvents = ({
  content,
  value,
  isEditable,
  field,
  onChange,
  onPasteRows,
  setIsEditing,
  setValue,
  adjustTextareaHeight,
  settings: _settings,
  fieldOrder = ['hp', 'prediction', 'charge', 'guard', 'action', 'note'],
}: TableCellEventProps): void => {
  const { handlePasteError, handleValidationError } = useTableCellError();

  const handleClick = useCallback(() => {
    if (isEditable) {
      setIsEditing(true);
    }
  }, [isEditable, setIsEditing]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (value !== content && onChange) {
      onChange(value);
    }
  }, [content, value, onChange, setIsEditing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleBlur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setValue(content);
        setIsEditing(false);
      }
    },
    [content, handleBlur, setIsEditing, setValue]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      adjustTextareaHeight();
    },
    [setValue, adjustTextareaHeight]
  );

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (!onPasteRows || !field) return;

      try {
        const text = e.clipboardData.getData('text');

        // タブ区切りテキストの処理
        if (text.includes('\t')) {
          e.preventDefault();
          const rows = parseTabSeparatedText(text);
          const items = convertToItems(rows, field, fieldOrder);
          onPasteRows(items);
          setIsEditing(false);
          return;
        }

        // 通常の改行区切りテキストの処理
        const lines = text.split('\n').filter(Boolean);
        if (lines.length === 0) {
          handleValidationError('noValidRows');
          return;
        }

        if (lines.length === 1) {
          // 単一行の場合は通常の貼り付け処理を行う
          return;
        }

        // 複数行の場合は配列として処理
        e.preventDefault();
        const items = lines.map(line => ({
          [field]: line.trim()
        }));
        onPasteRows(items);
        setIsEditing(false);
      } catch (error) {
        handlePasteError(error);
      }
    },
    [onPasteRows, field, setIsEditing, handlePasteError, handleValidationError, fieldOrder]
  );

  return {
    handleClick,
    handleBlur,
    handleKeyDown,
    handleChange,
    handlePaste,
  };
};