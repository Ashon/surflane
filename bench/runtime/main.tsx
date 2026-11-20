// A monitoring dashboard as a consumer builds one: the shell, a sidebar of links, a
// time range, eighteen panels of charts, stats and a table, and a poll that rolls
// every series forward one point. scripts/bench-runtime.mjs drives it: it waits for
// window.bench, mounts, then ticks, and reads the browser's own timings around it.
import '@surflane/ui/all.css'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import {
  AppShell,
  Badge,
  BarList,
  Icon,
  ScrollArea,
  SizeProvider,
  Sparkline,
  Stat,
  StatusDot,
  Table,
  type StatusTone,
} from '@surflane/ui'
import { Dashboard } from '@surflane/ui/dashboard'
import {
  AreaChart,
  BarChart,
  LineChart,
  type ChartDatum,
} from '@surflane/ui/chart'
import { TimeRangePicker } from '@surflane/ui/time-range-picker'

const start = Date.UTC(2026, 9, 17)
const minute = 60_000
// A deterministic wave, so every run draws the same values.
const wave = (seed: number, index: number, base: number, swing: number) =>
  Math.round(
    base +
      swing * Math.sin(index / (6 + seed)) +
      (swing / 3) * Math.sin(index / 2.3 + seed),
  )

function rows(
  keys: readonly string[],
  points: number,
  tick: number,
  seed: number,
): ChartDatum[] {
  return Array.from({ length: points }, (_, offset) => {
    const index = tick + offset
    const values: Record<string, number> = {}
    keys.forEach((key, k) => {
      values[key] = wave(seed + k, index, 60 + 10 * k, 18)
    })
    return {
      id: `p-${index}`,
      label: `Minute ${index}`,
      time: start + index * minute,
      values,
    }
  })
}

const nodes = ['dgx-001', 'dgx-002', 'dgx-003', 'dgx-004'] as const
const series = (keys: readonly string[]) =>
  keys.map((key) => ({ key, label: key }))
const tones: StatusTone[] = ['success', 'success', 'caution', 'danger', 'info']

