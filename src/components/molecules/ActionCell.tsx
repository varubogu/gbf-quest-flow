import * as React from "react"
import { cn } from "@/utils/cn"
import { Text } from "../atoms/Text"

interface ActionCellProps {
  content: string
  isCurrentRow?: boolean
  isHeader?: boolean
}

export const ActionCell: React.FC<ActionCellProps> = ({
  content,
  isCurrentRow = false,
  isHeader = false,
}) => {
  return (
    <div
      className={cn(
        "px-3 py-2 border-b border-r",
        isHeader ? "bg-muted font-medium" : "bg-background",
        isCurrentRow && "bg-accent"
      )}
    >
      <Text variant={isHeader ? "default" : isCurrentRow ? "default" : "dimmed"}>
        {content}
      </Text>
    </div>
  )
}