// What the package does when used, beyond how it looks: focus moves, the clipboard
// fallback, and the footer and layout props Growth-style consoles need. Checked by
// tests/package/behavior.spec.ts, not by the screenshots.
import {
  AppShell,
  Button,
  CopyButton,
  PageHeader,
  Sheet,
  Stack,
  Table,
  Text,
} from '@surflane/ui'

export function Behavior() {
  return (
    <section data-ssr='behavior'>
      <AppShell.Root layout='workspace' shortcut={false}>
        <AppShell.SkipLink target='behavior-main' />
        <AppShell.Content>
          <main id='behavior-main' tabIndex={-1}>
            <Stack gap='section' className='behavior-sections'>
              <PageHeader
                title='Channels'
                headingProps={{ id: 'behavior-title', tabIndex: -1 }}
              />
              <Button
                className='behavior-change-page'
                onClick={() =>
                  document.getElementById('behavior-title')?.focus()
                }
              >
                Change page
              </Button>
              <CopyButton value='https://example.test/post/1' />
              <Table.Root>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell nowrap className='behavior-date'>
                      Not recorded
                    </Table.Cell>
                    <Table.Cell>
                      A long title that wraps across lines in a narrow column
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
              <Sheet.Root>
                <Sheet.Trigger render={<Button variant='outline' />}>
                  Edit channel
                </Sheet.Trigger>
                <Sheet.Content closeLabel='Close channel'>
                  <Sheet.Header>
                    <Sheet.Title>Channel</Sheet.Title>
                  </Sheet.Header>
                  <Sheet.Body label='Channel details'>
                    {Array.from({ length: 40 }, (_, i) => (
                      <Text key={i}>Detail {i + 1}</Text>
                    ))}
                  </Sheet.Body>
                  <Sheet.Footer
                    start={<Button variant='destructive'>Delete</Button>}
                  >
                    <Sheet.Close render={<Button />}>Save</Sheet.Close>
                  </Sheet.Footer>
                </Sheet.Content>
              </Sheet.Root>
            </Stack>
          </main>
        </AppShell.Content>
      </AppShell.Root>
    </section>
  )
}
