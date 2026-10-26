import { useState } from 'react'
import {
  TimeRangePicker,
  refreshIntervalOptions,
  timeRangeOptions,
} from '@surflane/ui/time-range-picker'
import { useLocale } from './i18n'
import { text } from './i18n/pages/TimeRangeExample'

export function TimeRangeExample() {
  const t = text[useLocale().locale]
  // The package's spans and intervals, with this page's language.
  const ranges = timeRangeOptions.map((option, index) => ({
    ...option,
    label: t.ranges[index],
  }))
  const intervals = refreshIntervalOptions.map((option, index) => ({
    ...option,
    label: t.intervals[index],
  }))
  const [range, setRange] = useState(ranges[3].value)
  const [interval, setIntervalValue] = useState(0)
  const [count, setCount] = useState(0)
  return (
    <div className='example-stack'>
      <TimeRangePicker
        label={t.dashboardTime}
        range={range}
        onRangeChange={setRange}
        ranges={ranges}
        refreshInterval={interval}
        onRefreshIntervalChange={setIntervalValue}
        refreshIntervals={intervals}
        onRefresh={() => setCount((n) => n + 1)}
      />
      <p role='status' aria-label={t.statusLabel}>
        {t.status(
          ranges.find((option) => option.value === range)!.label,
          intervals.find((option) => option.value === interval)!.label,
          count,
        )}
      </p>
    </div>
  )
}
