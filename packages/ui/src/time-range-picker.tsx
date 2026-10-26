'use client'
import * as React from 'react'
import { useLabels } from './label-context.js'
import { Button } from './button.js'
import { Icon } from './icon.js'
import { Select } from './select.js'
import { cx } from './class-names.js'
import type { ComponentSize } from './size.js'

const MINUTE = 60_000,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR
/** A span of time back from now, or a refresh interval, in milliseconds. */
export type TimeRangeOption = { value: number; label: string }
export const timeRangeOptions: readonly TimeRangeOption[] = [
  { value: 15 * MINUTE, label: 'Last 15 minutes' },
  { value: HOUR, label: 'Last hour' },
  { value: 6 * HOUR, label: 'Last 6 hours' },
  { value: DAY, label: 'Last 24 hours' },
  { value: 7 * DAY, label: 'Last 7 days' },
  { value: 30 * DAY, label: 'Last 30 days' },
]
/** 0 is off. */
export const refreshIntervalOptions: readonly TimeRangeOption[] = [
  { value: 0, label: 'Off' },
  { value: 10_000, label: 'Every 10 seconds' },
  { value: 30_000, label: 'Every 30 seconds' },
  { value: MINUTE, label: 'Every minute' },
  { value: 5 * MINUTE, label: 'Every 5 minutes' },
]
export type TimeRangePickerLabels = {
  /** The range select's name. */
  range: string
  /** The refresh interval select's name. */
  refresh: string
  /** The button that refreshes now. */
  refreshNow: string
}
const pickerLabels: TimeRangePickerLabels = {
  range: 'Time range',
  refresh: 'Refresh interval',
  refreshNow: 'Refresh now',
}
export type TimeRangePickerProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> & {
  /** Names the group, such as "Dashboard time". */
  label: string
  /** The span back from now, in ms; one of ranges. */
  range: number
  onRangeChange: (range: number) => void
  /** The span options, such as timeRangeOptions with translated labels. */
  ranges?: readonly TimeRangeOption[]
  /** How often onRefresh runs, in ms; 0 is off. Leave it out for no interval select. */
  refreshInterval?: number
  onRefreshIntervalChange?: (interval: number) => void
  refreshIntervals?: readonly TimeRangeOption[]
  /** Runs when the button is pressed and on every interval while the page is shown.
   * Leave it out for no refresh button. */
  onRefresh?: () => void
  labels?: Partial<TimeRangePickerLabels>
  size?: ComponentSize
}
/** The span a monitoring screen shows, back from now, with how often it refreshes and
 * a button to refresh now. For a fixed span between two dates, put a DateRangePicker
 * beside it. */
export const TimeRangePicker = function TimeRangePicker({
  label,
  range,
  onRangeChange,
  ranges = timeRangeOptions,
  refreshInterval,
  onRefreshIntervalChange,
  refreshIntervals: intervals = refreshIntervalOptions,
  onRefresh,
  labels,
  size,
  className,
  ref,
  ...props
}: TimeRangePickerProps & { ref?: React.Ref<HTMLDivElement> }) {
  const provided = useLabels<TimeRangePickerLabels>('timeRangePicker')
  const text = { ...pickerLabels, ...provided, ...labels }
  const refresh = React.useRef(onRefresh)
  refresh.current = onRefresh
  // The interval pauses while the page is hidden, and refreshes once it shows again.
  React.useEffect(() => {
    if (!refreshInterval || !refresh.current) return
    let due = false
    const timer = setInterval(() => {
      if (document.hidden) due = true
      else refresh.current?.()
    }, refreshInterval)
    const shown = () => {
      if (!document.hidden && due) {
        due = false
        refresh.current?.()
      }
    }
    document.addEventListener('visibilitychange', shown)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', shown)
    }
  }, [refreshInterval])
  const options = (list: readonly TimeRangeOption[]) =>
    list.map((option) => ({
      value: String(option.value),
      label: option.label,
    }))
  return (
    <div
      role='group'
      aria-label={label}
      {...props}
      ref={ref}
      className={cx('surf-time-range', className)}
    >
      <Select
        width='content'
        size={size}
        options={options(ranges)}
        value={String(range)}
        onValueChange={(value) => onRangeChange(Number(value))}
        aria-label={text.range}
      />
      {refreshInterval !== undefined && (
        <Select
          width='content'
          size={size}
          options={options(intervals)}
          value={String(refreshInterval)}
          onValueChange={(value) => onRefreshIntervalChange?.(Number(value))}
          aria-label={text.refresh}
        />
      )}
      {onRefresh && (
        <Button
          variant='outline'
          size={
            size === 'small'
              ? 'icon-small'
              : size === 'large'
                ? 'icon-large'
                : 'icon'
          }
          aria-label={text.refreshNow}
          onClick={() => onRefresh()}
        >
          <Icon name='refresh' />
        </Button>
      )}
    </div>
  )
}
