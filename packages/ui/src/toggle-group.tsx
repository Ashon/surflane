'use client'
import * as React from 'react'
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group'
import { skin } from './parts.js'

export function ToggleGroup<Value extends string>({
  className,
  ref,
  ...props
}: BaseToggleGroup.Props<Value> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <BaseToggleGroup<Value>
      {...props}
      ref={ref}
      className={skin('pui-toggle-group', className)}
    />
  )
}
