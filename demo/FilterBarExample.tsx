import React, { useRef, useState } from 'react'
import {
  FilterBar,
  Input,
  Select,
  Button,
  Icon,
  EmptyState,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/FilterBarExample'
const resources = [
  { name: 'Workspace', product: 'workspace', status: 'ready' },
  { name: 'Inventory main', product: 'inventory', status: 'ready' },
  { name: 'Documentation', product: 'docs', status: 'pending' },
  {
    name: 'Project deployment platform-api-abcdefghijklmnopqrstuvwxyz0123456789',
    product: 'workspace',
    status: 'pending',
  },
]
export function FilterBarExample() {
  const t = text[useLocale().locale]
  const [query, setQuery] = useState(''),
    [product, setProduct] = useState('all'),
    [status, setStatus] = useState('all')
  const input = useRef<HTMLInputElement>(null)
  const visible = resources.filter(
    (item) =>
      (product === 'all' || item.product === product) &&
      (status === 'all' || item.status === status) &&
      item.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  )
  const active =
    Number(Boolean(query.trim())) +
    Number(product !== 'all') +
    Number(status !== 'all')
  const clear = () => {
    setQuery('')
    setProduct('all')
    setStatus('all')
    input.current?.focus()
  }
  const productOptions = [
    { value: 'all', label: t.allProducts },
    { value: 'workspace', label: t.workspace },
    { value: 'inventory', label: t.inventory },
    { value: 'docs', label: t.documentation },
  ]
  const statusOptions = [
    { value: 'all', label: t.allStates },
    { value: 'ready', label: t.ready },
    { value: 'pending', label: t.pending },
  ]
  return (
    <div className='filter-bar-example'>
      <FilterBar.Root
        label={t.filterPreviewResources}
        onSubmit={(e) => e.preventDefault()}
        onReset={(e) => {
          e.preventDefault()
          clear()
        }}
      >
        <FilterBar.Controls>
          <FilterBar.Field width='search'>
            {t.searchResources}
            <Input
              ref={input}
              type='search'
              name='query'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.nameOrIdentifier}
              leadingIcon={<Icon name='search' />}
              aria-controls='filter-preview-results'
            />
          </FilterBar.Field>
          <FilterBar.Field>
            {t.product}
            <Select
              value={product}
              onValueChange={setProduct}
              options={productOptions}
              aria-label={t.filterProduct}
            />
          </FilterBar.Field>
          <FilterBar.Field>
            {t.state}
            <Select
              value={status}
              onValueChange={setStatus}
              options={statusOptions}
              aria-label={t.filterState}
            />
          </FilterBar.Field>
          <FilterBar.Actions>
            <Button type='reset' variant='outline' disabled={!active}>
              {t.clearAllFilters}
            </Button>
          </FilterBar.Actions>
        </FilterBar.Controls>
        {active > 0 && (
          <FilterBar.Actions aria-label={t.appliedFilters} role='group'>
            {query.trim() && (
              <Button
                variant='ghost'
                onClick={() => {
                  setQuery('')
                  input.current?.focus()
                }}
                aria-label={t.removeSearchFilter(query.trim())}
              >
                {t.searchValue(query.trim())}
                <Icon name='close' />
              </Button>
            )}
            {product !== 'all' && (
              <Button
                variant='ghost'
                onClick={() => {
                  setProduct('all')
                  input.current?.focus()
                }}
                aria-label={t.removeProductFilter(
                  productOptions.find((p) => p.value === product)?.label ?? '',
                )}
              >
                {productOptions.find((p) => p.value === product)?.label}
                <Icon name='close' />
              </Button>
            )}
            {status !== 'all' && (
              <Button
                variant='ghost'
                onClick={() => {
                  setStatus('all')
                  input.current?.focus()
                }}
                aria-label={t.removeStateFilter(
                  statusOptions.find((s) => s.value === status)?.label ?? '',
                )}
              >
                {statusOptions.find((s) => s.value === status)?.label}
                <Icon name='close' />
              </Button>
            )}
          </FilterBar.Actions>
        )}
        <FilterBar.Summary>
          {t.summary(visible.length, resources.length, active)}
        </FilterBar.Summary>
      </FilterBar.Root>
      <div id='filter-preview-results'>
        {visible.length ? (
          <ul className='filter-preview-list'>
            {visible.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.status === 'ready' ? t.ready : t.pending}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState.Root>
            <EmptyState.Title>{t.noMatchingResources}</EmptyState.Title>
            <EmptyState.Description>
              {t.tryDifferentSearchTerm}
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button variant='outline' onClick={clear}>
                {t.resetFilters}
              </Button>
            </EmptyState.Actions>
          </EmptyState.Root>
        )}
      </div>
      <p>{t.footer}</p>
    </div>
  )
}
