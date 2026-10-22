'use client'
import * as React from 'react'
import { Separator as BaseSeparator } from '@base-ui/react/separator'
import { skin } from './parts.js'

export const Separator = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseSeparator>,
  React.ComponentPropsWithoutRef<typeof BaseSeparator> & { inset?: boolean }
>(function Separator({ inset = false, className, ...props }, ref) {
  return (
    <BaseSeparator
      {...props}
      ref={ref}
      data-inset={inset || undefined}
      className={skin('pui-separator', className)}
    />
  )
})
