import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Compare numeric trends in one unit as a line, bar, or area chart. Always provide a title, a factual summary, and axis names with units. Series default to brand and neutral fills and lines, told apart by dashes and markers; pass palette="categorical" when color must separate categories, such as buckets. For values far from zero, such as prices or latency, set includeZero={false}. For monitoring, xScale="time" places rows by data[].time, ticks on round times and breaks a line where sampling stops; references draw thresholds and target bands, and mark events and periods on the x axis; a comparison series, such as a benchmark, draws quieter, and difference shades the lead between two lines; stacked shows a total; curve="step" holds values sampled on change; yScale="log" spans orders of magnitude. In a dashboard card, density="compact" keeps the plot, legend and floating values. Pass data as an immutable array that the caller owns.',
  avoid: [
    "Don't mix units on one axis. Use separate charts instead.",
    "Don't put more than seven series on one chart where you can choose: keep the largest, sum the rest as Other, or split the chart. A monitoring view that must compare more, such as tokens per project, keeps every line on the plot, takes the twelve categorical colors and folds the legend with legendLimit.",
    "Don't replace missing values with 0. Pass null instead: the chart treats null, undefined, NaN, and Infinity as missing and doesn't connect lines across them.",
    'Don\'t expect a second value axis. Put a second unit on a second chart, and values orders of magnitude apart on yScale="log".',
    "Don't expect smoothed curves. Lines are linear or steps, so the chart doesn't invent extremes that weren't measured.",
    "Don't expect the chart to show loading, error, or retry states. Build them in the product screen.",
    "Don't expect the description prop to be an automatically inferred analysis. It holds the caller's factual summary.",
  ],
  keyboard: [
    'Tab reaches the legend buttons, the chart, and the data table toggle.',
    'With the chart focused, Left and Right move between data points.',
    "Enter or Space on a legend button shows or hides its series, and aria-pressed reports whether it's shown. Hidden series stay in the data table.",
    'View data table is a native details element that Enter or Space expands. Long tables scroll on both axes. Each series header names the unit once, and the cells hold full values aligned at the end.',
    'Escape clears the details, and an arrow key shows them again.',
    "Pointer, touch and the arrow keys show the point's values in a box beside it, which turns to whichever side has more room and stays inside the plot. The same values fill the details region below the plot, a polite live region that never covers the marks; the box itself stays out of the accessibility tree.",
    'Circle, square, and triangle markers, line patterns, and bar fill patterns distinguish series beyond color. They remain in high contrast mode.',
    'Above 40 points, the plot omits markers to reduce overlap. Legend markers, line patterns, details, and the table remain.',
    'Animation is off by default.',
    'Test real assistive technology usability separately after product integration.',
  ],
  anatomy:
    'figure → figcaption(title + summary) + legend toggle buttons + named axes + responsive Recharts ComposedChart + persistent inline value readout + details → Table.Container → full data table',
  tokens: [
    '--surf-chart-series-1',
    '--surf-chart-series-2',
    '--surf-chart-series-3',
    '--surf-ink-muted',
    '--surf-line',
    '--surf-canvas',
    '--surf-surface',
    '--surf-interaction-hover-bg',
    '--surf-interaction-focus',
    '--surf-space-3',
    '--surf-radius-md',
  ],
  code: `// Needs recharts: npm install recharts
import { Chart, type ChartDatum } from '@surflane/ui/chart'

const data: ChartDatum[] = [
  { id: 'day-1', label: 'October 1', values: { workspace: 12, inventory: 8 } },
  {
    id: 'day-2',
    label: 'October 2',
    values: { workspace: 18, inventory: null },
  },
  { id: 'day-3', label: 'October 3', values: { workspace: 14, inventory: 10 } },
]
<Chart
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
  type='line'
/>

// Controlled selection: update only when the owner accepts the change.
// hiddenSeries={hidden} onHiddenSeriesChange={setHidden}
// Render loading/error/retry in the owning product before the chart.`,
  props: [
    [
      'title / description / xLabel / yLabel / unit',
      'required string labels, a factual summary, and a shared unit',
      'required',
    ],
    [
      'data',
      'readonly {id, label, values: Record<seriesKey, number | null | undefined>}[]; unique non-empty id',
      'required',
    ],
    [
      'series',
      "readonly {key, label, color?}[]; unique non-empty key; color replaces the palette's for one series",
      'required',
    ],
    ['type', 'line | bar | area', 'line'],
    [
      'height',
      "finite pixel height, minimum 200 (120 when compact); 'fill' takes the container's height, as in a stretched dashboard panel, and gives the plot what the caption and legend leave, never less than the default",
      '280 / 180 compact',
    ],
    [
      'xScale / data[].time',
      'category spaces rows evenly by label; time places them by time (ms or Date), ticks on round times and breaks lines across a gap of more than twice the usual interval',
      'category',
    ],
    [
      'yScale',
      'linear | log: log spans orders of magnitude; zero and negative values stay off the plot and in the table',
      'linear',
    ],
    ['curve', 'linear | step: step holds each value until the next', 'linear'],
    [
      'stacked',
      'stacks bar and area series; the readout adds their total',
      'false',
    ],
    [
      'series[].comparison',
      'a series the others are read against, such as a benchmark: thinner, muted ink, drawn under the others',
      'false',
    ],
    [
      'series[].planOf',
      'the key of the series this one plans, such as a target beside its actual: its color and marker, dashed, thinner and under it, while the series it plans stays solid',
      '—',
    ],
    [
      'difference',
      '{series, against, above, below}: shades a line chart between two series in the trend-up color where series is above and trend-down where it is below; the legend names both sides and inspecting a row says the side and the size. gap is its earlier name, deprecated',
      '—',
    ],
    [
      'references',
      'readonly ({y, label, tone?} | {from, to, label, tone?} | {x, label, tone?} | {xFrom, xTo, label, tone?})[]: threshold lines and bands the value axis reaches, and event lines and periods at a datum id or a time, in neutral, caution or danger. The legend names each with its value or place; inspecting a row names the events and periods at it',
      '[]',
    ],
    [
      'density',
      'default | compact: compact keeps the plot, legend and floating values; caption, help and readout stay for assistive technology',
      'default',
    ],
    [
      'legendPosition / legendLimit',
      'top | bottom / how many entries the legend shows, series first, then references and the difference\'s sides, before folding the rest behind a "+N" popover; auto shows as many as fit one line',
      'top / every series',
    ],
    [
      'includeZero',
      'keeps 0 on the value axis; bars always start at zero',
      'true',
    ],
    [
      'palette',
      'neutral | categorical: ink with dashes and markers, or twelve hues for categories',
      'neutral',
    ],
    [
      'locale / formatValue',
      "Intl number and date locale, as the number helpers take; pass it when the server renders the chart, so its text matches the browser's / optional finite-value formatter (unit appended)",
      "the runtime's / maximum 2 fractional digits",
    ],
    [
      'hiddenSeries / defaultHiddenSeries / onHiddenSeriesChange',
      'controlled or uncontrolled hidden keys; callback requests the next keys',
      'uncontrolled / []',
    ],
    [
      'labels',
      'text the chart shows or announces: missing, empty, noSeries, showAll, keyboardHelp, values, viewTable, table, tableCaption, inspectHint, noRows, legend(title), series(label), moreSeries(count), moreEntries(count), total',
      'English',
    ],
    [
      'ChartSeriesMark',
      "{type, index, palette, color}: a series' swatch as the legend draws it, for a key of your own",
      'line / neutral',
    ],
    [
      'ref / className / figure props',
      'root HTMLElement ref and native figure attributes',
      'optional',
    ],
  ],
}
