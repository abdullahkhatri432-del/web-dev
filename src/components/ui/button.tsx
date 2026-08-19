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
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          {
            "default": "bg-amber-gradient text-primary-foreground shadow-[0_8px_24px_-8px_rgba(245,158,11,0.6)] hover:shadow-[0_10px_32px_-6px_rgba(245,158,11,0.75)] hover:brightness-110",
            "secondary": "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            "outline": "border border-border bg-transparent text-foreground hover:bg-white/5 hover:border-white/20",
            "ghost": "text-foreground/80 hover:bg-white/5 hover:text-foreground",
            "link": "underline-offset-4 hover:underline text-primary",
          }[variant],
          {
            "default": "h-10 py-2 px-5",
            "sm": "h-9 px-4 rounded-full",
            "lg": "h-12 px-8 rounded-full text-base",
            "icon": "h-10 w-10 rounded-full",
          }[size],
          className
        )}
        {...props}
      />
    )
  }
)

ReactButton.displayName = "Button"

export { ReactButton as Button }