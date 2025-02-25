import * as React from 'react';
import { Plus } from 'lucide-react';
import { ActionCell3 } from './ActionCell3';
import { useTranslation } from 'react-i18next';
import { columnTranslationKeys } from '@/config/actionTable';
import type { ActionTableColumn } from '@/types/models';

interface ActionTableHeader3Props {
  className: string;
  isEditMode: boolean;
  onAddRow?: (_index: number) => void;
}

export const ActionTableHeader3: React.FC<ActionTableHeader3Props> = ({
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
          <th
            key={column}
            className="border-b border-r border-gray-400 px-1 py-0.5"
            style={{ textAlign: alignments[column] }}
            data-field={column}
          >
            {t(columnTranslationKeys[column]) as string}
          </th>
        ))}
      </tr>
    </thead>
  );
};