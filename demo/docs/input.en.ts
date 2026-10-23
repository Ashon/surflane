import type { ComponentDoc } from '../componentDocs'
const controls = [
  '--control-height',
  '--control-radius',
  '--interaction-focus',
  '--control-background',
]
export const doc: ComponentDoc = {
  usage:
    'Enter short, single-line text. Keep the label visible after the user types.',
  avoid:
    "Don't use the placeholder as the only label. Add a visible label instead. Describe errors in text associated with the input.",
  keyboard:
    'Tab moves focus. Native text editing and Korean IME input keep working.',
  anatomy:
    'label → Input wrapper → leadingIcon(optional) + input, help text / error',
  tokens: controls,
  code: `import { Input } from '@surflane/ui'

<label>
  Project name
  <Input name='project' placeholder='Enter a name' />
</label>
<Input
  aria-label='Project ID'
  aria-invalid='true'
  aria-describedby='project-error'
/>`,
  props: [
    ['leadingIcon', 'ReactNode', '—'],
    ['wrapperClassName', 'string', '—'],
    ['name / required / readOnly / disabled', 'native input props', '—'],
  ],
}
