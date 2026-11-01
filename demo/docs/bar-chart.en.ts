import type { ComponentDoc } from '../componentDocs'
import {
  chartAnatomy,
  chartKeyboard,
  chartProps,
  chartTokens,
} from './chart-common'
export const doc: ComponentDoc = {
  usage:
    'Compare amounts per period or category as bars, such as runs per day, tokens per day by kind or an allocation against its targets. A bar\'s length is its amount, so bars always start at zero on a linear axis. Always provide a title, a factual summary, and axis names with units. Series default to brand and neutral fills, told apart by fill patterns; pass palette="categorical" when color must separate categories, such as kinds or buckets, or palette="extended" for a chart with more series than twelve. stacked adds the series into one bar per row, whose top is their total and which the readout names. A plan, such as a target, is a level to reach: an unfilled dashed bar beside its series, outside the stack and its total. With xScale="time", rows sit by data[].time, each bar centered on its own. references draw thresholds and target bands, and mark events and periods on the x axis. In a dashboard card, density="compact" keeps the plot, legend and floating values; minimal leaves the marks alone. Pass data as an immutable array that the caller owns.',
  avoid: [
    "Don't draw a long or finely sampled series as bars, such as a day every ten minutes: past a few dozen rows the bars thin out to lines. Use LineChart.",
    'Don\'t expect bars for values far from zero or orders of magnitude apart: a bar starts at zero, and a log axis has none. Use LineChart, with includeZero={false} or yScale="log".',
    "Don't stack series that don't add up, such as latency per region. Stack only parts of a total, and set the others side by side.",
    "Don't mix units on one axis. Use separate charts instead.",
    "Don't replace missing values with 0. Pass null instead: the chart treats null, undefined, NaN, and Infinity as missing and leaves the bar out, while a 0 is a bar of no length.",
    "Don't rank named values as bars here. Use BarList, which sorts them with their names and values as text.",
    "Don't expect the chart to show loading, error, or retry states. Build them in the product screen.",
    "Don't expect the description prop to be an automatically inferred analysis. It holds the caller's factual summary.",
  ],
  keyboard: chartKeyboard('bar'),
  anatomy: chartAnatomy,
  tokens: chartTokens,
  code: `// Needs recharts: npm install recharts
import { BarChart, type ChartDatum } from '@surflane/ui/chart'

const data: ChartDatum[] = [
  { id: 'oct-1', label: 'October 1', values: { prefill: 3.2, decode: 1.1 } },
  { id: 'oct-2', label: 'October 2', values: { prefill: 4.0, decode: 1.4 } },
  { id: 'oct-3', label: 'October 3', values: { prefill: 2.6, decode: null } },
]
<BarChart
  title='Tokens per day'
  description='Prefill leads every day; decode has no report on October 3.'
  xLabel='Day'
  yLabel='Tokens'
  unit='M tokens'
  data={data}
  series={[
    { key: 'prefill', label: 'Prefill' },
    { key: 'decode', label: 'Decode' },
  ]}
  palette='categorical'
  stacked
/>`,
  props: chartProps('bar', [
    [
      'stacked',
      'stacks the series into one bar per row, whose top is their total, which the readout adds; a comparison or a plan is read against the stack, not added to it, so it stands beside it and stays out of the total',
      'false',
    ],
  ]),
}
