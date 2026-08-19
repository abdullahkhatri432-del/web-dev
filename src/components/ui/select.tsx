import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface SelectProps extends React.HTMLAttributes<HTMLSelectElement> {
  className?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <Slot
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        <option disabled>Select an option</option>
      </Slot>
    )
  }
)

Select.displayName = "Select"

export { Select }