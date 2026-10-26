import React, { useContext, useState } from 'react'
import {
  Table,
  List,
  Button,
  Input,
  Checkbox,
  StatusBadge,
  EmptyState,
  InlineMessage,
  Spinner,
  Card,
  Grid,
  Stat,
  Sparkline,
  BarList,
  Banner,
  type BannerTone,
  DescriptionList,
  Timeline,
  Inline,
  Select,
  formatCurrency,
  formatNumber,
  formatPercent,
  Icon,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/DataExamples'
import { PreviewTableVariantContext } from './previewOptions'
export { dataExampleIds } from './exampleGroups'
const environments = [
  {
    id: 'demo-main',
    name: 'DEMO main',
    region: 'staging-cluster-01',
    count: 3,
  },
  {
    id: 'documentation',
    name: 'Documentation',
    region: 'staging-cluster-02',
    count: 1,
  },
  {
    id: 'inventory-main',
    name: 'Inventory main',
    region: 'prod-cluster-01',
    count: 2,
  },
]
function SearchMark() {
  return <Icon name='search' />
}
function EmptyPreview() {
  const t = text[useLocale().locale]
  const [mode, setMode] = useState<'empty' | 'search' | 'permission'>('empty')
  const [created, setCreated] = useState(false),
    [notice, setNotice] = useState('')
  return (
    <div className='example-stack'>
      <div className='actions'>
        <Button
          variant='outline'
          onClick={() => {
            setMode('empty')
            setCreated(false)
            setNotice('')
          }}
        >
          {t.initialEmpty}
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            setMode('search')
            setCreated(false)
            setNotice('')
          }}
        >
          {t.noSearchResults}
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            setMode('permission')
            setCreated(false)
            setNotice('')
          }}
        >
          {t.permissionRequired}
        </Button>
      </div>
      {created ? (
        <List.Root aria-label={t.registeredPreviewEnvironments}>
          <List.Item>
            <List.Content>
              <List.Title>{t.newEnvironmentPreview}</List.Title>
              <List.Description>{t.localExampleOnly}</List.Description>
            </List.Content>
            <StatusBadge tone='success'>{t.configured}</StatusBadge>
          </List.Item>
        </List.Root>
      ) : (
        <EmptyState.Root>
          <EmptyState.Icon aria-hidden='true'>
            <SearchMark />
          </EmptyState.Icon>
          <EmptyState.Title>
            {mode === 'empty'
              ? t.noEnvironmentsRegistered
              : mode === 'search'
                ? t.noMatchingEnvironments
                : t.environmentAccessRequired}
          </EmptyState.Title>
          <EmptyState.Description>
            {mode === 'empty'
              ? t.registerEnvironmentHint
              : mode === 'search'
                ? t.tryAnotherNameOrClearFilters
                : t.askAdminForAccess}
          </EmptyState.Description>
          <EmptyState.Actions>
            {mode === 'empty' ? (
              <Button
                onClick={() => {
                  setCreated(true)
                  setNotice(t.previewEnvironmentAdded)
                }}
              >
                {t.registerPreviewEnvironment}
              </Button>
            ) : mode === 'search' ? (
              <Button
                variant='outline'
                onClick={() => {
                  setMode('empty')
                  setNotice(t.filtersCleared)
                }}
              >
                {t.clearFilters}
              </Button>
            ) : (
              <Button
                variant='outline'
                onClick={() => setNotice(t.accessRequestPreviewed)}
              >
                {t.previewAccessRequest}
              </Button>
            )}
          </EmptyState.Actions>
        </EmptyState.Root>
      )}
      <p role='status' className='example-announcement'>
        {notice}
      </p>
    </div>
  )
}
function BannerPreview() {
  const t = text[useLocale().locale]
  const [tone, setTone] = useState<BannerTone>('caution')
  const [shown, setShown] = useState(true)
  const notice = t.bannerNotices[tone]
  return (
    <div className='example-stack'>
      <label>
        {t.bannerState}
        <Select
          width='content'
          value={tone}
          onValueChange={(value) => setTone(value as BannerTone)}
          options={(['info', 'caution', 'danger'] as const).map((value) => ({
            value,
            label: t.bannerNotices[value].title,
          }))}
        />
      </label>
      {shown ? (
        <Banner.Root
          tone={tone}
          onDismiss={() => setShown(false)}
          dismissLabel={t.bannerDismiss}
        >
          <Banner.Icon />
          <Banner.Content>
            <Banner.Title>{notice.title}</Banner.Title>
            <Banner.Description>{notice.description}</Banner.Description>
          </Banner.Content>
          <Banner.Actions>
            <Button variant='outline' size='small'>
              {t.bannerViewStatus}
            </Button>
          </Banner.Actions>
        </Banner.Root>
      ) : null}
      <Button variant='outline' onClick={() => setShown(true)}>
        {t.bannerShowAgain}
      </Button>
    </div>
  )
}
function MessagePreview() {
  const t = text[useLocale().locale]
  const [state, setState] = useState<'error' | 'pending' | 'success'>('error')
  const [notice, setNotice] = useState('')
  const tone =
    state === 'error' ? 'danger' : state === 'pending' ? 'progress' : 'success'
  return (
    <div className='example-stack'>
      <InlineMessage.Root tone={tone}>
        <InlineMessage.Icon tone={tone}>
          {state === 'pending' ? (
            <Spinner decorative size='small' />
          ) : undefined}
        </InlineMessage.Icon>
        <InlineMessage.Content>
          <InlineMessage.Title>
            {state === 'error'
              ? t.environmentDiscoveryFailed
              : state === 'pending'
                ? t.retryingEnvironmentDiscovery
                : t.environmentDiscoveryComplete}
          </InlineMessage.Title>
          <InlineMessage.Description>
            {state === 'error'
              ? t.endpointNoResponse
              : state === 'pending'
                ? t.waitingForResult
                : t.threeEnvironmentsAvailable}
          </InlineMessage.Description>
          <InlineMessage.Actions>
            <Button
              variant='outline'
              onClick={() => {
                if (state === 'error') {
                  setState('pending')
                  setNotice(t.retryInProgress)
                } else if (state === 'pending') {
                  setState('success')
                  setNotice(t.discoverySucceeded)
                } else {
                  setState('error')
                  setNotice(t.errorExampleRestored)
                }
              }}
            >
              {state === 'error'
                ? t.retryPreview
                : state === 'pending'
                  ? t.completeRetry
                  : t.resetErrorExample}
            </Button>
            {state === 'pending' && (
              <>
                <Button
                  variant='ghost'
                  onClick={() => {
                    setState('error')
                    setNotice(t.discoveryFailedAgain)
                  }}
                >
                  {t.failRetry}
                </Button>
              </>
            )}
          </InlineMessage.Actions>
        </InlineMessage.Content>
      </InlineMessage.Root>
      <p role='status' className='example-announcement'>
        {notice}
      </p>
      <InlineMessage.Root tone='caution'>
        <InlineMessage.Icon tone='caution' />
        <InlineMessage.Content>
          <InlineMessage.Title>{t.credentialsExpireSoon}</InlineMessage.Title>
          <InlineMessage.Description>
            {t.renewCredentialsBeforeRun}
          </InlineMessage.Description>
        </InlineMessage.Content>
      </InlineMessage.Root>
      <InlineMessage.Root>
        <InlineMessage.Icon />
        <InlineMessage.Content>
          <InlineMessage.Title>{t.localExamples}</InlineMessage.Title>
          <InlineMessage.Description>
            {t.controlsNoContact}
          </InlineMessage.Description>
        </InlineMessage.Content>
      </InlineMessage.Root>
    </div>
  )
}
// Twelve weeks of a platform's figures; one week of deploy data is missing.
const weeks = {
  success: [
    0.94,
    0.95,
    0.93,
    0.96,
    0.97,
    null,
    0.97,
    0.98,
    0.97,
    0.98,
    0.985,
    0.99,
  ],
  latency: [182, 176, 190, 171, 168, 172, 160, 158, 155, 149, 151, 144],
  cost: [
    4.2e6, 4.25e6, 4.3e6, 4.28e6, 4.4e6, 4.52e6, 4.6e6, 4.58e6, 4.71e6, 4.8e6,
    4.86e6, 4.92e6,
  ],
}
const lastChange = (series: readonly (number | null)[]) => {
  const values = series.filter((v): v is number => v !== null)
  const [before, last] = values.slice(-2)
  return (last - before) / before
}
function StatPreview() {
  const { locale } = useLocale()
  const t = text[locale]
  const tag = locale === 'ko' ? 'ko-KR' : 'en-US'
  const percent = (value: number) =>
    formatPercent(value, { locale: tag, signed: true })
  const cards = [
    {
      key: 'success',
      label: t.deploySuccess,
      value: formatPercent(weeks.success.at(-1), { locale: tag }),
      change: lastChange(weeks.success),
      lowerIsBetter: false,
      series: weeks.success,
    },
    {
      key: 'latency',
      label: t.p95Latency,
      value: `${formatNumber(weeks.latency.at(-1), { locale: tag })} ms`,
      change: lastChange(weeks.latency),
      lowerIsBetter: true,
      series: weeks.latency,
    },
    {
      key: 'cost',
      label: t.monthlyCost,
      value: formatCurrency(weeks.cost.at(-1), 'KRW', {
        locale: tag,
        compact: true,
      }),
      change: lastChange(weeks.cost),
      lowerIsBetter: true,
      series: weeks.cost,
    },
  ]
  return (
    <Grid columns={3} gap={4}>
      {cards.map((card) => (
        <Card.Root key={card.key}>
          <Card.Body>
            <Stat.Root>
              <Stat.Label>{card.label}</Stat.Label>
              <Stat.Value>{card.value}</Stat.Value>
              <Stat.Change
                value={card.change}
                format={percent}
                lowerIsBetter={card.lowerIsBetter}
              />
              <Stat.Caption>{t.vsLastWeek}</Stat.Caption>
            </Stat.Root>
            <Sparkline
              data={card.series}
              lowerIsBetter={card.lowerIsBetter}
              label={t.trendLabel(card.label, percent(card.change))}
            />
          </Card.Body>
        </Card.Root>
      ))}
      {/* A value past its threshold, and one measure across nodes. */}
      <Card.Root>
        <Card.Body>
          <Stat.Root>
            <Stat.Label>{t.freeDisk}</Stat.Label>
            <Stat.Value>24 GiB</Stat.Value>
            <Stat.Status tone='danger'>{t.belowLimit}</Stat.Status>
          </Stat.Root>
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <Stat.Root>
            <Stat.Label>{t.lastScan}</Stat.Label>
            <Stat.Value>
              {locale === 'ko' ? '2시간 40분' : '2 h 40 min'}
            </Stat.Value>
            <Stat.Status tone='caution'>{t.overdue}</Stat.Status>
          </Stat.Root>
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>
          <Stat.Group label={t.gpuTemperature}>
            <Stat.Root>
              <Stat.Label>dgx-001</Stat.Label>
              <Stat.Value>62 °C</Stat.Value>
            </Stat.Root>
            <Stat.Root>
              <Stat.Label>dgx-002</Stat.Label>
              <Stat.Value>71 °C</Stat.Value>
            </Stat.Root>
          </Stat.Group>
        </Card.Body>
      </Card.Root>
    </Grid>
  )
}
const directories = [
  ['models', '/srv/models', 412],
  ['cache', '/var/cache/huggingface', 168],
  ['datasets', '/srv/datasets', 96],
  ['checkpoints', '/srv/runs/checkpoints', 73],
  ['logs', '/var/log', 21],
  ['backups', '/srv/backups', 14],
  ['tmp', '/tmp', 6],
  ['docker', '/var/lib/docker', 54],
] as const
const projectTokens = [
  ['Harbor', 18.4],
  ['Beacon', 9.7],
  ['Tideline', 6.2],
  ['Anchor', 3.1],
  ['Compass', 1.4],
] as const
function BarListPreview() {
  const { locale } = useLocale()
  const t = text[locale]
  const tag = locale === 'ko' ? 'ko-KR' : 'en-US'
  return (
    <Grid columns={2} gap={4}>
      <Card.Root>
        <Card.Header>
          <Card.Title>{t.diskByDirectory}</Card.Title>
        </Card.Header>
        <Card.Body>
          {/* Eight directories, five rows before it scrolls. */}
          <BarList
            label={t.diskByDirectory}
            items={directories.map(([id, detail, value]) => ({
              id,
              label: id,
              detail,
              value,
              text: `${value} GiB`,
            }))}
            maxRows={5}
            locale={tag}
          />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>{t.tokensByProject}</Card.Title>
        </Card.Header>
        <Card.Body>
          <BarList
            label={t.tokensByProject}
            items={projectTokens.map(([label, value]) => ({
              id: label,
              label,
              value,
            }))}
            formatValue={(value) => `${formatNumber(value, { locale: tag })}M`}
          />
        </Card.Body>
      </Card.Root>
    </Grid>
  )
}
function SparklinePreview() {
  const { locale } = useLocale()
  const t = text[locale]
  const tag = locale === 'ko' ? 'ko-KR' : 'en-US'
  const close = [2512, 2528, 2519, 2541, 2536, 2560, 2549, 2575, 2581, 2570]
  const previous = 2540
  const change = (close.at(-1)! - previous) / previous
  return (
    <div className='example-stack'>
      {(['small', 'default', 'large'] as const).map((size) => (
        <div key={size} className='sparkline-row'>
          <span>{t.sizeName(size)}</span>
          <Sparkline
            data={close}
            size={size}
            baseline={previous}
            label={t.indexLabel(
              formatPercent(change, { locale: tag, signed: true }),
            )}
          />
        </div>
      ))}
      <div className='sparkline-row'>
        <span>{t.withGap}</span>
        <Sparkline
          data={weeks.success}
          label={t.trendLabel(t.deploySuccess, t.oneWeekMissing)}
        />
      </div>
    </div>
  )
}
function DescriptionListPreview() {
  const { locale } = useLocale()
  const t = text[locale]
  const [layout, setLayout] = useState<'inline' | 'stacked'>('inline')
  const [columns, setColumns] = useState<'1' | '2'>('2')
  const created = new Date('2026-10-21T09:30:00Z')
  return (
    <div className='example-stack'>
      <Inline gap={4}>
        <label>
          {t.dlLayout}
          <Select
            width='content'
            value={layout}
            onValueChange={(value) => setLayout(value as 'inline' | 'stacked')}
            options={[
              { value: 'inline', label: t.dlInline },
              { value: 'stacked', label: t.dlStacked },
            ]}
          />
        </label>
        <label>
          {t.dlColumns}
          <Select
            width='content'
            value={columns}
            onValueChange={(value) => setColumns(value as '1' | '2')}
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
            ]}
          />
        </label>
      </Inline>
      <Card.Root>
        <Card.Header>
          <Card.Title>platform-api</Card.Title>
        </Card.Header>
        <Card.Body>
          <DescriptionList.Root
            layout={layout}
            columns={columns === '2' ? 2 : 1}
            labels={t.dlLabels}
          >
            <DescriptionList.Item>
              <DescriptionList.Term>{t.dlStatus}</DescriptionList.Term>
              <DescriptionList.Value>
                <StatusBadge tone='success'>{t.dlRunning}</StatusBadge>
              </DescriptionList.Value>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>{t.dlRegion}</DescriptionList.Term>
              <DescriptionList.Value>ap-northeast-2</DescriptionList.Value>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>{t.dlClusterId}</DescriptionList.Term>
              <DescriptionList.Value copy>
                cls-7f3a9c2e41b84d0f9a1e
              </DescriptionList.Value>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>{t.dlImage}</DescriptionList.Term>
              <DescriptionList.Value truncate copy>
                registry.example.com/platform/api@sha256:4f1c9a0b7e2d3c8a6b5f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b
              </DescriptionList.Value>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>{t.dlCreated}</DescriptionList.Term>
              <DescriptionList.Value>
                <time dateTime={created.toISOString()}>
                  {new Intl.DateTimeFormat(
                    locale === 'ko' ? 'ko-KR' : 'en-US',
                    {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                      timeZone: 'UTC',
                    },
                  ).format(created)}{' '}
                  UTC
                </time>
              </DescriptionList.Value>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>{t.dlDescription}</DescriptionList.Term>
              <DescriptionList.Value />
            </DescriptionList.Item>
          </DescriptionList.Root>
        </Card.Body>
      </Card.Root>
    </div>
  )
}
function TimelinePreview() {
  const t = text[useLocale().locale]
  return (
    <Timeline.Root aria-label={t.tlLabel}>
      <Timeline.Item
        tone='progress'
        current
        icon={<Spinner decorative size='small' />}
      >
        <Timeline.Title>{t.tlCanary}</Timeline.Title>
        <Timeline.Time dateTime='2026-10-26T09:44:00Z'>09:44 UTC</Timeline.Time>
        <Timeline.Status>{t.tlRunning}</Timeline.Status>
        <Timeline.Description>{t.tlCanaryBy}</Timeline.Description>
      </Timeline.Item>
      <Timeline.Item tone='success'>
        <Timeline.Title>{t.tlDeployed}</Timeline.Title>
        <Timeline.Time dateTime='2026-10-26T09:42:00Z'>09:42 UTC</Timeline.Time>
        <Timeline.Status>{t.tlSucceeded}</Timeline.Status>
        <Timeline.Description>{t.tlDeployedBy}</Timeline.Description>
        <Timeline.Detail summary={t.tlChanges}>
          <ul>
            {t.tlChangeList.map((change) => (
              <li key={change}>{change}</li>
            ))}
          </ul>
        </Timeline.Detail>
      </Timeline.Item>
      <Timeline.Item tone='danger'>
        <Timeline.Title>{t.tlFailed}</Timeline.Title>
        <Timeline.Time dateTime='2026-10-25T18:05:00Z'>
          {t.tlYesterday} 18:05 UTC
        </Timeline.Time>
        <Timeline.Status>{t.tlFailedStatus}</Timeline.Status>
        <Timeline.Description>{t.tlFailedWhy}</Timeline.Description>
        <Timeline.Detail summary={t.tlLogs}>
          <p>{t.tlLogLine}</p>
        </Timeline.Detail>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Title>{t.tlCreated}</Timeline.Title>
        <Timeline.Time dateTime='2026-10-20T08:00:00Z'>
          {t.tlCreatedOn}
        </Timeline.Time>
        <Timeline.Status>{t.tlCreatedStatus}</Timeline.Status>
      </Timeline.Item>
    </Timeline.Root>
  )
}
export function DataExample({ id }: { id: string }) {
  const t = text[useLocale().locale]
  const [query, setQuery] = useState(''),
    [ascending, setAscending] = useState(true)
  const variant = useContext(PreviewTableVariantContext)
  const [selected, setSelected] = useState<string[]>([]),
    [inspected, setInspected] = useState('')
  if (id === 'stat') return <StatPreview />
  if (id === 'description-list') return <DescriptionListPreview />
  if (id === 'timeline') return <TimelinePreview />
  if (id === 'sparkline') return <SparklinePreview />
  if (id === 'bar-list') return <BarListPreview />
  if (id === 'empty-state') return <EmptyPreview />
  if (id === 'inline-message') return <MessagePreview />
  if (id === 'banner') return <BannerPreview />
  const rows = environments
    .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (ascending ? 1 : -1) * a.name.localeCompare(b.name))
  const toggle = (id: string, checked: boolean) =>
    setSelected((current) =>
      checked
        ? [...current.filter((v) => v !== id), id]
        : current.filter((v) => v !== id),
    )
  return (
    <div className='example-stack'>
      <label>
        {t.filterEnvironments}
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchByEnvironmentName}
        />
      </label>
      {rows.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Icon aria-hidden='true'>
            <SearchMark />
          </EmptyState.Icon>
          <EmptyState.Title>{t.noMatchingEnvironments}</EmptyState.Title>
          <EmptyState.Description>
            {t.clearSearchToSeeEnvironments}
          </EmptyState.Description>
          <EmptyState.Actions>
            <Button variant='outline' onClick={() => setQuery('')}>
              {t.clearSearch}
            </Button>
          </EmptyState.Actions>
        </EmptyState.Root>
      ) : id === 'table' ? (
        <Table.Container label={t.environmentComparison}>
          <Table.Root variant={variant} style={{ minWidth: 720 }}>
            <Table.Caption>{t.registeredEnvironmentsCaption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.selection}</Table.HeaderCell>
                <Table.SortHeader
                  sort={ascending ? 'ascending' : 'descending'}
                  onSort={() => setAscending((v) => !v)}
                >
                  {t.name}
                </Table.SortHeader>
                <Table.HeaderCell scope='col'>{t.cluster}</Table.HeaderCell>
                <Table.HeaderCell scope='col' numeric>
                  {t.discoveredServices}
                </Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.actions}</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {rows.map((row) => (
                <Table.Row key={row.id} selected={selected.includes(row.id)}>
                  <Table.Cell>
                    <Checkbox.Root
                      aria-label={t.selectEnvironment(row.name)}
                      checked={selected.includes(row.id)}
                      onCheckedChange={(checked) => toggle(row.id, checked)}
                    >
                      <Checkbox.Indicator />
                    </Checkbox.Root>
                  </Table.Cell>
                  <Table.HeaderCell scope='row'>{row.name}</Table.HeaderCell>
                  <Table.Cell>{row.region}</Table.Cell>
                  <Table.Cell numeric>{row.count}</Table.Cell>
                  <Table.Cell>
                    <Button
                      variant='outline'
                      size='small'
                      onClick={() =>
                        setInspected(t.servicesDiscovered(row.name, row.count))
                      }
                    >
                      {t.inspectEnvironment(row.name)}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
      ) : (
        <List.Root aria-label={t.registeredEnvironments}>
          {rows.map((row) => (
            <List.Item key={row.id} selected={selected.includes(row.id)}>
              <Checkbox.Root
                aria-label={t.selectEnvironment(row.name)}
                checked={selected.includes(row.id)}
                onCheckedChange={(checked) => toggle(row.id, checked)}
              >
                <Checkbox.Indicator />
              </Checkbox.Root>
              <List.Content>
                <List.Title>{row.name}</List.Title>
                <List.Description>
                  {t.discoveredServicesInRegion(row.region, row.count)}
                </List.Description>
              </List.Content>
              <List.Actions>
                <StatusBadge tone='success'>{t.configured}</StatusBadge>
                <Button
                  variant='outline'
                  size='small'
                  onClick={() =>
                    setInspected(t.servicesDiscovered(row.name, row.count))
                  }
                >
                  {t.inspectEnvironment(row.name)}
                </Button>
              </List.Actions>
            </List.Item>
          ))}
        </List.Root>
      )}
      <p role='status'>{t.selectedSummary(selected.length, inspected)}</p>
    </div>
  )
}
