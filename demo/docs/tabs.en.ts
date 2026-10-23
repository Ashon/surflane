import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    'Switch between related panels in the same context. The selected tab shows as a full rounded surface. Set Panel.keepMounted to preserve input.',
  avoid:
    "Don't fake navigation between separate pages with tab state. Use links instead. Don't load slow content on arrow-key focus. Keep the default manual activation instead.",
  keyboard:
    "Tab moves focus to the active tab. Arrow keys, Home, and End move focus between tabs. In the default manual mode, Enter or Space activates the focused tab. With List.activateOnFocus=true, a tab activates when it receives focus. Disabled tabs receive focus but don't activate.",
  anatomy: 'Tabs.Root → List(Tab + Indicator) + value-matched Panels',
  tokens: [
    '--surface',
    '--canvas',
    '--control-height',
    '--control-radius',
    '--interaction-focus',
  ],
  code: `import { Tabs } from '@surflane/ui'

<Tabs.Root defaultValue='overview'>
  <Tabs.List aria-label='Deployment sections'>
    <Tabs.Tab value='overview'>Overview</Tabs.Tab>
    <Tabs.Tab value='logs'>Logs</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value='overview' keepMounted>
    Overview details
  </Tabs.Panel>
  <Tabs.Panel value='logs' keepMounted>
    Build logs
  </Tabs.Panel>
</Tabs.Root>`,
  props: [
    [
      'Root.value / defaultValue / onValueChange',
      'selected tab value and change callback',
      '— / 0 / —',
    ],
    ['Root.orientation', 'horizontal | vertical', 'horizontal'],
    ['List.activateOnFocus', 'activate tabs on arrow-key focus', 'false'],
    ['Panel.keepMounted', 'keep inactive panels in the DOM', 'false'],
  ],
}
