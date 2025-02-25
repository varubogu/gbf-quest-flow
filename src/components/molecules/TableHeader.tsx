import * as React from 'react';
import { TableHeaderCell } from './TableHeaderCell';

interface TableHeaderProps {
  columns: string[];
  isEditMode: boolean;
  alignments: Record<string, 'left' | 'center' | 'right'>;
  translationKeys?: Record<string, string>;
}

export function TableHeader({
  columns,
  isEditMode,
  alignments,
  translationKeys = {},
}: TableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="bg-gray-200">
        {isEditMode && (
          <>
            <th className="border-b border-r border-gray-400 p-2 text-center">削除</th>
            <th className="border-b border-r border-gray-400 p-2 text-center">追加</th>
          </>
        )}
        {columns.map((column) => (
          <TableHeaderCell
            key={column}
            column={column}
            translationKey={translationKeys[column] || `column.${column}`}
            alignment={alignments[column] || 'left'}
          />
        ))}
      </tr>
    </thead>
  );
}