import * as React from "react"
import { cn } from "@/utils/cn"
import { Text } from "../atoms/Text"
import { useState, useRef, useEffect } from "react"

interface ActionCellProps {
  content: string
  isCurrentRow?: boolean
  isHeader?: boolean
  isEditable?: boolean
  onChange?: (value: string) => void
}

export const ActionCell: React.FC<ActionCellProps> = ({
  content,
  isCurrentRow = false,
  isHeader = false,
  isEditable = false,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(content);
  }, [content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // カーソルを末尾に移動
      textareaRef.current.setSelectionRange(value.length, value.length);
      // テキストエリアの高さを自動調整
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
    if (isEditable && !isHeader) {
      setIsEditing(true);
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

  return (
    <div
      className={cn(
        "px-3 py-2 border-b border-r border-gray-400",
        isHeader ? "bg-muted font-medium" : "bg-background",
        isCurrentRow && "bg-accent",
        !isHeader && "cursor-text"
      )}
      onClick={handleClick}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full bg-white border rounded px-1 resize-none overflow-hidden",
            "text-sm leading-normal font-normal"
          )}
          rows={1}
        />
      ) : (
        <Text variant={isHeader ? "default" : isCurrentRow ? "default" : "dimmed"}>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-normal">{content}</pre>
        </Text>
      )}
    </div>
  )
}