import * as React from 'react';
import { Plus } from 'lucide-react';
import type { TableAlignment } from '@/types/types';
import TableHeaderCell from '@/components/molecules/common/table/TableHeaderCell';

interface TableHeaderProps<T extends Record<string, string>> {
  className: string;
  isEditMode: boolean;
  columns: (keyof T)[];
  alignments: Record<keyof T, TableAlignment>;
  onAddRow?: (_index: number) => void;
}

export const TableHeader = <T extends Record<string, string>>({
  className,
  isEditMode,
  columns,
  alignments,
  onAddRow,
}: TableHeaderProps<T>): React.ReactElement => {
  const stickyClasses = isEditMode ? 'sticky top-0 z-10' : 'sticky top-12 z-10';

  return (
    <thead className={stickyClasses}>
      <tr className={`${className} ${stickyClasses}`}>
        {isEditMode && (
          <>
            <th className="border-b border-r border-gray-400 bg-muted font-medium"></th>
            <th className="border-b border-r border-gray-400 bg-muted font-medium text-center">
              <button
                onClick={() => onAddRow?.(-1)}
                className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center cursor-pointer mx-auto"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </th>
          </>
        )}
        {columns.map((column) => (
          <TableHeaderCell
            key={String(column)}
            column={String(column)}
            alignment={alignments[column]}
          />
        ))}
      </tr>
    </thead>
  );
};