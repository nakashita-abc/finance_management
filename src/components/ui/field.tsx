import { Field as ChakraField } from "@chakra-ui/react"
import type { ReactNode } from "react"

export interface FieldProps {
  label?: string
  required?: boolean
  invalid?: boolean
  errorText?: string
  helperText?: string
  children: ReactNode
}

export const Field = ({
  label,
  required,
  invalid,
  errorText,
  helperText,
  children,
}: FieldProps) => {
  return (
    <ChakraField.Root invalid={invalid} required={required}>
      {label && <ChakraField.Label>{label}</ChakraField.Label>}
      {children}
      {helperText && !invalid && (
        <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
      )}
      {invalid && errorText && (
        <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>
      )}
    </ChakraField.Root>
  )
}
