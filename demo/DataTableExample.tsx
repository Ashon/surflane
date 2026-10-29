import React, { useContext, useEffect, useId, useRef, useState } from 'react'
import {
  Field,
  Table,
  Checkbox,
  Button,
  FilterBar,
  Input,
  NativeSelect,
  Menu,
  Pagination,
  EmptyState,
  InlineMessage,
  Skeleton,
  StatusBadge,
  useTableSelection,
  Link as TextLink,
} from '@surflane/ui'
import { Link } from './router'
import { useLocale, useMessages } from './i18n'
import { text } from './i18n/pages/DataTableExample'
import {
  PreviewDensityContext,
  PreviewTableVariantContext,
} from './previewOptions'
const resources = [
  {
    id: 'workspace',
    name: 'Workspace',
    product: 'Workspace',
    region: 'production',
    instances: 12,
    manage: true,
    href: '/patterns/app-shell',
  },
  {
    id: 'docs',
    name: 'Documentation',
    product: 'Documentation',
    region: 'development',
    instances: 2,
    manage: false,
    href: '/foundations/typography',
  },
  {
    id: 'inventory',
    name: 'Inventory main',
    product: 'Inventory',
    region: 'staging',
    instances: 8,
    manage: true,
    href: '/components/table',
  },
  {
    id: 'discovery',
    name: 'Environment discovery',
    product: 'Workspace',
    region: 'production',
    instances: 24,
    manage: true,
    href: '/patterns/form-workflow',
  },
  {
    id: 'inventory-review',
    name: 'Inventory review',
    product: 'Inventory',
    region: 'development',
    instances: 3,
    manage: true,
    href: '/patterns/resource-list',
  },
  {
    id: 'layout',
    name: 'Layout guide',
    product: 'Documentation',
    region: 'development',
    instances: 1,
    manage: false,
    href: '/foundations/layout',
  },
  {
    id: 'release',
    name: 'Release pipeline',
    product: 'Workspace',
    region: 'staging',
    instances: 6,
    manage: true,
    href: '/components/badge',
  },
  {
    id: 'runtime',
    name: 'Runtime inventory',
    product: 'Inventory',
    region: 'production',
    instances: 18,
    manage: true,
    href: '/components/list',
  },
  {
    id: 'long',
    name: 'Project deployment / platform-api-abcdefghijklmnopqrstuvwxyz0123456789',
    product: 'Documentation',
    region: 'staging',
    instances: 4,
    manage: true,
    href: '/components/code',
  },
]
type Resource = (typeof resources)[number]
type Mode = 'ready' | 'loading' | 'error' | 'permission' | 'empty'
type SortKey = 'name' | 'product' | 'region' | 'instances'
type Column = 'product' | 'region' | 'instances'
const collator = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base',
})
// Text sorts ascending first; numbers descending first, so the largest comes up.
const firstAscending = (key: SortKey) => key !== 'instances'
const compare = (a: Resource, b: Resource, key: SortKey) =>
  key === 'instances'
    ? a.instances - b.instances
    : collator.compare(a[key], b[key])
