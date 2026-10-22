import type { ComponentDoc } from './componentDocs'
export const chartDocs: Record<string, ComponentDoc> = {
  chart: {
    usage:
      'Compare numeric trends in one unit as a line, bar, or area chart. Always provide a title, a factual summary, and axis names with units. Series default to brand and neutral fills and lines. Pass data as an immutable array that the caller owns.',
    avoid: [
      "Don't mix units on one axis. Use separate charts instead.",
      "Don't overlay many series on one screen. Use filters or separate charts instead.",
      "Don't replace missing values with 0. Pass null instead: the chart treats null, undefined, NaN, and Infinity as missing and doesn't connect lines across them.",
      "Don't expect a cropped y-axis. It always includes 0 and keeps negative values.",
      "Don't expect smoothed curves. Lines are linear, so the chart doesn't invent extremes that weren't measured.",
      "Don't expect the chart to show loading, error, or retry states. Build them in the product screen.",
      "Don't expect the description prop to be an automatically inferred analysis. It holds the caller's factual summary.",
    ],
    keyboard: [
      'Tab reaches the legend buttons, the chart, and the data table toggle.',
      'With the chart focused, Left and Right move between data points.',
      "Enter or Space on a legend button shows or hides its series, and aria-pressed reports whether it's shown. Hidden series stay in the data table.",
      'View data table is a native details element that Enter or Space expands. Long tables scroll on both axes and include headers, units, and full values.',
      'Escape clears the details, and an arrow key shows them again.',
      "Pointer and touch update the same details region. It's a fixed-position, polite live region that doesn't cover the marks.",
      'Circle, square, and triangle markers, line patterns, and bar fill patterns distinguish series beyond color. They remain in high contrast mode.',
      'Above 40 points, the plot omits markers to reduce overlap. Legend markers, line patterns, details, and the table remain.',
      'Animation is off by default.',
      'Test real assistive technology usability separately after product integration.',
    ],
    anatomy:
      'figure → figcaption(title + summary) + legend toggle buttons + named axes + responsive Recharts ComposedChart + persistent inline value readout + details → Table.Container → full data table',
    tokens: [
      '--chart-series-1',
      '--chart-series-2',
      '--chart-series-3',
      '--ink-muted',
      '--line',
      '--canvas',
      '--surface',
      '--interaction-hover-bg',
      '--interaction-focus',
      '--space-3',
      '--radius-md',
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
      ['series', 'readonly {key, label}[]; unique non-empty key', 'required'],
      ['type', 'line | bar | area', 'line'],
      ['height', 'finite pixel height, minimum 200', '280'],
      [
        'locale / formatValue',
        'Intl number locale / optional finite-value formatter (unit appended)',
        'en-US / maximum 2 fractional digits',
      ],
      [
        'hiddenSeries / defaultHiddenSeries / onHiddenSeriesChange',
        'controlled or uncontrolled hidden keys; callback requests the next keys',
        'uncontrolled / []',
      ],
      [
        'missingLabel / emptyLabel',
        'text alternatives for missing or non-finite values, and for no numeric measurements',
        'Not available / No numeric measurements to display.',
      ],
      [
        'ref / className / figure props',
        'root HTMLElement ref and native figure attributes',
        'optional',
      ],
    ],
  },
}
