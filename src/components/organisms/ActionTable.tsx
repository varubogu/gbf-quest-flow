import * as React from 'react';
import { ActionCell } from '../molecules/ActionCell';
import { ChevronUp, ChevronDown, Plus, Minus } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import type { Action } from '@/types/models';
import { useTranslation } from 'react-i18next';
import useSettingsStore from '@/stores/settingsStore';
import { useTableKeyboardNavigation } from '@/hooks/useTableKeyboardNavigation';
import { useTableScroll } from '@/hooks/useTableScroll';

// 編集モードに応じてグリッドレイアウトを切り替え
const getGridClasses = (isEditMode: boolean) =>
  isEditMode
    ? 'min-w-full grid grid-cols-[56px_56px_5fr_15fr_4fr_4fr_30fr_20fr]'
    : 'min-w-full grid grid-cols-[5fr_15fr_4fr_4fr_30fr_20fr]';

// スクロールの設定値
const TOUCHPAD_SCROLL_THRESHOLD = 35;

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
  onPasteRows?: (_index: number, _rows: Partial<Action>[]) => void;
}

export const ActionTable: React.FC<ActionTableProps> = ({
  data,
  currentRow,
  buttonPosition,
  onRowSelect,
  onMoveUp,
  onMoveDown,
  isEditMode = false,
  onCellEdit,
  onDeleteRow,
  onAddRow,
  onPasteRows,
}) => {
  const { t } = useTranslation();
  const { settings } = useSettingsStore();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const accumulatedDeltaRef = React.useRef(0);
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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
        <div className="flex justify-between items-center p-2 sticky top-0 bg-white z-20">
          <div className={`flex gap-2 ${buttonPosition === 'right' ? 'ml-auto' : ''}`}>
            <IconButton
              icon={ChevronUp}
              label={t('moveUp')}
              onClick={onMoveUp}
              disabled={currentRow <= 0}
            />
            <IconButton
              icon={ChevronDown}
              label={t('moveDown')}
              onClick={onMoveDown}
              disabled={currentRow >= data.length - 1}
            />
          </div>
        </div>
      )}

      {/* ヘッダー部分 */}
      <div
        className={`${getGridClasses(isEditMode)} bg-green-300 sticky ${isEditMode ? 'top-0' : 'top-12'} z-10 shadow-sm border-b border-gray-400 border-l border-r`}
      >
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
        <ActionCell content={t('hpColumn')} isHeader alignment="right" />
        <ActionCell content={t('triggerColumn')} isHeader alignment="left" />
        <ActionCell content={t('ougiColumn')} isHeader alignment="center" />
        <ActionCell content={t('guardColumn')} isHeader alignment="center" />
        <ActionCell content={t('actionColumn')} isHeader alignment="left" />
        <ActionCell content={t('notesColumn')} isHeader alignment="left" />
      </div>

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
            <div
              key={`action-row-${index}`}
              id={`action-row-${index}`}
              className={`${getGridClasses(isEditMode)} border-b border-gray-400 border-l border-r ${
                !isEditMode && index === currentRow
                  ? 'border border-yellow-500 bg-yellow-200'
                  : !isEditMode && index < currentRow
                    ? `opacity-50 ${baseBackground}`
                    : baseBackground
              }`}
              onClick={() => handleRowClick(index)}
              onDoubleClick={() => handleRowDoubleClick(index)}
            >
              {isEditMode && (
                <>
                  <div className="flex items-center justify-center border-r border-gray-400">
                    <button
                      onClick={() => onDeleteRow?.(index)}
                      className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center border-r border-gray-400">
                    <button
                      onClick={() => onAddRow?.(index)}
                      className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </>
              )}
              <ActionCell
                content={row.hp}
                isCurrentRow={!isEditMode && index === currentRow}
                isEditable={isEditMode}
                onChange={(value) => onCellEdit?.(index, 'hp', value)}
                field="hp"
                alignment="right"
              />
              <ActionCell
                content={row.prediction}
                isCurrentRow={!isEditMode && index === currentRow}
                isEditable={isEditMode}
                onChange={(value) => onCellEdit?.(index, 'prediction', value)}
                field="prediction"
                alignment="left"
              />
              <ActionCell
                content={row.charge}
                isCurrentRow={!isEditMode && index === currentRow}
                isEditable={isEditMode}
                onChange={(value) => onCellEdit?.(index, 'charge', value)}
                field="charge"
                alignment="center"
              />
              <ActionCell
                content={row.guard}
                isCurrentRow={!isEditMode && index === currentRow}
                isEditable={isEditMode}
                onChange={(value) => onCellEdit?.(index, 'guard', value)}
                field="guard"
                alignment="center"
              />
              <ActionCell
                content={row.action}
                isCurrentRow={!isEditMode && index === currentRow}
                isEditable={isEditMode}
                onChange={(value) => onCellEdit?.(index, 'action', value)}
                field="action"
                alignment="left"
              />
              <ActionCell
                content={row.note}
                isCurrentRow={!isEditMode && index === currentRow}
                isEditable={isEditMode}
                onChange={(value) => onCellEdit?.(index, 'note', value)}
                field="note"
                alignment="left"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
