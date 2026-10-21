import React, { useState } from 'react'
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
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/DataExamples'
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
  return (
    <svg
      aria-hidden='true'
      width='32'
      height='32'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    >
      <circle cx='10' cy='10' r='7' />
      <path d='m15 15 6 6' />
    </svg>
  )
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
          {state === 'pending' ? <Spinner decorative size='sm' /> : undefined}
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
export function DataExample({ id }: { id: string }) {
  const t = text[useLocale().locale]
  const [query, setQuery] = useState(''),
    [ascending, setAscending] = useState(true)
  const [selected, setSelected] = useState<string[]>([]),
    [inspected, setInspected] = useState('')
  if (id === 'empty-state') return <EmptyPreview />
  if (id === 'inline-message') return <MessagePreview />
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
          <Table.Root style={{ minWidth: 720 }}>
            <Table.Caption>{t.registeredEnvironmentsCaption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.selection}</Table.HeaderCell>
                <Table.HeaderCell
                  scope='col'
                  aria-sort={ascending ? 'ascending' : 'descending'}
                >
                  <Button
                    variant='ghost'
                    onClick={() => setAscending((v) => !v)}
                  >
                    {t.name}
                    <svg
                      width='14'
                      height='14'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      aria-hidden='true'
                    >
                      <path d={ascending ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
                    </svg>
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.cluster}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>
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
                  <Table.Cell>{row.count}</Table.Cell>
                  <Table.Cell>
                    <Button
                      variant='outline'
                      size='sm'
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
                  size='sm'
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
