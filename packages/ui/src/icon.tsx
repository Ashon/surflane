import * as React from 'react'
import { cx } from './class-names.js'
import type { ComponentSize } from './size.js'
const shapes = {
  search: (
    <>
      <circle cx='10.5' cy='10.5' r='6.5' />
      <path d='m16 16 4 4' />
    </>
  ),
  plus: <path d='M12 5v14M5 12h14' />,
  close: <path d='m6 6 12 12M18 6 6 18' />,
  check: <path d='m5 12 4 4L19 6' />,
  info: (
    <>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 11v6m0-10v1' />
    </>
  ),
  alert: (
    <>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 7v6m0 3v1' />
    </>
  ),
  warning: (
    <>
      <path d='m12 3 10 18H2L12 3Z' />
      <path d='M12 9v4m0 3v1' />
    </>
  ),
  menu: <path d='M4 6h16M4 12h16M4 18h16' />,
  sidebar: (
    <>
      <rect x='3' y='4' width='18' height='16' rx='2' />
      <path d='M9 4v16' />
    </>
  ),
  more: (
    <>
      <circle cx='5' cy='12' r='1' />
      <circle cx='12' cy='12' r='1' />
      <circle cx='19' cy='12' r='1' />
    </>
  ),
  sun: (
    <>
      <circle cx='12' cy='12' r='4' />
      <path d='M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5' />
    </>
  ),
  moon: <path d='M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5 8.5 8.5 0 1 0 20.5 13.2Z' />,
  monitor: (
    <>
      <rect x='3' y='4' width='18' height='13' rx='2' />
      <path d='M8 21h8m-4-4v4' />
    </>
  ),
  minus: <path d='M5 12h14' />,
  'minus-circle': (
    <>
      <circle cx='12' cy='12' r='9' />
      <path d='M8 12h8' />
    </>
  ),
  clock: (
    <>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 7v6l4 2' />
    </>
  ),
  'chevron-down': <path d='m7 10 5 5 5-5' />,
  'chevron-forward': <path d='m9 6 6 6-6 6' />,
  'chevron-back': <path d='m15 6-6 6 6 6' />,
  'arrow-back': <path d='M20 12H4m7-7-7 7 7 7' />,
  'arrow-up': <path d='M12 19V5m-6 6 6-6 6 6' />,
  'arrow-down': <path d='M12 5v14m-6-6 6 6 6-6' />,
  refresh: <path d='M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4' />,
  sort: <path d='m8 9 4-4 4 4m-8 6 4 4 4-4' />,
  'external-link': (
    <>
      <path d='M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5' />
    </>
  ),
  copy: (
    <>
      <rect x='8' y='8' width='12' height='13' rx='2' />
      <path d='M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3' />
    </>
  ),
  play: <path d='m7 3 14 9-14 9V3Z' />,
  upload: <path d='M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5' />,
  calendar: (
    <>
      <rect x='3' y='5' width='18' height='16' rx='3' />
      <path d='M7 3v4m10-4v4M3 11h18m-12 4h2' />
    </>
  ),
  user: (
    <>
      <circle cx='12' cy='8' r='4' />
      <path d='M4 21v-2a8 8 0 0 1 16 0v2' />
    </>
  ),
  settings: (
    <>
      <path d='M4 6h16M4 12h16M4 18h16M9 3v6m6 0v6m-6 0v6' />
    </>
  ),
  // What a product runs on: machines, storage, links, power and model tokens.
  server: (
    <>
      <rect x='3' y='4' width='18' height='7' rx='2' />
      <rect x='3' y='13' width='18' height='7' rx='2' />
      <path d='M7 7.5h3m-3 9h3' />
    </>
  ),
  database: (
    <>
      <ellipse cx='12' cy='6' rx='8' ry='3' />
      <path d='M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3' />
    </>
  ),
  disk: (
    <>
      <path d='M3 14 5.6 5.4A2 2 0 0 1 7.5 4h9a2 2 0 0 1 1.9 1.4L21 14' />
      <rect x='3' y='14' width='18' height='6' rx='2' />
      <path d='M7 17h2' />
    </>
  ),
  chip: (
    <>
      <rect x='6' y='6' width='12' height='12' rx='2' />
      <rect x='9.5' y='9.5' width='5' height='5' rx='1' />
      <path d='M9.5 2.5V6m5-3.5V6m-5 12v3.5m5-3.5v3.5M2.5 9.5H6m-3.5 5H6m12-5h3.5M18 14.5h3.5' />
    </>
  ),
  memory: (
    <>
      <rect x='2' y='7' width='20' height='10' rx='2' />
      <path d='M6 17v3m4-3v3m4-3v3m4-3v3M7 10.5v3m5-3v3m5-3v3' />
    </>
  ),
  network: (
    <>
      <rect x='9' y='3' width='6' height='5' rx='1' />
      <rect x='3' y='16' width='6' height='5' rx='1' />
      <rect x='15' y='16' width='6' height='5' rx='1' />
      <path d='M12 8v4M6 16v-4h12v4' />
    </>
  ),
  bolt: <path d='M13 2.5 4.5 13.5H12l-1 8 8.5-11H12l1-8Z' />,
  token: (
    <>
      <path d='m12 3 7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z' />
      <circle cx='12' cy='12' r='3' />
    </>
  ),
  thermometer: (
    <>
      <path d='M14 14.5V5a2 2 0 0 0-4 0v9.5a4 4 0 1 0 4 0Z' />
      <path d='M12 9v7.5' />
    </>
  ),
  // View controls: keep an item in place, and show a list or a grid.
  pin: <path d='M9 3h6l-1 6 4 4H6l4-4-1-6ZM12 13v8' />,
  list: <path d='M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01' />,
  grid: (
    <>
      <rect x='4' y='4' width='6' height='6' rx='1' />
      <rect x='14' y='4' width='6' height='6' rx='1' />
      <rect x='4' y='14' width='6' height='6' rx='1' />
      <rect x='14' y='14' width='6' height='6' rx='1' />
    </>
  ),
}
export type IconName = keyof typeof shapes
export const iconNames: readonly IconName[] = Object.keys(shapes) as IconName[]
// These point along the reading direction, so they mirror in right-to-left text.
const directional = new Set<IconName>([
  'chevron-forward',
  'chevron-back',
  'arrow-back',
])
type Semantics =
  { decorative?: true; label?: never } | { decorative: false; label: string }
export type IconProps = Omit<
  React.ComponentPropsWithoutRef<'svg'>,
  | 'children'
  | 'name'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-hidden'
  | 'tabIndex'
  | 'focusable'
  | 'width'
  | 'height'
  | 'viewBox'
  | 'strokeWidth'
  | 'fill'
  | 'stroke'
  | 'title'
> &
  Semantics & {
    name: IconName
    /** 14, 16 or 20px; 16px when omitted. */
    size?: ComponentSize
  }
/** Static SVG only. Actions, focus, accessible button names and hit targets belong to the parent control. */
export const Icon = function Icon({
  name,
  size,
  decorative = true,
  label,
  className,
  ref,
  ...props
}: IconProps & { ref?: React.Ref<SVGSVGElement> }) {
  return (
    <svg
      {...props}
      ref={ref}
      className={cx('surf-icon', className)}
      data-size={size}
      data-directional={directional.has(name) ? 'true' : undefined}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      focusable='false'
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
    >
      {shapes[name]}
    </svg>
  )
}
