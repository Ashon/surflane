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
      className={skin('surf-accordion', className)}
    />
  )
}
const AccordionTrigger = function AccordionTrigger({
  className,
  children,
  indicator,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger> & {
  indicator?: React.ReactNode
} & { ref?: React.Ref<React.ComponentRef<typeof BaseAccordion.Trigger>> }) {
  return (
    <BaseAccordion.Trigger
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
    </BaseAccordion.Trigger>
  )
}
const AccordionPanel = function AccordionPanel({
  className,
  children,
  render,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel> & {
  ref?: React.Ref<React.ComponentRef<typeof BaseAccordion.Panel>>
}) {
  return (
    <BaseAccordion.Panel
      {...props}
      ref={ref}
      className={skin('surf-accordion-panel', className)}
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
      <div className='surf-disclosure-body'>{children}</div>
    </BaseAccordion.Panel>
  )
}
export const Accordion = {
  ...BaseAccordion,
  Root: AccordionRoot,
  Item: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseAccordion.Item>,
    React.ComponentPropsWithoutRef<typeof BaseAccordion.Item>
  >(BaseAccordion.Item, 'surf-accordion-item'),
  Header: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseAccordion.Header>,
    React.ComponentPropsWithoutRef<typeof BaseAccordion.Header>
  >(BaseAccordion.Header, 'surf-accordion-header'),
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
}
// Flat names for React Server Components, which cannot dot into client exports.
export { AccordionPanel, AccordionRoot, AccordionTrigger }
export const { Header: AccordionHeader, Item: AccordionItem } = Accordion
