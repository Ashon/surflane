import { Accordion, StatusBadge, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <Accordion.Root defaultValue={['identity']}>
    <Accordion.Item value='identity'>
      <Accordion.Header>
        <Accordion.Trigger>Identity controls</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <Text>
          checkout-api runs as the svc-checkout account. It can read the orders
          and payments schemas, and nothing in billing.
        </Text>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value='environments'>
      <Accordion.Header>
        <Accordion.Trigger>Environment access</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <Text>Deploys to staging and production; development is blocked.</Text>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value='secrets'>
      <Accordion.Header>
        <Accordion.Trigger>Secrets and keys</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <Text>4 secrets, rotated 12 days ago.</Text>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
)

export const Collapsed = () => (
  <Accordion.Root>
    <Accordion.Item value='build'>
      <Accordion.Header>
        <Accordion.Trigger>Build settings</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <Text>Node 24, npm ci, cache keyed on package-lock.json.</Text>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value='health'>
      <Accordion.Header>
        <Accordion.Trigger>Health checks</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <Text>GET /healthz every 10 seconds, 3 failures to restart.</Text>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value='alerts'>
      <Accordion.Header>
        <Accordion.Trigger>Alert routing</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <Text>Pages #payments-oncall after 5 minutes of errors.</Text>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
)

export const Multiple = () => (
  <Accordion.Root multiple defaultValue={['staging', 'production']}>
    <Accordion.Item value='staging'>
      <Accordion.Header>
        <Accordion.Trigger>staging</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <StatusBadge tone='success'>Healthy</StatusBadge>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value='production'>
      <Accordion.Header>
        <Accordion.Trigger>production</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <StatusBadge tone='caution'>Degraded</StatusBadge>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value='development'>
      <Accordion.Header>
        <Accordion.Trigger>development</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <StatusBadge tone='neutral'>Not deployed</StatusBadge>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
)

export const DisabledItem = () => (
  <Accordion.Root defaultValue={['policy']}>
    <Accordion.Item value='policy'>
      <Accordion.Header>
        <Accordion.Trigger>Deploy policy</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <Text>Two approvals for production; staging deploys on merge.</Text>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value='retention' disabled>
      <Accordion.Header>
        <Accordion.Trigger>Log retention (Enterprise plan)</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>
        <Text>Keep logs for up to 400 days.</Text>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
)
