import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface DialogProps extends React.ComponentPropsWithoutRef<"div"> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ children, ...props }, ref) => {
    return (
      <Slot
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 transition-opacity",
          "bg-black/50 backdrop-blur-sm rtl:justify-end",
          "animate-fade-in-medium-0 duration-200"
        )}
        {...props}
      >
        <div className="relative top-20 max-w-2xl w-full margin-auto bg-card p-6 shadow-lg transition-all duration-300 sm:top-24">
          {children}
        </div>
      </Slot>
    )
  }
)

Dialog.displayName = "Dialog"

export { Dialog }