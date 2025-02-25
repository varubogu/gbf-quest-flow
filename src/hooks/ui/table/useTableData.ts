import { useState, useCallback } from 'react';
import type { Action } from '@/types/models';
import { createEmptyRow } from '@/utils/tableDataUtils';

interface UseTableDataProps {
  initialData: Action[];
  onDataChange?: ((_data: Action[]) => void) | undefined;
}

export interface UseTableDataResult {
  data: Action[];
  addRow: (_index: number) => boolean;
  deleteRow: (_index: number) => boolean;
  updateRow: (_index: number, _updatedRow: Partial<Action>) => boolean;
}

export const useTableData = ({ initialData, onDataChange }: UseTableDataProps): UseTableDataResult => {
  const [data, setData] = useState<Action[]>(initialData);

  const updateData = useCallback(
    (newData: Action[]) => {
      setData(newData);
      onDataChange?.(newData);
    },
    [onDataChange]
  );

  const addRow = useCallback(
    (index: number) => {
      try {
        const newData = [...data];
        newData.splice(index + 1, 0, createEmptyRow());
        updateData(newData);
        return true;
      } catch (error) {
        console.error('行の追加中にエラーが発生しました:', error);
        return false;
      }
    },
    [data, updateData]
  );

  const deleteRow = useCallback(
    (index: number) => {
      try {
        if (index >= 0 && index < data.length) {
          const newData = data.filter((_, i) => i !== index);
          updateData(newData);
          return true;
        }
        return false;
      } catch (error) {
        console.error('行の削除中にエラーが発生しました:', error);
        return false;
      }
    },
    [data, updateData]
  );

  const updateRow = useCallback(
    (index: number, updatedRow: Partial<Action>) => {
      try {
        if (index >= 0 && index < data.length) {
          const newData = data.map((row, i) =>
            i === index ? { ...row, ...updatedRow } : row
          );
          updateData(newData);
          return true;
        }
        return false;
      } catch (error) {
        console.error('行の更新中にエラーが発生しました:', error);
        return false;
      }
    },
    [data, updateData]
  );

  return {
    data,
    addRow,
    deleteRow,
    updateRow,
  };
};