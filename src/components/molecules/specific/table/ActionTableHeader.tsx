import * as React from 'react';
import { TableHeader } from '../../common/table/TableHeader';
import type { Action, ActionTableColumn, TableAlignment } from '@/types/types';

interface ActionTableHeaderProps {
  className: string;
  isEditMode: boolean;
  onAddRow?: (_index: number) => void;
}

export const ActionTableHeader: React.FC<ActionTableHeaderProps> = ({
  className,
  isEditMode,
  onAddRow,
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

  return (
    <TableHeader<Action>
      className={className}
      isEditMode={isEditMode}
      columns={columns}
      alignments={alignments}
      onAddRow={onAddRow}
    />
  );
};