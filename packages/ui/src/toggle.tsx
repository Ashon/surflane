'use client'
import * as React from 'react'
import { useComponentSize, type ComponentSizeAlias } from './sizing.js'
import { Toggle as BaseToggle } from '@base-ui/react/toggle'
import { sizeName, skin } from './parts.js'

export function Toggle<Value extends string>({
  className,
  size,
  ref,
  ...props
}: BaseToggle.Props<Value> & {
  size?: ComponentSizeAlias | 'icon'
  ref?: React.Ref<HTMLButtonElement>
}) {
  const scheme = useComponentSize(size === 'icon' ? undefined : size)
  return (
    <BaseToggle<Value>
      {...props}
      ref={ref}
      className={skin('surf-button surf-toggle', className)}
      data-size={sizeName(size)}
      data-ui-size={scheme}
    />
  )
}
