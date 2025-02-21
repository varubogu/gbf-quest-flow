import * as React from 'react';
import { Plus, Minus } from 'lucide-react';
import { ActionCell } from './ActionCell';
import type { Action, ActionTableColumn } from '@/types/models';

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
}) => {
  const columns: ActionTableColumn[] = ['hp', 'prediction', 'charge', 'guard', 'action', 'note'];
  const alignments: Record<ActionTableColumn, 'left' | 'center' | 'right'> = {
    hp: 'right',
    prediction: 'left',
    charge: 'center',
    guard: 'center',
    action: 'left',
    note: 'left',
  };

  return (
    <div
      id={`action-row-${index}`}
      data-testid={`action-row-${index}`}
      className={className}
      onClick={onRowClick}
      onDoubleClick={onRowDoubleClick}
    >
      {isEditMode && (
        <>
          <div className="flex items-center justify-center border-r border-gray-400">
            <button
              onClick={onDeleteRow}
              className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex items-center justify-center border-r border-gray-400">
            <button
              onClick={onAddRow}
              className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </>
      )}
      {columns.map((column) => (
        <ActionCell
          key={column}
          content={data[column]}
          isCurrentRow={isCurrentRow}
          isEditable={isEditMode}
          onChange={(value) => onCellEdit?.(column, value)}
          field={column}
          alignment={alignments[column]}
          data-testid={`cell-${column}`}
        />
      ))}
    </div>
  );
};