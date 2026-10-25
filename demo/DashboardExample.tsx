import { useState } from 'react'
import { BarList, SizeProvider, Stat, ToggleGroup, Toggle } from '@surflane/ui'
import { Dashboard } from '@surflane/ui/dashboard'
import { Chart, type ChartDatum } from '@surflane/ui/chart'
import { TimeRangePicker } from '@surflane/ui/time-range-picker'
import { useLocale } from './i18n'
import { text } from './i18n/pages/DashboardExample'

const at = (hour: number, minute = 0) =>
  new Date(2026, 9, 17, hour, minute).getTime()
const gpu: ChartDatum[] = Array.from({ length: 48 }, (_, index) => ({
  id: `gpu-${index}`,
  label: `October 17, 2026, ${String(Math.floor(index / 2)).padStart(2, '0')}:${index % 2 ? '30' : '00'}`,
  time: at(Math.floor(index / 2), (index % 2) * 30),
  values: {
    'dgx-001': Math.round(62 + 9 * Math.sin(index / 5)),
    'dgx-002': Math.round(70 + 12 * Math.sin(index / 4 + 1)),
  },
}))
const projects = [
  ['Harbor', 18.4],
  ['Beacon', 9.7],
  ['Tideline', 6.2],
  ['Anchor', 3.1],
] as const
type Demo = 'ready' | 'loading' | 'refreshing' | 'error'
export function DashboardExample() {
  const { locale } = useLocale()
  const t = text[locale]
  const [demo, setDemo] = useState<Demo>('ready')
  const [range, setRange] = useState(24 * 3_600_000)
  const state = demo === 'loading' || demo === 'error' ? demo : 'ready'
  return (
    <div className='example-stack'>
      <ToggleGroup
        aria-label={t.stateLabel}
        value={[demo]}
        onValueChange={(value) => value[0] && setDemo(value[0] as Demo)}
      >
        {(Object.keys(t.states) as Demo[]).map((key) => (
          <Toggle key={key} value={key}>
            {t.states[key]}
          </Toggle>
        ))}
      </ToggleGroup>
      {/* A dense dashboard: small controls, compact density for the panels, their
          titles, charts and tables, and controls that keep their size on touch. */}
      <SizeProvider size='small' density='compact'>
        <TimeRangePicker
          label={t.dashboardTime}
          range={range}
          onRangeChange={setRange}
          onRefresh={() => {
            // The panels keep their values while new ones are on the way.
            setDemo('refreshing')
            setTimeout(() => setDemo('ready'), 1500)
          }}
        />
        <Dashboard.Root aria-label={t.overview}>
          <Dashboard.Panel
            title={t.gpu}
            description={t.gpuDescription}
            span={2}
            state={state}
            refreshing={demo === 'refreshing'}
            onRetry={() => setDemo('ready')}
            message={demo === 'error' ? t.offline : undefined}
          >
            <Chart
              title={t.gpu}
              description={t.gpuDescription}
              data={gpu}
              series={[
                { key: 'dgx-001', label: 'dgx-001' },
                { key: 'dgx-002', label: 'dgx-002' },
              ]}
              unit='°C'
              xLabel='Time'
              yLabel={t.gpu}
              xScale='time'
              references={[{ y: 85, label: 'Limit', tone: 'danger' }]}
              height={160}
              locale={locale === 'ko' ? 'ko-KR' : 'en-US'}
            />
          </Dashboard.Panel>
          <Dashboard.Panel
            title={t.disk}
            state={state}
            refreshing={demo === 'refreshing'}
            onRetry={() => setDemo('ready')}
          >
            <Stat.Root>
              <Stat.Label>dgx-001 /srv</Stat.Label>
              <Stat.Value>24 GiB</Stat.Value>
              <Stat.Status tone='danger'>{t.belowLimit}</Stat.Status>
            </Stat.Root>
          </Dashboard.Panel>
          <Dashboard.Panel
            title={t.tokens}
            description={t.tokensDescription}
            state={state}
            refreshing={demo === 'refreshing'}
            onRetry={() => setDemo('ready')}
          >
            <BarList
              label={t.tokens}
              items={projects.map(([label, value]) => ({
                id: label,
                label,
                value,
                text: `${value}M`,
              }))}
            />
          </Dashboard.Panel>
          <Dashboard.Panel
            title={t.jobs}
            state={demo === 'loading' ? 'loading' : 'empty'}
            message={t.noFailures}
          />
          <Dashboard.Panel
            title={t.latency}
            state={state}
            refreshing={demo === 'refreshing'}
            onRetry={() => setDemo('ready')}
          >
            <Stat.Root>
              <Stat.Label>p95</Stat.Label>
              <Stat.Value>182 ms</Stat.Value>
              <Stat.Change value={-0.04} lowerIsBetter />
            </Stat.Root>
          </Dashboard.Panel>
        </Dashboard.Root>
      </SizeProvider>
    </div>
  )
}
