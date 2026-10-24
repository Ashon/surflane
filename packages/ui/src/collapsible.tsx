'use client'
import * as React from 'react'
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible'
import { Icon } from './icon.js'
import { skin, part } from './parts.js'

const CollapsibleTrigger = function CollapsibleTrigger({
  className,
  children,
  indicator,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger> & {
  indicator?: React.ReactNode
} & { ref?: React.Ref<React.ComponentRef<typeof BaseCollapsible.Trigger>> }) {
  return (
    <BaseCollapsible.Trigger
      {...props}
      ref={ref}
      className={skin('surf-disclosure-trigger', className)}
    >
      <span className='surf-disclosure-label'>{children}</span>
      {indicator === undefined ? (
        <Icon name='chevron-forward' className='surf-disclosure-chevron' />
      ) : (
        indicator
      )}
    </BaseCollapsible.Trigger>
  )
}
const CollapsiblePanel = function CollapsiblePanel({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel> & {
  ref?: React.Ref<React.ComponentRef<typeof BaseCollapsible.Panel>>
}) {
  return (
    <BaseCollapsible.Panel
      {...props}
      ref={ref}
      className={skin('surf-collapsible-panel', className)}
    >
      <div className='surf-disclosure-body'>{children}</div>
    </BaseCollapsible.Panel>
  )
}
export const Collapsible = {
  ...BaseCollapsible,
  Root: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseCollapsible.Root>,
    React.ComponentPropsWithoutRef<typeof BaseCollapsible.Root>
  >(BaseCollapsible.Root, 'surf-collapsible'),
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
}
// Flat names for React Server Components, which cannot dot into client exports.
export { CollapsiblePanel, CollapsibleTrigger }
export const { Root: CollapsibleRoot } = Collapsible
