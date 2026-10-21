'use client'
import * as React from 'react'

/** The disclosure and breadcrumb chevron. Internal: not exported from the package. */
export function Chevron() {
  return (
    <svg
      className='pui-disclosure-chevron'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      aria-hidden='true'
    >
      <path d='m9 6 6 6-6 6' />
    </svg>
  )
}
