import { Badge, Inline, ScrollArea, Stack, Table, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const log = [
  '12:04:01  step 1/9  FROM node:22-alpine AS build',
  '12:04:03  step 2/9  WORKDIR /app',
  '12:04:03  step 3/9  COPY package.json package-lock.json ./',
  '12:04:19  step 4/9  RUN npm ci --omit=dev',
  '12:04:41  step 5/9  COPY . .',
  '12:04:42  step 6/9  RUN npm run build',
  '12:05:10  step 7/9  FROM node:22-alpine',
  '12:05:11  step 8/9  COPY --from=build /app/dist ./dist',
  '12:05:12  step 9/9  CMD ["node", "dist/server.js"]',
  '12:05:14  pushed registry.internal/checkout-api:2.14.0',
  '12:05:15  digest sha256:8af4935c6e2b1542a302a89238c0',
]

export const BuildLog = () => (
  <ScrollArea
    label='Build log'
    orientation='vertical'
    style={{ maxHeight: 180 }}
  >
    <Stack gap={1}>
      {log.map((line) => (
        <Text key={line} variant='mono'>
          {line}
        </Text>
      ))}
    </Stack>
  </ScrollArea>
)

const revisions = [
  [
    'platform-api',
    'sha256:8af4935c6e2b1542a302a89238c0',
    'sha256:28c04592d081b1b83f1b2d46177a',
  ],
  [
    'auth-gateway',
    'sha256:1d9e7c03b5a64f28e0c71b9a4d22',
    'sha256:7b3f0e19c8d2a6514f9e03b27c61',
  ],
  [
    'billing-service',
    'sha256:c40e8a1f73b92d05e6f1a8c3b947',
    'sha256:5e2a91d0f4c78b36a1e9d02c7f58',
  ],
  [
    'search-indexer',
    'sha256:9f02b6e4d1c83a75f0e2b9c16d34',
    'sha256:e81c4a07b3f92d65c1a0e8f47b29',
  ],
]

export const WideTable = () => (
  <ScrollArea label='Build revisions' orientation='horizontal'>
    <Table.Root style={{ minWidth: 1100 }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell scope='col'>Service</Table.HeaderCell>
          <Table.HeaderCell scope='col'>Start revision</Table.HeaderCell>
          <Table.HeaderCell scope='col'>Finish revision</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {revisions.map(([service, from, to]) => (
          <Table.Row key={service}>
            <Table.HeaderCell scope='row'>{service}</Table.HeaderCell>
            <Table.Cell>
              <code>{from}</code>
            </Table.Cell>
            <Table.Cell>
              <code>{to}</code>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </ScrollArea>
)

const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-2',
  'ca-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-central-1',
  'eu-north-1',
  'ap-south-1',
  'ap-northeast-1',
  'ap-southeast-2',
  'sa-east-1',
]

export const HorizontalChips = () => (
  <ScrollArea label='Deployment regions' orientation='horizontal'>
    <Inline gap={2} style={{ flexWrap: 'nowrap', width: 'max-content' }}>
      {regions.map((r) => (
        <Badge key={r}>{r}</Badge>
      ))}
    </Inline>
  </ScrollArea>
)
