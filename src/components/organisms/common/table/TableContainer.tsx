import { type JSX } from 'react';
import { Table } from '@/components/organisms/common/table/Table';
import useSettingsStore, { type SettingsStore } from '@/core/stores/settingsStore';
import { type TableAlignment } from '@/types/types';

interface TableContainerProps<T extends Record<string, string>> {
  isEditMode?: boolean;
  data: T[];
  currentRow: number;
  columns: (keyof T)[];
  alignments: Record<keyof T, TableAlignment>;
  getRowClasses: (_props: { index: number; currentRow: number; baseBackground: string }) => string;
  headerClasses: string;
  tableId?: string;
  onRowSelect: (_index: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onCellEdit?: (_rowIndex: number, _field: keyof T, _value: string) => void;
  onDeleteRow?: (_index: number) => void;
  onAddRow?: (_index: number) => void;
  onPasteRows?: (_index: number, _rows: Partial<T>[]) => void;
}

export function TableContainer<T extends Record<string, string>>({
  isEditMode = false,
  data,
  currentRow,
  columns,
  alignments,
  getRowClasses,
  headerClasses,
  tableId,
  onRowSelect,
  onMoveUp,
  onMoveDown,
  onCellEdit,
  onDeleteRow,
  onAddRow,
  onPasteRows,
}: TableContainerProps<T>): JSX.Element | null {
  const settings = useSettingsStore((state: SettingsStore) => state.settings);

  // データが存在しない場合は空のテーブルを表示する
  if (!data) {
    return null;
  }

  return (
    <Table<T>
      data={data}
      currentRow={currentRow}
      buttonPosition={settings.buttonAlignment === 'left' ? 'left' : 'right'}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onRowSelect={onRowSelect}
      isEditMode={isEditMode}
      onCellEdit={onCellEdit}
      onDeleteRow={onDeleteRow}
      onAddRow={onAddRow}
      onPasteRows={onPasteRows}
      columns={columns}
      alignments={alignments}
      getRowClasses={getRowClasses}
      headerClasses={headerClasses}
      tableId={tableId}
    />
  );
}
