import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { columnTranslationKeys } from '@/config/actionTable';
import type { ActionTableColumn } from '@/types/models';

const ActionTableHeaderCell: React.FC<{ column: ActionTableColumn; alignment: 'left' | 'center' | 'right'; }> = ({ column, alignment }) => {
  const { t } = useTranslation();
  return (
    <th
      key={column}
      className="border-b border-r border-gray-400 px-1 py-0.5"
      style={{ textAlign: alignment }}
      data-field={column}
    >
      {t(columnTranslationKeys[column]) as string}
    </th>
  );
};

export default ActionTableHeaderCell;