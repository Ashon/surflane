import type { ComponentDoc } from './componentDocs'
export const chartDocs: Record<string, ComponentDoc> = {
  chart: {
    usage:
      'Compares numeric trends in the same unit as line, bar, or area charts. Always provide a title, a factual summary, and axis names with units. By default, series use brand and neutral fills and lines, and circle/square/triangle markers, line patterns, and bar fill patterns distinguish series beyond color. Legend buttons only change which series are shown; hidden series remain in the source data table. Above 40 points, markers are omitted to reduce overlap, while legend markers and line patterns, details, and the table remain. The data is an immutable array owned by the caller.',
    avoid:
      "Don't mix different units on one axis or replace missing values with 0. null, undefined, NaN, and Infinity are normalized to missing values, and lines aren't connected across them. The y-axis always includes 0 and keeps negative values. Linear lines are used so the chart doesn't invent extremes that weren't measured. Instead of overlaying many series on one screen, use filters or separate charts. Build loading, error, and retry states in the product screen; description is a factual summary provided by the caller, not an automatically inferred analysis.",
    keyboard:
      "Tab reaches the legend buttons, the chart, and the data table toggle. Enter/Space on a legend button toggles a series, and aria-pressed reports whether it's shown. With the chart focused, Left/Right moves between data points. Escape clears the details, and arrow keys show them again. Pointer and touch update the same details region. Details appear in a fixed-position polite live region that doesn't cover the marks. View data table is a native details element that expands with Enter/Space. Long tables have their own horizontal and vertical scrolling and provide headers, units, and full values. Animation is off by default, and markers, line patterns, and fill patterns remain in high contrast mode. Real assistive technology usability is tested separately after product integration.",
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
    code: `import { Chart, type ChartDatum } from '@surflane/ui'

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
        'required string labels, factual summary and a shared unit',
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
        'text alternatives for non-finite/missing values and no numeric measurements',
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
