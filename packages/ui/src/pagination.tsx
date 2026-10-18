'use client'
import * as React from 'react'
import { Button } from './button.js'
type CommonPaginationProps = Omit<
  React.ComponentPropsWithoutRef<'nav'>,
  'children'
> & {
  page: number
  pageCount: number
  siblings?: 0 | 1 | 2
  disabled?: boolean
  labels?: {
    previous?: string
    next?: string
    page?: (page: number) => string
    more?: string
    summary?: (page: number, pageCount: number) => string
  }
}
export type PaginationProps = CommonPaginationProps &
  (
    | { getPageHref: (page: number) => string; onPageChange?: never }
    | { getPageHref?: never; onPageChange: (page: number) => void }
  )
function Chevron({ next = false }: { next?: boolean }) {
  return (
    <svg
      className='pui-pagination-arrow'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      aria-hidden='true'
    >
      <path d={next ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
    </svg>
  )
}
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
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
      if (getPageHref)
        return inactive ? (
          <span {...attributes} aria-disabled='true'>
            {children}
          </span>
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
        className={['pui-pagination', className].filter(Boolean).join(' ')}
      >
        {control(
          Math.max(1, current - 1),
          labels?.previous ?? 'Previous page',
          <>
            <Chevron />
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
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    aria-hidden='true'
                  >
                    <circle cx='5' cy='12' r='1.5' />
                    <circle cx='12' cy='12' r='1.5' />
                    <circle cx='19' cy='12' r='1.5' />
                  </svg>
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
            <Chevron next />
          </>,
          current === count,
        )}
      </nav>
    )
  },
)
