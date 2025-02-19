import { useCallback } from 'react';
import type { Action, ActionTableConfig } from '@/types/models';

interface UseActionTableEventsProps {
  config: ActionTableConfig;
  currentRow: number;
  isEditMode: boolean;
  onRowSelect: (_index: number) => void;
  onCellEdit?: (_rowIndex: number, _field: keyof Action, _value: string) => void;
  onPasteRows?: (_index: number, _rows: Partial<Action>[]) => void;
}

export const useActionTableEvents = ({
  config,
  currentRow,
  isEditMode,
  onRowSelect,
  onCellEdit,
  onPasteRows,
}: UseActionTableEventsProps) => {
  // 行クリック時のハンドラー
  const handleRowClick = useCallback(
    (index: number) => {
      if (isEditMode) return;
      if (config.clickType === 'single') {
        onRowSelect(index);
      }
    },
    [isEditMode, config.clickType, onRowSelect]
  );

  // 行ダブルクリック時のハンドラー
  const handleRowDoubleClick = useCallback(
    (index: number) => {
      if (isEditMode) return;
      if (config.clickType === 'double') {
        onRowSelect(index);
      }
    },
    [isEditMode, config.clickType, onRowSelect]
  );

  // セル編集時のハンドラー
  const handleCellEdit = useCallback(
    (rowIndex: number, field: keyof Action, value: string) => {
      if (!isEditMode || !onCellEdit) return;
      onCellEdit(rowIndex, field, value);
    },
    [isEditMode, onCellEdit]
  );

  // セルのペースト時のハンドラー
  const handleCellPaste = useCallback(
    (event: ClipboardEvent, rowIndex: number) => {
      if (!isEditMode || !onPasteRows) return;

      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      const text = clipboardData.getData('text');
      const rows = text.split('\n').map((row) => {
        const [hp, prediction, charge, guard, action, note] = row.split('\t');
        return { hp, prediction, charge, guard, action, note };
      });

      if (rows.length > 0) {
        event.preventDefault();
        onPasteRows(rowIndex, rows);
      }
    },
    [isEditMode, onPasteRows]
  );

  // キーボードイベントのハンドラー
  const handleKeyDown = useCallback(
    (event: KeyboardEvent, rowIndex: number, field: keyof Action) => {
      if (!isEditMode) return;

      // Tabキーの処理
      if (event.key === 'Tab') {
        event.preventDefault();
        const columns = Object.keys(config.columns) as (keyof Action)[];
        const currentColumnIndex = columns.indexOf(field);
        const nextColumnIndex = event.shiftKey
          ? (currentColumnIndex - 1 + columns.length) % columns.length
          : (currentColumnIndex + 1) % columns.length;

        // 次のセルにフォーカスを移動
        const nextCell = document.querySelector(
          `[data-row="${rowIndex}"][data-field="${columns[nextColumnIndex]}"]`
        ) as HTMLElement;
        nextCell?.focus();
      }
    },
    [isEditMode, config.columns]
  );

  return {
    handleRowClick,
    handleRowDoubleClick,
    handleCellEdit,
    handleCellPaste,
    handleKeyDown,
  };
};