export function DataTableExample() {
  const { locale } = useLocale()
  const t = text[locale]
  const messages = useMessages()
  const density = useContext(PreviewDensityContext)
  const variant = useContext(PreviewTableVariantContext)
  const number = new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US')
  const [mode, setMode] = useState<Mode>('ready'),
    [query, setQuery] = useState(''),
    [product, setProduct] = useState('all')
  const [sort, setSort] = useState<{ key: SortKey; ascending: boolean }>({
    key: 'name',
    ascending: true,
  })
  const [page, setPage] = useState(1),
    [size, setSize] = useState(3),
    [selected, setSelected] = useState<string[]>([]),
    [reviewed, setReviewed] = useState<string[]>([])
  const [columns, setColumns] = useState<Record<Column, boolean>>({
      product: true,
      region: true,
      instances: true,
    }),
    [notice, setNotice] = useState('')
  const input = useRef<HTMLInputElement>(null),
    focusSearch = useRef(false),
    resultId = useId()
  useEffect(() => {
    if (mode === 'ready' && focusSearch.current) {
      focusSearch.current = false
      input.current?.focus()
    }
  }, [mode])
  // Filter, then sort with an ID tie-break, then page.
  const filtered = resources.filter(
    (row) =>
      (product === 'all' || row.product === product) &&
      `${row.name} ${row.product} ${row.region}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  )
  const sorted = [...filtered].sort(
    (a, b) =>
      (sort.ascending ? 1 : -1) * compare(a, b, sort.key) ||
      collator.compare(a.id, b.id),
  )
  const pageCount = Math.ceil(sorted.length / size),
    current = Math.max(1, Math.min(page, pageCount || 1)),
    rows = sorted.slice((current - 1) * size, current * size)
  const selection = useTableSelection({
    rows,
    getId: (row) => row.id,
    canSelect: (row) => row.manage,
    selected,
    onSelectedChange: setSelected,
  })
  const ready = mode === 'ready',
    active = Boolean(query.trim()) || product !== 'all'
  const labels: Record<SortKey, string> = {
    name: t.name,
    product: t.product,
    region: t.environment,
    instances: t.instances,
  }
  const columnCount =
    3 + Object.values(columns).filter((visible) => visible).length
  function resetFilters() {
    setQuery('')
    setProduct('all')
    setPage(1)
    input.current?.focus()
  }
  function recover() {
    focusSearch.current = true
    setMode('ready')
  }
  function updateSort(key: SortKey) {
    const ascending = sort.key === key ? !sort.ascending : firstAscending(key)
    setSort({ key, ascending })
    setPage(1)
    setNotice(t.sortedBy(labels[key], ascending))
  }
  function column(key: Column, checked: boolean) {
    setColumns((old) => ({ ...old, [key]: checked }))
    if (!checked && sort.key === key) {
      setSort({ key: 'name', ascending: true })
      setPage(1)
    }
  }
  const sortHeader = (key: SortKey) => (
    <Table.SortHeader
      numeric={key === 'instances'}
      sort={
        sort.key === key
          ? sort.ascending
            ? 'ascending'
            : 'descending'
          : undefined
      }
      onSort={() => updateSort(key)}
      disabled={!ready || !filtered.length}
    >
      {labels[key]}
    </Table.SortHeader>
  )
  const message = (content: React.ReactNode) => (
    <Table.Message colSpan={columnCount}>{content}</Table.Message>
  )
  return (
    <div className='data-table-example'>
      <Field.Root className='data-table-state'>
        <Field.Label>{t.previewTableState}</Field.Label>
        <NativeSelect
          value={mode}
          onChange={(event) => {
            const next = event.target.value as Mode
            setMode(next)
            setNotice('')
            if (next === 'permission') setSelected([])
          }}
        >
          {['ready', 'loading', 'error', 'permission', 'empty'].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </NativeSelect>
      </Field.Root>
      <FilterBar.Root
        label={t.filterTableResources}
        onSubmit={(event) => event.preventDefault()}
        onReset={(event) => {
          event.preventDefault()
          resetFilters()
        }}
      >
        <FilterBar.Controls>
          <FilterBar.Field width='search'>
            {t.searchResources}
            <Input
              ref={input}
              type='search'
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder={t.searchPlaceholder}
              aria-controls={resultId}
              disabled={!ready}
            />
          </FilterBar.Field>
          <FilterBar.Field>
            {t.product}
            <NativeSelect
              value={product}
              disabled={!ready}
              onChange={(event) => {
                setProduct(event.target.value)
                setPage(1)
              }}
            >
              <option value='all'>{t.allProducts}</option>
              {['Workspace', 'Inventory', 'Documentation'].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </NativeSelect>
          </FilterBar.Field>
          <FilterBar.Actions>
            <Button type='reset' variant='outline' disabled={!ready || !active}>
              {t.clearFilters}
            </Button>
          </FilterBar.Actions>
        </FilterBar.Controls>
        <FilterBar.Summary>
          {ready
            ? t.summary(
                filtered.length,
                resources.length,
                selected.length,
                selection.hiddenCount,
              )
            : mode === 'loading'
              ? t.loadingPreview
              : mode === 'error'
                ? t.requestFailed
                : mode === 'permission'
                  ? t.accessRequired
                  : t.noRegistered}
        </FilterBar.Summary>
      </FilterBar.Root>
      <div id={resultId}>
        <div className='data-table-toolbar'>
          {mode === 'loading' ? (
            <>
              <p>{t.loadingDescription}</p>
              <Button variant='outline' onClick={recover}>
                {t.completePreview}
              </Button>
            </>
          ) : (
            <>
              <div className='actions'>
                <Button
                  variant='outline'
                  disabled={!ready || !selected.length}
                  onClick={() => {
                    const ids = selected.filter((id) =>
                      resources.some((row) => row.id === id && row.manage),
                    )
                    setReviewed((old) => [...new Set([...old, ...ids])])
                    selection.clear()
                    setNotice(t.markedReviewed(ids.length))
                  }}
                >
                  {t.markReviewed(selected.length)}
                </Button>
                <Button
                  variant='ghost'
                  disabled={!ready || !selected.length}
                  onClick={() => {
                    selection.clear()
                    setNotice(t.selectionCleared)
                  }}
                >
                  {t.clearSelection}
                </Button>
              </div>
              <Menu.Root>
                <Menu.Trigger
                  render={<Button variant='outline' disabled={!ready} />}
                >
                  {t.columns}
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Content>
                    <Menu.CheckboxItem checked disabled>
                      <Menu.CheckboxItemIndicator />
                      {t.nameRequired}
                    </Menu.CheckboxItem>
                    {(['product', 'region', 'instances'] as const).map(
                      (key) => (
                        <Menu.CheckboxItem
                          key={key}
                          checked={columns[key]}
                          closeOnClick={false}
                          onCheckedChange={(checked) => column(key, checked)}
                        >
                          <Menu.CheckboxItemIndicator />
                          {labels[key]}
                        </Menu.CheckboxItem>
                      ),
                    )}
                  </Menu.Content>
                </Menu.Portal>
              </Menu.Root>
            </>
          )}
        </div>
        {/* The header and columns stay put in every state; messages fill the body. */}
        <Table.Container label={t.tableScrollLabel} orientation='horizontal'>
          <Table.Root
            layout='fixed'
            minWidth='50rem'
            density={density}
            variant={variant}
            aria-busy={mode === 'loading' || undefined}
          >
            <Table.Caption>{t.caption}</Table.Caption>
            {/* Fixed widths keep the columns still while rows turn into skeletons or a message. */}
            <Table.Columns>
              <Table.Column width='3.5rem' />
              <Table.Column />
              {columns.product && <Table.Column width='9.5rem' />}
              {columns.region && <Table.Column width='9.5rem' />}
              {columns.instances && <Table.Column width='8rem' />}
              <Table.Column width='9.5rem' />
            </Table.Columns>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>
                  <Checkbox.Root
                    aria-label={t.selectManageableRows}
                    {...selection.pageCheckbox}
                    disabled={!ready || selection.pageCheckbox.disabled}
                  >
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                </Table.HeaderCell>
                {sortHeader('name')}
                {columns.product && sortHeader('product')}
                {columns.region && sortHeader('region')}
                {columns.instances && sortHeader('instances')}
                <Table.HeaderCell scope='col'>{t.state}</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {mode === 'loading'
                ? Array.from({ length: size }, (_, row) => (
                    <Table.Row key={row}>
                      {Array.from({ length: columnCount }, (_, cell) => (
                        <Table.Cell key={cell}>
                          <Skeleton />
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                : mode === 'error'
                  ? message(
                      <InlineMessage.Root tone='danger'>
                        <InlineMessage.Icon tone='danger' />
                        <InlineMessage.Content>
                          <InlineMessage.Title>
                            {t.loadFailedTitle}
                          </InlineMessage.Title>
                          <InlineMessage.Description>
                            {t.keptDescription}
                          </InlineMessage.Description>
                          <InlineMessage.Actions>
                            <Button variant='outline' onClick={recover}>
                              {t.retryPreview}
                            </Button>
                          </InlineMessage.Actions>
                        </InlineMessage.Content>
                      </InlineMessage.Root>,
                    )
                  : mode === 'permission'
                    ? message(
                        <EmptyState.Root>
                          <EmptyState.Title level={4}>
                            {t.accessRequired}
                          </EmptyState.Title>
                          <EmptyState.Description>
                            {t.accessDescription}
                          </EmptyState.Description>
                          <EmptyState.Actions>
                            <Button variant='outline' onClick={recover}>
                              {t.restoreAccess}
                            </Button>
                          </EmptyState.Actions>
                        </EmptyState.Root>,
                      )
                    : mode === 'empty' || !filtered.length
                      ? message(
                          <EmptyState.Root>
                            <EmptyState.Title level={4}>
                              {mode === 'empty' ? t.noRegistered : t.noMatching}
                            </EmptyState.Title>
                            <EmptyState.Description>
                              {mode === 'empty'
                                ? t.emptyExampleDescription
                                : t.changeFilterDescription}
                            </EmptyState.Description>
                            <EmptyState.Actions>
                              <Button
                                variant='outline'
                                onClick={
                                  mode === 'empty' ? recover : resetFilters
                                }
                              >
                                {mode === 'empty'
                                  ? t.restorePreview
                                  : t.resetFilters}
                              </Button>
                            </EmptyState.Actions>
                          </EmptyState.Root>,
                        )
                      : rows.map((row) => (
                          <Table.Row
                            key={row.id}
                            selected={selection.isSelected(row.id)}
                          >
                            <Table.Cell>
                              <Checkbox.Root
                                aria-label={t.selectRow(row.name)}
                                {...selection.rowCheckbox(row)}
                              >
                                <Checkbox.Indicator />
                              </Checkbox.Root>
                            </Table.Cell>
                            <Table.HeaderCell scope='row'>
                              <TextLink render={<Link href={row.href} />}>
                                {row.name}
                              </TextLink>
                            </Table.HeaderCell>
                            {columns.product && (
                              <Table.Cell>{row.product}</Table.Cell>
                            )}
                            {columns.region && (
                              <Table.Cell>{row.region}</Table.Cell>
                            )}
                            {columns.instances && (
                              <Table.Cell numeric>
                                {number.format(row.instances)}
                              </Table.Cell>
                            )}
                            <Table.Cell>
                              <StatusBadge
                                tone={
                                  !row.manage
                                    ? 'neutral'
                                    : reviewed.includes(row.id)
                                      ? 'success'
                                      : 'caution'
                                }
                              >
                                {!row.manage
                                  ? t.readOnly
                                  : reviewed.includes(row.id)
                                    ? t.reviewed
                                    : t.needsReview}
                              </StatusBadge>
                            </Table.Cell>
                          </Table.Row>
                        ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        {ready && filtered.length > 0 && (
          <>
            <div className='data-table-pagination'>
              <Field.Root>
                <Field.Label>{t.rowsPerPage}</Field.Label>
                <NativeSelect
                  value={String(size)}
                  onChange={(event) => {
                    setSize(Number(event.target.value))
                    setPage(1)
                  }}
                >
                  {[3, 5, 10].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </NativeSelect>
              </Field.Root>
              <Pagination
                page={current}
                pageCount={pageCount}
                onPageChange={setPage}
                aria-label={t.resultPages}
                labels={messages.pagination}
              />
            </div>
            <p>
              {t.footer(
                (current - 1) * size + 1,
                Math.min(current * size, filtered.length),
                filtered.length,
              )}
            </p>
          </>
        )}
      </div>
      <p role='status' aria-label={t.actionResultLabel}>
        {notice}
      </p>
    </div>
  )
}
