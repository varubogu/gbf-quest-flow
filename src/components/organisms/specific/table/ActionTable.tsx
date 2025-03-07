import * as React from 'react';
import { Table } from '@/components/organisms/common/table/Table';
import type { Action, ActionTableColumn, TableAlignment } from '@/types/types';
import { useTableConfig } from '@/core/hooks/ui/table/useTableConfig';

interface ActionTableProps {
  data: Action[];
  currentRow: number;
  buttonPosition?: 'left' | 'right';
  onRowSelect: (_index: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isEditMode?: boolean;
  onCellEdit?: (_rowIndex: number, _field: keyof Action, _value: string) => void;
  onDeleteRow?: (_index: number) => void;
  onAddRow?: (_index: number) => void;
  onPasteRows?: (_index: number, _rows: Partial<Action>[]) => void;
}

export function ActionTable({
  data,
  currentRow,
  buttonPosition = 'left',
  onRowSelect,
  onMoveUp,
  onMoveDown,
  isEditMode = false,
  onCellEdit,
  onDeleteRow,
  onAddRow,
  onPasteRows,
}: ActionTableProps): React.ReactElement {
  // 行動表の列定義
  const columns: ActionTableColumn[] = ['hp', 'prediction', 'charge', 'guard', 'action', 'note'];

  // 行動表の列の配置
  const alignments: Record<ActionTableColumn, TableAlignment> = {
    hp: 'right',
    prediction: 'left',
    charge: 'center',
    guard: 'center',
    action: 'left',
    note: 'left',
  };

  // 行動表の列幅
  const columnWidths = ['5fr', '15fr', '4fr', '4fr', '30fr', '20fr'];

  // 行動表のスタイル設定
  const { headerClasses, getRowClasses } = useTableConfig({
    isEditMode,
    columnWidths,
    baseBackground: 'bg-white',
    selectedBackground: 'bg-yellow-200',
    completedBackground: 'bg-gray-300',
    headerBackground: 'bg-green-300',
    borderColor: 'border-gray-400',
  });

  // 行IDの生成関数
  const getRowId = (index: number): string => `action-row-${index}`;

  return (
    <Table<Action>
      data={data}
      currentRow={currentRow}
      buttonPosition={buttonPosition}
      onRowSelect={onRowSelect}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      isEditMode={isEditMode}
      onCellEdit={onCellEdit}
      onDeleteRow={onDeleteRow}
      onAddRow={onAddRow}
      onPasteRows={onPasteRows}
      columns={columns}
      alignments={alignments}
      getRowClasses={getRowClasses}
      headerClasses={headerClasses}
      tableId="flow-action-table"
    />
  );
}