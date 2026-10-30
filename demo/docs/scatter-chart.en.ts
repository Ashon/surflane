import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Plot two measures per item, one point each, such as holdings by quality and news sentiment or models by throughput and latency. Give a title, a factual summary, and both axis names, with units where the values have them. groups tell points apart by the chart's category hues and by marker, such as aligned and diverged; a group's color can be one of your own. Without groups every point is one ink. references draw a line at x or at y, such as a midpoint or a target; one on each axis splits the plot, and quadrants names the four parts in their corners. xDomain and yDomain fix a known scale, such as 0 to 10 for a score; without them the axes take round values around the points and the lines.",
  avoid: [
    "Don't use ScatterChart for a measure over time. Use Chart.",
    "Don't color a point by its quadrant alone. Give it a group, so the marker says it too, or let the quadrant names say where it is.",
    "Don't expect the description prop to be an automatically inferred analysis. It holds the caller's factual summary.",
  ],
  keyboard: [
    'Tab reaches the plot and the data table toggle.',
    'With the plot focused, Left and Right step through the points from left to right, lower first where two share an x; Home and End reach the first and last. Escape clears the details.',
    'Pointer, touch and the arrow keys ring the point and show its name and values in a box beside it. The same values fill the details region below the plot, a polite live region; the box stays out of the accessibility tree.',
    "The readout and the table name each point's group and quadrant. Points without both values stay out of the plot and in the table.",
    'Circle, square and triangle markers tell groups apart beyond color, and remain in high contrast mode.',
  ],
  anatomy:
    'figure → figcaption(title + summary) + legend (groups, references) + named axes + focusable plot (Recharts ScatterChart) + persistent inline value readout + details → Table.Container → table of every point',
  tokens: [
    '--surf-chart-series-1',
    '--surf-chart-category-1',
    '--surf-chart-category-2',
    '--surf-ink-muted',
    '--surf-line',
    '--surf-interaction-focus',
    '--surf-type-caption-size',
  ],
  code: `import { ScatterChart } from '@surflane/ui/scatter-chart'

<ScatterChart
  title='Quality against news sentiment'
  description='Each holding by its quality score and its news sentiment, both out of 10.'
  data={[
    { id: 'northwind', label: 'Northwind Chips', x: 8.2, y: 7.1, group: 'aligned' },
    { id: 'atlas', label: 'Atlas Telecom', x: 6.1, y: 3.8, group: 'diverged' },
  ]}
  groups={[
    { key: 'aligned', label: 'Aligned' },
    { key: 'diverged', label: 'Diverged' },
  ]}
  xLabel='Quality score'
  yLabel='News sentiment'
  xDomain={[0, 10]}
  yDomain={[0, 10]}
  references={[
    { x: 5, label: 'Quality midpoint' },
    { y: 5, label: 'Sentiment midpoint' },
  ]}
  quadrants={{ topRight: 'Strong and liked', bottomRight: 'Strong but disliked' }}
/>`,
  props: [
    ['title / description', 'names the chart / a factual summary', 'required'],
    [
      'data',
      'readonly {id, label, x, y, group?}[]; a point without both values stays in the table',
      'required',
    ],
    [
      'groups',
      'readonly {key, label, color?}[]: color and marker per group',
      'one ink',
    ],
    ['xLabel / yLabel', 'axis names', 'required'],
    ['xUnit / yUnit', 'units after each value and in the axis names', '—'],
    [
      'xDomain / yDomain',
      'the axis extent, such as [0, 10]',
      'round values around the points and lines',
    ],
    [
      'references',
      'readonly ({x, label, tone?} | {y, label, tone?})[]: lines across the plot, named in the legend',
      '[]',
    ],
    [
      'quadrants',
      '{topLeft?, topRight?, bottomLeft?, bottomRight?}: names for the parts the first x and y lines make',
      '—',
    ],
    ['height', 'plot height in px', '280, or 180 when compact'],
    ['density', 'default | compact', 'SizeProvider density'],
    [
      'formatX / formatY / locale',
      'writes the values on each axis / Intl number locale',
      'Intl.NumberFormat',
    ],
    [
      'labels',
      'missing, empty, keyboardHelp, values(title), viewTable, table(title), tableCaption, inspectHint, noRows, legend(title), group, quadrant',
      'English',
    ],
  ],
}
