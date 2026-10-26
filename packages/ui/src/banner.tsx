'use client'
import * as React from 'react'
import { useToneTransition } from './tone-transition.js'
import { part, cx } from './parts.js'
import { StatusIcon } from './status.js'
import { Button } from './button.js'
import { Icon } from './icon.js'
import { useLabels } from './label-context.js'

/** What a notice across the whole product is about: news, a degraded or planned
 * state, or an outage. */
export type BannerTone = 'info' | 'caution' | 'danger'
const BannerToneContext =
  /* @__PURE__ */ React.createContext<BannerTone>('info')
const focusable =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
/** The first control after the banner, where focus goes when the banner leaves. */
function following(banner: Element) {
  for (const element of document.querySelectorAll<HTMLElement>(focusable))
    if (
      !banner.contains(element) &&
      banner.compareDocumentPosition(element) &
        Node.DOCUMENT_POSITION_FOLLOWING &&
      element.getClientRects().length > 0
    )
      return element
  return null
}
export type BannerRootProps = React.ComponentPropsWithoutRef<'div'> & {
  tone?: BannerTone
  /** Shows a dismiss button at the end and calls this when it is pressed; remove
   * the banner then. Focus moves to the first control after it. */
  onDismiss?: () => void
  /** The dismiss button's name. */
  dismissLabel?: string
}
/** A notice for the whole product, such as maintenance or an outage: a full-width
 * plane in its tone, first in AppShell.Root, which spans the shell above everything
 * else. It is a polite live region, so a change to its text is announced. */
const Root = function BannerRoot({
  tone = 'info',
  onDismiss,
  dismissLabel,
  className,
  children,
  ref,
  ...props
}: BannerRootProps & { ref?: React.Ref<HTMLDivElement> }) {
  const elementRef = useToneTransition<HTMLDivElement>(tone, ref)
  const text = useLabels<{ dismiss: string }>('banner')
  const next = React.useRef<HTMLElement | null>(null)
  // Removed while focus was on its dismiss button: focus moves on, not to the page.
  React.useEffect(
    () => () => {
      const target = next.current
      const active = document.activeElement
      if (target?.isConnected && (!active || active === document.body))
        target.focus()
    },
    [],
  )
  return (
    <BannerToneContext.Provider value={tone}>
      <div
        role='status'
        {...props}
        ref={elementRef}
        data-tone={tone}
        className={cx('surf-banner', className)}
      >
        {children}
        {onDismiss && (
          <Button
            variant='ghost'
            size='icon-small'
            className='surf-banner-dismiss'
            aria-label={dismissLabel ?? text.dismiss ?? 'Dismiss'}
            onClick={(event) => {
              const banner = event.currentTarget.closest('.surf-banner')
              next.current = banner ? following(banner) : null
              onDismiss()
            }}
          >
            <Icon name='close' />
          </Button>
        )}
      </div>
    </BannerToneContext.Provider>
  )
}
/** The tone's icon, beside the title that names the state in words. */
const IconPart = function BannerIcon({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'span'> & {
  ref?: React.Ref<HTMLSpanElement>
}) {
  const tone = React.useContext(BannerToneContext)
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden='true'
      className={cx('surf-banner-icon', className)}
    >
      {children ?? <StatusIcon tone={tone} />}
    </span>
  )
}
export const Banner = {
  Root,
  Icon: IconPart,
  /** The title and description, in one line where they fit. */
  Content: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-banner-content'),
  /** The state in words, such as "Scheduled maintenance"; the tone's color never
   * says it alone. */
  Title: /* @__PURE__ */ part<
    HTMLElement,
    React.ComponentPropsWithoutRef<'strong'>
  >('strong', 'surf-banner-title'),
  Description: /* @__PURE__ */ part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<'span'>
  >('span', 'surf-banner-description'),
  Actions: /* @__PURE__ */ part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
  >('div', 'surf-banner-actions'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: BannerRoot,
  Icon: BannerIcon,
  Content: BannerContent,
  Title: BannerTitle,
  Description: BannerDescription,
  Actions: BannerActions,
} = Banner
