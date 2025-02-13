import * as React from "react"
import { ActionCell } from "../molecules/ActionCell"
import { ChevronUp, ChevronDown, Plus, Minus } from "lucide-react"
import { IconButton } from "../atoms/IconButton"
import type { Action } from "@/types/models"
import { useTranslation } from "react-i18next"

// 編集モードに応じてグリッドレイアウトを切り替え
const getGridClasses = (isEditMode: boolean) =>
  isEditMode
    ? "min-w-full grid grid-cols-[56px_56px_5fr_15fr_4fr_4fr_30fr_20fr]"
    : "min-w-full grid grid-cols-[5fr_15fr_4fr_4fr_30fr_20fr]"

interface ActionTableProps {
  data: Action[]
  currentRow: number
  buttonPosition: "right" | "left"
  onRowSelect: (row: number) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isEditMode?: boolean
  onCellEdit?: (rowIndex: number, field: keyof Action, value: string) => void
  onDeleteRow?: (rowIndex: number) => void
  onAddRow?: (rowIndex: number) => void
  onPasteRows?: (rowIndex: number, rows: Partial<Action>[]) => void
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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const lastWheelTimeRef = React.useRef(0);  // ホイールイベントの制限用

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || isEditMode) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (!container.contains(target)) return;

      e.preventDefault();

      // タッチパッドの判定
      const isTouchpad = e.deltaMode === 0;  // ピクセル単位のスクロール

      if (isTouchpad) {
        const currentTime = Date.now();
        if (currentTime - lastWheelTimeRef.current < 500) {  // タッチパッドの場合のみ500ミリ秒のクールダウン
          return;
        }
        lastWheelTimeRef.current = currentTime;
      }

      if (e.deltaY < 0 && currentRow > 0) {
        onRowSelect(currentRow - 1);
      } else if (e.deltaY > 0 && currentRow < data.length - 1) {
        onRowSelect(currentRow + 1);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [currentRow, data.length, onRowSelect, isEditMode]);

  // 上下移動ボタンのクリックハンドラ（クールダウンなし）
  const handleMove = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      onMoveUp();
    } else {
      onMoveDown();
    }
  };

  // キーボードイベントも編集モード時は無効化
  React.useEffect(() => {
    if (isEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && currentRow > 0) {
        e.preventDefault();
        onRowSelect(currentRow - 1)
      } else if (e.key === "ArrowDown" && currentRow < data.length - 1) {
        e.preventDefault();
        onRowSelect(currentRow + 1)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onRowSelect, currentRow, data.length, isEditMode]);

  // 編集モード終了時に最初の行を選択
  React.useEffect(() => {
    if (!isEditMode && currentRow === -1) {
      onRowSelect(0);
    }
  }, [isEditMode, currentRow, onRowSelect]);

  // スクロール位置の自動調整も編集モード時は無効化
  React.useEffect(() => {
    if (isEditMode) return;

    const container = containerRef.current;
    const target = document.getElementById(`action-row-${currentRow}`);
    if (target && container) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const controlBar = container.querySelector(".sticky.top-0");
      const headerBar = container.querySelector(".sticky.top-12");
      const controlHeight = controlBar ? controlBar.getBoundingClientRect().height : 0;
      const headerHeight = headerBar ? headerBar.getBoundingClientRect().height : 0;
      const fixedHeight = controlHeight + headerHeight;
      const desiredScrollTop = container.scrollTop + (targetRect.top - containerRect.top) - fixedHeight;
      container.scrollTo({
        top: desiredScrollTop,
        behavior: "smooth",
      });
    }
  }, [currentRow, isEditMode]);

  const handleCellChange = (rowIndex: number, field: keyof Action, value: string) => {
    if (onCellEdit) {
      onCellEdit(rowIndex, field, value);
    }
  };

  const handlePasteRows = async (rowIndex: number, rows: Partial<Action>[]) => {
    if (!onPasteRows) return;
    onPasteRows(rowIndex, rows);
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full overflow-y-auto">
      {/* 上下移動ボタンは編集モード時は非表示 */}
      {!isEditMode && (
        <div className="flex justify-between items-center p-2 sticky top-0 bg-white z-20">
          <div className={`flex gap-2 ${buttonPosition === "right" ? "ml-auto" : ""}`}>
            <IconButton
              icon={ChevronUp}
              label={t('moveUp')}
              onClick={() => handleMove('up')}
              disabled={currentRow <= 0}
            />
            <IconButton
              icon={ChevronDown}
              label={t('moveDown')}
              onClick={() => handleMove('down')}
              disabled={currentRow >= data.length - 1}
            />
          </div>
        </div>
      )}

      {/* ヘッダー部分：編集モード時はより上部に配置 */}
      <div className={`${getGridClasses(isEditMode)} bg-green-300 sticky ${isEditMode ? 'top-0' : 'top-12'} z-10 shadow-sm border-b border-gray-400 border-l border-r`}>
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
      <div className="flex flex-col">
        {data.map((row, index) => {
          // HPが空の場合、直前のHPが存在する行まで遡る
          let currentIndex = index;
          let hpRowCount = 0; // HPが入っている行数をカウント
          for (let i = 0; i <= index; i++) {
            if (data[i].hp.trim()) {
              hpRowCount++;
            }
          }
          while (currentIndex > 0 && !data[currentIndex].hp.trim()) {
            currentIndex--;
          }
          // HPが存在する行の番号を使用
          const isEvenRow = hpRowCount % 2 === 1; // HPが入っている行数で判定

          // 基本の背景色を決定
          const baseBackground = isEvenRow ? "bg-white" : "bg-gray-300";

          return (
            <div
              key={index}
              id={`action-row-${index}`}
              onDoubleClick={() => !isEditMode && onRowSelect(index)}
              className={`${getGridClasses(isEditMode)} border-b border-gray-400 border-l border-r ${
                !isEditMode && index === currentRow
                  ? "border-2 border-yellow-500 bg-yellow-200"
                  : !isEditMode && index < currentRow
                  ? `opacity-50 ${baseBackground}`
                  : baseBackground
              }`}
            >
              {isEditMode && (
                <>
                  <div className="w-full h-full border-b border-r border-gray-400 bg-muted font-medium flex justify-center pt-2">
                    <button
                      onClick={() => onDeleteRow?.(index)}
                      className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="w-full h-full border-b border-r border-gray-400 bg-muted font-medium flex justify-center pt-2">
                    <button
                      onClick={() => onAddRow?.(index)}
                      className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center cursor-pointer"
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
                onChange={(value) => handleCellChange(index, "hp", value)}
                onPasteRows={(rows) => handlePasteRows(index, rows)}
                field="hp"
                alignment="right"
              />
              <ActionCell
                content={row.prediction}
                isCurrentRow={!isEditMode && index === currentRow}
                isEditable={isEditMode}
                onChange={(value) => handleCellChange(index, "prediction", value)}
                field="prediction"
                alignment="left"
              />
              <ActionCell
                content={row.charge}
                isCurrentRow={!isEditMode && index === currentRow}
                isEditable={isEditMode}
                onChange={(value) => handleCellChange(index, "charge", value)}
                field="charge"
                alignment="center"
              />
              <ActionCell
                content={row.guard}
                isCurrentRow={!isEditMode && index === currentRow}
                isEditable={isEditMode}
                onChange={(value) => handleCellChange(index, "guard", value)}
                field="guard"
                alignment="center"
              />
              <ActionCell
                content={row.action}
                isCurrentRow={!isEditMode && index === currentRow}
                isEditable={isEditMode}
                onChange={(value) => handleCellChange(index, "action", value)}
                field="action"
                alignment="left"
              />
              <ActionCell
                content={row.note}
                isCurrentRow={!isEditMode && index === currentRow}
                isEditable={isEditMode}
                onChange={(value) => handleCellChange(index, "note", value)}
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