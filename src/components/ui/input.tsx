'use client'

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  isError?: boolean
}

function Input({ className, type, isError = false, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [inputType, setInputType] = React.useState(type)

  // Update input type when show/hide password is toggled
  React.useEffect(() => {
    if (type === "password") {
      setInputType(showPassword ? "text" : "password")
    } else {
      setInputType(type)
    }
  }, [type, showPassword])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const isPasswordType = type === "password"

  return (
    <div className="relative">
      <input
        type={inputType}
        data-slot="input"
        aria-invalid={isError}
        className={cn(
          // base style
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // focus
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          // error state
          isError &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40",
          // right padding for toggle icon
          isPasswordType && "pr-10",
          className
        )}
        {...props}
      />
      {isPasswordType && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground disabled:pointer-events-none disabled:opacity-50"
          disabled={props.disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  )
}

export { Input }
