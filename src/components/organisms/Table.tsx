import * as React from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTableKeyboardNavigation } from '../../hooks/useTableKeyboardNavigation';
import { useTableScroll } from '../../hooks/useTableScroll';
import { useActionTableConfig } from '../../hooks/useActionTableConfig';
import { TableRow } from '../molecules/TableRow';
import { TableHeader } from '../molecules/TableHeader';
import { TableControls } from '../molecules/TableControls';

export interface TableProps<T extends Record<string, any>> {
  data: T[];
  currentRow: number;
  onRowClick: (index: number) => void;
  onRowDoubleClick: (index: number) => void;
  onCellEdit?: (index: number, field: keyof T, value: string) => void;
  onDeleteRow?: (index: number) => void;
  onAddRow?: (index: number) => void;
  onMoveRow?: (fromIndex: number, toIndex: number) => void;
  isEditMode?: boolean;
  buttonPosition?: 'top' | 'bottom' | 'both';
  columns: string[];
  alignments?: Record<string, 'left' | 'center' | 'right'>;
  translationKeys?: Record<string, string>;
  renderRow?: (props: {
    data: T;
    index: number;
    isCurrentRow: boolean;
    isEditMode: boolean;
    className: string;
    onRowClick: () => void;
    onRowDoubleClick: () => void;
    onCellEdit?: (field: keyof T, value: string) => void;
    onDeleteRow?: () => void;
    onAddRow?: () => void;
  }) => React.ReactNode;
}

export function Table<T extends Record<string, any>>({
  data,
  currentRow,
  onRowClick,
  onRowDoubleClick,
  onCellEdit,
  onDeleteRow,
  onAddRow,
  onMoveRow,
  isEditMode = false,
  buttonPosition = 'both',
  columns,
  alignments = {},
  translationKeys = {},
  renderRow,
}: TableProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { settings } = useSettingsStore();
  const { styles } = useActionTableConfig();

  const { handleKeyDown } = useTableKeyboardNavigation({
    currentRow,
    rowCount: data.length,
    onRowChange: onRowClick,
    onRowDoubleClick,
    isEditMode,
  });

  useTableScroll({
    containerRef,
    currentRow,
    isEditMode,
  });

  React.useEffect(() => {
    if (!isEditMode && currentRow === -1 && data.length > 0) {
      onRowClick(0);
    }
  }, [isEditMode, currentRow, data.length, onRowClick]);

  const handleRowClick = (index: number) => {
    if (settings.clickType === 'single' || isEditMode) {
      onRowClick(index);
    }
  };

  const handleRowDoubleClick = (index: number) => {
    if (settings.clickType === 'double' && !isEditMode) {
      onRowDoubleClick(index);
    }
  };

  const handleMoveUp = () => {
    if (currentRow > 0 && onMoveRow) {
      onMoveRow(currentRow, currentRow - 1);
      onRowClick(currentRow - 1);
    }
  };

  const handleMoveDown = () => {
    if (currentRow < data.length - 1 && onMoveRow) {
      onMoveRow(currentRow, currentRow + 1);
      onRowClick(currentRow + 1);
    }
  };

  return (
    <div
      className="flex flex-row w-full h-full"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={containerRef}
    >
      {onMoveRow && (
        <TableControls
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          buttonPosition={buttonPosition}
          className="sticky left-0 z-10"
        />
      )}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse" style={styles.table}>
          <TableHeader
            columns={columns}
            isEditMode={isEditMode}
            alignments={alignments}
            translationKeys={translationKeys}
          />
          <tbody>
            {data.map((item, index) => {
              // 背景色の決定（hpが空でない行の数をカウント）
              let count = 0;
              for (let i = 0; i <= index; i++) {
                if (data[i].hp !== undefined && data[i].hp !== '') {
                  count++;
                }
              }
              const bgColor = count % 2 === 0 ? 'bg-white' : 'bg-gray-50';
              const isCurrentRowClass = index === currentRow ? 'bg-blue-100' : bgColor;
              const className = `${isCurrentRowClass} hover:bg-blue-50`;

              if (renderRow) {
                return renderRow({
                  data: item,
                  index,
                  isCurrentRow: index === currentRow,
                  isEditMode,
                  className,
                  onRowClick: () => handleRowClick(index),
                  onRowDoubleClick: () => handleRowDoubleClick(index),
                  onCellEdit: onCellEdit
                    ? (field, value) => onCellEdit(index, field, value)
                    : undefined,
                  onDeleteRow: onDeleteRow ? () => onDeleteRow(index) : undefined,
                  onAddRow: onAddRow ? () => onAddRow(index) : undefined,
                });
              }

              return (
                <TableRow
                  key={index}
                  data={item}
                  index={index}
                  isCurrentRow={index === currentRow}
                  isEditMode={isEditMode}
                  className={className}
                  onRowClick={() => handleRowClick(index)}
                  onRowDoubleClick={() => handleRowDoubleClick(index)}
                  onCellEdit={
                    onCellEdit ? (field, value) => onCellEdit(index, field, value) : undefined
                  }
                  onDeleteRow={onDeleteRow ? () => onDeleteRow(index) : undefined}
                  onAddRow={onAddRow ? () => onAddRow(index) : undefined}
                  columns={columns}
                  alignments={alignments}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}