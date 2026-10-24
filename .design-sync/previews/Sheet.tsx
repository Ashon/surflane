import * as React from 'react'
import {
  Button,
  Checkbox,
  ChoiceLabel,
  Field,
  Heading,
  Inline,
  List,
  Select,
  Sheet,
  Stack,
  StatusBadge,
  Surface,
  Text,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// The list page the sheet opens over.
const Page = ({ children }: { children: React.ReactNode }) => (
  <Surface surface='canvas' padding={6}>
    <Stack gap={4}>
      <Stack gap={1}>
        <Heading level={1} size='section'>
          Services
        </Heading>
        <Text color='secondary'>14 services across 3 regions</Text>
      </Stack>
      <Inline gap={2}>{children}</Inline>
    </Stack>
  </Surface>
)

const deployments = [
  {
    build: 'Build 418',
    note: 'Retry payment webhooks on 502 · 2 h ago',
    tone: 'success',
    status: 'Live',
  },
  {
    build: 'Build 417',
    note: 'Bump TLS ciphers · yesterday',
    tone: 'neutral',
    status: 'Replaced',
  },
  {
    build: 'Build 416',
    note: 'Cache cart totals · 3 days ago',
    tone: 'danger',
    status: 'Rolled back',
  },
] as const

export const Default = () => {
  const environment = React.useRef<HTMLButtonElement>(null)
  return (
    <Page>
      <Sheet.Root defaultOpen>
        <Sheet.Trigger render={<Button variant='outline' />}>
          checkout-api details
        </Sheet.Trigger>
        <Sheet.Content
          closeLabel='Close service details'
          initialFocus={environment}
        >
          <Sheet.Header>
            <Sheet.Title>checkout-api</Sheet.Title>
            <Sheet.Description>
              Owned by Payments · on call: Mina Park
            </Sheet.Description>
          </Sheet.Header>
          <Sheet.Body>
            <Stack gap={5}>
              <Field.Root name='environment'>
                <Field.Label>Environment</Field.Label>
                <Select
                  ref={environment}
                  aria-label='Environment'
                  defaultValue='production'
                  options={[
                    { value: 'production', label: 'Production · us-east-1' },
                    { value: 'staging', label: 'Staging · us-east-1' },
                  ]}
                />
              </Field.Root>
              <Stack gap={2}>
                <Heading level={3} size='subsection'>
                  Recent deployments
                </Heading>
                <List.Root aria-label='Recent deployments'>
                  {deployments.map((d) => (
                    <List.Item key={d.build}>
                      <List.Content>
                        <List.Title>{d.build}</List.Title>
                        <List.Description>{d.note}</List.Description>
                      </List.Content>
                      <List.Actions>
                        <StatusBadge tone={d.tone}>{d.status}</StatusBadge>
                      </List.Actions>
                    </List.Item>
                  ))}
                </List.Root>
              </Stack>
            </Stack>
          </Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close render={<Button variant='outline' />}>
              Done
            </Sheet.Close>
            <Button>Deploy build 418</Button>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet.Root>
    </Page>
  )
}

const filters = [
  { label: 'Healthy', checked: true },
  { label: 'Degraded', checked: true },
  { label: 'Failing', checked: true },
  { label: 'Archived', checked: false },
]

export const Left = () => {
  const region = React.useRef<HTMLButtonElement>(null)
  return (
    <Page>
      <Sheet.Root side='left' defaultOpen>
        <Sheet.Trigger render={<Button variant='outline' />}>
          Filters
        </Sheet.Trigger>
        <Sheet.Content
          size='small'
          closeLabel='Close filters'
          initialFocus={region}
        >
          <Sheet.Header>
            <Sheet.Title>Filters</Sheet.Title>
            <Sheet.Description>Showing 11 of 14 services</Sheet.Description>
          </Sheet.Header>
          <Sheet.Body>
            <Stack gap={5}>
              <Field.Root name='region'>
                <Field.Label>Region</Field.Label>
                <Select
                  ref={region}
                  aria-label='Region'
                  defaultValue='all'
                  options={[
                    { value: 'all', label: 'All regions' },
                    { value: 'us-east-1', label: 'us-east-1' },
                    { value: 'eu-west-1', label: 'eu-west-1' },
                  ]}
                />
              </Field.Root>
              <Stack gap={2}>
                <Text weight='medium'>Status</Text>
                {filters.map((f) => (
                  <ChoiceLabel
                    key={f.label}
                    control={
                      <Checkbox.Root defaultChecked={f.checked}>
                        <Checkbox.Indicator />
                      </Checkbox.Root>
                    }
                  >
                    {f.label}
                  </ChoiceLabel>
                ))}
              </Stack>
            </Stack>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant='ghost'>Reset</Button>
            <Sheet.Close render={<Button />}>Show 11 services</Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet.Root>
    </Page>
  )
}

export const FlushBottom = () => {
  const close = React.useRef<HTMLButtonElement>(null)
  return (
    <Page>
      <Sheet.Root side='bottom' defaultOpen>
        <Sheet.Trigger render={<Button variant='outline' />}>
          Incident summary
        </Sheet.Trigger>
        <Sheet.Content
          flush
          closeLabel='Close incident summary'
          initialFocus={close}
        >
          <Sheet.Header>
            <Sheet.Title>INC-2291 · Elevated 502s on checkout-api</Sheet.Title>
            <Sheet.Description>
              Opened 14:05 UTC · Sev 2 · 38 minutes
            </Sheet.Description>
          </Sheet.Header>
          <Sheet.Body>
            <Text>
              Build 416 cached cart totals across tenants. Rolling back to 415
              stopped the errors at 14:31; refunds for 212 affected orders are
              in progress.
            </Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close ref={close} render={<Button variant='outline' />}>
              Close
            </Sheet.Close>
            <Button>Open incident</Button>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet.Root>
    </Page>
  )
}
