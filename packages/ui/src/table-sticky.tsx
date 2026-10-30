'use client'
import * as React from 'react'

// A sticky header of more than one row: each row sticks where it sits under the
// rows above it. Row heights follow their content and fonts that load late, so the
// offsets are measured and kept current; at rest nothing moves. The table and its
// container render on the server; only this measuring runs in the browser.
export function StickyHeadRows() {
  const marker = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    const table =
      marker.current?.parentElement?.querySelector<HTMLTableElement>(
        'table[data-sticky-header]',
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
  return <span ref={marker} hidden />
}
