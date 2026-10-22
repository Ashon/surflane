import React, { useState } from 'react'
import { Checkbox, NativeSelect, ChoiceLabel } from '@surflane/ui'
import { Chart, type ChartDatum } from '@surflane/ui/chart'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ChartExample'

const series = [
  { key: 'workspace', label: 'Workspace' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'docs', label: 'Documentation' },
]
const trend: ChartDatum[] = [12, 18, 14, 20, 25, 27].map(
  (workspace, index) => ({
    id: `day-${index + 1}`,
    label: `October ${index + 1}, 2026`,
    values: {
      workspace,
      inventory: [8, 9, null, 15, 18, 22][index],
      docs: [4, 5, 6, 7, 8, 10][index],
    },
  }),
)
const mixed: ChartDatum[] = [-12, 0, 8, 20, -4, 10].map((workspace, index) => ({
  id: `change-${index}`,
  label: `Cluster ${index + 1} / Platform service ${index + 1}`,
  values: {
    workspace,
    inventory: [2, -3, 0, 12, null, 6][index],
    docs: index - 2,
  },
}))
const dense: ChartDatum[] = Array.from({ length: 120 }, (_, index) => ({
  id: `resource-${index}`,
  label: `배포 대상 서비스 ${index + 1} / resource-with-a-long-identifier-${index + 1}`,
  values: {
    workspace: (index * 7) % 31,
    inventory: index % 9 === 0 ? null : (index * 3) % 23,
    docs: (index * 5) % 17,
  },
}))
const missing: ChartDatum[] = [
  {
    id: 'missing-1',
    label: 'No report received',
    values: { workspace: null, inventory: undefined, docs: null },
  },
  {
    id: 'missing-2',
    label: 'Invalid numeric report',
    values: { workspace: NaN, inventory: Infinity, docs: -Infinity },
  },
]
const latency: ChartDatum[] = [182, 176, 190, 171, 160, 144].map(
  (workspace, index) => ({
    id: `latency-${index + 1}`,
    label: `October ${index + 1}, 2026`,
    values: {
      workspace,
      inventory: [230, 221, 226, 214, 205, 198][index],
      docs: [158, 161, 155, 162, 150, 152][index],
    },
  }),
)
const bucketSeries = [
  { key: 'under-1', label: 'Under 1 min' },
  { key: 'to-5', label: '1–5 min' },
  { key: 'to-15', label: '5–15 min' },
  { key: 'to-60', label: '15–60 min' },
  { key: 'over-60', label: 'Over 60 min' },
]
const buckets: ChartDatum[] = Array.from({ length: 6 }, (_, index) => ({
  id: `buckets-${index + 1}`,
  label: `October ${index + 1}, 2026`,
  values: {
    'under-1': [40, 44, 38, 47, 52, 50][index],
    'to-5': [28, 31, 33, 30, 35, 37][index],
    'to-15': [12, 10, 14, 13, 11, 9][index],
    'to-60': [5, 6, 4, 7, 5, 4][index],
    'over-60': [1, 0, 2, 1, 0, 1][index],
  },
}))
export function ChartExample() {
  const t = text[useLocale().locale]
  const [type, setType] = useState<'line' | 'bar' | 'area'>('line')
  const [scenario, setScenario] = useState('trend')
  const [locale, setLocale] = useState('en-US')
  const [locked, setLocked] = useState(false)
  const [hidden, setHidden] = useState<string[]>([])
  const [palette, setPalette] = useState<'neutral' | 'categorical'>('neutral')
  const [includeZero, setIncludeZero] = useState(true)
  const [notice, setNotice] = useState(t.allSeriesVisible)
  const scenarios: Record<
    string,
    {
      data: ChartDatum[]
      unit: string
      description: string
      series?: typeof bucketSeries
    }
  > = {
    latency: {
      data: latency,
      unit: 'ms',
      description: t.descriptions.latency,
    },
    buckets: {
      data: buckets,
      unit: 'runs',
      description: t.descriptions.buckets,
      series: bucketSeries,
    },
    trend: {
      data: trend,
      unit: 'runs',
      description: t.descriptions.trend,
    },
    mixed: {
      data: mixed,
      unit: 'resources',
      description: t.descriptions.mixed,
    },
    dense: {
      data: dense,
      unit: 'runs',
      description: t.descriptions.dense,
    },
    missing: {
      data: missing,
      unit: 'runs',
      description: t.descriptions.missing,
    },
    empty: {
      data: [],
      unit: 'runs',
      description: t.descriptions.empty,
    },
  }
  const sample = scenarios[scenario]
  return (
    <div className='example-stack'>
      <div className='foundation-controls'>
        <label>
          Chart type
          <NativeSelect
            value={type}
            onChange={(event) => setType(event.target.value as typeof type)}
          >
            <option value='line'>Line</option>
            <option value='bar'>Bar</option>
            <option value='area'>Area</option>
          </NativeSelect>
        </label>
        <label>
          Chart data
          <NativeSelect
            value={scenario}
            onChange={(event) => setScenario(event.target.value)}
          >
            <option value='trend'>Trend with a missing value</option>
            <option value='mixed'>Negative and zero values</option>
            <option value='dense'>120 long resource labels</option>
            <option value='missing'>All values unavailable</option>
            <option value='empty'>No rows</option>
            <option value='latency'>Latency far from zero</option>
            <option value='buckets'>Five duration buckets</option>
          </NativeSelect>
        </label>
        <label>
          Palette
          <NativeSelect
            value={palette}
            onChange={(event) =>
              setPalette(event.target.value as typeof palette)
            }
          >
            <option value='neutral'>Neutral</option>
            <option value='categorical'>Categorical</option>
          </NativeSelect>
        </label>
        <label>
          Number locale
          <NativeSelect
            value={locale}
            onChange={(event) => setLocale(event.target.value)}
          >
            <option value='en-US'>English</option>
            <option value='ko-KR'>Korean</option>
          </NativeSelect>
        </label>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={locked} onCheckedChange={setLocked}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          Lock series selection
        </ChoiceLabel>
        <ChoiceLabel
          control={
            <Checkbox.Root
              checked={includeZero}
              onCheckedChange={setIncludeZero}
            >
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          Keep zero on the value axis
        </ChoiceLabel>
      </div>
      <Chart
        title='Pipeline activity'
        description={sample.description}
        xLabel={
          ['trend', 'latency', 'buckets'].includes(scenario)
            ? 'Reporting day'
            : 'Resource'
        }
        yLabel={
          scenario === 'mixed'
            ? 'Resource change'
            : scenario === 'latency'
              ? 'P95 latency'
              : 'Pipeline run count'
        }
        unit={sample.unit}
        type={type}
        data={sample.data}
        series={sample.series ?? series}
        palette={palette}
        includeZero={includeZero}
        locale={locale}
        hiddenSeries={locked ? hidden : undefined}
        onHiddenSeriesChange={(next) => {
          if (locked)
            setNotice(
              'Series selection unchanged. The example rejected this change.',
            )
          else {
            setHidden(next)
            setNotice(
              next.length
                ? `${next.length} hidden series. The data table still shows every series.`
                : 'All series are visible.',
            )
          }
        }}
      />
      <p role='status' aria-label='Chart selection result'>
        {notice}
      </p>
    </div>
  )
}
