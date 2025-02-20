import * as React from 'react';
import type { Action } from '@/types/models';
import useSettingsStore from '@/stores/settingsStore';
import { useTableKeyboardNavigation } from '@/hooks/useTableKeyboardNavigation';
import { useTableScroll } from '@/hooks/useTableScroll';
import { useActionTableConfig } from '@/hooks/useActionTableConfig';
import { ActionTableControls } from '../molecules/ActionTableControls';
import { ActionTableHeader } from '../molecules/ActionTableHeader';
import { ActionTableRow } from '../molecules/ActionTableRow';

interface ActionTableProps {
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
  _onPasteRows?: (_index: number, _rows: Partial<Action>[]) => void;
}

export const ActionTable: React.FC<ActionTableProps> = ({
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
  _onPasteRows,
}) => {
  const { settings } = useSettingsStore();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // 設定とスタイルの管理
  const { headerClasses, getRowClasses } = useActionTableConfig({
    buttonPosition,
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
    <div ref={containerRef} className="flex flex-col h-full overflow-y-auto">
      {/* 上下移動ボタンは編集モード時は非表示 */}
      {!isEditMode && (
        <ActionTableControls
          buttonPosition={buttonPosition}
          currentRow={currentRow}
          totalRows={data.length}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      )}

      {/* ヘッダー部分 */}
      <ActionTableHeader
        className={headerClasses}
        isEditMode={isEditMode}
        onAddRow={onAddRow}
      />

      {/* データ部分 */}
      <div className="flex-1">
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
            <ActionTableRow
              key={`action-row-${index}`}
              data={row}
              index={index}
              currentRow={currentRow}
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
      </div>
    </div>
  );
};
