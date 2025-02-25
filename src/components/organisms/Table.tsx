import * as React from 'react';
import type { Action } from '@/types/models';
import useSettingsStore from '@/stores/settingsStore';
import { useTableKeyboardNavigation } from '@/hooks/ui/table/useTableKeyboardNavigation';
import { useTableScroll } from '@/hooks/ui/table/useTableScroll';
import { useActionTableConfig } from '@/hooks/ui/table/useActionTableConfig';
import { TableControls } from '@/components/molecules/TableControls';
import { TableHeader } from '@/components/molecules/TableHeader';
import { TableRow } from '@/components/molecules/TableRow';

interface TableProps {
  data: Action[];
  currentRow: number;
  buttonPosition?: 'left' | 'right';
  onRowSelect: (_index: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isEditMode?: boolean;
  onCellEdit?: (_rowIndex: number, _field: keyof Action, _value: string) => void;
  onDeleteRow?: (_index: number) => void;
  onAddRow?: (_index: number) => void;
}

export const Table: React.FC<TableProps> = ({
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
}) => {
  const { settings } = useSettingsStore();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // 設定とスタイルの管理
  const { headerClasses, getRowClasses } = useActionTableConfig({
    isEditMode,
  });

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

  const handleRowClick = (index: number) => {
    if (isEditMode) return;
    if (settings.actionTableClickType === 'single') {
      onRowSelect(index);
    }
  };

  const handleRowDoubleClick = (index: number) => {
    if (isEditMode) return;
    if (settings.actionTableClickType === 'double') {
      onRowSelect(index);
    }
  };

  return (
    <div
      ref={containerRef}
      id="flow-action-table"
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
          <TableHeader
            className={headerClasses}
            isEditMode={isEditMode}
            onAddRow={onAddRow ?? (() => {})}
          />

          <tbody>
            {data.map((row, index) => {
              // HPが空の場合、直前のHPが存在する行まで遡る
              let currentIndex = index;
              let hpRowCount = 0; // HPが入っている行数をカウント
              for (let i = 0; i <= index; i++) {
                if (data[i]?.hp?.trim()) {
                  hpRowCount++;
                }
              }
              while (currentIndex > 0 && !data[currentIndex]?.hp?.trim()) {
                currentIndex--;
              }
              // HPが存在する行の番号を使用
              const isEvenRow = hpRowCount % 2 === 1; // HPが入っている行数で判定

              // 基本の背景色を決定
              const baseBackground = isEvenRow ? 'bg-white' : 'bg-gray-300';

              return (
                <TableRow
                  key={`action-row-${index}`}
                  data={row}
                  index={index}
                  isCurrentRow={index === currentRow}
                  isEditMode={isEditMode}
                  className={getRowClasses({ index, currentRow, baseBackground })}
                  onRowClick={() => handleRowClick(index)}
                  onRowDoubleClick={() => handleRowDoubleClick(index)}
                  onCellEdit={(field, value) => onCellEdit?.(index, field, value)}
                  onDeleteRow={() => onDeleteRow?.(index)}
                  onAddRow={() => onAddRow?.(index)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
