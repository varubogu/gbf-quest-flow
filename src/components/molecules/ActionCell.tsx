import * as React from "react"
import { cn } from "@/utils/cn"
import { Text } from "../atoms/Text"
import { useState, useRef, useEffect } from "react"
import type { Action } from "@/types/models"

interface ActionCellProps {
  content: string
  isCurrentRow?: boolean
  isHeader?: boolean
  isEditable?: boolean
  onChange?: (value: string) => void
  onPasteRows?: (rows: Partial<Action>[]) => void
  field?: keyof Action
  alignment?: "left" | "center" | "right"
}

// タブ区切りテキストを解析する関数
const parseTabSeparatedText = (text: string): string[][] => {
  console.log('Starting text parsing...');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  // 1文字ずつ処理
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // エスケープされた引用符
        currentCell += '"';
        i++;
        console.log('Escaped quote found');
      } else {
        // 引用符の開始または終了
        inQuotes = !inQuotes;
        console.log('Quote state changed:', inQuotes);
      }
    } else if (char === '\t' && !inQuotes) {
      // タブ区切り（引用符の外）
      currentRow.push(currentCell.trim());
      currentCell = '';
      console.log('Tab found, current row:', [...currentRow]);
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // 引用符の外での改行は新しい行を意味する
      if (char === '\r' && nextChar === '\n') {
        i++; // \r\n を1つの改行として扱う
      }
      currentRow.push(currentCell.trim());
      rows.push([...currentRow]); // 現在の行を配列にコピー
      console.log('New row added:', [...currentRow]);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  // 最後のセルと行を処理
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
    console.log('Final row added:', currentRow);
  }

  // 空の行を除外し、各行のセル数を揃える
  const result = rows
    .filter(row => row.some(cell => cell.length > 0))
    .map(row => {
      // 引用符を適切に処理
      return row.map(cell => {
        cell = cell.trim();
        // 引用符で囲まれているセルの処理
        if (cell.startsWith('"') && cell.endsWith('"')) {
          // 引用符を除去し、エスケープされた引用符を単一の引用符に変換
          return cell.slice(1, -1).replace(/""/g, '"');
        }
        return cell;
      });
    });

  console.log('Final parsed result:', result);
  return result;
};

// 解析したデータをActionオブジェクトに変換する関数
const convertToActions = (rows: string[][]): Partial<Action>[] => {
  return rows.map(row => {
    const action: Partial<Action> = {};
    if (row[0]) action.hp = row[0].trim();
    if (row[1]) action.prediction = row[1].trim();
    if (row[2]) action.charge = row[2].trim();
    if (row[3]) action.guard = row[3].trim();
    if (row[4]) action.action = row[4].trim();
    if (row[5]) action.note = row[5].trim();
    return action;
  });
};

export const ActionCell: React.FC<ActionCellProps> = ({
  content,
  isCurrentRow = false,
  isHeader = false,
  isEditable = false,
  onChange,
  onPasteRows,
  field,
  alignment = "left",
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

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!onPasteRows || !field) return;

    const clipboardText = e.clipboardData.getData('text');
    console.log('=== Paste Event in ActionCell ===');
    console.log('Clipboard text:', clipboardText);
    console.log('Current field:', field);

    if (clipboardText.includes('\t')) {
      e.preventDefault();
      const rows = parseTabSeparatedText(clipboardText);
      console.log('Parsed rows:', rows);
      const actions = convertToActions(rows);
      console.log('Converted actions:', actions);
      onPasteRows(actions);
    }
  };

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div
      className={cn(
        "px-3 py-2 border-b border-r border-gray-400",
        isHeader ? "bg-muted font-medium" : "bg-background",
        isCurrentRow && "bg-accent",
        !isHeader && "cursor-text",
        alignmentClasses[alignment]
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
          onPaste={handlePaste}
          className={cn(
            "w-full bg-white border rounded px-1 resize-none overflow-hidden",
            "text-sm leading-normal font-normal",
            alignmentClasses[alignment]
          )}
          rows={1}
        />
      ) : (
        <Text variant={isHeader ? "default" : isCurrentRow ? "default" : "dimmed"}>
          <pre className={cn("whitespace-pre-wrap font-sans text-sm leading-normal", alignmentClasses[alignment])}>{content}</pre>
        </Text>
      )}
    </div>
  )
}