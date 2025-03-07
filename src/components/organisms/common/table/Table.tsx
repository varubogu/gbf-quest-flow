import * as React from 'react';
import useSettingsStore, { type SettingsStore } from '@/core/stores/settingsStore';
import { useTableKeyboardNavigation } from '@/core/hooks/ui/table/useTableKeyboardNavigation';
import { useTableScroll } from '@/core/hooks/ui/table/useTableScroll';
import { TableControls } from '@/components/molecules/common/table/TableControls';
import { TableHeader } from '@/components/molecules/common/table/TableHeader';
import { TableRow } from '@/components/molecules/common/table/TableRow';
import { type JSX } from 'react';
import { type TableAlignment } from '@/types/types';

interface TableProps<T extends Record<string, string>> {
  data: T[];
  currentRow: number;
  buttonPosition?: 'left' | 'right';
  onRowSelect: (_index: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isEditMode?: boolean;
  onCellEdit?: (_rowIndex: number, _field: keyof T, _value: string) => void;
  onDeleteRow?: (_index: number) => void;
  onAddRow?: (_index: number) => void;
  onPasteRows?: (_index: number, _rows: Partial<T>[]) => void;
  columns: (keyof T)[];
  alignments: Record<keyof T, TableAlignment>;
  getRowClasses: (_props: { index: number; currentRow: number; baseBackground: string }) => string;
  headerClasses: string;
  tableId?: string;
}

export function Table<T extends Record<string, string>>({
  data,
  currentRow,
  buttonPosition = 'left',
  onRowSelect,
  onMoveUp,
  onMoveDown,
  isEditMode = false,
  onCellEdit,
  onDeleteRow,
  onAddRow,
  onPasteRows,
  columns,
  alignments,
  getRowClasses,
  headerClasses,
  tableId = 'data-table',
}: TableProps<T>): JSX.Element {
  const settings = useSettingsStore((state: SettingsStore) => state.settings);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // キーボードナビゲーションの設定
  useTableKeyboardNavigation({
    currentRow,
    data,
    onRowSelect,
    isEditMode,
  });

  // スクロール制御の設定
  useTableScroll({
    containerRef,
    currentRow,
    data,
    onRowSelect,
    isEditMode,
  });

  // 編集モード終了時に最初の行を選択
  React.useEffect(() => {
    if (!isEditMode && currentRow === -1) {
      onRowSelect(0);
    }
  }, [isEditMode, currentRow, onRowSelect]);

  const handleRowClick = (index: number): void => {
    if (isEditMode) return;
    if (settings.actionTableClickType === 'single') {
      onRowSelect(index);
    }
  };

  const handleRowDoubleClick = (index: number): void => {
    if (isEditMode) return;
    if (settings.actionTableClickType === 'double') {
      onRowSelect(index);
    }
  };

  return (
    <div
      ref={containerRef}
      id={tableId}
      className="flex flex-col h-full overflow-y-auto"
    >
        <div className="sticky top-0 z-10">
          {!isEditMode && (
            <TableControls
              buttonPosition={buttonPosition}
              currentRow={currentRow}
              totalRows={data.length}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
            />
        )}
        </div>

      <div>
        <table className="w-full border-separate border-spacing-0">
          <TableHeader<T>
            className={headerClasses}
            isEditMode={isEditMode}
            columns={columns}
            alignments={alignments}
            onAddRow={onAddRow}
          />

          <tbody>
            {data.map((row, index) => {
              // HPが空の場合、直前のHPが存在する行まで遡る
              let currentIndex = index;
              let hpRowCount = 0; // HPが入っている行数をカウント

              // HPフィールドが存在する場合のみ処理
              if ('hp' in row) {
                for (let i = 0; i <= index; i++) {
                  if (data[i]?.['hp']?.toString().trim()) {
                    hpRowCount++;
                  }
                }
                while (currentIndex > 0 && !data[currentIndex]?.['hp']?.toString().trim()) {
                  currentIndex--;
                }
              }

              // HPが存在する行の番号を使用
              const isEvenRow = hpRowCount % 2 === 1; // HPが入っている行数で判定

              // 基本の背景色を決定
              const baseBackground = isEvenRow ? 'bg-white' : 'bg-gray-300';

              return (
                <TableRow<T>
                  key={`row-${index}`}
                  data={row}
                  index={index}
                  isCurrentRow={index === currentRow}
                  isEditMode={isEditMode}
                  className={getRowClasses({ index, currentRow, baseBackground })}
                  columns={columns}
                  alignments={alignments}
                  onRowClick={() => handleRowClick(index)}
                  onRowDoubleClick={() => handleRowDoubleClick(index)}
                  onCellEdit={(field, value) => onCellEdit?.(index, field, value)}
                  onDeleteRow={() => onDeleteRow?.(index)}
                  onAddRow={() => onAddRow?.(index)}
                  onPasteRows={(rows) => onPasteRows?.(index, rows)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
