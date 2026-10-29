import type { ComponentDoc } from '../componentDocs'
const controls = [
  '--surf-control-height',
  '--surf-control-radius',
  '--surf-interaction-focus',
  '--surf-control-background',
]
export const doc: ComponentDoc = {
  usage:
    'Enter short, single-line text. Keep the label visible after the user types.',
  avoid:
    "Don't use the placeholder as the only label. Add a visible label instead. Describe errors in text associated with the input.",
  keyboard:
    'Tab moves focus. Native text editing and Korean IME input keep working.',
  anatomy:
    'Field.Root → Field.Label + Input wrapper(leadingIcon? + input) + Field.Description? / Field.Error',
  tokens: controls,
  code: `import { Field, Input } from '@surflane/ui'

<Field.Root>
  <Field.Label>Project name</Field.Label>
  <Input name='project' placeholder='Enter a name' />
</Field.Root>
<Field.Root invalid>
  <Field.Label>Project ID</Field.Label>
  <Input name='project-id' aria-invalid='true' />
  <Field.Error match>Check the project ID.</Field.Error>
</Field.Root>`,
  props: [
    ['leadingIcon', 'ReactNode', '—'],
    ['wrapperClassName', 'string', '—'],
    ['name / required / readOnly / disabled', 'native input props', '—'],
  ],
}
