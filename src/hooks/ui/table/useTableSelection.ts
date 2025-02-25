import { useState, useCallback, useEffect } from 'react';

interface UseTableSelectionProps {
  totalRows: number;
  isEditMode: boolean;
  onRowSelect?: ((_index: number) => void) | undefined;
}

interface UseTableSelectionResult {
  currentRow: number;
  selectRow: (_index: number) => boolean;
}

export const useTableSelection = ({
  totalRows,
  isEditMode,
  onRowSelect,
}: UseTableSelectionProps): UseTableSelectionResult => {
  const [currentRow, setCurrentRow] = useState<number>(-1);

  const selectRow = useCallback(
    (index: number) => {
      if (isEditMode) return false;
      if (index >= 0 && index < totalRows) {
        setCurrentRow(index);
        onRowSelect?.(index);
        return true;
      }
      return false;
    },
    [isEditMode, totalRows, onRowSelect]
  );

  useEffect(() => {
    // 編集モード終了時に最初の行を選択
    if (!isEditMode) {
      selectRow(0);
    }
  }, [isEditMode, selectRow]);



  return {
    currentRow,
    selectRow,
  };
};