'use client'
import * as React from 'react'
import { useToneTransition } from './tone-transition.js'
import { part } from './parts.js'
import { type StatusTone, StatusIcon } from './status.js'
const MessageRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & { tone?: StatusTone }
>(function MessageRoot({ tone = 'neutral', className, ...props }, ref) {
  const elementRef = useToneTransition<HTMLDivElement>(tone, ref)
  return (
    <div
      {...props}
      ref={elementRef}
      data-tone={tone}
      className={['pui-message', className].filter(Boolean).join(' ')}
    />
  )
})
const MessageIcon = React.forwardRef<
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
      className={['pui-message-icon', className].filter(Boolean).join(' ')}
    >
      {children ?? <StatusIcon tone={tone} />}
    </span>
  )
})
export const InlineMessage = {
  Root: MessageRoot,
  Icon: MessageIcon,
  Content: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-message-content',
  ),
  Title: part<HTMLElement, React.ComponentPropsWithoutRef<'strong'>>(
    'strong',
    'pui-message-title',
  ),
  Description: part<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    'p',
    'pui-message-description',
  ),
  Actions: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-message-actions',
  ),
}
const EmptyTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<'h3'> & { level?: 2 | 3 | 4 | 5 | 6 }
>(function EmptyTitle({ level = 3, className, ...props }, ref) {
  return React.createElement(`h${level}`, {
    ...props,
    ref,
    className: ['pui-empty-title', className].filter(Boolean).join(' '),
  })
})
export const EmptyState = {
  Root: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-empty',
  ),
  Icon: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-empty-icon',
  ),
  Title: EmptyTitle,
  Description: part<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    'p',
    'pui-empty-description',
  ),
  Actions: part<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    'div',
    'pui-empty-actions',
  ),
}

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: EmptyStateRoot,
  Icon: EmptyStateIcon,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Actions: EmptyStateActions,
} = EmptyState
export const {
  Root: InlineMessageRoot,
  Icon: InlineMessageIcon,
  Content: InlineMessageContent,
  Title: InlineMessageTitle,
  Description: InlineMessageDescription,
  Actions: InlineMessageActions,
} = InlineMessage
