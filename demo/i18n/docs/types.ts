import type { DocText } from '../../componentDocs'

// Korean overrides for one component or pattern's docs. Fields left out stay in
// English; props are keyed by the prop name in the English table's first column.
export type DocKo = {
  usage?: DocText
  avoid?: DocText
  keyboard?: DocText
  props?: Record<string, string>
}
