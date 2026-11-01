import type { ComponentDoc } from '../componentDocs'
import {
  chartAnatomy,
  chartKeyboard,
  chartProps,
  chartTokens,
} from './chart-common'
export const doc: ComponentDoc = {
  usage:
    'Draw values that change along time or another order as lines, such as a temperature, a latency, a price or a portfolio against its benchmark. A line says its slope, so it also reads values far from zero: set includeZero={false} and the line takes the height. Always provide a title, a factual summary, and axis names with units. Series default to brand and neutral lines, told apart by dashes and markers; pass palette="categorical" when color must separate categories, such as buckets, or palette="extended" for a chart with more series than twelve, which adds a second dozen hues, the same twelve a step along the ramp; dashes={false} draws every line solid and leaves the markers to tell the series apart. For monitoring, xScale="time" places rows by data[].time, ticks on round times and breaks a line where sampling stops, or past breakAfter, such as 4 days for closes on trading days; references draw thresholds and target bands, and mark events and periods on the x axis; a comparison series, such as a benchmark, draws quieter, and difference shades the lead between two lines; curve="step" holds values sampled on change; yScale="log" spans orders of magnitude. In a dashboard card, density="compact" keeps the plot, legend and floating values; for a trend on a card, minimal leaves the marks alone and extremes labels the period\'s high and low. Pass data as an immutable array that the caller owns.',
  avoid: [
    "Don't mix units on one axis. Use separate charts instead.",
    "Don't draw parts of a whole as lines, such as tokens by kind. Use AreaChart or BarChart with stacked, which shows their total.",
    "Don't plot one measure against another here. Use ScatterChart, one point per item.",
    'Don\'t put more than seven series on one chart where you can choose: keep the largest, sum the rest as Other, or split the chart. A monitoring view that must compare more, such as tokens per project, keeps every line on the plot, takes the twelve categorical colors, or the twenty-four of palette="extended" when there are more than twelve, and folds the legend with legendLimit.',
    "Don't turn dashes off to unclutter a crowded plot: past 40 points the plot already drops its markers to do that, and a chart drawn solid keeps them, which adds ink. Turn them off for a line style; split the chart when the plot is crowded.",
    "Don't replace missing values with 0. Pass null instead: the chart treats null, undefined, NaN, and Infinity as missing and doesn't connect lines across them.",
    'Don\'t expect a second value axis. Put a second unit on a second chart, and values orders of magnitude apart on yScale="log".',
    "Don't expect smoothed curves. Lines are linear or steps, so the chart doesn't invent extremes that weren't measured.",
    "Don't expect the chart to show loading, error, or retry states. Build them in the product screen.",
    "Don't expect the description prop to be an automatically inferred analysis. It holds the caller's factual summary.",
  ],
  keyboard: chartKeyboard('line'),
  anatomy: chartAnatomy,
  tokens: chartTokens,
  code: `// Needs recharts: npm install recharts
import { LineChart, type ChartDatum } from '@surflane/ui/chart'

const data: ChartDatum[] = [
  { id: 'day-1', label: 'October 1', values: { workspace: 12, inventory: 8 } },
  {
    id: 'day-2',
    label: 'October 2',
    values: { workspace: 18, inventory: null },
  },
  { id: 'day-3', label: 'October 3', values: { workspace: 14, inventory: 10 } },
]
<LineChart
  title='Pipeline activity'
  description='Workspace records 12, 18 and 14 runs; Inventory has no report on October 2.'
  xLabel='Reporting day'
  yLabel='Pipeline run count'
  unit='runs'
  data={data}
  series={[
    { key: 'workspace', label: 'Workspace' },
    { key: 'inventory', label: 'Inventory' },
  ]}
/>

// Controlled selection: update only when the owner accepts the change.
// hiddenSeries={hidden} onHiddenSeriesChange={setHidden}
// Render loading/error/retry in the owning product before the chart.`,
  props: chartProps('line', [
    [
      'includeZero',
      'keeps 0 on the value axis; turn it off for values far from zero, such as prices, so the line takes the height',
      'true',
    ],
    [
      'yScale',
      'linear | log: log spans orders of magnitude; zero and negative values stay off the plot and in the table',
      'linear',
    ],
    ['curve', 'linear | step: step holds each value until the next', 'linear'],
    [
      'breakAfter',
      'on a time axis, the longest wait between rows a line runs across, in ms; past it the line breaks. For closes on trading days, 4 days carries a line over weekends and a holiday; a missing value still breaks it',
      'twice the usual interval',
    ],
    [
      'dashes',
      'false draws every line solid and leaves the markers to tell the series apart; a plan keeps its dash, which is what makes it a plan',
      'true',
    ],
    [
      'difference',
      '{series, against, above, below}: shades between two series in the trend-up color where series is above and trend-down where it is below; the legend names both sides and inspecting a row says the side and the size',
      '—',
    ],
  ]),
}
