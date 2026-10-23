'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { Button } from './button.js'
import { cx } from './parts.js'
export type PaginationLabels = {
  previous: string
  next: string
  page: (page: number) => string
  more: string
  summary: (page: number, pageCount: number) => string
}
type CommonPaginationProps = Omit<
  React.ComponentPropsWithoutRef<'nav'>,
  'children'
> & {
  page: number
  pageCount: number
  siblings?: 0 | 1 | 2
  disabled?: boolean
  labels?: Partial<PaginationLabels>
}
export type PaginationProps = CommonPaginationProps &
  (
    | { getPageHref: (page: number) => string; onPageChange?: never }
    | { getPageHref?: never; onPageChange: (page: number) => void }
  )
export const Pagination = /* @__PURE__ */ React.forwardRef<
  HTMLElement,
  PaginationProps
>(function Pagination(
  {
    page,
    pageCount,
    siblings = 1,
    disabled = false,
    labels,
    getPageHref,
    onPageChange,
    className,
    'aria-label': ariaLabel = 'Pagination',
    ...props
  },
  ref,
) {
  const count = Number.isFinite(pageCount)
    ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.floor(pageCount)))
    : 0
  if (count < 2) return null
  const current = Math.min(
    count,
    Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1),
  )
  const reach = Math.min(2, Math.max(0, Math.floor(siblings)))
  const pages = new Set([1, count])
  for (
    let n = Math.max(1, current - reach);
    n <= Math.min(count, current + reach);
    n++
  )
    pages.add(n)
  const sorted = [...pages].sort((a, b) => a - b),
    items: (number | string)[] = []
  sorted.forEach((n, i) => {
    const previous = sorted[i - 1]
    if (i > 0 && n - previous === 2) items.push(previous + 1)
    else if (i > 0 && n - previous > 2) items.push(`gap-${previous}`)
    items.push(n)
  })
  function control(
    target: number,
    name: string,
    children: React.ReactNode,
    boundary = false,
  ) {
    const inactive = disabled || boundary
    const currentPage =
      !boundary && target === current && typeof children === 'number'
    const attributes = {
      className: 'pui-pagination-control',
      'aria-label': name,
      'aria-current': currentPage ? ('page' as const) : undefined,
    }
    // An inactive page is a link with no destination: it keeps its name and reads as
    // unavailable, as a disabled Button does. A plain span could carry neither.
    if (getPageHref)
      return inactive ? (
        <a {...attributes} role='link' aria-disabled='true'>
          {children}
        </a>
      ) : (
        <a {...attributes} href={getPageHref(target)}>
          {children}
        </a>
      )
    return (
      <Button
        {...attributes}
        variant='ghost'
        type='button'
        disabled={inactive}
        onClick={() => {
          if (target !== current) onPageChange?.(target)
        }}
      >
        {children}
      </Button>
    )
  }
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={ariaLabel}
      className={cx('pui-pagination', className)}
    >
      {control(
        Math.max(1, current - 1),
        labels?.previous ?? 'Previous page',
        <>
          <Icon name='chevron-back' className='pui-pagination-arrow' />
          <span>{labels?.previous ?? 'Previous page'}</span>
        </>,
        current === 1,
      )}
      <span className='pui-pagination-summary'>
        {labels?.summary?.(current, count) ?? `Page ${current} of ${count}`}
      </span>
      <ul role='list' className='pui-pagination-list'>
        {items.map((item) => (
          <li key={item}>
            {typeof item === 'number' ? (
              control(item, labels?.page?.(item) ?? `Page ${item}`, item)
            ) : (
              <span className='pui-pagination-gap'>
                <Icon name='more' />
                <span className='pui-feedback-sr'>
                  {labels?.more ?? 'More pages'}
                </span>
              </span>
            )}
          </li>
        ))}
      </ul>
      {control(
        Math.min(count, current + 1),
        labels?.next ?? 'Next page',
        <>
          <span>{labels?.next ?? 'Next page'}</span>
          <Icon name='chevron-forward' className='pui-pagination-arrow' />
        </>,
        current === count,
      )}
    </nav>
  )
})
