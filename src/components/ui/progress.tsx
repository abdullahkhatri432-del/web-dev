import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  value: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className=cn(
          "h-2 w-full rounded-full bg-muted overflow-hidden",
          "bg-gradient-to-r from-[--border] to-[--border]",
          className
        )
        {...props}
      >
        <div
          className=cn(
            "h-full rounded-full bg-accent",
            `w-${(value / max) * 100}%`
          )
        />
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }