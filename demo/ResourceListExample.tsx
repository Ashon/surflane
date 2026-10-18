import React, { useEffect, useRef, useState } from 'react'
import {
  List,
  Checkbox,
  Button,
  StatusBadge,
  Menu,
  NativeSelect,
  FilterBar,
  Input,
  EmptyState,
  InlineMessage,
  Spinner,
  type StatusTone,
} from '@surflane/ui'
import { Link } from './router'
const resources = [
  {
    id: 'workspace',
    name: 'Platform workspace',
    product: 'Workspace',
    description: 'Operational layout and page header',
    href: '/patterns/page-header',
    tone: 'success',
    status: 'Ready',
    canManage: true,
  },
  {
    id: 'inventory',
    name: 'Resource inventory',
    product: 'Inventory',
    description: 'Resource comparison and inventory table',
    href: '/components/table',
    tone: 'caution',
    status: 'Review needed',
    canManage: true,
  },
  {
    id: 'writing',
    name: 'Writing guide',
    product: 'Documentation',
    description: 'Typography and reading conventions',
    href: '/foundations/typography',
    tone: 'neutral',
    status: 'Read-only',
    canManage: false,
  },
  {
    id: 'identifier',
    name: '프로젝트 배포 / platform-api-abcdefghijklmnopqrstuvwxyz0123456789',
    product: 'Workspace',
    description: 'Long mixed-language resource name and identifier',
    href: '/components/code',
    tone: 'progress',
    status: 'In progress',
    canManage: true,
  },
] as const
type Mode = 'ready' | 'loading' | 'error' | 'permission' | 'empty'
export function ResourceListExample() {
  const [mode, setMode] = useState<Mode>('ready'),
    [query, setQuery] = useState(''),
    [selected, setSelected] = useState<string[]>([]),
    [reviewed, setReviewed] = useState<string[]>([]),
    [notice, setNotice] = useState('')
  const search = useRef<HTMLInputElement>(null)
  const pendingFocus = useRef(false)
  useEffect(() => {
    if (mode === 'ready' && pendingFocus.current) {
      pendingFocus.current = false
      search.current?.focus()
    }
  }, [mode])
  const visible = resources.filter((item) =>
    `${item.name} ${item.product}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  )
  const selectable = visible
    .filter((item) => item.canManage)
    .map((item) => item.id)
  const visibleSelected = selectable.filter((id) => selected.includes(id))
  const checked =
    selectable.length > 0 && visibleSelected.length === selectable.length
  const update = (id: string, value: boolean) =>
    setSelected((current) =>
      value
        ? [...new Set([...current, id])]
        : current.filter((key) => key !== id),
    )
  const restore = () => {
    pendingFocus.current = true
    setMode('ready')
  }
  return (
    <div className='resource-list-example'>
      <label className='resource-preview-mode'>
        Result state
        <NativeSelect
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as Mode)
            setNotice('')
          }}
        >
          <option value='ready'>Ready</option>
          <option value='loading'>Loading</option>
          <option value='error'>Error</option>
          <option value='permission'>Permission restricted</option>
          <option value='empty'>Initially empty</option>
        </NativeSelect>
      </label>
      <FilterBar.Root
        label='Find resource examples'
        onSubmit={(e) => e.preventDefault()}
      >
        <FilterBar.Controls>
          <FilterBar.Field width='search'>
            Find resources
            <Input
              ref={search}
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Name or product…'
              disabled={mode === 'permission'}
              aria-describedby={
                mode === 'permission' ? 'resource-access-note' : undefined
              }
              aria-controls='resource-preview-results'
            />
          </FilterBar.Field>
          <FilterBar.Actions>
            <Button
              variant='outline'
              disabled={!query || mode === 'permission'}
              onClick={() => {
                setQuery('')
                search.current?.focus()
              }}
            >
              Clear search
            </Button>
          </FilterBar.Actions>
        </FilterBar.Controls>
        <FilterBar.Summary>
          {mode === 'ready'
            ? `${visible.length} resources / ${selected.length} selected / ${visibleSelected.length} visible selections`
            : `Preview state: ${mode}`}
        </FilterBar.Summary>
      </FilterBar.Root>
      <div id='resource-preview-results' aria-busy={mode === 'loading'}>
        {mode === 'loading' ? (
          <div className='resource-loading'>
            <Spinner label='Loading resource preview' />
            <span>
              Waiting for preview resources. Change the result state to
              continue.
            </span>
          </div>
        ) : mode === 'error' ? (
          <InlineMessage.Root tone='danger' role='alert'>
            <InlineMessage.Icon tone='danger' />
            <InlineMessage.Content>
              <InlineMessage.Title>
                Resources could not be loaded
              </InlineMessage.Title>
              <InlineMessage.Description>
                Your search and selection are retained.
              </InlineMessage.Description>
              <InlineMessage.Actions>
                <Button variant='outline' onClick={restore}>
                  Retry preview
                </Button>
              </InlineMessage.Actions>
            </InlineMessage.Content>
          </InlineMessage.Root>
        ) : mode === 'permission' ? (
          <EmptyState.Root>
            <EmptyState.Title>Resource access unavailable</EmptyState.Title>
            <EmptyState.Description id='resource-access-note'>
              This preview account can't access the resource collection.
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button variant='outline' onClick={restore}>
                Restore preview access
              </Button>
            </EmptyState.Actions>
          </EmptyState.Root>
        ) : mode === 'empty' ? (
          <EmptyState.Root>
            <EmptyState.Title>No registered resources</EmptyState.Title>
            <EmptyState.Description>
              Add resources before filtering or inspecting them.
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button
                variant='outline'
                onClick={() => {
                  setQuery('')
                  restore()
                }}
              >
                Show sample resources
              </Button>
            </EmptyState.Actions>
          </EmptyState.Root>
        ) : visible.length === 0 ? (
          <EmptyState.Root>
            <EmptyState.Title>No matching resources</EmptyState.Title>
            <EmptyState.Description>
              Try another name or clear the search.
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button
                variant='outline'
                onClick={() => {
                  setQuery('')
                  search.current?.focus()
                }}
              >
                Reset resource search
              </Button>
            </EmptyState.Actions>
          </EmptyState.Root>
        ) : (
          <>
            <div className='resource-selection'>
              <label className='pui-choice-label'>
                <Checkbox.Root
                  checked={checked}
                  indeterminate={visibleSelected.length > 0 && !checked}
                  disabled={!selectable.length}
                  onCheckedChange={(value) =>
                    setSelected((current) =>
                      value
                        ? [...new Set([...current, ...selectable])]
                        : current.filter(
                            (id) =>
                              !selectable.includes(
                                id as (typeof selectable)[number],
                              ),
                          ),
                    )
                  }
                >
                  <Checkbox.Indicator />
                </Checkbox.Root>
                Select visible editable resources
              </label>
              <Button
                variant='ghost'
                disabled={!selected.length}
                onClick={() => {
                  setSelected([])
                  search.current?.focus()
                }}
              >
                Clear selection
              </Button>
            </div>
            <List.Root aria-label='Resource examples'>
              {visible.map((item) => (
                <List.Item key={item.id} selected={selected.includes(item.id)}>
                  <Checkbox.Root
                    aria-label={`Select ${item.name}`}
                    disabled={!item.canManage}
                    aria-describedby={
                      !item.canManage ? `resource-reason-${item.id}` : undefined
                    }
                    checked={selected.includes(item.id)}
                    onCheckedChange={(value) => update(item.id, value)}
                  >
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                  <List.Content>
                    <List.Title>
                      <Link href={item.href}>{item.name}</Link>
                    </List.Title>
                    <List.Description>
                      {item.product} / {item.description}
                      {!item.canManage && (
                        <span id={`resource-reason-${item.id}`}>
                          {' '}
                          / Read-only preview: review and selection unavailable.
                        </span>
                      )}
                    </List.Description>
                  </List.Content>
                  <List.Actions>
                    <StatusBadge
                      tone={
                        reviewed.includes(item.id)
                          ? 'success'
                          : (item.tone as StatusTone)
                      }
                    >
                      {reviewed.includes(item.id) ? 'Reviewed' : item.status}
                    </StatusBadge>
                    <Menu.Root>
                      <Menu.Trigger aria-label={`Actions for ${item.name}`}>
                        Actions
                      </Menu.Trigger>
                      <Menu.Portal>
                        <Menu.Content align='end'>
                          <Menu.Item
                            disabled={!item.canManage}
                            onClick={() => {
                              setReviewed((current) => [
                                ...new Set([...current, item.id]),
                              ])
                              setNotice(
                                `Marked ${item.name} as reviewed in this local preview.`,
                              )
                            }}
                          >
                            Mark reviewed
                          </Menu.Item>
                          <Menu.Item
                            disabled={
                              !item.canManage || !reviewed.includes(item.id)
                            }
                            onClick={() => {
                              setReviewed((current) =>
                                current.filter((id) => id !== item.id),
                              )
                              setNotice(
                                `Reset review for ${item.name} in this local preview.`,
                              )
                            }}
                          >
                            Reset review
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Portal>
                    </Menu.Root>
                  </List.Actions>
                </List.Item>
              ))}
            </List.Root>
          </>
        )}
      </div>
      <p role='status' className='resource-action-status'>
        {notice}
      </p>
      <p>
        Local design examples. Title links open the related documentation.
        Review actions don't contact product services.
      </p>
    </div>
  )
}
