import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  src: string
  alt: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, children, ...props }, ref) => {
    return (
      <Slot
        ref={ref}
        className=cn(
          "relative flex h-10 w-10 rounded-full overflow-hidden flex-shrink-0",
          className
        )
        {...props}
      >
        <img
          className="object-cover h-full w-full"
          src={src}
          alt={alt}
        />
        {children}
      </Slot>
    )
  }
)

Avatar.displayName = "Avatar"

export { Avatar }