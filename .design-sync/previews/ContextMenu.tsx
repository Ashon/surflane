import * as React from 'react'
import {
  Button,
  ContextMenu,
  Icon,
  Inline,
  Menu,
  Stack,
  Surface,
  Text,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// ContextMenu opens at the pointer. The preview right-clicks inside the target
// on mount, so the menu renders open where a user's click would put it.
function useRightClick(id: string) {
  React.useEffect(() => {
    const target = document.getElementById(id)
    if (!target) return
    const box = target.getBoundingClientRect()
    target.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        button: 2,
        clientX: box.left + box.width * 0.42,
        clientY: box.top + box.height * 0.3,
      }),
    )
  }, [id])
}

const lines = [
  '14:05:12  WARN  upstream timeout after 3000 ms  req=7f2c',
  '14:05:12  ERROR POST /v2/charges 502  req=7f2c',
  '14:05:13  INFO  retry 1/3 scheduled  req=7f2c',
  '14:05:16  INFO  POST /v2/charges 200  req=7f2c',
]

// The page: a log panel (non-interactive content, the right-click target) and
// a visible Menu with the same actions for keyboard and touch users.
const LogPage = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => (
  <Surface surface='canvas' padding={6}>
    <Stack gap={3}>
      <Inline gap={4} justify='between'>
        <Stack gap={1}>
          <Text weight='medium'>Build 418 logs</Text>
          <Text variant='caption' color='secondary'>
            checkout-api · production
          </Text>
        </Stack>
        <Menu.Root>
          <Menu.Trigger
            render={<Button variant='ghost' size='icon' />}
            aria-label='Log actions'
          >
            <Icon name='more' />
          </Menu.Trigger>
          <Menu.Content aria-label='Log actions'>
            <Menu.Item>Open logs</Menu.Item>
            <Menu.Item>Copy request ID</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </Inline>
      <ContextMenu.Root>
        <ContextMenu.Trigger id={id}>
          <Surface padding={4}>
            <Stack gap={1}>
              {lines.map((line) => (
                <Text key={line} variant='mono'>
                  {line}
                </Text>
              ))}
            </Stack>
          </Surface>
        </ContextMenu.Trigger>
        {children}
      </ContextMenu.Root>
    </Stack>
  </Surface>
)

export const Default = () => {
  useRightClick('log-default')
  return (
    <LogPage id='log-default'>
      <ContextMenu.Portal>
        <ContextMenu.Content aria-label='Log actions' collisionPadding={12}>
          <ContextMenu.Item>Open logs</ContextMenu.Item>
          <ContextMenu.Item>Copy request ID</ContextMenu.Item>
          <ContextMenu.CheckboxItem defaultChecked>
            <ContextMenu.CheckboxItemIndicator />
            Pin logs
          </ContextMenu.CheckboxItem>
          <ContextMenu.Separator />
          <ContextMenu.Item disabled>Delete logs</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </LogPage>
  )
}

export const Grouped = () => {
  useRightClick('log-grouped')
  return (
    <LogPage id='log-grouped'>
      <ContextMenu.Portal>
        <ContextMenu.Content aria-label='Log view' collisionPadding={12}>
          <ContextMenu.Group>
            <ContextMenu.GroupLabel>Show level</ContextMenu.GroupLabel>
            <ContextMenu.RadioGroup defaultValue='warn'>
              <ContextMenu.RadioItem value='all'>
                <ContextMenu.RadioItemIndicator />
                All
              </ContextMenu.RadioItem>
              <ContextMenu.RadioItem value='warn'>
                <ContextMenu.RadioItemIndicator />
                Warnings and errors
              </ContextMenu.RadioItem>
              <ContextMenu.RadioItem value='error'>
                <ContextMenu.RadioItemIndicator />
                Errors only
              </ContextMenu.RadioItem>
            </ContextMenu.RadioGroup>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Item>Copy as JSON</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </LogPage>
  )
}
