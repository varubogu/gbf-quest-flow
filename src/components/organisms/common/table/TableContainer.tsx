import { type JSX } from 'react';
import { Table } from '@/components/organisms/common/table/Table';
import type { Action } from '@/types/types';
import useFlowStore from '@/core/stores/flowStore';
import useCursorStore from '@/core/stores/cursorStore';
import useSettingsStore, { type SettingsStore } from '@/core/stores/settingsStore';

import type { CursorStore, FlowStore } from '@/types/flowStore.types';
import { useTableEventHandlers } from '@/core/hooks/ui/table/useTableEventHandlers';

interface TableContainerProps {
  isEditMode?: boolean;
  data?: Action[];
}

export function TableContainer({
  isEditMode = false,
  data,
}: TableContainerProps): JSX.Element | null {
  const currentRow = useCursorStore((state: CursorStore) => state.currentRow);
  const flowData = useFlowStore((state: FlowStore) => state.flowData);
  const settings = useSettingsStore((state: SettingsStore) => state.settings);

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
    <Table
      data={data ?? flowData.flow}
      currentRow={currentRow}
      buttonPosition={settings.buttonAlignment === 'left' ? 'left' : 'right'}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
      onRowSelect={handleRowSelect}
      isEditMode={isEditMode}
      onCellEdit={handleCellEdit}
      onDeleteRow={handleDeleteRow}
      onAddRow={handleAddRow}
      onPasteRows={handlePasteRows}
    />
  );
}
