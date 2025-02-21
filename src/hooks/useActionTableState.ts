import { useCallback, useEffect, useState } from 'react';
import type { Action } from '@/types/models';

interface UseActionTableStateProps {
  initialData: Action[];
  isEditMode?: boolean;
  onDataChange?: (_data: Action[]) => void;
  onRowSelect?: (_index: number) => void;
}

// 新しい行を作成するユーティリティ関数
const createEmptyRow = (): Action => ({
  hp: '',
  prediction: '',
  charge: '',
  guard: '',
  action: '',
  note: '',
});

export const useActionTableState = ({
  initialData,
  isEditMode = false,
  onDataChange,
  onRowSelect,
}: UseActionTableStateProps) => {
  // 状態を分割
  const [data, setData] = useState<Action[]>(initialData);
  const [currentRow, setCurrentRow] = useState<number>(-1);
  const [editMode, setEditMode] = useState<boolean>(isEditMode);

  // 編集モード変更時の処理
  useEffect(() => {
    setEditMode(isEditMode);
    // 編集モード終了時に最初の行を選択
    if (!isEditMode && currentRow === -1) {
      setCurrentRow(0);
    }
  }, [isEditMode, currentRow]);

  // データ更新のハンドラー
  const updateData = useCallback(
    (newData: Action[]) => {
      setData(newData);
      onDataChange?.(newData);
    },
    [onDataChange]
  );

  // 行選択のハンドラー
  const selectRow = useCallback(
    (index: number) => {
      if (editMode) return;
      if (index >= 0 && index < data.length) {
        setCurrentRow(index);
        onRowSelect?.(index);
      }
    },
    [editMode, data.length, onRowSelect]
  );

  // 行の追加
  const addRow = useCallback(
    (index: number) => {
      if (!editMode) return;
      try {
        const newData = [...data];
        newData.splice(index + 1, 0, createEmptyRow());
        updateData(newData);
      } catch (error) {
        console.error('行の追加中にエラーが発生しました:', error);
      }
    },
    [editMode, data, updateData]
  );

  // 行の削除
  const deleteRow = useCallback(
    (index: number) => {
      if (!editMode) return;
      try {
        if (index >= 0 && index < data.length) {
          const newData = data.filter((_, i) => i !== index);
          updateData(newData);
        }
      } catch (error) {
        console.error('行の削除中にエラーが発生しました:', error);
      }
    },
    [editMode, data, updateData]
  );

  // セルの編集
  const editCell = useCallback(
    (rowIndex: number, field: keyof Action, value: string) => {
      if (!editMode) return;
      try {
        if (rowIndex >= 0 && rowIndex < data.length) {
          const newData = [...data];
          const updatedRow = { ...createEmptyRow(), ...newData[rowIndex], [field]: value };
          newData[rowIndex] = updatedRow;
          updateData(newData);
        }
      } catch (error) {
        console.error('セルの編集中にエラーが発生しました:', error);
      }
    },
    [editMode, data, updateData]
  );

  // 行の移動（上へ）
  const moveRowUp = useCallback(() => {
    if (editMode || currentRow <= 0) return;
    selectRow(currentRow - 1);
  }, [editMode, currentRow, selectRow]);

  // 行の移動（下へ）
  const moveRowDown = useCallback(() => {
    if (editMode || currentRow >= data.length - 1) return;
    selectRow(currentRow + 1);
  }, [editMode, currentRow, data.length, selectRow]);

  // 行の貼り付け
  const pasteRows = useCallback(
    (index: number, rows: Partial<Action>[]) => {
      if (!editMode) return;
      try {
        if (index >= -1 && index < data.length) {
          const newData = [...data];
          const validRows = rows.map((row) => ({
            ...createEmptyRow(),
            ...row,
          }));
          newData.splice(index + 1, 0, ...validRows);
          updateData(newData);
        }
      } catch (error) {
        console.error('行の貼り付け中にエラーが発生しました:', error);
      }
    },
    [editMode, data, updateData]
  );

  return {
    state: {
      currentRow,
      data,
      isEditMode: editMode,
    },
    selectRow,
    addRow,
    deleteRow,
    editCell,
    moveRowUp,
    moveRowDown,
    pasteRows,
  };
};