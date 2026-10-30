import * as React from 'react'
import { cx } from './class-names.js'
import { ScrollArea } from './scroll-area.js'
import { StickyHeadRows } from './table-sticky.js'

export const TableContainer = function TableContainer({
  bleed,
  rootClassName,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof ScrollArea> & {
  label: string
  /** Hangs the table into the gutter by its cell inset, so cell text lines up with
   * the text around it and a row's hover reaches past it evenly on both sides. */
  bleed?: boolean
} & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <ScrollArea
      {...props}
      ref={ref}
      rootClassName={cx(
        'surf-table-container',
        bleed && 'surf-table-bleed',
        rootClassName,
      )}
    >
      {children}
      <StickyHeadRows />
    </ScrollArea>
  )
}
