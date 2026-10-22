'use client'
import * as React from 'react'
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible'
import { Icon } from './icon.js'
import { skin, part } from './parts.js'

const CollapsibleTrigger = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseCollapsible.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger> & {
    indicator?: React.ReactNode
  }
>(function CollapsibleTrigger(
  { className, children, indicator, ...props },
  ref,
) {
  return (
    <BaseCollapsible.Trigger
      {...props}
      ref={ref}
      className={skin('pui-disclosure-trigger', className)}
    >
      <span className='pui-disclosure-label'>{children}</span>
      {indicator === undefined ? (
        <Icon name='chevron-forward' className='pui-disclosure-chevron' />
      ) : (
        indicator
      )}
    </BaseCollapsible.Trigger>
  )
})
const CollapsiblePanel = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseCollapsible.Panel>,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>
>(function CollapsiblePanel({ className, children, ...props }, ref) {
  return (
    <BaseCollapsible.Panel
      {...props}
      ref={ref}
      className={skin('pui-collapsible-panel', className)}
    >
      <div className='pui-disclosure-body'>{children}</div>
    </BaseCollapsible.Panel>
  )
})
export const Collapsible = {
  ...BaseCollapsible,
  Root: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseCollapsible.Root>,
    React.ComponentPropsWithoutRef<typeof BaseCollapsible.Root>
  >(BaseCollapsible.Root, 'pui-collapsible'),
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
}
// Flat names for React Server Components, which cannot dot into client exports.
export { CollapsiblePanel, CollapsibleTrigger }
export const { Root: CollapsibleRoot } = Collapsible
