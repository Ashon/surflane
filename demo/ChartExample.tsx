import React, { useState } from 'react'
import { Checkbox, NativeSelect, ChoiceLabel } from '@surflane/ui'
import {
  Chart,
  type ChartDatum,
  type ChartProps,
  type ChartReference,
} from '@surflane/ui/chart'
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
// Raw bytes, as a metrics API returns them.
const memory: ChartDatum[] = [3.1, 3.4, 4.2, 3.9, 5.2, 5.6].map(
  (workspace, index) => ({
    id: `memory-${index + 1}`,
    label: `October ${index + 1}, 2026`,
    values: {
      workspace: workspace * 1e9,
      inventory: [2.2, 2.4, 2.3, 2.6, 2.8, 2.7][index] * 1e9,
      docs: [1.1, 1.2, 1.2, 1.3, 1.2, 1.4][index] * 1e9,
    },
  }),
)
// Local times, so the axis ticks fall on round hours wherever the page is read.
const at = (day: number, hour: number, minute = 0) =>
  new Date(2026, 9, day, hour, minute).getTime()
const clock = (day: number, hour: number, minute = 0) =>
  `October ${day}, 2026, ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
const gpuSeries = [
  { key: 'dgx-001', label: 'dgx-001' },
  { key: 'dgx-002', label: 'dgx-002' },
]
// Every 10 minutes for a day, with nothing reported from 03:00 to 04:00.
const gpu: ChartDatum[] = Array.from({ length: 144 }, (_, index) => {
  const hour = Math.floor(index / 6),
    minute = (index % 6) * 10
  return {
    id: `gpu-${index}`,
    label: clock(17, hour, minute),
    time: at(17, hour, minute),
    values: {
      'dgx-001': Math.round(62 + 9 * Math.sin(index / 14)),
      'dgx-002': Math.round(70 + 12 * Math.sin(index / 11 + 1)),
    },
  }
}).filter((row) => !(row.time >= at(17, 3, 10) && row.time < at(17, 4)))
const gpuReferences: ChartReference[] = [
  { y: 70, label: 'Warning', tone: 'caution' },
  { y: 85, label: 'Limit', tone: 'danger' },
]
const tokenSeries = [
  { key: 'prompt', label: 'Prompt' },
  { key: 'completion', label: 'Completion' },
  { key: 'cached', label: 'Cached' },
]
const tokens: ChartDatum[] = Array.from({ length: 7 }, (_, index) => ({
  id: `tokens-${index}`,
  label: `October ${index + 11}, 2026`,
  time: at(index + 11, 0),
  values: {
    prompt: [4.2, 5.1, 3.8, 6.4, 5.9, 2.1, 1.8][index],
    completion: [1.1, 1.4, 0.9, 1.8, 1.6, 0.5, 0.4][index],
    cached: [2.4, 2.9, 2.2, 3.7, 3.1, 1.2, 1.0][index],
  },
}))
const throughputSeries = [
  { key: 'prefill', label: 'Prefill' },
  { key: 'decode', label: 'Decode' },
]
const throughput: ChartDatum[] = Array.from({ length: 12 }, (_, index) => ({
  id: `throughput-${index}`,
  label: clock(17, index * 2),
  time: at(17, index * 2),
  values: {
    prefill: [
      3200, 4100, 3800, 5200, 6100, 5800, 4900, 7200, 6600, 5100, 4300, 3900,
    ][index],
    decode: [42, 38, 45, 51, 48, 55, 61, 58, 52, 47, 44, 40][index],
  },
}))
const diskSeries = [{ key: 'models', label: '/srv/models' }]
const disk: ChartDatum[] = Array.from({ length: 24 }, (_, index) => ({
  id: `disk-${index}`,
  label: clock(17, index),
  time: at(17, index),
  values: {
    models: index < 5 ? 412 : index < 11 ? 468 : index < 19 ? 455 : 503,
  },
}))
const projectSeries = Array.from({ length: 12 }, (_, index) => ({
  key: `project-${index + 1}`,
  label: `Project ${String.fromCharCode(65 + index)}`,
}))
const projects: ChartDatum[] = Array.from({ length: 7 }, (_, day) => ({
  id: `projects-${day}`,
  label: `October ${day + 11}, 2026`,
  time: at(day + 11, 0),
  values: Object.fromEntries(
    projectSeries.map((s, index) => [
      s.key,
      Math.round((12 - index) * 3 + ((day * (index + 3)) % 7)),
    ]),
  ),
}))
type Preset = Partial<
  Pick<ChartProps, 'type' | 'yScale' | 'curve' | 'stacked' | 'palette'>
> & { legendLimit?: number | 'auto' }
// What each sample is best read with; picking a sample applies it.
const presets: Record<string, Preset> = {
  gpu: { type: 'line' },
  tokens: { type: 'bar', stacked: true, palette: 'categorical' },
  throughput: { type: 'line', yScale: 'log' },
  disk: { type: 'area', curve: 'step' },
  projects: { type: 'line', palette: 'categorical', legendLimit: 4 },
}
export function ChartExample() {
  const { locale: pageLocale } = useLocale()
  const t = text[pageLocale]
  const [type, setType] = useState<'line' | 'bar' | 'area'>('line')
  const [scenario, setScenario] = useState('trend')
  // Numbers start in the page's language; the select tries the other.
  const [locale, setLocale] = useState(pageLocale === 'ko' ? 'ko-KR' : 'en-US')
  const [locked, setLocked] = useState(false)
  const [hidden, setHidden] = useState<string[]>([])
  const [palette, setPalette] = useState<'neutral' | 'categorical'>('neutral')
  const [includeZero, setIncludeZero] = useState(true)
  const [yScale, setYScale] = useState<'linear' | 'log'>('linear')
  const [curve, setCurve] = useState<'linear' | 'step'>('linear')
  const [stacked, setStacked] = useState(false)
  const [density, setDensity] = useState<'default' | 'compact'>('default')
  const [legendPosition, setLegendPosition] = useState<'top' | 'bottom'>('top')
  const [legendLimit, setLegendLimit] = useState<number | 'auto'>()
  const choose = (next: string) => {
    const preset = presets[next] ?? {}
    setScenario(next)
    setType(preset.type ?? 'line')
    setYScale(preset.yScale ?? 'linear')
    setCurve(preset.curve ?? 'linear')
    setStacked(preset.stacked ?? false)
    setPalette(preset.palette ?? 'neutral')
    setLegendLimit(preset.legendLimit)
  }
  const [notice, setNotice] = useState(t.allSeriesVisible)
  const scenarios: Record<
    string,
    {
      data: ChartDatum[]
      unit: string
      description: string
      series?: { key: string; label: string }[]
      formatValue?: (value: number) => string
      xScale?: 'time'
      references?: ChartReference[]
      xLabel?: string
      yLabel?: string
    }
  > = {
    gpu: {
      data: gpu,
      unit: '°C',
      description: t.descriptions.gpu,
      series: gpuSeries,
      xScale: 'time',
      references: gpuReferences.map((reference, index) => ({
        ...reference,
        label: t.references[index],
      })),
      xLabel: t.time,
      yLabel: t.gpuTemperature,
    },
    tokens: {
      data: tokens,
      unit: t.units.mTokens,
      description: t.descriptions.tokens,
      series: tokenSeries,
      xScale: 'time',
      xLabel: t.day,
      yLabel: t.tokens,
    },
    throughput: {
      data: throughput,
      unit: 't/s',
      description: t.descriptions.throughput,
      series: throughputSeries,
      xScale: 'time',
      xLabel: t.time,
      yLabel: t.throughput,
    },
    disk: {
      data: disk,
      unit: 'GiB',
      description: t.descriptions.disk,
      series: diskSeries,
      xScale: 'time',
      // When something changed: an event at one time, a period between two.
      references: [
        { x: at(17, 5), label: t.diskEvents[0] },
        {
          xFrom: at(17, 11),
          xTo: at(17, 13),
          label: t.diskEvents[1],
          tone: 'caution',
        },
      ],
      xLabel: t.time,
      yLabel: t.diskUsed,
    },
    projects: {
      data: projects,
      unit: t.units.kTokens,
      description: t.descriptions.projects,
      series: projectSeries,
      xScale: 'time',
      xLabel: t.day,
      yLabel: t.tokens,
    },
    latency: {
      data: latency,
      unit: 'ms',
      description: t.descriptions.latency,
      // On a category axis, an event names the datum it falls on.
      references: [{ x: 'latency-4', label: t.latencyEvent }],
    },
    memory: {
      data: memory,
      unit: 'GB',
      description: t.descriptions.memory,
      formatValue: (value) =>
        new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
          value / 1e9,
        ),
    },
    buckets: {
      data: buckets,
      unit: t.units.runs,
      description: t.descriptions.buckets,
      series: bucketSeries.map((bucket, index) => ({
        ...bucket,
        label: t.buckets[index],
      })),
    },
    trend: {
      data: trend,
      unit: t.units.runs,
      description: t.descriptions.trend,
    },
    mixed: {
      data: mixed,
      unit: t.units.resources,
      description: t.descriptions.mixed,
    },
    dense: {
      data: dense,
      unit: t.units.runs,
      description: t.descriptions.dense,
    },
    missing: {
      data: missing,
      unit: t.units.runs,
      description: t.descriptions.missing,
    },
    empty: {
      data: [],
      unit: t.units.runs,
      description: t.descriptions.empty,
    },
  }
  const sample = scenarios[scenario]
  return (
    <div className='example-stack'>
      <div className='foundation-controls'>
        <label>
          {t.chartType}
          <NativeSelect
            value={type}
            onChange={(event) => setType(event.target.value as typeof type)}
          >
            <option value='line'>{t.lineType}</option>
            <option value='bar'>{t.barType}</option>
            <option value='area'>{t.areaType}</option>
          </NativeSelect>
        </label>
        <label>
          {t.chartData}
          <NativeSelect
            value={scenario}
            onChange={(event) => choose(event.target.value)}
          >
            <option value='trend'>{t.trendOption}</option>
            <option value='mixed'>{t.mixedOption}</option>
            <option value='dense'>{t.denseOption}</option>
            <option value='missing'>{t.missingOption}</option>
            <option value='empty'>{t.emptyOption}</option>
            <option value='latency'>{t.options.latency}</option>
            <option value='buckets'>{t.options.buckets}</option>
            <option value='memory'>{t.options.memory}</option>
            <option value='gpu'>{t.options.gpu}</option>
            <option value='tokens'>{t.options.tokens}</option>
            <option value='throughput'>{t.options.throughput}</option>
            <option value='disk'>{t.options.disk}</option>
            <option value='projects'>{t.options.projects}</option>
          </NativeSelect>
        </label>
        <label>
          {t.valueScale}
          <NativeSelect
            value={yScale}
            onChange={(event) => setYScale(event.target.value as typeof yScale)}
          >
            <option value='linear'>{t.linear}</option>
            <option value='log'>{t.log}</option>
          </NativeSelect>
        </label>
        <label>
          {t.curve}
          <NativeSelect
            value={curve}
            onChange={(event) => setCurve(event.target.value as typeof curve)}
          >
            <option value='linear'>{t.linear}</option>
            <option value='step'>{t.step}</option>
          </NativeSelect>
        </label>
        <label>
          {t.density}
          <NativeSelect
            value={density}
            onChange={(event) =>
              setDensity(event.target.value as typeof density)
            }
          >
            <option value='default'>{t.densityDefault}</option>
            <option value='compact'>{t.densityCompact}</option>
          </NativeSelect>
        </label>
        <label>
          {t.legend}
          <NativeSelect
            value={legendPosition}
            onChange={(event) =>
              setLegendPosition(event.target.value as typeof legendPosition)
            }
          >
            <option value='top'>{t.top}</option>
            <option value='bottom'>{t.bottom}</option>
          </NativeSelect>
        </label>
        <label>
          {t.legendLimit}
          <NativeSelect
            value={legendLimit ?? 'all'}
            onChange={(event) =>
              setLegendLimit(
                event.target.value === 'all'
                  ? undefined
                  : event.target.value === 'auto'
                    ? 'auto'
                    : Number(event.target.value),
              )
            }
          >
            <option value='all'>{t.everySeries}</option>
            <option value='auto'>{t.oneLine}</option>
            <option value='4'>{t.four}</option>
            <option value='2'>{t.two}</option>
          </NativeSelect>
        </label>
        <label>
          {t.palette}
          <NativeSelect
            value={palette}
            onChange={(event) =>
              setPalette(event.target.value as typeof palette)
            }
          >
            <option value='neutral'>{t.neutral}</option>
            <option value='categorical'>{t.categorical}</option>
          </NativeSelect>
        </label>
        <label>
          {t.numberLocale}
          <NativeSelect
            value={locale}
            onChange={(event) => setLocale(event.target.value)}
          >
            <option value='en-US'>{t.english}</option>
            <option value='ko-KR'>{t.korean}</option>
          </NativeSelect>
        </label>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={locked} onCheckedChange={setLocked}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.lockSeriesSelection}
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
          {t.keepZero}
        </ChoiceLabel>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={stacked} onCheckedChange={setStacked}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.stackSeries}
        </ChoiceLabel>
      </div>
      <Chart
        title={t.chartTitle}
        description={sample.description}
        xLabel={
          sample.xLabel ??
          (['trend', 'latency', 'buckets', 'memory'].includes(scenario)
            ? t.reportingDay
            : t.resource)
        }
        yLabel={
          sample.yLabel ??
          (scenario === 'mixed'
            ? t.resourceChange
            : scenario === 'latency'
              ? t.p95Latency
              : scenario === 'memory'
                ? t.memoryInUse
                : t.pipelineRunCount)
        }
        xScale={sample.xScale}
        references={sample.references}
        yScale={yScale}
        curve={curve}
        stacked={stacked}
        density={density}
        legendPosition={legendPosition}
        legendLimit={legendLimit}
        unit={sample.unit}
        type={type}
        data={sample.data}
        series={sample.series ?? series}
        palette={palette}
        includeZero={includeZero}
        locale={locale}
        formatValue={sample.formatValue}
        hiddenSeries={locked ? hidden : undefined}
        onHiddenSeriesChange={(next) => {
          if (locked) setNotice(t.rejectedChange)
          else {
            setHidden(next)
            setNotice(
              next.length ? t.hiddenSeries(next.length) : t.allSeriesVisible,
            )
          }
        }}
      />
      <p role='status' aria-label={t.selectionResultLabel}>
        {notice}
      </p>
    </div>
  )
}
