import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Show a key figure on a dashboard: what it measures, its value, how it moved and what it covers. Change takes the change as a number, shows its sign and an arrow, and colors it by direction with the trend tokens. Format values with formatNumber, formatCurrency or formatPercent, so every screen writes numbers the same way.',
  avoid: [
    "Don't show direction with color alone. Change keeps the sign and the arrow, so leave them in.",
    "Don't put a long sentence in Caption. Name the period or the comparison, such as 'vs. yesterday's close'.",
    "Don't use Stat for values people need to compare across rows. Use a Table with numeric cells instead.",
  ],
  keyboard:
    'Stat is static text: a description list in which the label names the value. Nothing enters the Tab order. A link or button you add keeps its own focus.',
  anatomy: 'Root(dl) → Label(dt) + Value(dd) + Change(dd) + Caption(dd)',
  tokens: [
    '--type-metric-size',
    '--trend-up-fg',
    '--trend-down-fg',
    '--trend-flat-fg',
    '--ink-muted',
  ],
  code: `import { Stat, formatCurrency } from '@surflane/ui'

<Stat.Root>
  <Stat.Label>Portfolio value</Stat.Label>
  <Stat.Value>
    {formatCurrency(128_450_000, 'KRW', { locale: 'ko-KR' })}
  </Stat.Value>
  <Stat.Change value={0.0123} />
  <Stat.Caption>vs. yesterday's close</Stat.Caption>
</Stat.Root>`,
  props: [
    ['Change.value', 'number; its sign sets the direction', 'required'],
    [
      'Change.format',
      '(value) => ReactNode',
      'signed percentage, such as +1.2%',
    ],
    ['Change.direction', 'up | down | flat', 'from the sign'],
    [
      'Change.lowerIsBetter',
      'swaps the colors for measures where a fall is good',
      'false',
    ],
    ['Root / Label / Value / Caption', 'native dl, dt and dd props', '—'],
  ],
}
