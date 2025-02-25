import * as React from 'react';
import { Plus, Minus } from 'lucide-react';
import { ActionCell3 } from './ActionCell3';
import type { Action, ActionTableColumn } from '@/types/models';

interface ActionTableRow3Props {
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

export const ActionTableRow3: React.FC<ActionTableRow3Props> = ({
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
    <tr
      id={`action-row-${index}`}
      data-testid={`action-row-${index}`}
      className={className}
      onClick={onRowClick}
      onDoubleClick={onRowDoubleClick}
    >
      {isEditMode && (
        <>
          <td className="border-b border-r border-gray-400 text-center">
            <button
              onClick={onDeleteRow}
              className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center mx-auto"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
          </td>
          <td className="border-b border-r border-gray-400 text-center">
            <button
              onClick={onAddRow}
              className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center mx-auto"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </td>
        </>
      )}
      {columns.map((column) => (
        <ActionCell3
          key={column}
          content={data[column] || ''}
          isCurrentRow={isCurrentRow}
          isEditable={isEditMode}
          onChange={(value) => onCellEdit?.(column, value)}
          field={column}
          alignment={alignments[column]}
          data-testid={`cell-${column}-${index}`}
        />
      ))}
    </tr>
  );
};