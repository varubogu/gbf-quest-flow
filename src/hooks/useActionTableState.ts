import { useState, useEffect } from 'react';
import type { Action } from '@/types/models';
import { useTableData } from './useTableData';
import { useTableSelection } from './useTableSelection';

interface UseActionTableStateProps {
  initialData: Action[];
  isEditMode?: boolean;
  onDataChange?: ((_data: Action[]) => void) | undefined;
  onRowSelect?: ((_index: number) => void) | undefined;
}


export const useActionTableState = ({
  initialData,
  isEditMode = false,
  onDataChange,
  onRowSelect,
}: UseActionTableStateProps) => {
  const [editMode, setEditMode] = useState<boolean>(isEditMode);

  const {
    data,
    addRow,
    deleteRow,
    updateRow,
  } = useTableData({
    initialData,
    onDataChange,
  });

  const {
    currentRow,
    selectRow,
  } = useTableSelection({
    totalRows: data.length,
    isEditMode: editMode,
    onRowSelect,
  });

  useEffect(() => {
    setEditMode(isEditMode);
  }, [isEditMode]);

  return {
    data,
    currentRow,
    editMode,
    addRow: editMode ? addRow : undefined,
    deleteRow: editMode ? deleteRow : undefined,
    updateRow: editMode ? updateRow : undefined,
    selectRow,
  };
};