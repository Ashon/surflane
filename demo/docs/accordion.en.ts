import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Expand related details under their headings. In single-item mode, the closing and opening panels swap with a height and fade transition. The closing panel turns inert, so its inputs can't be used mid-transition. With reduced motion, panels switch instantly.",
  avoid:
    "Don't hide all essential information in collapsed panels. Keep key facts visible outside them. Don't nest buttons or links inside a Trigger. Place them in the Panel instead.",
  keyboard:
    'Tab and Shift+Tab move through each Trigger and the inputs in open panels. Enter or Space expands a panel. Base UI 1.9 dropped arrow-key roving focus for Accordion.',
  anatomy: 'Root → Item → Header(Trigger + SVG) + Panel(content body)',
  tokens: [
    '--surf-surface',
    '--surf-space-4',
    '--surf-control-height',
    '--surf-motion-reveal',
    '--surf-interaction-focus',
  ],
  code: `import { Accordion } from '@surflane/ui'

<Accordion.Root defaultValue={['identity']}>
  <Accordion.Item value='identity'>
    <Accordion.Header>
      <Accordion.Trigger>Identity controls</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>Deployment details</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>`,
  props: [
    ['Root.value / defaultValue', 'array of expanded item values', '—'],
    [
      'Root.multiple / keepMounted',
      'allow several expanded items / keep closed content mounted',
      'false',
    ],
    [
      'Trigger.indicator',
      'custom ReactNode; false hides default SVG',
      'SVG chevron',
    ],
  ],
}
