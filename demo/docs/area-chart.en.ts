import type { ComponentDoc } from '../componentDocs'
import {
  chartAnatomy,
  chartKeyboard,
  chartProps,
  chartTokens,
} from './chart-common'
export const doc: ComponentDoc = {
  usage:
    'Fill amounts along time as areas, such as disk used or tokens by project, and stack them so the top of the stack is their total. The fill is an amount, so an area always rises from zero on a linear axis. Always provide a title, a factual summary, and axis names with units. Series default to brand and neutral fills, told apart by fill patterns, dashes and markers; pass palette="categorical" when color must separate categories, such as projects, or palette="extended" for a chart with more series than twelve; dashes={false} draws the tops solid. stacked adds the series into their total, which the readout names; a comparison or a plan, such as a target, draws as its line alone and stays out of the total. With xScale="time", rows sit by data[].time and an area breaks where sampling stops, or past breakAfter; curve="step" holds values sampled on change, such as disk used. references draw thresholds and target bands, and mark events and periods on the x axis. In a dashboard card, density="compact" keeps the plot, legend and floating values; minimal leaves the marks alone. Pass data as an immutable array that the caller owns.',
  avoid: [
    'Don\'t fill values far from zero, such as a price, or values orders of magnitude apart: the fill would claim an amount that isn\'t there. Use LineChart, with includeZero={false} or yScale="log".',
    "Don't stack series that don't add up, such as a temperature per node. Stack only parts of a total, and draw the rest with LineChart.",
    "Don't stack many series where you can choose: each layer rides on the ones below it, so only the lowest and the total read their own change. Keep the largest, sum the rest as Other, or use LineChart to compare their change.",
    "Don't mix units on one axis. Use separate charts instead.",
    "Don't replace missing values with 0. Pass null instead: the chart treats null, undefined, NaN, and Infinity as missing and breaks the area there.",
    "Don't expect the chart to show loading, error, or retry states. Build them in the product screen.",
    "Don't expect the description prop to be an automatically inferred analysis. It holds the caller's factual summary.",
  ],
  keyboard: chartKeyboard('area'),
  anatomy: chartAnatomy,
  tokens: chartTokens,
  code: `// Needs recharts: npm install recharts
import { AreaChart, type ChartDatum } from '@surflane/ui/chart'

const data: ChartDatum[] = [
  { id: 'oct-1', label: 'October 1', values: { models: 412, cache: 96 } },
  { id: 'oct-2', label: 'October 2', values: { models: 438, cache: 120 } },
  { id: 'oct-3', label: 'October 3', values: { models: 451, cache: 88 } },
]
<AreaChart
  title='Disk used'
  description='Models grow from 412 to 451 GiB; the cache stays near 100 GiB.'
  xLabel='Day'
  yLabel='Disk used'
  unit='GiB'
  data={data}
  series={[
    { key: 'models', label: '/srv/models' },
    { key: 'cache', label: '/srv/cache' },
  ]}
  stacked
/>`,
  props: chartProps('area', [
    [
      'stacked',
      'stacks the series, so the top of the stack is their total, which the readout adds; a comparison or a plan is read against the stack, not added to it, so it draws on its own and stays out of the total',
      'false',
    ],
    ['curve', 'linear | step: step holds each value until the next', 'linear'],
    [
      'breakAfter',
      'on a time axis, the longest wait between rows an area runs across, in ms; past it the area breaks. A missing value still breaks it',
      'twice the usual interval',
    ],
    [
      'dashes',
      "false draws every area's top solid and leaves the markers to tell the series apart; a plan keeps its dash, which is what makes it a plan",
      'true',
    ],
  ]),
}
