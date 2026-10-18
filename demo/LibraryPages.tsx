import React, { useRef, useState } from 'react'
import { Grid, Input, Select, Button, FilterBar } from '@surflane/ui'
import {
  components,
  foundations,
  patterns,
  itemHref,
  stageLabels,
  type CatalogItem,
} from './catalog'
import { StageLabel } from './StageLabel'
import { Link } from './router'
export function FoundationIndex() {
  return <ItemList items={foundations} layout='grid' />
}
export function ItemList({
  items,
  layout = 'list',
  columns = 2,
}: {
  items: CatalogItem[]
  layout?: 'list' | 'grid'
  columns?: 2 | 3
}) {
  const children = items.map((item) => (
    <Link
      className='catalog-item'
      data-kind={item.kind}
      href={itemHref(item)}
      key={item.id}
    >
      <div>
        <div className='catalog-item-heading'>
          <strong>{item.name}</strong>
          <StageLabel item={item} />
        </div>
        <p>{item.summary}</p>
      </div>
    </Link>
  ))
  return layout === 'grid' ? (
    <Grid
      columns={columns}
      gap={4}
      bleed={4}
      className='catalog-item-list'
      data-layout='grid'
    >
      {children}
    </Grid>
  ) : (
    <div className='catalog-item-list' data-layout='list'>
      {children}
    </div>
  )
}
export function LibraryIndex({
  kind = 'component',
}: {
  kind?: 'component' | 'pattern'
}) {
  const [search, setSearch] = useState(''),
    [group, setGroup] = useState('all'),
    [stage, setStage] = useState('all')
  const searchInput = useRef<HTMLInputElement>(null)
  const resetFilters = () => {
    setSearch('')
    setGroup('all')
    setStage('all')
    searchInput.current?.focus()
  }
  const items = kind === 'component' ? components : patterns
  const categories = [...new Set(items.map((item) => item.group))]
  const visible = items.filter(
    (i) =>
      (group === 'all' || i.group === group) &&
      (stage === 'all' || i.stage === stage) &&
      `${i.name} ${i.summary} ${i.group}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  )
  return (
    <>
      <section>
        <FilterBar.Root
          label='Filter catalog'
          onSubmit={(e) => e.preventDefault()}
          onReset={(e) => {
            e.preventDefault()
            resetFilters()
          }}
        >
          <FilterBar.Controls>
            <FilterBar.Field width='search'>
              Search
              <Input
                ref={searchInput}
                type='search'
                aria-label='Search catalog'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Name, purpose, category…'
              />
            </FilterBar.Field>
            {kind === 'component' && (
              <FilterBar.Field>
                Category
                <Select
                  aria-label='Component category'
                  value={group}
                  onValueChange={setGroup}
                  options={[
                    { value: 'all', label: 'All categories' },
                    ...categories.map((g) => ({
                      value: g,
                      label: g,
                    })),
                  ]}
                />
              </FilterBar.Field>
            )}
            <FilterBar.Field>
              Readiness
              <Select
                aria-label='Component readiness'
                value={stage}
                onValueChange={setStage}
                options={[
                  { value: 'all', label: 'All stages' },
                  ...Object.entries(stageLabels).map(([value, label]) => ({
                    value,
                    label,
                  })),
                ]}
              />
            </FilterBar.Field>
            <FilterBar.Actions>
              <Button
                type='reset'
                variant='outline'
                disabled={!search && group === 'all' && stage === 'all'}
              >
                Clear filters
              </Button>
            </FilterBar.Actions>
          </FilterBar.Controls>
          <FilterBar.Summary className='catalog-count'>
            {visible.length} / {items.length} items
          </FilterBar.Summary>
        </FilterBar.Root>
        {visible.length ? (
          kind === 'component' ? (
            <div className='catalog-categories'>
              {categories.map((category) => {
                const categoryItems = visible.filter(
                  (item) => item.group === category,
                )
                if (!categoryItems.length) return null
                const heading = `component-category-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                return (
                  <section
                    key={category}
                    aria-labelledby={heading}
                    data-catalog-category={category}
                  >
                    <div className='catalog-category-header'>
                      <h2 id={heading}>{category}</h2>
                      <span>
                        {categoryItems.length}{' '}
                        {categoryItems.length === 1
                          ? 'component'
                          : 'components'}
                      </span>
                    </div>
                    <ItemList items={categoryItems} layout='grid' columns={3} />
                  </section>
                )
              })}
            </div>
          ) : (
            <ItemList items={visible} layout='grid' columns={3} />
          )
        ) : (
          <p>No matching items. Try a different search term or filter.</p>
        )}
      </section>
      {kind === 'pattern' && (
        <section>
          <h2>Interaction lab</h2>
          <p>
            Explore input, popups, nested panels, and themes together in one
            example.
          </p>
          <Link href='/patterns/interaction-lab'>Open interaction lab</Link>
        </section>
      )}
    </>
  )
}
