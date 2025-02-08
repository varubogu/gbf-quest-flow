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
}

export const ActionTable: React.FC<ActionTableProps> = ({
  data,
  currentRow,
  onMoveUp,
  onMoveDown,
  buttonPosition,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2">
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

      {/* ヘッダー部分：スクロールしない固定部分 */}
      <div className="grid grid-cols-[5fr_15fr_5fr_5fr_30fr_20fr] min-w-full bg-white z-10 shadow-sm sticky top-0 border-b">
        <ActionCell content="HP" isHeader />
        <ActionCell content="予兆" isHeader />
        <ActionCell content="奥義" isHeader />
        <ActionCell content="ガード" isHeader />
        <ActionCell content="行動" isHeader />
        <ActionCell content="備考" isHeader />
      </div>

      {/* データ部分：縦スクロールする領域 */}
      <div className="overflow-auto flex-1">
        <div className="grid grid-cols-[5fr_15fr_5fr_5fr_30fr_20fr] min-w-full">
          {data.map((row, index) => (
            <React.Fragment key={index}>
              <ActionCell content={row.hp} isCurrentRow={index === currentRow} />
              <ActionCell content={row.prediction} isCurrentRow={index === currentRow} />
              <ActionCell content={row.ougi} isCurrentRow={index === currentRow} />
              <ActionCell content={row.guard} isCurrentRow={index === currentRow} />
              <ActionCell content={row.action} isCurrentRow={index === currentRow} />
              <ActionCell content={row.note} isCurrentRow={index === currentRow} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}