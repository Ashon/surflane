import { Collapsible, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Open = () => (
  <Collapsible.Root defaultOpen>
    <Collapsible.Trigger>Technical details</Collapsible.Trigger>
    <Collapsible.Panel>
      <Text>
        Deployment 418 rolled out to 6 of 6 pods in 2m 40s. Build logs are
        redacted for secrets before they are stored.
      </Text>
    </Collapsible.Panel>
  </Collapsible.Root>
)

export const Closed = () => (
  <Collapsible.Root>
    <Collapsible.Trigger>Show environment variables</Collapsible.Trigger>
    <Collapsible.Panel>
      <Text>DATABASE_URL, REDIS_URL and 9 more.</Text>
    </Collapsible.Panel>
  </Collapsible.Root>
)

export const Disabled = () => (
  <Collapsible.Root disabled>
    <Collapsible.Trigger>
      Rollback history (no rollbacks yet)
    </Collapsible.Trigger>
    <Collapsible.Panel>
      <Text>No rollbacks for this service.</Text>
    </Collapsible.Panel>
  </Collapsible.Root>
)
