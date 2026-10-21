import React, { useRef, useState } from 'react'
import { Grid, Input, Select, Button, FilterBar } from '@surflane/ui'
import {
  components,
  foundations,
  patterns,
  itemHref,
  stageLabels,
  type CatalogItem,
  type Stage,
} from './catalog'
import { StageLabel } from './StageLabel'
import { Link } from './router'
import { useCatalogText } from './catalogText'
import { useMessages } from './i18n'
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
  const text = useCatalogText()
  const children = items.map((item) => (
    <Link
      className='catalog-item'
      data-kind={item.kind}
      href={itemHref(item)}
      key={item.id}
    >
      <div>
        <div className='catalog-item-heading'>
          <strong>{text.name(item)}</strong>
          <StageLabel item={item} />
        </div>
        <p>{text.summary(item)}</p>
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
  const messages = useMessages()
  const library = messages.library
  const searchInput = useRef<HTMLInputElement>(null)
  const resetFilters = () => {
    setSearch('')
    setGroup('all')
    setStage('all')
    searchInput.current?.focus()
  }
  const items = kind === 'component' ? components : patterns
  const categories = [...new Set(items.map((item) => item.group))]
  const text = useCatalogText()
  const visible = items.filter(
    (i) =>
      (group === 'all' || i.group === group) &&
      (stage === 'all' || i.stage === stage) &&
      `${i.name} ${i.summary} ${i.group} ${text.name(i)} ${text.summary(i)} ${text.group(i.group)}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  )
  return (
    <>
      <section>
        <FilterBar.Root
          label={library.filter}
          onSubmit={(e) => e.preventDefault()}
          onReset={(e) => {
            e.preventDefault()
            resetFilters()
          }}
        >
          <FilterBar.Controls>
            <FilterBar.Field width='search'>
              {library.search}
              <Input
                ref={searchInput}
                type='search'
                aria-label={library.searchLabel}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={library.searchPlaceholder}
              />
            </FilterBar.Field>
            {kind === 'component' && (
              <FilterBar.Field>
                {library.category}
                <Select
                  aria-label={library.categoryLabel}
                  value={group}
                  onValueChange={setGroup}
                  options={[
                    { value: 'all', label: library.allCategories },
                    ...categories.map((g) => ({
                      value: g,
                      label: text.group(g),
                    })),
                  ]}
                />
              </FilterBar.Field>
            )}
            <FilterBar.Field>
              {library.readiness}
              <Select
                aria-label={library.readinessLabel}
                value={stage}
                onValueChange={setStage}
                options={[
                  { value: 'all', label: library.allStages },
                  ...Object.entries(stageLabels).map(([value, label]) => ({
                    value,
                    label: text.stage(value as Stage),
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
                {library.clearFilters}
              </Button>
            </FilterBar.Actions>
          </FilterBar.Controls>
          <FilterBar.Summary className='catalog-count'>
            {library.count(visible.length, items.length)}
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
                      <h2 id={heading}>{text.group(category)}</h2>
                      <span>{library.components(categoryItems.length)}</span>
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
          <p>{library.empty}</p>
        )}
      </section>
      {kind === 'pattern' && (
        <section>
          <h2>{library.labTitle}</h2>
          <p>{library.labBody}</p>
          <Link href='/patterns/interaction-lab'>{library.labLink}</Link>
        </section>
      )}
    </>
  )
}
