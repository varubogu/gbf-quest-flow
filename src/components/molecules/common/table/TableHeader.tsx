import * as React from 'react';
import { Plus } from 'lucide-react';
import type { ActionTableColumn, TableAlignment } from '@/types/types';
import TableHeaderCell from '@/components/molecules/common/table/TableHeaderCell';

interface TableHeaderProps {
  className: string;
  isEditMode: boolean;
  onAddRow?: (_index: number) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ className, isEditMode, onAddRow }) => {
  const columns: ActionTableColumn[] = ['hp', 'prediction', 'charge', 'guard', 'action', 'note'];
  const alignments: Record<ActionTableColumn, TableAlignment> = {
    hp: 'right',
    prediction: 'left',
    charge: 'center',
    guard: 'center',
    action: 'left',
    note: 'left',
  };

  const stickyStyle: React.CSSProperties = { top: 'var(--table-controls-height, 0px)' };
  const headerCellStickyClasses = 'sticky z-10 bg-green-300';

  return (
    <thead className="bg-green-300">
      <tr className={className}>
        {isEditMode && (
          <>
            <th
              className={`${headerCellStickyClasses} border-b border-r border-gray-400 bg-muted font-medium`}
              style={stickyStyle}
            ></th>
            <th
              className={`${headerCellStickyClasses} border-b border-r border-gray-400 bg-muted font-medium text-center`}
              style={stickyStyle}
            >
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
          <TableHeaderCell key={column} column={column} alignment={alignments[column]} />
        ))}
      </tr>
    </thead>
  );
};
