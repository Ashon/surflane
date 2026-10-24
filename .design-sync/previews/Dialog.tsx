import * as React from 'react'
import {
  Button,
  Dialog,
  Field,
  Heading,
  Inline,
  Select,
  Stack,
  StatusBadge,
  Surface,
  Text,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const environments = [
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
  { value: 'preview', label: 'Preview' },
]

// The page the dialog opens over: a service header with its trigger.
const Page = ({ children }: { children: React.ReactNode }) => (
  <Surface surface='canvas' padding={6}>
    <Stack gap={4}>
      <Stack gap={1}>
        <Inline gap={2}>
          <Heading level={1} size='section'>
            checkout-api
          </Heading>
          <StatusBadge tone='success'>Healthy</StatusBadge>
        </Inline>
        <Text color='secondary'>Production · us-east-1 · build 418</Text>
      </Stack>
      <Inline gap={2}>{children}</Inline>
    </Stack>
  </Surface>
)

export const Default = () => {
  const environment = React.useRef<HTMLButtonElement>(null)
  return (
    <Page>
      <Dialog.Root defaultOpen>
        <Dialog.Trigger render={<Button variant='outline' />}>
          Plan deployment
        </Dialog.Trigger>
        <Dialog.Content
          closeLabel='Close deployment plan'
          initialFocus={environment}
        >
          <Dialog.Header>
            <Dialog.Title>Deployment plan</Dialog.Title>
            <Dialog.Description>
              Review where build 418 goes. Nothing deploys until you start it.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={4}>
              <Field.Root name='environment'>
                <Field.Label>Target environment</Field.Label>
                <Select
                  ref={environment}
                  aria-label='Target environment'
                  defaultValue='staging'
                  options={environments}
                />
                <Field.Description>
                  Staging runs the smoke suite before it serves traffic.
                </Field.Description>
              </Field.Root>
              <Field.Root name='note'>
                <Field.Label>Release note</Field.Label>
                <Field.Control defaultValue='Retry payment webhooks on 502' />
              </Field.Root>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant='outline' />}>
              Cancel
            </Dialog.Close>
            <Dialog.Close render={<Button />}>Start deployment</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Page>
  )
}

export const Small = () => {
  const name = React.useRef<HTMLInputElement>(null)
  return (
    <Page>
      <Dialog.Root defaultOpen>
        <Dialog.Trigger render={<Button variant='outline' />}>
          Rename environment
        </Dialog.Trigger>
        <Dialog.Content
          size='small'
          closeLabel='Close rename'
          initialFocus={name}
        >
          <Dialog.Header>
            <Dialog.Title>Rename environment</Dialog.Title>
            <Dialog.Description>
              Links to the old name redirect for 30 days.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <Field.Root name='name'>
              <Field.Label>Environment name</Field.Label>
              <Field.Control ref={name} defaultValue='staging-eu' />
            </Field.Root>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant='outline' />}>
              Cancel
            </Dialog.Close>
            <Dialog.Close render={<Button />}>Rename</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Page>
  )
}

const checks = [
  {
    name: 'Smoke suite',
    detail: '42 of 42 passed',
    tone: 'success',
    status: 'Passed',
  },
  {
    name: 'Error budget',
    detail: '71% left this month',
    tone: 'success',
    status: 'Passed',
  },
  {
    name: 'Change freeze',
    detail: 'Ends Friday 18:00 UTC',
    tone: 'caution',
    status: 'Active',
  },
] as const

export const Large = () => {
  const close = React.useRef<HTMLButtonElement>(null)
  return (
    <Page>
      <Dialog.Root defaultOpen>
        <Dialog.Trigger render={<Button variant='outline' />}>
          Review checks
        </Dialog.Trigger>
        <Dialog.Content
          size='large'
          closeLabel='Close release checks'
          initialFocus={close}
        >
          <Dialog.Header>
            <Dialog.Title>Release checks</Dialog.Title>
            <Dialog.Description>
              Build 418 must pass every check before it reaches production.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={4}>
              {checks.map((check) => (
                <Inline key={check.name} gap={2} justify='between'>
                  <Stack gap={1}>
                    <Text weight='medium'>{check.name}</Text>
                    <Text variant='caption' color='secondary'>
                      {check.detail}
                    </Text>
                  </Stack>
                  <StatusBadge tone={check.tone}>{check.status}</StatusBadge>
                </Inline>
              ))}
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close ref={close} render={<Button variant='outline' />}>
              Close
            </Dialog.Close>
            <Button disabled>Promote to production</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Page>
  )
}
