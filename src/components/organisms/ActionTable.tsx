import * as React from "react"
import { ActionCell } from "../molecules/ActionCell"
import { ChevronUp, ChevronDown } from "lucide-react"
import { IconButton } from "../atoms/IconButton"
import type { Action } from "@/types/models"

// 追加: グリッドのカラムサイズ設定を共通化
const gridClasses = "min-w-full grid grid-cols-[5fr_15fr_4fr_4fr_30fr_20fr]"

interface ActionTableProps {
  data: Action[]
  currentRow: number
  buttonPosition: "left" | "right"
  onRowSelect: (index: number) => void
}

export const ActionTable: React.FC<ActionTableProps> = ({
  data,
  currentRow,
  buttonPosition,
  onRowSelect,
}) => {
  // 追加: スクロール対象となるコンテナのrefを作成
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && currentRow > 0) {
        e.preventDefault(); // デフォルトのスクロール動作を抑止
        onRowSelect(currentRow - 1)
      } else if (e.key === "ArrowDown" && currentRow < data.length - 1) {
        e.preventDefault(); // デフォルトのスクロール動作を抑止
        onRowSelect(currentRow + 1)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onRowSelect, currentRow, data.length])

  React.useEffect(() => {
    const container = containerRef.current;
    const target = document.getElementById(`action-row-${currentRow}`);
    if (target && container) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      // それぞれの固定部分の高さを取得（上下ボタン部分とヘッダー部分）
      const controlBar = container.querySelector(".sticky.top-0");
      const headerBar = container.querySelector(".sticky.top-12");
      const controlHeight = controlBar ? controlBar.getBoundingClientRect().height : 0;
      const headerHeight = headerBar ? headerBar.getBoundingClientRect().height : 0;
      const fixedHeight = controlHeight + headerHeight;
      // container.scrollTop に、container 内での対象行の位置の差分（targetRect.top - containerRect.top）
      // から、固定部分の高さを差し引いた値を加算
      const desiredScrollTop = container.scrollTop + (targetRect.top - containerRect.top) - fixedHeight;
      container.scrollTo({
        top: desiredScrollTop,
        behavior: "smooth",
      });
    }
  }, [currentRow]);

  // 追加: HPの値に基づいて行の色を判定する関数
  const getRowColorClass = (index: number): string => {
    let colorChangeCount = 0;
    for (let i = 0; i <= index; i++) {
      // 空文字やnullでない実際の値が存在する場合のみカウント
      if (data[i].hp && String(data[i].hp).trim() !== '') {
        colorChangeCount++;
      }
    }
    // より明確な背景色を設定
    return colorChangeCount % 2 === 0 ? "bg-white" : "bg-slate-200";
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full overflow-y-auto">
      <div className="flex justify-between items-center p-2 sticky top-0 bg-white z-20">
        <div className={`flex gap-2 ${buttonPosition === "right" ? "ml-auto" : ""}`}>
          <IconButton
            icon={ChevronUp}
            label="上に移動"
            onClick={() => currentRow > 0 && onRowSelect(currentRow - 1)}
            disabled={currentRow <= 0}
          />
          <IconButton
            icon={ChevronDown}
            label="下に移動"
            onClick={() => currentRow < data.length - 1 && onRowSelect(currentRow + 1)}
            disabled={currentRow >= data.length - 1}
          />
        </div>
      </div>

      {/* ヘッダー部分：スクロールしない固定部分 */}
      <div className={`${gridClasses} bg-green-300 sticky top-12 z-10 shadow-sm border-b border-gray-400 border-l border-r`}>
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
            id={`action-row-${index}`}
            key={index}
            onDoubleClick={() => onRowSelect(index)}
            className={`${gridClasses} border-b border-gray-400 border-l border-r cursor-pointer ${
              index === currentRow
                ? "border-2 border-yellow-500 bg-yellow-200"
                : getRowColorClass(index)
            } ${index < currentRow ? "opacity-50" : ""}`}
          >
            <ActionCell content={row.hp} isCurrentRow={index === currentRow} />
            <ActionCell content={row.prediction} isCurrentRow={index === currentRow} />
            <ActionCell content={row.charge} isCurrentRow={index === currentRow} />
            <ActionCell content={row.guard} isCurrentRow={index === currentRow} />
            <ActionCell content={row.action} isCurrentRow={index === currentRow} />
            <ActionCell content={row.note} isCurrentRow={index === currentRow} />
          </div>
        ))}
      </div>
    </div>
  )
}