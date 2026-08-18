import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormFieldProps {
  field: any
  fieldset?: React.HTMLFieldSetProps
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
          <div {...field.getInputProps()} {...field.getElementProps()}>
            {field.render()}
          </div>
        )}
        {field.error && (
          <p className="text-sm text-destructive">{field.error.message}</p>
        )}
      </div>
    </div>
  )
}