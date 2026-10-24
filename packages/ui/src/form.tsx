'use client'
import { Form as BaseForm } from '@base-ui/react/form'
import { skin } from './parts.js'

export function Form<
  Values extends Record<string, unknown> = Record<string, unknown>,
>({ className, ...props }: BaseForm.Props<Values>) {
  return (
    <BaseForm<Values> {...props} className={skin('surf-form', className)} />
  )
}
