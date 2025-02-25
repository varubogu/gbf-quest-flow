import { useState, useEffect, useRef, useCallback } from 'react';

interface TableCellStateProps {
  content: string;
  onFocus?: () => void;
}

export interface UseTableCellStateResult {
  isEditing: boolean;
  setIsEditing: (_isEditing: boolean) => void;
  value: string;
  setValue: (_value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  adjustTextareaHeight: () => void;
}

export const useTableCellState = ({ content, onFocus }: TableCellStateProps): UseTableCellStateResult => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content || '');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setValue(content || '');
  }, [content]);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, []);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const currentValue = textareaRef.current.value;
      if (currentValue) {
        textareaRef.current.setSelectionRange(currentValue.length, currentValue.length);
      }
      adjustTextareaHeight();
      onFocus?.();
    }
  }, [isEditing, onFocus, adjustTextareaHeight]);

  return {
    isEditing,
    setIsEditing,
    value,
    setValue,
    textareaRef,
    adjustTextareaHeight,
  };
};