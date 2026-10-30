import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Split one whole into its parts, such as positive, negative and neutral news, a portfolio by market or GPU hours by team. Parts take the chart's category hues in order; parts that read as a direction take tone: up and down use the trend colors, and flat the quiet neutral mark. The legend names each part with its share, its value or both.",
  avoid: [
    "Don't use ProportionBar for values that don't add up to a whole. Rank them with BarList.",
    "Don't split a bar into more parts than a reader can tell apart, about six. Fold the small ones into one part, such as Other.",
    "Don't use ProportionBar for one value against its limit. Use Meter.",
  ],
  keyboard:
    "ProportionBar is a named group holding a list of text: each entry reads its part's name and value. The bar is decoration, so parts never rely on color alone. With legendHidden, the legend stays for assistive technology.",
  anatomy:
    'div(role=group, aria-label) → bar (aria-hidden): segment per part above zero; ul legend → li: swatch (aria-hidden) + name + value',
  tokens: [
    '--surf-chart-category-1',
    '--surf-trend-up-fg',
    '--surf-trend-down-fg',
    '--surf-status-neutral-border',
    '--surf-recessed',
    '--surf-type-caption-size',
  ],
  code: `import { ProportionBar } from '@surflane/ui'

<ProportionBar
  label='News sentiment, 25 articles'
  show='both'
  segments={[
    { id: 'positive', label: 'Positive', value: 12, tone: 'up' },
    { id: 'negative', label: 'Negative', value: 5, tone: 'down' },
    { id: 'neutral', label: 'Neutral', value: 8, tone: 'flat' },
  ]}
/>`,
  props: [
    ['label', 'names the whole', 'required'],
    [
      'segments',
      'readonly {id, label, value, text?, tone?, color?}[]; tone is up | down | flat; color is a color of your own, such as var(--surf-brand-mark)',
      'required',
    ],
    [
      'show',
      'value | share | both: what the legend writes for each part',
      'share',
    ],
    [
      'legendHidden',
      'hides the legend where the text around the bar says it; assistive technology still reads it',
      'false',
    ],
    [
      'formatValue / locale',
      'writes a value that has no text / Intl number locale',
      'formatNumber',
    ],
  ],
}
