import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface DropdownMenuProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string
}

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Slot
        ref={ref}
        className=cn("z-50", className)
        {...props}
      >
        {children}
      </Slot>
    )
  }
)

DropdownMenu.displayName = "DropdownMenu"

export { DropdownMenu }