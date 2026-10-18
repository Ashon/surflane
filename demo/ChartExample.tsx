import React, { useState } from 'react'
import { Chart, Checkbox, NativeSelect, type ChartDatum } from '@surflane/ui'

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
const scenarios: Record<
  string,
  { data: ChartDatum[]; unit: string; description: string }
> = {
  trend: {
    data: trend,
    unit: 'runs',
    description:
      'Six illustrative days: Workspace rises from 12 to 27 runs. Inventory has no measurement on October 3; the line keeps that gap.',
  },
  mixed: {
    data: mixed,
    unit: 'resources',
    description:
      'Illustrative changes include negative, zero and positive resource counts. Every bar starts at the zero baseline; missing values remain unavailable.',
  },
  dense: {
    data: dense,
    unit: 'runs',
    description:
      '120 illustrative resources with long Korean and English labels. The data table preserves all labels and measurements; only axis labels are abbreviated.',
  },
  missing: {
    data: missing,
    unit: 'runs',
    description:
      'Two reports contain no finite numeric measurement. Missing and invalid values are unavailable, never zero.',
  },
  empty: {
    data: [],
    unit: 'runs',
    description:
      'No reports in this illustrative scope. The empty state has no fabricated trend.',
  },
}

export function ChartExample() {
  const [type, setType] = useState<'line' | 'bar' | 'area'>('line')
  const [scenario, setScenario] = useState('trend')
  const [locale, setLocale] = useState('en-US')
  const [locked, setLocked] = useState(false)
  const [hidden, setHidden] = useState<string[]>([])
  const [notice, setNotice] = useState('All series are visible.')
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
        <label className='pui-choice-label'>
          <Checkbox.Root checked={locked} onCheckedChange={setLocked}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          <span>Lock series selection</span>
        </label>
      </div>
      <Chart
        title='Pipeline activity'
        description={sample.description}
        xLabel={scenario === 'trend' ? 'Reporting day' : 'Resource'}
        yLabel={scenario === 'mixed' ? 'Resource change' : 'Pipeline run count'}
        unit={sample.unit}
        type={type}
        data={sample.data}
        series={series}
        locale={locale}
        hiddenSeries={locked ? hidden : undefined}
        onHiddenSeriesChange={(next) => {
          if (locked)
            setNotice(
              'Series selection unchanged: the calling example rejected this change.',
            )
          else {
            setHidden(next)
            setNotice(
              next.length
                ? `${next.length} hidden series. The data table still contains every series.`
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
