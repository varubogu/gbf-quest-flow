import { type JSX } from 'react';
import { ActionTable } from './ActionTable';
import type { Action } from '@/types/types';
import useFlowStore from '@/core/stores/flowStore';
import useCursorStore from '@/core/stores/cursorStore';
import type { CursorStore, FlowStore } from '@/types/flowStore.types';
import { useTableEventHandlers } from '@/core/hooks/ui/table/useTableEventHandlers';

interface ActionTableContainerProps {
  isEditMode?: boolean;
  data?: Action[];
}

export function ActionTableContainer({
  isEditMode = false,
  data,
}: ActionTableContainerProps): JSX.Element | null {
  const currentRow = useCursorStore((state: CursorStore) => state.currentRow);
  const flowData = useFlowStore((state: FlowStore) => state.flowData);

  const {
    handleRowSelect,
    handleMoveUp,
    handleMoveDown,
    handleCellEdit,
    handleDeleteRow,
    handleAddRow,
    handlePasteRows,
  } = useTableEventHandlers();

  // flowDataが存在しない場合は何も表示しない
  if (!flowData) {
    return null;
  }

  return (
    <ActionTable
      data={data ?? flowData.flow}
      currentRow={currentRow}
      onRowSelect={handleRowSelect}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
      isEditMode={isEditMode}
      onCellEdit={handleCellEdit}
      onDeleteRow={handleDeleteRow}
      onAddRow={handleAddRow}
      onPasteRows={handlePasteRows}
    />
  );
}