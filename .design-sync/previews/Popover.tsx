import * as React from 'react'
import {
  Button,
  Field,
  Inline,
  Popover,
  Stack,
  Surface,
  Text,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// A toolbar row on the page; the trigger sits at its start.
const Bar = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <Surface surface='canvas' padding={6}>
    <Inline gap={3}>
      {children}
      <Text color='secondary'>{label}</Text>
    </Inline>
  </Surface>
)

// Title and Description group at gap 1; inputs and actions at gap 4.
export const Default = () => {
  const threshold = React.useRef<HTMLInputElement>(null)
  return (
    <Bar label='checkout-api · p95 latency'>
      <Popover.Root defaultOpen>
        <Popover.Trigger render={<Button variant='outline' />}>
          Alert rule
        </Popover.Trigger>
        <Popover.Content initialFocus={threshold}>
          <Stack gap={4}>
            <Stack gap={1}>
              <Popover.Title>Latency alert</Popover.Title>
              <Popover.Description>
                Pages on-call when p95 stays above the threshold for 5 minutes.
              </Popover.Description>
            </Stack>
            <Field.Root name='threshold'>
              <Field.Label>Threshold (ms)</Field.Label>
              <Field.Control
                ref={threshold}
                defaultValue='400'
                inputMode='numeric'
              />
            </Field.Root>
            <Inline gap={2}>
              <Popover.Close render={<Button variant='outline' />}>
                Cancel
              </Popover.Close>
              <Popover.Close render={<Button />}>Save rule</Popover.Close>
            </Inline>
          </Stack>
        </Popover.Content>
      </Popover.Root>
    </Bar>
  )
}

// A low-stakes confirmation next to its button; data loss uses AlertDialog.
export const InlineConfirmation = () => {
  const keep = React.useRef<HTMLButtonElement>(null)
  return (
    <Bar label='4 filters applied · 11 of 14 services'>
      <Popover.Root defaultOpen>
        <Popover.Trigger render={<Button variant='outline' />}>
          Reset filters
        </Popover.Trigger>
        <Popover.Content initialFocus={keep}>
          <Stack gap={4}>
            <Stack gap={1}>
              <Popover.Title>Reset all filters?</Popover.Title>
              <Popover.Description>
                Region, status, owner and tag go back to all services.
              </Popover.Description>
            </Stack>
            <Inline gap={2}>
              <Popover.Close ref={keep} render={<Button variant='outline' />}>
                Keep filters
              </Popover.Close>
              <Popover.Close render={<Button />}>Reset filters</Popover.Close>
            </Inline>
          </Stack>
        </Popover.Content>
      </Popover.Root>
    </Bar>
  )
}

// size='small' (240px) for brief read-only details.
export const Small = () => {
  const close = React.useRef<HTMLButtonElement>(null)
  return (
    <Bar label='Last deploy 2 hours ago'>
      <Popover.Root defaultOpen>
        <Popover.Trigger render={<Button variant='ghost' />}>
          Build 418
        </Popover.Trigger>
        <Popover.Content size='small' initialFocus={close}>
          <Stack gap={4}>
            <Stack gap={1}>
              <Popover.Title>Build 418</Popover.Title>
              <Popover.Description>
                Commit 9f3c2a1 by Mina Park. Built in 3m 12s, 214 modules.
              </Popover.Description>
            </Stack>
            <Inline gap={2}>
              <Popover.Close ref={close} render={<Button variant='outline' />}>
                Done
              </Popover.Close>
            </Inline>
          </Stack>
        </Popover.Content>
      </Popover.Root>
    </Bar>
  )
}
