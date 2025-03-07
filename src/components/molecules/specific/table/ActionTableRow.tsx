import * as React from 'react';
import { TableRow } from '../../common/table/TableRow';
import type { Action, ActionTableColumn, TableAlignment } from '@/types/types';

interface ActionTableRowProps {
  data: Action;
  index: number;
  isCurrentRow: boolean;
  isEditMode: boolean;
  className: string;
  onRowClick: () => void;
  onRowDoubleClick: () => void;
  onCellEdit?: (_field: keyof Action, _value: string) => void;
  onDeleteRow?: () => void;
  onAddRow?: () => void;
  onPasteRows?: (_rows: Partial<Action>[]) => void;
}

export const ActionTableRow: React.FC<ActionTableRowProps> = ({
  data,
  index,
  isCurrentRow,
  isEditMode,
  className,
  onRowClick,
  onRowDoubleClick,
  onCellEdit,
  onDeleteRow,
  onAddRow,
  onPasteRows,
}) => {
  const columns: ActionTableColumn[] = ['hp', 'prediction', 'charge', 'guard', 'action', 'note'];
  const alignments: Record<ActionTableColumn, TableAlignment> = {
    hp: 'right',
    prediction: 'left',
    charge: 'center',
    guard: 'center',
    action: 'left',
    note: 'left',
  };

  // TableRowコンポーネントに渡すpropsを明示的に定義
  const tableRowProps = {
    data,
    index,
    isCurrentRow,
    isEditMode,
    className,
    columns,
    alignments,
    onRowClick,
    onRowDoubleClick,
    onCellEdit,
    onDeleteRow,
    onAddRow,
    onPasteRows,
  };

  return <TableRow<Action> {...tableRowProps} />;
};