import * as React from "react"
import { ActionCell } from "../molecules/ActionCell"
import { ChevronUp, ChevronDown, Plus, Minus } from "lucide-react"
import { IconButton } from "../atoms/IconButton"
import type { Action } from "@/types/models"

// 削除ボタンと追加ボタンの列を調整（スペーサーを削除し、幅を拡張）
const gridClasses = "min-w-full grid grid-cols-[56px_56px_5fr_15fr_4fr_4fr_30fr_20fr]"

interface ActionTableProps {
  data: Action[]
  currentRow: number
  buttonPosition: "left" | "right"
  onRowSelect: (index: number) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isEditMode?: boolean
  onCellEdit?: (rowIndex: number, field: keyof Action, value: string) => void
  onDeleteRow?: (rowIndex: number) => void
  onAddRow?: (rowIndex: number) => void
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
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // マウスホイールイベントのハンドラを追加
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || isEditMode) return;

    const handleWheel = (e: WheelEvent) => {
      // マウスがテーブル内にあるかチェック
      const target = e.target as HTMLElement;
      if (!container.contains(target)) return;

      e.preventDefault(); // デフォルトのスクロール動作を抑止

      // 上下の移動を決定（deltaY > 0 が下方向）
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

  return (
    <div ref={containerRef} className="flex flex-col h-full overflow-y-auto">
      {/* 上下移動ボタンは編集モード時は非表示 */}
      {!isEditMode && (
        <div className="flex justify-between items-center p-2 sticky top-0 bg-white z-20">
          <div className={`flex gap-2 ${buttonPosition === "right" ? "ml-auto" : ""}`}>
            <IconButton
              icon={ChevronUp}
              label="上に移動"
              onClick={onMoveUp}
              disabled={currentRow <= 0}
            />
            <IconButton
              icon={ChevronDown}
              label="下に移動"
              onClick={onMoveDown}
              disabled={currentRow >= data.length - 1}
            />
          </div>
        </div>
      )}

      {/* ヘッダー部分：編集モード時はより上部に配置 */}
      <div className={`${gridClasses} bg-green-300 sticky ${isEditMode ? 'top-0' : 'top-12'} z-10 shadow-sm border-b border-gray-400 border-l border-r`}>
        <div className="w-full h-full border-b border-r border-gray-400 bg-muted font-medium" />
        <div className="w-full h-full border-b border-r border-gray-400 bg-muted font-medium" />
        <ActionCell content="HP" isHeader />
        <ActionCell content="予兆" isHeader />
        <ActionCell content="奥義" isHeader />
        <ActionCell content="ガード" isHeader />
        <ActionCell content="行動" isHeader />
        <ActionCell content="備考" isHeader />
      </div>

      {/* データ部分 */}
      <div className="flex flex-col">
        {data.map((row, index) => (
          <div
            key={index}
            id={`action-row-${index}`}
            onDoubleClick={() => !isEditMode && onRowSelect(index)}
            className={`${gridClasses} border-b border-gray-400 border-l border-r ${
              !isEditMode && index === currentRow
                ? "border-2 border-yellow-500 bg-yellow-200"
                : !isEditMode && index < currentRow
                ? "opacity-50"
                : "bg-white"
            }`}
          >
            <div className="w-full h-full border-r border-gray-400 flex items-center justify-center">
              {isEditMode && (
                <button
                  onClick={() => onDeleteRow?.(index)}
                  className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center cursor-pointer"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            <div className="w-full h-full border-r border-gray-400 flex items-center justify-center">
              {isEditMode && (
                <button
                  onClick={() => onAddRow?.(index)}
                  className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            <ActionCell
              content={row.hp}
              isCurrentRow={!isEditMode && index === currentRow}
              isEditable={isEditMode}
              onChange={(value) => handleCellChange(index, "hp", value)}
            />
            <ActionCell
              content={row.prediction}
              isCurrentRow={!isEditMode && index === currentRow}
              isEditable={isEditMode}
              onChange={(value) => handleCellChange(index, "prediction", value)}
            />
            <ActionCell
              content={row.charge}
              isCurrentRow={!isEditMode && index === currentRow}
              isEditable={isEditMode}
              onChange={(value) => handleCellChange(index, "charge", value)}
            />
            <ActionCell
              content={row.guard}
              isCurrentRow={!isEditMode && index === currentRow}
              isEditable={isEditMode}
              onChange={(value) => handleCellChange(index, "guard", value)}
            />
            <ActionCell
              content={row.action}
              isCurrentRow={!isEditMode && index === currentRow}
              isEditable={isEditMode}
              onChange={(value) => handleCellChange(index, "action", value)}
            />
            <ActionCell
              content={row.note}
              isCurrentRow={!isEditMode && index === currentRow}
              isEditable={isEditMode}
              onChange={(value) => handleCellChange(index, "note", value)}
            />
          </div>
        ))}
        {/* 最終行追加用の空行 */}
        {isEditMode && (
          <div className={`${gridClasses} border-b border-gray-400 border-l border-r bg-white`}>
            <div className="w-full h-full border-r border-gray-400" />
            <div className="w-full h-full border-r border-gray-400 flex items-center justify-center py-2">
              <button
                onClick={() => onAddRow?.(data.length)}
                className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="w-full h-full border-r border-gray-400" />
            <div className="w-full h-full border-r border-gray-400" />
            <div className="w-full h-full border-r border-gray-400" />
            <div className="w-full h-full border-r border-gray-400" />
            <div className="w-full h-full border-r border-gray-400" />
            <div className="w-full h-full border-r border-gray-400" />
          </div>
        )}
      </div>
    </div>
  )
}