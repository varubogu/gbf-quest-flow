import { useState, useEffect, useRef, useCallback } from 'react';

interface ActionCellStateProps {
  content: string;
  onFocus?: () => void;
}

export const useActionCellState = ({ content, onFocus }: ActionCellStateProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      onFocus?.();
    }
  }, [isEditing, onFocus]);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, []);

  return {
    isEditing,
    setIsEditing,
    value,
    setValue,
    textareaRef,
    adjustTextareaHeight,
  };
};