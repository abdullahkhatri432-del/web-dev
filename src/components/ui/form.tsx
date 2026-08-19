import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface FormFieldLike {
  id?: string
  label?: string
  error?: { message?: string } | null
  getInputProps?: () => Record<string, unknown>
  getElementProps?: () => Record<string, unknown>
  render?: () => React.ReactNode
}

export interface FormFieldProps {
  field: FormFieldLike
  fieldset?: React.FieldsetHTMLAttributes<HTMLFieldSetElement>
  className?: string
}

export function FormField({ field, fieldset, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {field.label && (
        <Label htmlFor={field.id}>{field.label}</Label>
      )}
      <div>
        {fieldset ? (
          <fieldset {...fieldset} />
        ) : (
          <div {...field.getInputProps?.()} {...field.getElementProps?.()}>
            {field.render?.()}
          </div>
        )}
        {field.error && (
          <p className="text-sm text-destructive">{field.error.message}</p>
        )}
      </div>
    </div>
  )
}