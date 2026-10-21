'use client'
import * as React from 'react'
import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible'
import { Chevron } from './chevron.js'
import { skin, part } from './parts.js'
function AccordionRoot<Value = string>({
  className,
  ...props
}: BaseAccordion.Root.Props<Value>) {
  return (
    <BaseAccordion.Root<Value>
      {...props}
      className={skin('pui-accordion', className)}
    />
  )
}
const AccordionTrigger = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseAccordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger> & {
    indicator?: React.ReactNode
  }
>(function AccordionTrigger({ className, children, indicator, ...props }, ref) {
  return (
    <BaseAccordion.Trigger
      {...props}
      ref={ref}
      className={skin('pui-disclosure-trigger', className)}
    >
      <span className='pui-disclosure-label'>{children}</span>
      {indicator === undefined ? <Chevron /> : indicator}
    </BaseAccordion.Trigger>
  )
})
const AccordionPanel = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseAccordion.Panel>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel>
>(function AccordionPanel({ className, children, render, ...props }, ref) {
  return (
    <BaseAccordion.Panel
      {...props}
      ref={ref}
      className={skin('pui-accordion-panel', className)}
      render={
        render ??
        ((panelProps, state) => (
          <div
            {...panelProps}
            inert={state.transitionStatus === 'ending' || undefined}
            aria-hidden={state.transitionStatus === 'ending' || undefined}
          />
        ))
      }
    >
      <div className='pui-disclosure-body'>{children}</div>
    </BaseAccordion.Panel>
  )
})
export const Accordion = {
  ...BaseAccordion,
  Root: AccordionRoot,
  Item: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseAccordion.Item>,
    React.ComponentPropsWithoutRef<typeof BaseAccordion.Item>
  >(BaseAccordion.Item, 'pui-accordion-item'),
  Header: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseAccordion.Header>,
    React.ComponentPropsWithoutRef<typeof BaseAccordion.Header>
  >(BaseAccordion.Header, 'pui-accordion-header'),
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
}
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
      {indicator === undefined ? <Chevron /> : indicator}
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
export {
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
  CollapsiblePanel,
  CollapsibleTrigger,
}
export const { Header: AccordionHeader, Item: AccordionItem } = Accordion
export const { Root: CollapsibleRoot } = Collapsible
