import * as React from "react"
import { ActionCell } from "../molecules/ActionCell"
import { ChevronUp, ChevronDown } from "lucide-react"
import { IconButton } from "../atoms/IconButton"

interface ActionTableProps {
  data: {
    hp: string
    prediction: string
    ougi: string
    guard: string
    action: string
    note: string
  }[]
  currentRow: number
  onMoveUp: () => void
  onMoveDown: () => void
  buttonPosition: "left" | "right"
  onRowSelect: (index: number) => void
}

export const ActionTable: React.FC<ActionTableProps> = ({
  data,
  currentRow,
  onMoveUp,
  onMoveDown,
  buttonPosition,
  onRowSelect,
}) => {

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && currentRow > 0) {
        onRowSelect(currentRow - 1)
      } else if (e.key === "ArrowDown" && currentRow < data.length - 1) {
        onRowSelect(currentRow + 1)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onRowSelect, currentRow, data.length])

  return (
    <div className="flex flex-col h-full overflow-y-auto">
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
      <div className="grid grid-cols-[5fr_15fr_5fr_5fr_30fr_20fr] min-w-full bg-white sticky top-12 z-10 shadow-sm border-b">
        <ActionCell content="HP" isHeader />
        <ActionCell content="予兆" isHeader />
        <ActionCell content="奥義" isHeader />
        <ActionCell content="ガード" isHeader />
        <ActionCell content="行動" isHeader />
        <ActionCell content="備考" isHeader />
      </div>

      {/* データ部分 */}
      <div className="min-w-full">
        {data.map((row, index) => (
          <div
            key={index}
            onDoubleClick={() => onRowSelect(index)}
            className={`grid grid-cols-[5fr_15fr_5fr_5fr_30fr_20fr] border-b cursor-pointer
              ${index === currentRow ? "border-2 border-yellow-500 bg-yellow-200" : ""}
              ${index < currentRow ? "opacity-50" : ""}`}
          >
            <ActionCell
              content={row.hp}
              isCurrentRow={index === currentRow}
              isPastRow={index < currentRow}
            />
            <ActionCell
              content={row.prediction}
              isCurrentRow={index === currentRow}
              isPastRow={index < currentRow}
            />
            <ActionCell
              content={row.ougi}
              isCurrentRow={index === currentRow}
              isPastRow={index < currentRow}
            />
            <ActionCell
              content={row.guard}
              isCurrentRow={index === currentRow}
              isPastRow={index < currentRow}
            />
            <ActionCell
              content={row.action}
              isCurrentRow={index === currentRow}
              isPastRow={index < currentRow}
            />
            <ActionCell
              content={row.note}
              isCurrentRow={index === currentRow}
              isPastRow={index < currentRow}
            />
          </div>
        ))}
      </div>
    </div>
  )
}