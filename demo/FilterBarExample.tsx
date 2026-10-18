import React, { useRef, useState } from 'react'
import {
  FilterBar,
  Input,
  Select,
  Button,
  Icon,
  EmptyState,
} from '@surflane/ui'
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
    { value: 'all', label: 'All products' },
    { value: 'workspace', label: 'Workspace' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'docs', label: 'Documentation' },
  ]
  const statusOptions = [
    { value: 'all', label: 'All states' },
    { value: 'ready', label: 'Ready' },
    { value: 'pending', label: 'Pending' },
  ]
  return (
    <div className='filter-bar-example'>
      <FilterBar.Root
        label='Filter preview resources'
        onSubmit={(e) => e.preventDefault()}
        onReset={(e) => {
          e.preventDefault()
          clear()
        }}
      >
        <FilterBar.Controls>
          <FilterBar.Field width='search'>
            Search resources
            <Input
              ref={input}
              type='search'
              name='query'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Name or identifier…'
              leadingIcon={<Icon name='search' />}
              aria-controls='filter-preview-results'
            />
          </FilterBar.Field>
          <FilterBar.Field>
            Product
            <Select
              value={product}
              onValueChange={setProduct}
              options={productOptions}
              aria-label='Filter product'
            />
          </FilterBar.Field>
          <FilterBar.Field>
            State
            <Select
              value={status}
              onValueChange={setStatus}
              options={statusOptions}
              aria-label='Filter state'
            />
          </FilterBar.Field>
          <FilterBar.Actions>
            <Button type='reset' variant='outline' disabled={!active}>
              Clear all filters
            </Button>
          </FilterBar.Actions>
        </FilterBar.Controls>
        {active > 0 && (
          <FilterBar.Actions aria-label='Applied filters' role='group'>
            {query.trim() && (
              <Button
                variant='ghost'
                onClick={() => {
                  setQuery('')
                  input.current?.focus()
                }}
                aria-label={`Remove search filter: Search: ${query.trim()}`}
              >
                Search: {query.trim()}
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
                aria-label={`Remove product filter: ${productOptions.find((p) => p.value === product)?.label}`}
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
                aria-label={`Remove state filter: ${statusOptions.find((s) => s.value === status)?.label}`}
              >
                {statusOptions.find((s) => s.value === status)?.label}
                <Icon name='close' />
              </Button>
            )}
          </FilterBar.Actions>
        )}
        <FilterBar.Summary>
          {visible.length} of {resources.length} resources / {active} active
          filters
        </FilterBar.Summary>
      </FilterBar.Root>
      <div id='filter-preview-results'>
        {visible.length ? (
          <ul className='filter-preview-list'>
            {visible.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.status === 'ready' ? 'Ready' : 'Pending'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState.Root>
            <EmptyState.Title>No matching resources</EmptyState.Title>
            <EmptyState.Description>
              Try a different search term or filter combination.
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button variant='outline' onClick={clear}>
                Reset filters
              </Button>
            </EmptyState.Actions>
          </EmptyState.Root>
        )}
      </div>
      <p>
        Filters apply immediately in this local example. The product connects
        server requests, URL sync, and permissions.
      </p>
    </div>
  )
}
