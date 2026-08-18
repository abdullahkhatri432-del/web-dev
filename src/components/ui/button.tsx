import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const ReactButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const CompoundComponent = asChild ? Slot : "button"

    return (
      <CompoundComponent
        ref={ref}
        className=cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "default": "bg-primary text-primary-foreground hover:bg-primary/90",
            "secondary": "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            "outline": "border border-border hover:bg-accent hover:text-accent-foreground",
            "ghost": "hover:bg-accent hover:text-accent-foreground",
            "link": "underline-offset-4 hover:underline text-primary/90",
          }[variant],
          {
            "default": "h-10 py-2 px-4",
            "sm": "h-9 px-3 rounded-md",
            "lg": "h-11 px-8 rounded-md",
            "icon": "h-10 w-10",
          }[size],
          className
        )
        {...props}
      )
    )
  }
)

ReactButton.displayName = "Button"

export { ReactButton as Button }