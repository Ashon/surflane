import { Tabs, Text } from '@surflane/ui'

document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <Tabs.Root defaultValue='overview'>
    <Tabs.List aria-label='Service sections'>
      <Tabs.Tab value='overview'>Overview</Tabs.Tab>
      <Tabs.Tab value='deployments'>Deployments</Tabs.Tab>
      <Tabs.Tab value='settings'>Settings</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value='overview'>
      <Text>checkout-api serves 1.2k requests a minute across 3 regions.</Text>
    </Tabs.Panel>
    <Tabs.Panel value='deployments'>
      <Text>12 deployments this week, the last one 2 hours ago.</Text>
    </Tabs.Panel>
    <Tabs.Panel value='settings'>
      <Text>Owners, alerts and the release window.</Text>
    </Tabs.Panel>
  </Tabs.Root>
)

export const SecondSelected = () => (
  <Tabs.Root defaultValue='logs'>
    <Tabs.List aria-label='Build output'>
      <Tabs.Tab value='summary'>Summary</Tabs.Tab>
      <Tabs.Tab value='logs'>Logs</Tabs.Tab>
      <Tabs.Tab value='artifacts'>Artifacts</Tabs.Tab>
      <Tabs.Tab value='tests' disabled>
        Tests
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value='summary'>
      <Text>Build 418 passed in 3m 12s.</Text>
    </Tabs.Panel>
    <Tabs.Panel value='logs'>
      <Text>Compiled 214 modules. Uploaded 3 artifacts.</Text>
    </Tabs.Panel>
    <Tabs.Panel value='artifacts'>
      <Text>app.tar.gz, sourcemaps.zip, sbom.json</Text>
    </Tabs.Panel>
    <Tabs.Panel value='tests'>
      <Text>No test run for this build.</Text>
    </Tabs.Panel>
  </Tabs.Root>
)
