import { useCallback, useEffect, useState } from 'react';
import type { Action, ActionTableState } from '@/types/models';

interface UseActionTableStateProps {
  initialData: Action[];
  isEditMode?: boolean;
  onDataChange?: (_data: Action[]) => void;
  onRowSelect?: (_index: number) => void;
}

export const useActionTableState = ({
  initialData,
  isEditMode = false,
  onDataChange,
  onRowSelect,
}: UseActionTableStateProps) => {
  // 基本的な状態管理
  const [state, setState] = useState<ActionTableState>({
    currentRow: -1,
    data: initialData,
    isEditMode,
  });

  // 編集モード変更時の処理
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isEditMode,
      // 編集モード終了時に最初の行を選択
      currentRow: !isEditMode && prev.currentRow === -1 ? 0 : prev.currentRow,
    }));
  }, [isEditMode]);

  // データ更新のハンドラー
  const updateData = useCallback(
    (newData: Action[]) => {
      setState((prev) => ({ ...prev, data: newData }));
      onDataChange?.(newData);
    },
    [onDataChange]
  );

  // 行選択のハンドラー
  const selectRow = useCallback(
    (index: number) => {
      if (isEditMode) return;
      setState((prev) => ({ ...prev, currentRow: index }));
      onRowSelect?.(index);
    },
    [isEditMode, onRowSelect]
  );

  // 行の追加
  const addRow = useCallback(
    (index: number) => {
      if (!isEditMode) return;

      const newRow: Action = {
        hp: '',
        prediction: '',
        charge: '',
        guard: '',
        action: '',
        note: '',
      };

      const newData = [...state.data];
      newData.splice(index + 1, 0, newRow);
      updateData(newData);
    },
    [isEditMode, state.data, updateData]
  );

  // 行の削除
  const deleteRow = useCallback(
    (index: number) => {
      if (!isEditMode) return;

      const newData = state.data.filter((_, i) => i !== index);
      updateData(newData);
    },
    [isEditMode, state.data, updateData]
  );

  // セルの編集
  const editCell = useCallback(
    (rowIndex: number, field: keyof Action, value: string) => {
      if (!isEditMode) return;

      const newData = [...state.data];
      const updatedRow = { ...newData[rowIndex], [field]: value } as Action;
      newData[rowIndex] = updatedRow;
      updateData(newData);
    },
    [isEditMode, state.data, updateData]
  );

  // 行の移動（上へ）
  const moveRowUp = useCallback(() => {
    if (isEditMode || state.currentRow <= 0) return;

    const newIndex = state.currentRow - 1;
    selectRow(newIndex);
  }, [isEditMode, state.currentRow, selectRow]);

  // 行の移動（下へ）
  const moveRowDown = useCallback(() => {
    if (isEditMode || state.currentRow >= state.data.length - 1) return;

    const newIndex = state.currentRow + 1;
    selectRow(newIndex);
  }, [isEditMode, state.currentRow, state.data.length, selectRow]);

  // 行の貼り付け
  const pasteRows = useCallback(
    (index: number, rows: Partial<Action>[]) => {
      if (!isEditMode) return;

      const newData = [...state.data];
      const validRows = rows.map((row) => ({
        hp: row.hp ?? '',
        prediction: row.prediction ?? '',
        charge: row.charge ?? '',
        guard: row.guard ?? '',
        action: row.action ?? '',
        note: row.note ?? '',
      }));

      newData.splice(index + 1, 0, ...validRows);
      updateData(newData);
    },
    [isEditMode, state.data, updateData]
  );

  return {
    state,
    selectRow,
    addRow,
    deleteRow,
    editCell,
    moveRowUp,
    moveRowDown,
    pasteRows,
  };
};