import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  EmptyState,
  Icon,
  InlineMessage,
  Menu,
  Pagination,
  Skeleton,
  StatusBadge,
  Table,
  Toggle,
  ToggleGroup,
  useTableSelection,
  type TableSort,
  Link as TextLink,
} from '@surflane/ui'
import { useLocale, useMessages } from './i18n'
import { text } from './i18n/pages/TableGuidelines'

type Environment = 'production' | 'staging' | 'development'
type Service = {
  id: string
  name: string
  environment: Environment
  replicas: number
  cpu: number
  memory: number
  latency: number
  errorRate: number
  image: string
  manage: boolean
  degraded?: boolean
}
// A stable, fake 64-character digest derived from the name.
const digest = (name: string) => {
  const hex = [...name].map((c) => c.charCodeAt(0).toString(16)).join('')
  return hex.repeat(Math.ceil(64 / hex.length)).slice(0, 64)
}
// Fictional services; every action in these previews stays local.
const services: Service[] = [
  ['checkout-api', 'production', 12, 7.25, 14.5, 182, 0.12, true],
  ['inventory-sync', 'production', 4, 1.5, 3, 96, 0.02, true],
  ['search-indexer', 'staging', 6, 11.75, 48, 412, 1.4, true, true],
  ['notification-worker', 'production', 3, 0.75, 1.5, 64, 0, false],
  ['auth-gateway', 'production', 8, 3.5, 6, 41, 0.05, false],
  ['report-builder', 'development', 2, 2, 8, 1260, 2.75, true, true],
  ['media-transcoder', 'staging', 5, 18, 32, 870, 0.6, true],
  ['audit-log-shipper', 'production', 3, 0.5, 1, 22, 0, true],
  ['billing-ledger', 'production', 6, 4.25, 12, 158, 0.08, false],
  ['docs-renderer', 'development', 1, 0.25, 0.5, 210, 0.3, true],
  ['config-service', 'production', 4, 1, 2, 18, 0, true],
  ['feature-flags', 'staging', 2, 0.5, 1, 12, 0, true],
].map(
  ([
    name,
    environment,
    replicas,
    cpu,
    memory,
    latency,
    errorRate,
    manage,
    degraded,
  ]) => ({
    id: `svc-${name}`,
    name: name as string,
    environment: environment as Environment,
    replicas: replicas as number,
    cpu: cpu as number,
    memory: memory as number,
    latency: latency as number,
    errorRate: errorRate as number,
    image: `registry.example.com/platform/${name}@sha256:${digest(name as string)}`,
    manage: manage as boolean,
    degraded: degraded as boolean | undefined,
  }),
)
const collator = new Intl.Collator('en', { numeric: true })
type Copy = (typeof text)['en']
function useCopy() {
  const { locale } = useLocale()
  const t = text[locale]
  const tag = locale === 'ko' ? 'ko-KR' : 'en-US'
  const number = (value: number, digits: number) =>
    value.toLocaleString(tag, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  return { t, number }
}
function Rules({ rules }: { rules: string[] }) {
  return (
    <ul className='table-guideline-rules'>
      {rules.map((rule) => (
        <li key={rule}>{rule}</li>
      ))}
    </ul>
  )
}
function Guideline({
  id,
  title,
  rules,
  children,
}: {
  id: string
  title: string
  rules: string[]
  children?: React.ReactNode
}) {
  return (
    <section className='table-guideline' aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
      <Rules rules={rules} />
      {children && <div className='table-guideline-preview'>{children}</div>}
    </section>
  )
}
function Status({ service, t }: { service: Service; t: Copy }) {
  if (!service.manage)
    return <StatusBadge tone='neutral'>{t.readOnly}</StatusBadge>
  return service.degraded ? (
    <StatusBadge tone='caution'>{t.degraded}</StatusBadge>
  ) : (
    <StatusBadge tone='success'>{t.running}</StatusBadge>
  )
}
function DensityPreview() {
  const { t, number } = useCopy()
  const [density, setDensity] = useState<'default' | 'compact'>('compact')
  return (
    <>
      <ToggleGroup
        aria-label={t.densityLabel}
        value={[density]}
        onValueChange={(next) => {
          if (next[0]) setDensity(next[0] as 'default' | 'compact')
        }}
      >
        <Toggle value='default'>{t.densityDefault}</Toggle>
        <Toggle value='compact'>{t.densityCompact}</Toggle>
      </ToggleGroup>
      <Table.Container bleed label={t.scrollCaption}>
        <Table.Root density={density}>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope='col'>{t.name}</Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.environment}</Table.HeaderCell>
              <Table.HeaderCell scope='col' numeric>
                {t.replicas}
              </Table.HeaderCell>
              <Table.HeaderCell scope='col' numeric>
                {t.cpu}
              </Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.status}</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {services.slice(0, 6).map((service) => (
              <Table.Row key={service.id}>
                <Table.HeaderCell scope='row'>{service.name}</Table.HeaderCell>
                <Table.Cell>{t.environments[service.environment]}</Table.Cell>
                <Table.Cell numeric>{number(service.replicas, 0)}</Table.Cell>
                <Table.Cell numeric>{number(service.cpu, 2)}</Table.Cell>
                <Table.Cell>
                  <Status service={service} t={t} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
    </>
  )
}
function AlignmentPreview() {
  const { t, number } = useCopy()
  const rows = services.slice(0, 4)
  return (
    <div className='table-guideline-pair'>
      <figure data-verdict='do'>
        <figcaption>
          <span className='table-guideline-verdict'>{t.do}</span>
          {t.alignDoCaption}
        </figcaption>
        <Table.Container bleed label={t.alignDoCaption}>
          <Table.Root density='compact'>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.name}</Table.HeaderCell>
                <Table.HeaderCell scope='col' numeric>
                  {t.cpu}
                </Table.HeaderCell>
                <Table.HeaderCell scope='col' numeric>
                  {t.memory}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {rows.map((service) => (
                <Table.Row key={service.id}>
                  <Table.HeaderCell scope='row'>
                    {service.name}
                  </Table.HeaderCell>
                  <Table.Cell numeric>{number(service.cpu, 2)}</Table.Cell>
                  <Table.Cell numeric>{number(service.memory, 1)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
      </figure>
      <figure data-verdict='dont'>
        <figcaption>
          <span className='table-guideline-verdict'>{t.dont}</span>
          {t.alignDontCaption}
        </figcaption>
        <Table.Container bleed label={t.alignDontCaption}>
          <Table.Root density='compact'>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.name}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.cpuShort}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.memoryShort}</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {rows.map((service) => (
                <Table.Row key={service.id}>
                  <Table.HeaderCell scope='row'>
                    {service.name}
                  </Table.HeaderCell>
                  <Table.Cell>{t.cpuCell(String(service.cpu))}</Table.Cell>
                  <Table.Cell>
                    {t.memoryCell(String(service.memory))}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
      </figure>
    </div>
  )
}
type SortKey = 'name' | 'replicas' | 'latency' | 'errorRate'
function SortingPreview() {
  const { t, number } = useCopy()
  const [sort, setSort] = useState<{ key: SortKey; direction: TableSort }>({
    key: 'latency',
    direction: 'descending',
  })
  const labels: Record<SortKey, string> = {
    name: t.name,
    replicas: t.replicas,
    latency: t.latency,
    errorRate: t.errorRate,
  }
  const rows = [...services.slice(0, 6)].sort((a, b) => {
    const order =
      sort.key === 'name'
        ? collator.compare(a.name, b.name)
        : a[sort.key] - b[sort.key]
    // Ties fall back to the stable ID, so equal rows never swap.
    return (
      (sort.direction === 'ascending' ? order : -order) ||
      collator.compare(a.id, b.id)
    )
  })
  const header = (key: SortKey, numeric = true) => (
    <Table.SortHeader
      numeric={numeric}
      sort={sort.key === key ? sort.direction : undefined}
      onSort={() =>
        setSort((old) =>
          old.key === key
            ? {
                key,
                direction:
                  old.direction === 'ascending' ? 'descending' : 'ascending',
              }
            : { key, direction: key === 'name' ? 'ascending' : 'descending' },
        )
      }
    >
      {labels[key]}
    </Table.SortHeader>
  )
  return (
    <>
      <Table.Container bleed label={t.sortCaption}>
        <Table.Root density='compact'>
          <Table.Caption>{t.sortCaption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              {header('name', false)}
              {header('replicas')}
              {header('latency')}
              {header('errorRate')}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map((service) => (
              <Table.Row key={service.id}>
                <Table.HeaderCell scope='row'>{service.name}</Table.HeaderCell>
                <Table.Cell numeric>{number(service.replicas, 0)}</Table.Cell>
                <Table.Cell numeric>{number(service.latency, 0)}</Table.Cell>
                <Table.Cell numeric>{number(service.errorRate, 2)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <p role='status' className='table-guideline-status'>
        {t.sortedBy(labels[sort.key], sort.direction === 'ascending')}
      </p>
    </>
  )
}
function LongValuesPreview() {
  const { t } = useCopy()
  const [notice, setNotice] = useState('')
  const copy = (service: Service) =>
    navigator.clipboard
      .writeText(service.image)
      .then(() => setNotice(t.copied(service.name)))
      .catch(() => setNotice(t.copyFailed))
  return (
    <>
      <Table.Container bleed label={t.longCaption}>
        <Table.Root density='compact'>
          <Table.Caption>{t.longCaption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope='col'>{t.name}</Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.image}</Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.status}</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {services.slice(0, 4).map((service) => (
              <Table.Row key={service.id}>
                <Table.HeaderCell scope='row'>{service.name}</Table.HeaderCell>
                <Table.Cell>
                  <span className='table-guideline-identifier'>
                    <Table.Truncate title={service.image}>
                      <code>{service.image}</code>
                    </Table.Truncate>
                    <Button
                      variant='ghost'
                      size='icon-small'
                      aria-label={t.copyImage(service.name)}
                      title={t.copyImage(service.name)}
                      onClick={() => copy(service)}
                    >
                      <Icon name='copy' />
                    </Button>
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Status service={service} t={t} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <p role='status' className='table-guideline-status'>
        {notice}
      </p>
    </>
  )
}
function SelectionPreview() {
  const { t, number } = useCopy()
  const messages = useMessages()
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState('')
  const size = 4
  const rows = services.slice(0, 8).slice((page - 1) * size, page * size)
  const selection = useTableSelection({
    rows,
    getId: (service) => service.id,
    canSelect: (service) => service.manage,
    defaultSelected: ['svc-search-indexer'],
  })
  const count = selection.selected.length
  return (
    <>
      <div className='table-guideline-toolbar'>
        <span>{t.selectedCount(count, selection.hiddenCount)}</span>
        <Button
          variant='outline'
          size='small'
          disabled={!count}
          onClick={() => {
            setNotice(t.restartRequested(count))
            selection.clear()
          }}
        >
          {t.restart}
        </Button>
        <Button
          variant='ghost'
          size='small'
          disabled={!count}
          onClick={selection.clear}
        >
          {t.clearSelection}
        </Button>
      </div>
      <Table.Container bleed label={t.selectionCaption}>
        <Table.Root density='compact'>
          <Table.Caption>{t.selectionCaption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell
                scope='col'
                align='center'
                className='table-guideline-check'
              >
                <Checkbox.Root
                  aria-label={t.selectPage}
                  {...selection.pageCheckbox}
                >
                  <Checkbox.Indicator />
                </Checkbox.Root>
              </Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.name}</Table.HeaderCell>
              <Table.HeaderCell scope='col' numeric>
                {t.replicas}
              </Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.status}</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map((service) => (
              <Table.Row
                key={service.id}
                selected={selection.isSelected(service.id)}
              >
                <Table.Cell align='center'>
                  <Checkbox.Root
                    aria-label={t.selectRow(service.name)}
                    {...selection.rowCheckbox(service)}
                  >
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                </Table.Cell>
                <Table.HeaderCell scope='row'>{service.name}</Table.HeaderCell>
                <Table.Cell numeric>{number(service.replicas, 0)}</Table.Cell>
                <Table.Cell>
                  <Status service={service} t={t} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <Pagination
        aria-label={t.pagination}
        labels={messages.pagination}
        page={page}
        pageCount={2}
        onPageChange={setPage}
      />
      <p role='status' className='table-guideline-status'>
        {notice}
      </p>
    </>
  )
}
function RowActionsPreview() {
  const { t, number } = useCopy()
  const [notice, setNotice] = useState('')
  return (
    <>
      <Table.Container bleed label={t.rowActionsCaption}>
        <Table.Root density='compact'>
          <Table.Caption>{t.rowActionsCaption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope='col'>{t.name}</Table.HeaderCell>
              <Table.HeaderCell scope='col' numeric>
                {t.replicas}
              </Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.status}</Table.HeaderCell>
              <Table.HeaderCell scope='col' align='end'>
                {t.actions}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {services.slice(0, 4).map((service) => (
              <Table.Row key={service.id}>
                <Table.HeaderCell scope='row'>
                  <TextLink href='#table-row-actions'>{service.name}</TextLink>
                </Table.HeaderCell>
                <Table.Cell numeric>{number(service.replicas, 0)}</Table.Cell>
                <Table.Cell>
                  <Status service={service} t={t} />
                </Table.Cell>
                <Table.Cell align='end'>
                  <span className='table-guideline-actions'>
                    <Button
                      variant='outline'
                      size='small'
                      onClick={() => setNotice(t.logsOpened(service.name))}
                    >
                      {t.viewLogs}
                    </Button>
                    <Menu.Root>
                      <Menu.Trigger
                        render={
                          <Button
                            variant='ghost'
                            size='icon-small'
                            aria-label={t.actionsFor(service.name)}
                          />
                        }
                      >
                        <Icon name='more' />
                      </Menu.Trigger>
                      <Menu.Portal>
                        <Menu.Content>
                          <Menu.Item
                            disabled={!service.manage}
                            onClick={() =>
                              setNotice(t.restartOne(service.name))
                            }
                          >
                            {t.restart}
                          </Menu.Item>
                          <Menu.Item
                            disabled={!service.manage}
                            onClick={() =>
                              setNotice(t.scaleOpened(service.name))
                            }
                          >
                            {t.scale}
                          </Menu.Item>
                          <Menu.Separator />
                          <Menu.Item
                            disabled={!service.manage}
                            onClick={() =>
                              setNotice(t.deleteOpened(service.name))
                            }
                          >
                            {t.deleteService}
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Portal>
                    </Menu.Root>
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <p role='status' className='table-guideline-status'>
        {notice}
      </p>
    </>
  )
}
type State = 'ready' | 'loading' | 'noResults' | 'noData' | 'error'
function StatesPreview() {
  const { t, number } = useCopy()
  const [state, setState] = useState<State>('loading')
  const columns = 4
  const labels: Record<State, string> = {
    ready: t.stateReady,
    loading: t.stateLoading,
    noResults: t.stateNoResults,
    noData: t.stateNoData,
    error: t.stateError,
  }
  return (
    <>
      <ToggleGroup
        aria-label={t.statesLabel}
        value={[state]}
        onValueChange={(next) => {
          if (next[0]) setState(next[0] as State)
        }}
      >
        {(Object.keys(labels) as State[]).map((key) => (
          <Toggle key={key} value={key}>
            {labels[key]}
          </Toggle>
        ))}
      </ToggleGroup>
      <Table.Container bleed label={t.statesCaption}>
        <Table.Root density='compact' aria-busy={state === 'loading'}>
          <Table.Caption>{t.statesCaption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope='col'>{t.name}</Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.environment}</Table.HeaderCell>
              <Table.HeaderCell scope='col' numeric>
                {t.replicas}
              </Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.status}</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {state === 'ready' &&
              services.slice(0, 4).map((service) => (
                <Table.Row key={service.id}>
                  <Table.HeaderCell scope='row'>
                    {service.name}
                  </Table.HeaderCell>
                  <Table.Cell>{t.environments[service.environment]}</Table.Cell>
                  <Table.Cell numeric>{number(service.replicas, 0)}</Table.Cell>
                  <Table.Cell>
                    <Status service={service} t={t} />
                  </Table.Cell>
                </Table.Row>
              ))}
            {state === 'loading' &&
              [0, 1, 2, 3].map((row) => (
                <Table.Row key={row}>
                  {Array.from({ length: columns }, (_, cell) => (
                    <Table.Cell key={cell}>
                      <Skeleton />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            {state === 'noResults' && (
              <Table.Message colSpan={columns}>
                <EmptyState.Root>
                  <EmptyState.Title level={4}>
                    {t.noResultsTitle}
                  </EmptyState.Title>
                  <EmptyState.Description>
                    {t.noResultsBody}
                  </EmptyState.Description>
                  <EmptyState.Actions>
                    <Button variant='outline' onClick={() => setState('ready')}>
                      {t.clearFilters}
                    </Button>
                  </EmptyState.Actions>
                </EmptyState.Root>
              </Table.Message>
            )}
            {state === 'noData' && (
              <Table.Message colSpan={columns}>
                <EmptyState.Root>
                  <EmptyState.Title level={4}>{t.noDataTitle}</EmptyState.Title>
                  <EmptyState.Description>
                    {t.noDataBody}
                  </EmptyState.Description>
                  <EmptyState.Actions>
                    <Button onClick={() => setState('ready')}>
                      {t.createService}
                    </Button>
                  </EmptyState.Actions>
                </EmptyState.Root>
              </Table.Message>
            )}
            {state === 'error' && (
              <Table.Message colSpan={columns}>
                <InlineMessage.Root tone='danger'>
                  <InlineMessage.Icon tone='danger' />
                  <InlineMessage.Content>
                    <InlineMessage.Title>{t.errorTitle}</InlineMessage.Title>
                    <InlineMessage.Description>
                      {t.errorBody}
                    </InlineMessage.Description>
                    <InlineMessage.Actions>
                      <Button
                        variant='outline'
                        onClick={() => setState('loading')}
                      >
                        {t.retry}
                      </Button>
                    </InlineMessage.Actions>
                  </InlineMessage.Content>
                </InlineMessage.Root>
              </Table.Message>
            )}
          </Table.Body>
        </Table.Root>
      </Table.Container>
    </>
  )
}
function ScrollingPreview() {
  const { t, number } = useCopy()
  return (
    <Table.Container
      bleed
      label={t.scrollLabel}
      orientation='both'
      className='table-guideline-bounded'
    >
      <Table.Root density='compact' stickyHeader>
        <Table.Caption>{t.scrollCaption}</Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell scope='col'>{t.name}</Table.HeaderCell>
            <Table.HeaderCell scope='col'>{t.environment}</Table.HeaderCell>
            <Table.HeaderCell scope='col' numeric>
              {t.replicas}
            </Table.HeaderCell>
            <Table.HeaderCell scope='col' numeric>
              {t.cpu}
            </Table.HeaderCell>
            <Table.HeaderCell scope='col' numeric>
              {t.memory}
            </Table.HeaderCell>
            <Table.HeaderCell scope='col' numeric>
              {t.latency}
            </Table.HeaderCell>
            <Table.HeaderCell scope='col' numeric>
              {t.errorRate}
            </Table.HeaderCell>
            <Table.HeaderCell scope='col'>{t.status}</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {services.map((service) => (
            <Table.Row key={service.id}>
              <Table.HeaderCell scope='row'>{service.name}</Table.HeaderCell>
              <Table.Cell>{t.environments[service.environment]}</Table.Cell>
              <Table.Cell numeric>{number(service.replicas, 0)}</Table.Cell>
              <Table.Cell numeric>{number(service.cpu, 2)}</Table.Cell>
              <Table.Cell numeric>{number(service.memory, 1)}</Table.Cell>
              <Table.Cell numeric>{number(service.latency, 0)}</Table.Cell>
              <Table.Cell numeric>{number(service.errorRate, 2)}</Table.Cell>
              <Table.Cell>
                <Status service={service} t={t} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.Container>
  )
}
export function TableGuidelines() {
  const { t } = useCopy()
  return (
    <div className='table-guidelines'>
      <p>{t.intro}</p>
      <Guideline
        id='table-choose'
        title={t.chooseTitle}
        rules={t.chooseRules}
      />
      <Guideline
        id='table-density'
        title={t.densityTitle}
        rules={t.densityRules}
      >
        <DensityPreview />
      </Guideline>
      <Guideline id='table-alignment' title={t.alignTitle} rules={t.alignRules}>
        <AlignmentPreview />
      </Guideline>
      <Guideline id='table-sorting' title={t.sortTitle} rules={t.sortRules}>
        <SortingPreview />
      </Guideline>
      <Guideline id='table-long-values' title={t.longTitle} rules={t.longRules}>
        <LongValuesPreview />
      </Guideline>
      <Guideline
        id='table-selection'
        title={t.selectionTitle}
        rules={t.selectionRules}
      >
        <SelectionPreview />
      </Guideline>
      <Guideline
        id='table-row-actions'
        title={t.rowActionsTitle}
        rules={t.rowActionsRules}
      >
        <RowActionsPreview />
      </Guideline>
      <Guideline id='table-states' title={t.statesTitle} rules={t.statesRules}>
        <StatesPreview />
      </Guideline>
      <Guideline
        id='table-scrolling'
        title={t.scrollTitle}
        rules={t.scrollRules}
      >
        <ScrollingPreview />
      </Guideline>
    </div>
  )
}
export default TableGuidelines
