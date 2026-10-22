'use client'
import * as React from 'react'
import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { Icon } from './icon.js'
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
      {indicator === undefined ? (
        <Icon name='chevron-forward' className='pui-disclosure-chevron' />
      ) : (
        indicator
      )}
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
// Flat names for React Server Components, which cannot dot into client exports.
export { AccordionPanel, AccordionRoot, AccordionTrigger }
export const { Header: AccordionHeader, Item: AccordionItem } = Accordion
