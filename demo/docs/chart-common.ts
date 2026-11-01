import type { ComponentDoc } from '../componentDocs'

type Row = ComponentDoc['props'][number]
type Marks = 'line' | 'area' | 'bar'
// LineChart, AreaChart and BarChart are one engine: they share the keyboard, the
// readout, the data table and most props. Each page adds what its marks read.
export const chartAnatomy =
  'figure → figcaption(title + summary) + legend toggle buttons + named axes + responsive Recharts ComposedChart + persistent inline value readout + details → Table.Container → full data table'
export const chartTokens = [
  '--surf-chart-line-width',
  '--surf-chart-line-quiet-ratio',
  '--surf-chart-series-1',
  '--surf-chart-series-2',
  '--surf-chart-series-3',
  '--surf-chart-category-1',
  '--surf-ink-muted',
  '--surf-line',
  '--surf-canvas',
  '--surf-surface',
  '--surf-interaction-hover-bg',
  '--surf-interaction-focus',
  '--surf-space-3',
  '--surf-radius-md',
]
export const chartKeyboard = (marks: Marks): string[] => [
  'Tab reaches the legend buttons, the chart, and the data table toggle.',
  'With the chart focused, Left and Right move between data points.',
  "Enter or Space on a legend button shows or hides its series, and aria-pressed reports whether it's shown. Hidden series stay in the data table.",
  'View data table is a native details element that Enter or Space expands. Long tables scroll on both axes. Each series header names the unit once, and the cells hold full values aligned at the end.',
  'Escape clears the details, and an arrow key shows them again.',
  "Pointer, touch and the arrow keys show the point's values in a box beside it, which turns to whichever side has more room and stays inside the plot. The same values fill the details region below the plot, a polite live region that never covers the marks; the box itself stays out of the accessibility tree.",
  ...(marks === 'bar'
    ? [
        'Fill patterns tell the bars apart beyond color, and the legend draws the same ones. They remain in high contrast mode.',
      ]
    : [
        `Circle, square, and triangle markers and line patterns${marks === 'area' ? ', with the fill patterns under them,' : ''} tell series apart beyond color. They remain in high contrast mode.`,
        'With dashes off the markers carry that difference alone, so a chart drawn solid keeps its markers even past 40 points, where a chart drawn with dashes drops them.',
        'Above 40 points, the plot omits markers to reduce overlap. Legend markers, line patterns, details, and the table remain.',
      ]),
  'Animation is off by default.',
  'Test real assistive technology usability separately after product integration.',
]
const planRow: Record<Marks, string> = {
  line: 'the key of the series this one plans, such as a target beside its actual: its color and marker, dashed, at the quiet line weight and under it, while the series it plans stays solid',
  area: 'the key of the series this one plans, such as a target beside its actual: a level to reach, not an amount, so its dashed line alone, in its color and marker, at the quiet line weight, under it and out of a stack',
  bar: "the key of the series this one plans, such as a target beside its actual: a level to reach, not an amount, so an unfilled dashed bar in its color beside it, at the quiet line weight, in the legend's order and out of a stack",
}
const comparisonRow: Record<Marks, string> = {
  line: 'a series the others are read against, such as a benchmark: muted ink at the quiet line weight, drawn under the others',
  area: 'a series the others are read against, such as a benchmark: muted ink at the quiet line weight, drawn under the others and out of a stack',
  bar: "a series the others are read against, such as last year's: muted ink, in the legend's order and out of a stack",
}
/** The rows every chart page lists, in the table's order; extra rows for the page's
 * own marks go in after the series. */
export const chartProps = (marks: Marks, own: Row[]): Row[] => [
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
  ['series[].comparison', comparisonRow[marks], 'false'],
  ['series[].planOf', planRow[marks], '—'],
  ...own,
  [
    'height',
    "finite pixel height, minimum 200 (120 when compact); 'fill' takes the container's height, as in a stretched dashboard panel, and gives the plot what the caption and legend leave, never less than the default",
    '280 / 180 compact',
  ],
  [
    'xScale / data[].time',
    marks === 'bar'
      ? 'category spaces rows evenly by label; time places them by time (ms or Date), each bar centered on its own, and ticks on round times'
      : 'category spaces rows evenly by label; time places them by time (ms or Date), ticks on round times and breaks the line across a gap of more than twice the usual interval',
    'category',
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
    'minimal',
    "the marks alone, for a trend on a card: no axes, grid, legend or axis names on screen; the readout, keyboard, references and data table stay, the axis names stay for assistive technology, and the table's disclosure shows only when keyboard focus reaches it",
    'false',
  ],
  [
    'extremes',
    "labels the highest and lowest value of the first shown series with its value and its row's label, such as a period's high and low",
    'false',
  ],
  [
    'legendPosition / legendLimit',
    'top | bottom / how many entries the legend shows, series first, then references and the difference\'s sides, before folding the rest behind a "+N" popover; auto shows as many as fit one line',
    'top / every series',
  ],
  [
    'palette',
    marks === 'bar'
      ? 'neutral | categorical | extended: ink with fill patterns, twelve hues for categories, or twenty-four, the same twelve a step along the ramp, for more series than twelve; the patterns step once past every twelve, so two series a dozen apart never share their color and pattern at once'
      : 'neutral | categorical | extended: ink with dashes and markers, twelve hues for categories, or twenty-four, the same twelve a step along the ramp, for more series than twelve; the dashes and markers step once past every twelve, so two series a dozen apart never share their color, dash and shape at once',
    'neutral',
  ],
  ...(marks === 'bar'
    ? ([
        [
          '--surf-chart-line-width / --surf-chart-line-quiet-ratio',
          "tokens: a plan's dashed outline draws at their product, the weight of a plan's line on the other charts",
          '2 / 0.75',
        ],
      ] satisfies Row[])
    : ([
        [
          '--surf-chart-line-width',
          "token: a series line's weight, which the legend's swatches follow; set it on :root for every chart, or on one chart",
          '2',
        ],
        [
          '--surf-chart-line-quiet-ratio',
          'token: the share of that weight a comparison or a plan draws at; 1 gives every line on the plot the same weight',
          '0.75',
        ],
      ] satisfies Row[])),
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
    'text the chart shows or announces: missing, empty, noSeries, showAll, keyboardHelp, values, viewTable, table, tableCaption, inspectHint, noRows, legend(title), series(label), moreSeries(count), moreEntries(count), total, high, low',
    'English',
  ],
  [
    'ChartSeriesMark',
    `{type, index, palette, color, comparison, plan, dashes}: a series' swatch as the legend draws it, for a key of your own; give it type='${marks}' and the flags of the series it keys`,
    'line / neutral / dashed',
  ],
  [
    'ref / className / figure props',
    'root HTMLElement ref and native figure attributes',
    'optional',
  ],
  [
    'Chart',
    "deprecated: LineChart, AreaChart and BarChart in one, picked by type='line' | 'bar' | 'area', taking every chart's props whether its marks read them or not",
    '—',
  ],
]
