import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <Slot
        ref={ref}
        className=cn(
          "flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:disabled-opacity-50",
          className
        )
        {...props}
      >
        {type === "password" && (
          <React.Fragment>
            <input
              {...props}
              className="pr-8"
              type={type}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password visibility"
            >
              {props.type === "text" ? /* eye */ : /* eye off */}
            </button>
          </React.Fragment>
        )}
      </Slot>
    )
  }
)

Input.displayName = "Input"

export { Input }