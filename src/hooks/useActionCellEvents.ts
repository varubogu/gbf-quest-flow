import { useCallback } from 'react';
import type { Action } from '@/types/models';
import { parseTabSeparatedText, convertToActions } from '@/utils/tableDataParser';

interface ActionCellEventProps {
  content: string;
  value: string;
  isEditable: boolean;
  field: keyof Action | undefined;
  onChange: ((_: string) => void) | undefined;
  onPasteRows: ((_: Partial<Action>[]) => void) | undefined;
  setIsEditing: (_: boolean) => void;
  setValue: (_: string) => void;
  adjustTextareaHeight: () => void;
  settings: {
    actionTableClickType: 'single' | 'double';
  };
}

export const useActionCellEvents = ({
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
}: ActionCellEventProps) => {
  // 編集モードの制御
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, [setIsEditing]);

  const finishEditing = useCallback((shouldSave: boolean) => {
    setIsEditing(false);
    if (shouldSave && onChange && value !== content) {
      onChange(value);
    }
  }, [setIsEditing, onChange, value, content]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setValue(content);
  }, [setIsEditing, setValue, content]);

  // 値の変更通知
  const notifyValueChange = useCallback((newValue: string) => {
    if (onChange) onChange(newValue);
  }, [onChange]);

  // テキストエリアの値更新
  const updateTextAreaValue = useCallback((newValue: string) => {
    setValue(newValue);
    adjustTextareaHeight();
  }, [setValue, adjustTextareaHeight]);

  // ペースト処理
  const processPastedData = useCallback((text: string) => {
    if (!onPasteRows || !field) return false;

    if (text.includes('\t')) {
      try {
        const rows = parseTabSeparatedText(text);
        const actions = convertToActions(rows, field);
        onPasteRows(actions);
        return true;
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert('貼り付け処理中にエラーが発生しました');
        }
      }
    }
    return false;
  }, [onPasteRows, field]);

  // イベントハンドラー
  const handleClick = useCallback(() => {
    if (isEditable) {
      startEditing();
      return;
    }

    if (settings.actionTableClickType === 'single') {
      notifyValueChange(content);
    }
  }, [isEditable, settings.actionTableClickType, startEditing, notifyValueChange, content]);

  const handleBlur = useCallback(() => {
    finishEditing(true);
  }, [finishEditing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        finishEditing(true);
      } else if (e.key === 'Escape') {
        cancelEditing();
      }
    },
    [finishEditing, cancelEditing]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateTextAreaValue(e.target.value);
    },
    [updateTextAreaValue]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const clipboardText = e.clipboardData.getData('text');
      if (processPastedData(clipboardText)) {
        e.preventDefault();
      }
    },
    [processPastedData]
  );

  return {
    handleClick,
    handleBlur,
    handleKeyDown,
    handleChange,
    handlePaste,
  };
};