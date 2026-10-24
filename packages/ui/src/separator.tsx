'use client'
import * as React from 'react'
import { Separator as BaseSeparator } from '@base-ui/react/separator'
import { skin } from './parts.js'

export const Separator = function Separator({
  inset = false,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseSeparator> & {
  inset?: boolean
} & { ref?: React.Ref<React.ComponentRef<typeof BaseSeparator>> }) {
  return (
    <BaseSeparator
      {...props}
      ref={ref}
      data-inset={inset || undefined}
      className={skin('surf-separator', className)}
    />
  )
}
