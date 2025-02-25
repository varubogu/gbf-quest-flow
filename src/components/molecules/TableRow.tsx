import * as React from 'react';
import { Plus, Minus } from 'lucide-react';
import { TableCell } from './TableCell';

interface TableRowProps<T extends Record<string, any>> {
  data: T;
  index: number;
  isCurrentRow: boolean;
  isEditMode: boolean;
  className: string;
  onRowClick: () => void;
  onRowDoubleClick: () => void;
  onCellEdit?: (_field: keyof T, _value: string) => void;
  onDeleteRow?: () => void;
  onAddRow?: () => void;
  columns: string[];
  alignments: Record<string, 'left' | 'center' | 'right'>;
}

export function TableRow<T extends Record<string, any>>({
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
  columns,
  alignments,
}: TableRowProps<T>) {
  return (
    <tr
      id={`row-${index}`}
      data-testid={`row-${index}`}
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
        <TableCell
          key={column}
          content={data[column]?.toString() || ''}
          isCurrentRow={isCurrentRow}
          isEditable={isEditMode}
          onChange={(value) => onCellEdit?.(column as keyof T, value)}
          field={column}
          alignment={alignments[column] || 'left'}
          data-testid={`cell-${column}-${index}`}
          as="td"
        />
      ))}
    </tr>
  );
}