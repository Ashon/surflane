'use client'
import * as React from 'react'
import { useRender } from '@base-ui/react/use-render'
import { cx } from './parts.js'
import type { StatusTone } from './status.js'

export type BottomNavigationRootProps =
  React.ComponentPropsWithoutRef<'nav'> & {
    /** Names the navigation, such as "Primary". */
    'aria-label': string
    /** mobile: shown at 760px and narrower, where AppShell hides its sidebar. always:
     * at every width. */
    visible?: 'mobile' | 'always'
    /** fixed: pinned to the bottom of the viewport, above the safe area. static: in the
     * flow, for a frame of your own. */
    position?: 'fixed' | 'static'
  }
/** A phone's primary destinations along the bottom edge, within thumb reach. Pad the
 * scrolling content by --surf-size-bottom-navigation so the last line stays visible. */
const Root = function BottomNavigationRoot({
  visible = 'mobile',
  position = 'fixed',
  className,
  children,
  ref,
  ...props
}: BottomNavigationRootProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <nav
      {...props}
      ref={ref}
      data-visible={visible}
      data-position={position}
      className={cx('surf-bottom-nav', className)}
    >
      <ul role='list' className='surf-bottom-nav-list'>
        {children}
      </ul>
    </nav>
  )
}

export type BottomNavigationItemProps = Omit<
  useRender.ComponentProps<'a'>,
  'ref' | 'children'
> & {
  icon: React.ReactNode
  label: string
  /** Marks the current destination with aria-current="page". */
  current?: boolean
  /** A count, shown up to 99+, or true for a dot. */
  badge?: number | boolean
  /** What the badge means, read after the label, such as "3 unread". A count reads
   * as its number without it; a dot needs it. */
  badgeLabel?: string
  /** The badge's color, by what it means: danger for what needs action now,
   * caution for what needs a look soon, neutral for news. */
  badgeTone?: StatusTone
}
/** One destination: an icon above its label. Pass a router's link element as
 * `render` to keep client navigation. */
const Item = function BottomNavigationItem({
  icon,
  label,
  current,
  badge,
  badgeLabel,
  badgeTone = 'danger',
  render,
  className,
  ref,
  ...props
}: BottomNavigationItemProps & { ref?: React.Ref<HTMLAnchorElement> }) {
  const count =
    typeof badge === 'number' && badge > 0
      ? badge > 99
        ? '99+'
        : String(badge)
      : undefined
  const shown = Boolean(count || badge === true)
  const spoken = badgeLabel ?? count
  const link = useRender({
    defaultTagName: 'a',
    render,
    ref,
    props: {
      ...props,
      'aria-current': current ? 'page' : props['aria-current'],
      className: cx('surf-bottom-nav-item', className),
      children: (
        <>
          <span className='surf-bottom-nav-icon' aria-hidden='true'>
            {icon}
            {shown && (
              <span
                className='surf-bottom-nav-badge'
                data-tone={badgeTone}
                data-dot={count ? undefined : ''}
              >
                {count}
              </span>
            )}
          </span>
          <span className='surf-bottom-nav-label'>{label}</span>
          {shown && spoken && (
            <span className='surf-feedback-sr'>, {spoken}</span>
          )}
        </>
      ),
    },
  })
  return <li className='surf-bottom-nav-entry'>{link}</li>
}

export const BottomNavigation = { Root, Item }

// Flat names for React Server Components, which cannot dot into client exports.
export const { Root: BottomNavigationRoot, Item: BottomNavigationItem } =
  BottomNavigation
