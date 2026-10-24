import { Button, InlineMessage, Spinner, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Tones = () => (
  <Stack gap={3}>
    <InlineMessage.Root tone='neutral'>
      <InlineMessage.Icon tone='neutral' />
      <InlineMessage.Content>
        <InlineMessage.Title>
          Preview environments are paused
        </InlineMessage.Title>
        <InlineMessage.Description>
          New pull requests won’t get a preview until the workspace resumes
          them.
        </InlineMessage.Description>
      </InlineMessage.Content>
    </InlineMessage.Root>
    <InlineMessage.Root tone='info'>
      <InlineMessage.Icon tone='info' />
      <InlineMessage.Content>
        <InlineMessage.Title>
          Maintenance window on Saturday
        </InlineMessage.Title>
        <InlineMessage.Description>
          The eu-west-1 registry is read-only from 02:00 to 03:00 UTC.
        </InlineMessage.Description>
      </InlineMessage.Content>
    </InlineMessage.Root>
    <InlineMessage.Root tone='success'>
      <InlineMessage.Icon tone='success' />
      <InlineMessage.Content>
        <InlineMessage.Title>Deployment complete</InlineMessage.Title>
        <InlineMessage.Description>
          checkout-api v2.14.0 is serving 100% of production traffic.
        </InlineMessage.Description>
      </InlineMessage.Content>
    </InlineMessage.Root>
    <InlineMessage.Root tone='caution'>
      <InlineMessage.Icon tone='caution' />
      <InlineMessage.Content>
        <InlineMessage.Title>Credentials expire in 3 days</InlineMessage.Title>
        <InlineMessage.Description>
          Renew the registry token before the nightly build runs.
        </InlineMessage.Description>
      </InlineMessage.Content>
    </InlineMessage.Root>
    <InlineMessage.Root tone='danger'>
      <InlineMessage.Icon tone='danger' />
      <InlineMessage.Content>
        <InlineMessage.Title>Build failed</InlineMessage.Title>
        <InlineMessage.Description>
          The test stage exited with code 1 after 4 min 12 s.
        </InlineMessage.Description>
      </InlineMessage.Content>
    </InlineMessage.Root>
    <InlineMessage.Root tone='progress'>
      <InlineMessage.Icon tone='progress' />
      <InlineMessage.Content>
        <InlineMessage.Title>Rollout queued</InlineMessage.Title>
        <InlineMessage.Description>
          Waiting for the staging canary to finish before production starts.
        </InlineMessage.Description>
      </InlineMessage.Content>
    </InlineMessage.Root>
  </Stack>
)

export const WithActions = () => (
  <InlineMessage.Root tone='danger'>
    <InlineMessage.Icon tone='danger' />
    <InlineMessage.Content>
      <InlineMessage.Title>Environment discovery failed</InlineMessage.Title>
      <InlineMessage.Description>
        The cluster endpoint didn’t respond within 30 seconds. Retrying asks the
        endpoint again; it doesn’t change the cluster.
      </InlineMessage.Description>
      <InlineMessage.Actions>
        <Button variant='outline'>Retry discovery</Button>
        <Button variant='ghost'>View logs</Button>
      </InlineMessage.Actions>
    </InlineMessage.Content>
  </InlineMessage.Root>
)

export const Pending = () => (
  <InlineMessage.Root tone='progress' role='status'>
    <InlineMessage.Icon tone='progress'>
      <Spinner decorative size='small' />
    </InlineMessage.Icon>
    <InlineMessage.Content>
      <InlineMessage.Title>Retrying environment discovery</InlineMessage.Title>
      <InlineMessage.Description>
        Waiting for the cluster to answer. This usually takes under a minute.
      </InlineMessage.Description>
      <InlineMessage.Actions>
        <Button variant='ghost'>Cancel</Button>
      </InlineMessage.Actions>
    </InlineMessage.Content>
  </InlineMessage.Root>
)
