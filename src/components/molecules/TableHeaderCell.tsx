import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { columnTranslationKeys } from '@/config/actionTable';
import type { ActionTableColumn } from '@/types/models';

interface TableHeaderCellProps {
  column: string;
  alignment: 'left' | 'center' | 'right';
  translationKey?: string;
}

const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  column,
  alignment,
  translationKey
}) => {
  const { t } = useTranslation();

  // ActionTableColumnの場合はcolumnTranslationKeysを使用
  const isActionColumn = Object.keys(columnTranslationKeys).includes(column);
  const displayText = translationKey
    ? t(translationKey)
    : isActionColumn
      ? t(columnTranslationKeys[column as ActionTableColumn])
      : column;

  return (
    <th
      key={column}
      className="border-b border-r border-gray-400 px-1 py-0.5"
      style={{ textAlign: alignment }}
      data-field={column}
    >
      {displayText}
    </th>
  );
};

export default TableHeaderCell;