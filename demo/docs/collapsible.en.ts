import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Expand one group of supplementary information in place. The Trigger and Panel share the same horizontal padding.',
  avoid:
    "Use Accordion for several related sections. Don't expect Escape to close it as it closes a modal. Close it with the Trigger instead.",
  keyboard:
    'Tab to the Trigger. Enter or Space opens and closes the Panel. With keepMounted, the closed Panel keeps its input state.',
  anatomy: 'Collapsible.Root → Trigger + Panel(content body)',
  tokens: ['--surface', '--space-4', '--motion-reveal', '--interaction-focus'],
  code: `import { Collapsible } from '@surflane/ui'

<Collapsible.Root>
  <Collapsible.Trigger>Technical details</Collapsible.Trigger>
  <Collapsible.Panel keepMounted>Redacted build logs</Collapsible.Panel>
</Collapsible.Root>`,
  props: [
    [
      'Root.open / defaultOpen / onOpenChange',
      'controlled / uncontrolled state',
      '— / false',
    ],
    ['Root.disabled', 'disable the Trigger', 'false'],
    [
      'Panel.keepMounted / hiddenUntilFound',
      'keep state while closed / reveal on browser find',
      'false',
    ],
  ],
}
