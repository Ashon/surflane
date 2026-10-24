import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Confirm a lightweight action, such as resetting filters, before it runs. Compose it from Popover and Button. There's no standalone export.",
  avoid:
    "Don't use it for high-risk actions, such as deleting or changing permissions. Use AlertDialog instead.",
  keyboard: 'Focus, Escape, and focus restoration work as in Popover.',
  anatomy: 'Popover + description + cancel / confirm Button',
  tokens: ['--surf-menu-border', '--surf-shadow-float'],
  code: `import { Popover, Button } from '@surflane/ui'

// Compose Popover + Button; no standalone Confirm export.
<Popover.Root open={open} onOpenChange={setOpen}>
  <Popover.Trigger render={<Button />}>Reset filters</Popover.Trigger>
  <Popover.Content>
    <Popover.Title>Reset filters?</Popover.Title>
    <Popover.Description>Restore default filters.</Popover.Description>
    <Popover.Close render={<Button />}>Keep filters</Popover.Close>
    <Button onClick={reset}>Reset filters</Button>
  </Popover.Content>
</Popover.Root>`,
  props: [['Composition', 'Popover + Button', 'no standalone export']],
}
