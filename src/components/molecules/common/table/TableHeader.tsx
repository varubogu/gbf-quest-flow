import * as React from 'react';
import { Plus } from 'lucide-react';
import type { ActionTableColumn, TableAlignment } from '@/types/types';
import TableHeaderCell from '@/components/molecules/common/table/TableHeaderCell';

interface TableHeaderProps {
  className: string;
  isEditMode: boolean;
  onAddRow?: (_index: number) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
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
            key={column}
            column={column}
            alignment={alignments[column]}
          />
        ))}
      </tr>
    </thead>
  );
};