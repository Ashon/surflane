import {
  Badge,
  Inline,
  ScrollArea,
  Stack,
  StatusBadge,
  Surface,
  Table,
  Text,
} from '@surflane/ui'

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

// A vertical scroller has no edge fade, so the log sits in a framed panel: the
// lines run under the panel's bottom edge, cut mid-line at 194px, which reads
// as more to scroll.
export const BuildLog = () => (
  <Surface padding={0} style={{ maxWidth: '36rem' }}>
    <ScrollArea
      label='Build log'
      orientation='vertical'
      style={{ maxHeight: 194 }}
    >
      <Stack gap={1} style={{ padding: 'var(--surf-space-4)' }}>
        {log.map((line) => (
          <Text key={line} variant='mono'>
            {line}
          </Text>
        ))}
      </Stack>
    </ScrollArea>
  </Surface>
)

const deploys = [
  [
    'platform-api',
    'eu-west-1',
    'sha256:8af4935c6e2b',
    'sha256:28c04592d081',
    '4m 12s',
    'mina.park',
    'success',
    'Live',
  ],
  [
    'auth-gateway',
    'us-east-1',
    'sha256:1d9e7c03b5a6',
    'sha256:7b3f0e19c8d2',
    '2m 48s',
    'j.okafor',
    'success',
    'Live',
  ],
  [
    'billing-service',
    'eu-central-1',
    'sha256:c40e8a1f73b9',
    'sha256:5e2a91d0f4c7',
    '6m 05s',
    'a.lindqvist',
    'caution',
    'Canary',
  ],
  [
    'search-indexer',
    'ap-northeast-2',
    'sha256:9f02b6e4d1c8',
    'sha256:e81c4a07b3f9',
    '9m 31s',
    'h.seo',
    'danger',
    'Rolled back',
  ],
] as const

// Seven columns overflow the card, so the table scrolls and its cut edge fades.
export const WideTable = () => (
  <ScrollArea label='Deploy history' orientation='horizontal'>
    <Table.Root variant='lined' style={{ minWidth: 1080 }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell scope='col'>Service</Table.HeaderCell>
          <Table.HeaderCell scope='col'>Region</Table.HeaderCell>
          <Table.HeaderCell scope='col'>From</Table.HeaderCell>
          <Table.HeaderCell scope='col'>To</Table.HeaderCell>
          <Table.HeaderCell scope='col' numeric>
            Duration
          </Table.HeaderCell>
          <Table.HeaderCell scope='col'>Deployed by</Table.HeaderCell>
          <Table.HeaderCell scope='col'>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {deploys.map(([service, region, from, to, took, by, tone, status]) => (
          <Table.Row key={service}>
            <Table.HeaderCell scope='row'>{service}</Table.HeaderCell>
            <Table.Cell>{region}</Table.Cell>
            <Table.Cell>
              <code>{from}</code>
            </Table.Cell>
            <Table.Cell>
              <code>{to}</code>
            </Table.Cell>
            <Table.Cell numeric>{took}</Table.Cell>
            <Table.Cell>{by}</Table.Cell>
            <Table.Cell>
              <StatusBadge tone={tone}>{status}</StatusBadge>
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
