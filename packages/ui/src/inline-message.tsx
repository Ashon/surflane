'use client'
import * as React from 'react'
import { useToneTransition } from './tone-transition.js'
import { part, cx } from './parts.js'
import { type StatusTone, StatusIcon } from './status.js'

const MessageRoot = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & { tone?: StatusTone }
>(function MessageRoot({ tone = 'neutral', className, ...props }, ref) {
  const elementRef = useToneTransition<HTMLDivElement>(tone, ref)
  return (
    <div
      {...props}
      ref={elementRef}
      data-tone={tone}
      className={cx('pui-message', className)}
    />
  )
})
const MessageIcon = /* @__PURE__ */ React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'> & { tone?: StatusTone }
>(function MessageIcon(
  { tone = 'neutral', children, className, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden='true'
      className={cx('pui-message-icon', className)}
    >
      {children ?? <StatusIcon tone={tone} />}
    </span>
  )
})
export const InlineMessage = {
  Root: MessageRoot,
  Icon: MessageIcon,
  Content: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'pui-message-content'),
  Title: /* @__PURE__ */ part<
    HTMLElement,
    React.ComponentPropsWithoutRef<'strong'>
  >('strong', 'pui-message-title'),
  Description: /* @__PURE__ */ part<
    HTMLParagraphElement,
    React.ComponentPropsWithoutRef<'p'>
  >('p', 'pui-message-description'),
  Actions: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'pui-message-actions'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: InlineMessageRoot,
  Icon: InlineMessageIcon,
  Content: InlineMessageContent,
  Title: InlineMessageTitle,
  Description: InlineMessageDescription,
  Actions: InlineMessageActions,
} = InlineMessage
