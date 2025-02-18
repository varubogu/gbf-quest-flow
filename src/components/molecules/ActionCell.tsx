import * as React from 'react';
import { cn } from '@/utils/cn';
import { Text } from '../atoms/Text';
import { useState, useRef, useEffect } from 'react';
import type { Action } from '@/types/models';
import { textInputBaseStyle, textareaBaseStyle } from '@/components/atoms/IconTextButton';
import useSettingsStore from '@/stores/settingsStore';

interface ActionCellProps {
  content: string;
  isCurrentRow?: boolean;
  isHeader?: boolean;
  isEditable?: boolean;
  onChange?: (_value: string) => void;
  onPasteRows?: (_rows: Partial<Action>[]) => void;
  field?: keyof Action;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

// タブ区切りテキストを解析する関数
const parseTabSeparatedText = (text: string): string[][] => {
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
      } else {
        // 引用符の開始または終了
        inQuotes = !inQuotes;
      }
    } else if (char === '\t' && !inQuotes) {
      // タブ区切り（引用符の外）
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // 引用符の外での改行は新しい行を意味する
      if (char === '\r' && nextChar === '\n') {
        i++; // \r\n を1つの改行として扱う
      }
      currentRow.push(currentCell.trim());
      rows.push([...currentRow]); // 現在の行を配列にコピー
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
  }

  // 空の行を除外し、各行のセル数を揃える
  const result = rows
    .filter((row) => row.some((cell) => cell.length > 0))
    .map((row) => {
      // 引用符を適切に処理
      return row.map((cell) => {
        cell = cell.trim();
        // 引用符で囲まれているセルの処理
        if (cell.startsWith('"') && cell.endsWith('"')) {
          // 引用符を除去し、エスケープされた引用符を単一の引用符に変換
          return cell.slice(1, -1).replace(/""/g, '"');
        }
        return cell;
      });
    });

  return result;
};

// 解析したデータをActionオブジェクトに変換する関数
const convertToActions = (rows: string[][], startField: keyof Action): Partial<Action>[] => {
  // フィールドの順序を定義
  const fieldOrder: (keyof Action)[] = ['hp', 'prediction', 'charge', 'guard', 'action', 'note'];

  // 貼り付け開始位置のインデックスを取得
  const startIndex = fieldOrder.indexOf(startField);

  // 各行のデータ列数を取得（空の列も含める）
  const dataColumnCount = Math.max(...rows.map((row) => row.length));

  // 残りの列数を計算
  const remainingColumns = fieldOrder.length - startIndex;

  // データがはみ出す場合の調整
  let adjustedStartIndex = startIndex;
  if (dataColumnCount > remainingColumns) {
    // 左にずらす必要がある分を計算
    const shiftLeft = dataColumnCount - remainingColumns;
    adjustedStartIndex = startIndex - shiftLeft;

    // 先頭列よりも左にはみ出す場合はエラー
    if (adjustedStartIndex < 0) {
      throw new Error('貼り付ける列数が多すぎます');
    }
  }

  return rows.map((row) => {
    const action: Partial<Action> = {};

    // 貼り付け開始位置から順にデータを割り当て
    row.forEach((value, index) => {
      const fieldIndex = adjustedStartIndex + index;
      if (fieldIndex < fieldOrder.length) {
        const field = fieldOrder[fieldIndex];
        if (field) {
          action[field] = value.trim();
        }
      }
    });

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
  alignment = 'left',
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { settings } = useSettingsStore();

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
    } else {
      // ダブルクリックの場合
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
        if (onChange) onChange(content);
      } else {
        clickTimeoutRef.current = setTimeout(() => {
          clickTimeoutRef.current = null;
        }, 300);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

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

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div
      className={cn(
        'border-b border-r border-gray-400',
        isHeader ? 'bg-muted font-medium' : 'bg-background',
        isCurrentRow && 'bg-accent',
        !isHeader && 'cursor-text',
        alignmentClasses[alignment],
        className
      )}
      style={{
        paddingTop: `${settings.tablePadding}px`,
        paddingBottom: `${settings.tablePadding}px`,
        paddingLeft: `${Math.max(2, settings.tablePadding)}px`,
        paddingRight: `${Math.max(2, settings.tablePadding)}px`,
      }}
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
            alignmentClasses[alignment],
            isHeader ? textInputBaseStyle : textareaBaseStyle
          )}
          rows={1}
        />
      ) : (
        <Text variant={isHeader ? 'default' : isCurrentRow ? 'default' : 'dimmed'}>
          <pre
            className={cn(
              'whitespace-pre-wrap font-sans text-sm leading-normal',
              alignmentClasses[alignment]
            )}
          >
            {content}
          </pre>
        </Text>
      )}
    </div>
  );
};
