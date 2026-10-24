import * as React from 'react'
import {
  Button,
  Drawer,
  Field,
  Grid,
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

// The service page the drawer opens over.
const Page = ({ children }: { children: React.ReactNode }) => (
  <Surface surface='canvas' padding={6}>
    <Stack gap={4}>
      <Stack gap={1}>
        <Inline gap={2}>
          <Heading level={1} size='section'>
            billing-worker
          </Heading>
          <StatusBadge tone='success'>Healthy</StatusBadge>
        </Inline>
        <Text color='secondary'>Production · us-east-1 · build 512</Text>
      </Stack>
      <Inline gap={2}>{children}</Inline>
    </Stack>
  </Surface>
)

const environments = [
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
]

// The default: a bottom drawer with an explicit Footer for done and cancel.
export const Default = () => {
  const name = React.useRef<HTMLInputElement>(null)
  return (
    <Page>
      <Drawer.Root defaultOpen>
        <Drawer.Trigger render={<Button variant='outline' />}>
          Prepare run
        </Drawer.Trigger>
        <Drawer.Content closeLabel='Close run setup' initialFocus={name}>
          <Drawer.Header>
            <Drawer.Title>Prepare deployment</Drawer.Title>
            <Drawer.Description>
              The run starts only when you confirm it.
            </Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <Grid columns={2} gap={4}>
              <Field.Root name='run'>
                <Field.Label>Run name</Field.Label>
                <Field.Control ref={name} defaultValue='billing-worker-512' />
              </Field.Root>
              <Field.Root name='environment'>
                <Field.Label>Target environment</Field.Label>
                <Select
                  aria-label='Target environment'
                  defaultValue='staging'
                  options={environments}
                />
              </Field.Root>
            </Grid>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close render={<Button variant='outline' />}>
              Cancel
            </Drawer.Close>
            <Drawer.Close render={<Button />}>Start run</Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </Page>
  )
}

// flush attaches the panel to the bottom edge, as a mobile bottom sheet sits.
export const Flush = () => {
  const cancel = React.useRef<HTMLButtonElement>(null)
  return (
    <Page>
      <Drawer.Root defaultOpen>
        <Drawer.Trigger render={<Button variant='outline' />}>
          Scale replicas
        </Drawer.Trigger>
        <Drawer.Content flush closeLabel='Close scaling' initialFocus={cancel}>
          <Drawer.Header>
            <Drawer.Title>Scale billing-worker</Drawer.Title>
            <Drawer.Description>
              From 3 to 6 replicas in us-east-1. Takes about 2 minutes.
            </Drawer.Description>
          </Drawer.Header>
          <Drawer.Footer>
            <Drawer.Close ref={cancel} render={<Button variant='outline' />}>
              Cancel
            </Drawer.Close>
            <Drawer.Close render={<Button />}>Scale to 6</Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </Page>
  )
}

// side='right' swipes to the right to close.
export const Right = () => {
  const reason = React.useRef<HTMLInputElement>(null)
  return (
    <Page>
      <Drawer.Root side='right' defaultOpen>
        <Drawer.Trigger render={<Button variant='outline' />}>
          Pause queue
        </Drawer.Trigger>
        <Drawer.Content
          size='small'
          closeLabel='Close pause queue'
          initialFocus={reason}
        >
          <Drawer.Header>
            <Drawer.Title>Pause invoice queue</Drawer.Title>
            <Drawer.Description>
              1,284 jobs wait until you resume it.
            </Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <Field.Root name='reason'>
              <Field.Label>Reason</Field.Label>
              <Field.Control ref={reason} defaultValue='Stripe API incident' />
              <Field.Description>
                Shown to the on-call channel.
              </Field.Description>
            </Field.Root>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close render={<Button variant='outline' />}>
              Cancel
            </Drawer.Close>
            <Drawer.Close render={<Button />}>Pause queue</Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </Page>
  )
}
