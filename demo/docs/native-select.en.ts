import type { ComponentDoc } from '../componentDocs'
const controls = [
  '--surf-control-height',
  '--surf-control-radius',
  '--surf-interaction-focus',
  '--surf-control-background',
]
export const doc: ComponentDoc = {
  usage:
    'Migrate existing option and optgroup markup incrementally with this compatibility adapter. Use Select for new screens.',
  avoid:
    "Don't assume the DOM API of the browser's native select popup. Use the value and onChange adapter instead.",
  keyboard:
    'Keys work as in the shared Select. A hidden input submits the value with the form.',
  anatomy: 'HTML option children → adapter → shared Select',
  tokens: controls,
  code: `import { NativeSelect } from '@surflane/ui'

<NativeSelect aria-label='Environment' name='environment'>
  <option value='staging'>Staging</option>
  <option value='production'>Production</option>
</NativeSelect>`,
  props: [
    ['children', 'option / optgroup elements', '—'],
    ['value / onChange', 'native-style change adapter', '—'],
  ],
}
