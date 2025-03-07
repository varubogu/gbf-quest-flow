import * as React from 'react';
import { Plus, Minus } from 'lucide-react';
import { TableCell } from './TableCell';
import type {
  TableAlignment
} from '@/types/types';

interface TableRowProps<T extends Record<string, string>> {
  data: T;
  index: number;
  isCurrentRow: boolean;
  isEditMode: boolean;
  className: string;
  columns: (keyof T)[];
  alignments: Record<keyof T, TableAlignment>;
  onRowClick: () => void;
  onRowDoubleClick: () => void;
  onCellEdit?: (_field: keyof T, _value: string) => void;
  onDeleteRow?: () => void;
  onAddRow?: () => void;
  onPasteRows?: (_rows: Partial<T>[]) => void;
}

export const TableRow = <T extends Record<string, string>>({
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
}: TableRowProps<T>): React.ReactElement => {
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
        <TableCell<T>
          key={String(column)}
          content={data[column] || ''}
          isCurrentRow={isCurrentRow}
          isEditable={isEditMode}
          onChange={(value) => onCellEdit?.(column, value)}
          onPasteRows={onPasteRows}
          field={String(column)}
          alignment={alignments[column]}
          data-testid={`cell-${String(column)}-${index}`}
        />
      ))}
    </tr>
  );
};