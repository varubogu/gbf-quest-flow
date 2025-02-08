import * as React from "react"
import { cn } from "@/utils/cn"

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "default" | "muted" | "dimmed"
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "text-sm",
          {
            "text-foreground": variant === "default",
            "text-muted-foreground": variant === "muted",
            "text-muted-foreground/60": variant === "dimmed",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"