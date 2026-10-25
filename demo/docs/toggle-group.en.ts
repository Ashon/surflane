import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Group related display modes or filters. At most one item is pressed, or several with multiple=true. The value is always an array, even in single mode.',
  avoid:
    'Use RadioGroup when a form requires exactly one choice. Let aria-pressed carry the pressed state, not aria-selected. Set orientation to match the visual layout.',
  anatomy: 'named ToggleGroup(role=group) → Toggle(value) items',
  keyboard:
    'The group is a single Tab stop. Arrow keys, Home, and End only move focus. Enter or Space selects the focused item. Disabled items are skipped. For RTL, set both DirectionProvider and the DOM dir.',
  tokens: [
    '--surf-selected',
    '--surf-control-border',
    '--surf-space-1',
    '--surf-radius-pill',
    '--surf-interaction-focus',
  ],
  code: `import { ToggleGroup, Toggle } from '@surflane/ui'

<ToggleGroup aria-label='Log source' value={source} onValueChange={setSource}>
  <Toggle value='live'>Live</Toggle>
  <Toggle value='simulation'>Simulation</Toggle>
</ToggleGroup>
<ToggleGroup
  multiple
  aria-label='Visible log details'
  defaultValue={['requests']}
>
  <Toggle value='requests'>Requests</Toggle>
  <Toggle value='errors'>Errors</Toggle>
</ToggleGroup>`,
  props: [
    [
      'value / defaultValue',
      'readonly string[]; generic value unions preserved',
      '[]',
    ],
    ['onValueChange', '(values, eventDetails) => void; supports cancel()', '—'],
    ['multiple', 'allow multiple pressed items', 'false'],
    [
      'orientation / loopFocus',
      'horizontal | vertical / cyclic focus',
      'horizontal / true',
    ],
    ['disabled', 'disable all toggles', 'false'],
    [
      'aria-label / aria-labelledby',
      'name the related command group',
      'caller supplied',
    ],
  ],
}
