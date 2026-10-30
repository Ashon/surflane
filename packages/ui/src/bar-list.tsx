import * as React from 'react'
import { cx } from './class-names.js'
import { missingValue } from './format.js'
import { ScrollArea } from './scroll-area.js'
import { diverging as divergingFrom, DivergingTrack } from './diverging-bar.js'

export type BarListItem = {
  id: string
  /** What the row measures, such as a directory or a project. */
  label: string
  /** A second, quieter name under the label, such as a path. */
  detail?: string
  value: number
  /** The value as written, such as "412 GiB". Defaults to the formatted value. */
  text?: string
}
export type BarListProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> & {
  /** Names the list, such as "Disk used by directory". */
  label: string
  items: readonly BarListItem[]
  /** The value a full bar stands for. Defaults to the largest value, or the largest
   * size of a signed value when the list is diverging. */
  max?: number
  /** Draws signed values from a center line, a rise toward the inline end and a fall
   * toward the start, such as each sector's gap against the market. */
  diverging?: boolean
  /** auto colors a diverging list's rises and falls as Stat does; neutral draws both
   * in the brand mark. */
  trend?: 'auto' | 'neutral'
  /** For measures where a fall is good: a diverging list's colors swap. */
  lowerIsBetter?: boolean
  /** Orders the rows from the largest value down. Turn it off to keep your order. */
  sorted?: boolean
  /** The rows shown before the list scrolls inside itself. */
  maxRows?: number
  /** Writes a value that has no text. */
  formatValue?: (value: number) => string
  locale?: string
}
/** A ranked list of named values, each with a bar in proportion to the largest, such
 * as disk by directory or tokens by project. Names and values are text; the bars are
 * decoration. */
export const BarList = function BarList({
  label,
  items,
  max,
  diverging = false,
  trend = 'auto',
  lowerIsBetter = false,
  sorted = true,
  maxRows,
  formatValue,
  locale,
  className,
  style,
  ref,
  ...props
}: BarListProps & { ref?: React.Ref<HTMLDivElement> }) {
  const rows = sorted ? [...items].sort((a, b) => b.value - a.value) : items
  const top =
    max ??
    rows.reduce(
      (largest, item) =>
        Number.isFinite(item.value)
          ? Math.max(largest, diverging ? Math.abs(item.value) : item.value)
          : largest,
      0,
    )
  const number = new Intl.NumberFormat(locale)
  // A value that is missing reads as the dash every other number helper writes.
  const write = (value: number) =>
    !Number.isFinite(value)
      ? missingValue
      : formatValue
        ? formatValue(value)
        : number.format(value)
  const scrolls = maxRows !== undefined && rows.length > maxRows
  const list = (
    <ol className='surf-bar-list-items' aria-label={label}>
      {rows.map((item) => {
        const share =
          top > 0 && Number.isFinite(item.value)
            ? Math.min(100, Math.max(0, (item.value / top) * 100))
            : 0
        return (
          <li key={item.id} className='surf-bar-list-item'>
            <span className='surf-bar-list-label'>
              <span className='surf-bar-list-name' title={item.label}>
                {item.label}
              </span>
              {item.detail && (
                <span className='surf-bar-list-detail' title={item.detail}>
                  {item.detail}
                </span>
              )}
            </span>
            {diverging ? (
              <DivergingTrack
                {...divergingFrom(item.value, top, trend, lowerIsBetter)}
                aria-hidden='true'
              />
            ) : (
              <span className='surf-bar-list-bar' aria-hidden='true'>
                <span
                  className='surf-bar-list-fill'
                  style={{ inlineSize: `${share}%` }}
                />
              </span>
            )}
            <span className='surf-bar-list-value'>
              {item.text ?? write(item.value)}
            </span>
          </li>
        )
      })}
    </ol>
  )
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-bar-list', className)}
      data-detail={items.some((item) => item.detail) || undefined}
      style={
        scrolls
          ? ({
              ...style,
              '--surf-bar-list-rows': maxRows,
            } as React.CSSProperties)
          : style
      }
    >
      {scrolls ? (
        <ScrollArea orientation='vertical' label={label}>
          {list}
        </ScrollArea>
      ) : (
        list
      )}
    </div>
  )
}
