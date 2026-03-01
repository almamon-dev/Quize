import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 placeholder:text-gray-400 disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
