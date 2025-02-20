import * as React from 'react';
import { Plus } from 'lucide-react';
import { ActionCell } from './ActionCell';
import { useTranslation } from 'react-i18next';
import { columnTranslationKeys } from '@/config/actionTable';
import type { ActionTableColumn } from '@/types/models';

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
  const { t } = useTranslation();
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
    <div className={className}>
      {isEditMode && (
        <>
          <div className="w-full h-full border-b border-r border-gray-400 bg-muted font-medium" />
          <div className="w-full h-full border-b border-r border-gray-400 bg-muted font-medium flex justify-center pt-2">
            <button
              onClick={() => onAddRow?.(-1)}
              className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </>
      )}
      {columns.map((column) => (
        <ActionCell
          key={column}
          content={t(columnTranslationKeys[column])}
          isHeader
          alignment={alignments[column]}
          data-testid={`cell-${column}`}
        />
      ))}
    </div>
  );
};