import * as React from "react"
import { Button } from "./Button"
import { cn } from "@/utils/cn"
import type { LucideIcon } from "lucide-react"

interface IconTextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  label: string
  text: string
  iconPosition?: "left" | "right"
  variant?: "default" | "ghost"
}

export const IconTextButton = React.forwardRef<HTMLButtonElement, IconTextButtonProps>(
  ({
    icon: Icon,
    label,
    text,
    iconPosition = "left",
    className,
    variant = "default",
    ...props
  }, ref) => {
    return (
      <Button
        variant={variant}
        className={cn("flex items-center gap-2", className)}
        ref={ref}
        aria-label={label}
        {...props}
      >
        {iconPosition === "left" && <Icon className="h-5 w-5" />}
        <span>{text}</span>
        {iconPosition === "right" && <Icon className="h-5 w-5" />}
      </Button>
    )
  }
)

IconTextButton.displayName = "IconTextButton"