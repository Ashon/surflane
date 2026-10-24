import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Group inputs on one topic under a Legend. The group's disabled state passes to child Fields.",
  avoid:
    "Don't use it just to draw a visual border. Use a Card instead. Keep an individual label on each input.",
  keyboard:
    'Tab follows the natural order of the inputs. A disabled group is excluded from interaction and form submission. Legend gives the group its accessible name.',
  anatomy: 'Fieldset.Root → Legend + related Fields',
  tokens: ['--surf-space-4', '--surf-type-subsection-size', '--surf-ink'],
  code: `import { Fieldset, Field } from '@surflane/ui'

<Fieldset.Root disabled={disabled}>
  <Fieldset.Legend>Deployment target</Fieldset.Legend>
  <Field.Root name='project'>
    <Field.Label>Project name</Field.Label>
    <Field.Control />
  </Field.Root>
</Fieldset.Root>`,
  props: [
    ['Root.disabled', 'boolean; cascades to nested fields', 'false'],
    ['Legend', 'accessible group name', 'required content'],
  ],
}