function Panels({ tick }: { tick: number }) {
  const line = (seed: number, keys: readonly string[], points: number) => (
    <LineChart
      title={`Load ${seed}`}
      description='Requests per minute by node.'
      xLabel='Time'
      yLabel='Requests'
      unit='requests'
      xScale='time'
      includeZero={false}
      density='compact'
      locale='en-US'
      data={rows(keys, points, tick, seed)}
      series={series(keys)}
    />
  )
  return (
    <Dashboard.Root label='Cluster overview' columns={3}>
      {Array.from({ length: 6 }, (_, i) => (
        <Dashboard.Panel key={`line-${i}`} title={`Line ${i}`}>
          {line(i, nodes.slice(0, 2), 240)}
        </Dashboard.Panel>
      ))}
      {Array.from({ length: 3 }, (_, i) => (
        <Dashboard.Panel key={`area-${i}`} title={`Area ${i}`}>
          <AreaChart
            title={`Memory ${i}`}
            description='Memory in use by node.'
            xLabel='Time'
            yLabel='GiB'
            unit='GiB'
            xScale='time'
            stacked
            density='compact'
            locale='en-US'
            data={rows(nodes.slice(0, 3), 240, tick, 10 + i)}
            series={series(nodes.slice(0, 3))}
          />
        </Dashboard.Panel>
      ))}
      {Array.from({ length: 3 }, (_, i) => (
        <Dashboard.Panel key={`bar-${i}`} title={`Bar ${i}`}>
          <BarChart
            title={`Jobs ${i}`}
            description='Jobs finished per hour.'
            xLabel='Hour'
            yLabel='Jobs'
            unit='jobs'
            density='compact'
            locale='en-US'
            data={rows(nodes.slice(0, 2), 12, tick, 20 + i).map((row, h) => ({
              ...row,
              label: `${h}:00`,
            }))}
            series={series(nodes.slice(0, 2))}
          />
        </Dashboard.Panel>
      ))}
      {Array.from({ length: 3 }, (_, i) => (
        <Dashboard.Panel key={`stat-${i}`} title={`Stats ${i}`}>
          <Stat.Group label={`Stats ${i}`} labelHidden>
            {nodes.slice(0, 3).map((node, k) => (
              <Stat.Root key={node}>
                <Stat.Label>{node}</Stat.Label>
                <Stat.Value>{wave(i + k, tick, 50, 30)}%</Stat.Value>
                <Stat.Change
                  value={(wave(i + k, tick, 0, 20) / 100) as number}
                />
              </Stat.Root>
            ))}
          </Stat.Group>
          <Sparkline
            data={Array.from({ length: 60 }, (_, p) =>
              wave(i, tick + p, 40, 20),
            )}
            label={`Trend ${i}`}
          />
        </Dashboard.Panel>
      ))}
      <Dashboard.Panel title='Queues'>
        <BarList
          label='Jobs by queue'
          items={Array.from({ length: 8 }, (_, q) => {
            const value = Math.abs(wave(q, tick, 30, 25))
            return {
              id: `q-${q}`,
              label: `Queue ${q}`,
              value,
              text: `${value}`,
            }
          })}
        />
      </Dashboard.Panel>
      <Dashboard.Panel title='All nodes' span='full'>
        {line(30, nodes, 480)}
      </Dashboard.Panel>
      <Dashboard.Panel title='Sessions' span='full'>
        <Table.Root density='compact'>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Session</Table.HeaderCell>
              <Table.HeaderCell>Node</Table.HeaderCell>
              <Table.HeaderCell>State</Table.HeaderCell>
              <Table.HeaderCell>Tokens</Table.HeaderCell>
              <Table.HeaderCell>Latency</Table.HeaderCell>
              <Table.HeaderCell>Note</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {Array.from({ length: 100 }, (_, r) => {
              // A poll changes a few states, not all: one row in twenty moves on.
              const tone =
                tones[(r + Math.floor((tick + r * 7) / 20)) % tones.length]
              return (
                <Table.Row key={r}>
                  <Table.Cell>Session {r}</Table.Cell>
                  <Table.Cell>{nodes[r % nodes.length]}</Table.Cell>
                  <Table.Cell>
                    <StatusDot tone={tone} label={tone} />
                  </Table.Cell>
                  <Table.Cell>{Math.abs(wave(r, tick, 900, 400))}</Table.Cell>
                  <Table.Cell>
                    <Badge tone={tone}>
                      {Math.abs(wave(r, tick, 120, 60))} ms
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>Running a batch of prompts</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </Dashboard.Panel>
    </Dashboard.Root>
  )
}

const sections = ['Overview', 'Nodes', 'Agents'] as const
const icons = ['search', 'info', 'menu', 'sidebar', 'more', 'check'] as const

function App({ tick }: { tick: number }) {
  return (
    <SizeProvider size='small' density='compact'>
      <AppShell.Root layout='workspace'>
        <AppShell.Sidebar aria-label='Bench'>
          <AppShell.SidebarToggle />
          <ScrollArea orientation='vertical' label='Dashboards'>
            {sections.map((section, s) => (
              <AppShell.Nav key={section} label={section}>
                {icons.map((icon, l) => (
                  <AppShell.Link
                    key={icon}
                    href={`#${section}-${l}`}
                    label={`${section} ${l}`}
                    icon={<Icon name={icon} decorative />}
                    aria-current={s === 0 && l === 0 ? 'page' : undefined}
                  />
                ))}
              </AppShell.Nav>
            ))}
          </ScrollArea>
        </AppShell.Sidebar>
        <AppShell.Content>
          <ScrollArea orientation='vertical' label='Dashboard' fade='none'>
            <AppShell.Page>
              <main>
                <TimeRangePicker
                  label='Time'
                  range={3_600_000}
                  onRangeChange={() => {}}
                  onRefresh={() => {}}
                />
                <Panels tick={tick} />
              </main>
            </AppShell.Page>
          </ScrollArea>
        </AppShell.Content>
      </AppShell.Root>
    </SizeProvider>
  )
}

declare global {
  interface Window {
    bench: {
      mount: () => Promise<number>
      tick: () => Promise<number>
    }
  }
}

const frame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )
const root = createRoot(document.getElementById('root')!)
let tick = 0
window.bench = {
  // Each resolves after the frame that shows the change, with its wall time in ms.
  async mount() {
    const t0 = performance.now()
    flushSync(() => root.render(<App tick={tick} />))
    await frame()
    return performance.now() - t0
  },
  async tick() {
    tick += 1
    const t0 = performance.now()
    flushSync(() => root.render(<App tick={tick} />))
    await frame()
    return performance.now() - t0
  },
}
