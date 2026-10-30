'use client'
import * as React from 'react'
import { cx } from './class-names.js'
import { ScrollArea } from './scroll-area.js'

// A sticky header of more than one row: each row sticks where it sits under the
// rows above it. Row heights follow their content and fonts that load late, so the
// offsets are measured and kept current; at rest nothing moves.
function useStickyHeadRows(viewport: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const table = viewport.current?.querySelector<HTMLTableElement>(
      '.surf-table[data-sticky-header]',
    )
    const head = table?.tHead
    if (!head || head.rows.length < 2) return
    const place = () => {
      const top = head.rows[0].offsetTop
      for (const row of head.rows)
        row.style.setProperty(
          '--surf-table-sticky-top',
          `${row.offsetTop - top}px`,
        )
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(head)
    return () => observer.disconnect()
  })
}

export const TableContainer = function TableContainer({
  bleed,
  rootClassName,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof ScrollArea> & {
  label: string
  /** Hangs the table into the gutter by its cell inset, so cell text lines up with
   * the text around it and a row's hover reaches past it evenly on both sides. */
  bleed?: boolean
} & { ref?: React.Ref<HTMLDivElement> }) {
  const viewport = React.useRef<HTMLDivElement>(null)
  useStickyHeadRows(viewport)
  return (
    <ScrollArea
      {...props}
      ref={(node: HTMLDivElement | null) => {
        viewport.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      rootClassName={cx(
        'surf-table-container',
        bleed && 'surf-table-bleed',
        rootClassName,
      )}
    />
  )
}
