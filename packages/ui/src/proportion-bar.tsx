import * as React from 'react'
import { cx } from './class-names.js'
import { formatNumber, formatPercent, missingValue } from './format.js'

export type ProportionSegment = {
  id: string
  /** What the part is, such as "Positive" or "Korea". */
  label: string
  value: number
  /** The value as written, such as "12 articles". Defaults to the formatted value. */
  text?: string
  /** up and down take the trend colors and flat the quiet neutral mark, for parts
   * that read as a direction, such as positive, negative and neutral news. */
  tone?: 'up' | 'down' | 'flat'
  /** A color of your own, such as var(--surf-brand-mark), in place of the chart's
   * category hue for its place or the tone's. */
  color?: string
}
export type ProportionBarProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> & {
  /** Names the whole, such as "News sentiment, 25 articles". */
  label: string
  segments: readonly ProportionSegment[]
  /** What the legend writes for each part: its value, its share of the whole, or
   * both. */
  show?: 'value' | 'share' | 'both'
  /** Hides the legend where the text around the bar already says it; assistive
   * technology still reads it. */
  legendHidden?: boolean
  /** Writes a value that has no text. */
  formatValue?: (value: number) => string
  locale?: string
}

// Parts of a whole take the chart's category hues in order, which neighbors tell
// apart; the chart's neutral inks are for lines that dashes tell apart.
const partColor = (segment: ProportionSegment, index: number) =>
  segment.color ??
  (segment.tone ? undefined : `var(--surf-chart-category-${(index % 12) + 1})`)

/** One bar split into the parts of a whole, such as positive, neutral and negative
 * news, with a legend that names each part and its value. The legend is the text;
 * the bar is decoration. */
export const ProportionBar = function ProportionBar({
  label,
  segments,
  show = 'share',
  legendHidden = false,
  formatValue,
  locale,
  className,
  ref,
  ...props
}: ProportionBarProps & { ref?: React.Ref<HTMLDivElement> }) {
  const counted = (value: number) =>
    Number.isFinite(value) && value > 0 ? value : 0
  const total = segments.reduce(
    (sum, segment) => sum + counted(segment.value),
    0,
  )
  const write = (segment: ProportionSegment) =>
    segment.text ??
    (!Number.isFinite(segment.value)
      ? missingValue
      : formatValue
        ? formatValue(segment.value)
        : formatNumber(segment.value, { locale }))
  // Whole percents: a part's share is read at a glance, not to the decimal.
  const share = (segment: ProportionSegment) =>
    total > 0
      ? formatPercent(counted(segment.value) / total, { locale, precision: 0 })
      : missingValue
  const parts = segments.map((segment, index) => ({
    segment,
    color: partColor(segment, index),
  }))
  return (
    <div
      {...props}
      ref={ref}
      role='group'
      aria-label={label}
      className={cx('surf-proportion', className)}
    >
      <span className='surf-proportion-bar' aria-hidden='true'>
        {parts
          .filter(({ segment }) => counted(segment.value) > 0)
          .map(({ segment, color }) => (
            <span
              key={segment.id}
              className='surf-proportion-segment'
              data-tone={segment.tone}
              style={
                {
                  flexGrow: counted(segment.value),
                  '--surf-proportion-color': color,
                } as React.CSSProperties
              }
            />
          ))}
      </span>
      <ul
        className={cx(
          'surf-proportion-legend',
          legendHidden && 'surf-visually-hidden',
        )}
      >
        {parts.map(({ segment, color }) => (
          <li key={segment.id} className='surf-proportion-entry'>
            <span
              className='surf-proportion-swatch'
              data-tone={segment.tone}
              aria-hidden='true'
              style={
                { '--surf-proportion-color': color } as React.CSSProperties
              }
            />
            {segment.label}
            <span className='surf-proportion-value'>
              {show === 'value'
                ? write(segment)
                : show === 'share'
                  ? share(segment)
                  : `${write(segment)} (${share(segment)})`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
