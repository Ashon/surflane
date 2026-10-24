import * as React from 'react'
import {
  Button,
  Heading,
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

// A page header with its actions menu at the end; the menu aligns to that end.
const Header = ({ children }: { children: React.ReactNode }) => (
  <Surface surface='canvas' padding={6}>
    <Inline gap={4} justify='between'>
      <Stack gap={1}>
        <Heading level={1} size='subsection'>
          checkout-api
        </Heading>
        <Text variant='caption' color='secondary'>
          Production · us-east-1
        </Text>
      </Stack>
      {children}
    </Inline>
  </Surface>
)

export const Default = () => (
  <Header>
    <Menu.Root defaultOpen>
      <Menu.Trigger render={<Button variant='outline' />}>
        Actions
        <Icon name='chevron-down' />
      </Menu.Trigger>
      <Menu.Content aria-label='Service actions'>
        <Menu.Group>
          <Menu.GroupLabel>Deployment</Menu.GroupLabel>
          <Menu.Item>Redeploy build 418</Menu.Item>
          <Menu.Item>Roll back to 417</Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.CheckboxItem defaultChecked>
          <Menu.CheckboxItemIndicator />
          Pin to dashboard
        </Menu.CheckboxItem>
        <Menu.Separator />
        <Menu.Item disabled>Delete service</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  </Header>
)

export const RadioGroup = () => (
  <Header>
    <Menu.Root defaultOpen>
      <Menu.Trigger render={<Button variant='outline' />}>
        <Icon name='sort' />
        Sort
      </Menu.Trigger>
      <Menu.Content aria-label='Sort deployments'>
        <Menu.Group>
          <Menu.GroupLabel>Sort deployments by</Menu.GroupLabel>
          <Menu.RadioGroup defaultValue='newest'>
            <Menu.RadioItem value='newest'>
              <Menu.RadioItemIndicator />
              Newest first
            </Menu.RadioItem>
            <Menu.RadioItem value='oldest'>
              <Menu.RadioItemIndicator />
              Oldest first
            </Menu.RadioItem>
            <Menu.RadioItem value='duration'>
              <Menu.RadioItemIndicator />
              Longest build
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Group>
      </Menu.Content>
    </Menu.Root>
  </Header>
)

// A submenu opens beside its trigger; the trigger sits at the toolbar's start.
export const Submenu = () => (
  <Surface surface='canvas' padding={6}>
    <Inline gap={3}>
      <Menu.Root defaultOpen>
        <Menu.Trigger render={<Button variant='outline' />}>
          Logs
          <Icon name='chevron-down' />
        </Menu.Trigger>
        <Menu.Content aria-label='Log actions' align='start'>
          <Menu.Item>Open in viewer</Menu.Item>
          <Menu.SubmenuRoot defaultOpen>
            <Menu.SubmenuTrigger>Export</Menu.SubmenuTrigger>
            <Menu.Content aria-label='Export format' align='start'>
              <Menu.Item>JSON lines</Menu.Item>
              <Menu.Item>CSV</Menu.Item>
            </Menu.Content>
          </Menu.SubmenuRoot>
          <Menu.Separator />
          <Menu.Item>Copy request ID</Menu.Item>
        </Menu.Content>
      </Menu.Root>
      <Text color='secondary'>checkout-api · build 418</Text>
    </Inline>
  </Surface>
)
