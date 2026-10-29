import React, { useEffect, useRef, useState } from 'react'
import {
  Inline,
  Text,
  Field,
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
  ChoiceLabel,
} from '@surflane/ui'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ResourceListExample'
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
  const t = text[useLocale().locale]
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
      <Field.Root className='resource-preview-mode'>
        <Field.Label>{t.resultState}</Field.Label>
        <NativeSelect
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as Mode)
            setNotice('')
          }}
        >
          <option value='ready'>{t.ready}</option>
          <option value='loading'>{t.loading}</option>
          <option value='error'>{t.error}</option>
          <option value='permission'>{t.permissionRestricted}</option>
          <option value='empty'>{t.initiallyEmpty}</option>
        </NativeSelect>
      </Field.Root>
      <FilterBar.Root
        label={t.findResourceExamples}
        onSubmit={(e) => e.preventDefault()}
      >
        <FilterBar.Controls>
          <FilterBar.Field width='search'>
            {t.findResources}
            <Input
              ref={search}
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
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
              {t.clearSearch}
            </Button>
          </FilterBar.Actions>
        </FilterBar.Controls>
        <FilterBar.Summary>
          {mode === 'ready'
            ? t.summary(visible.length, selected.length, visibleSelected.length)
            : t.previewState(mode)}
        </FilterBar.Summary>
      </FilterBar.Root>
      <div id='resource-preview-results' aria-busy={mode === 'loading'}>
        {mode === 'loading' ? (
          <Inline gap={3}>
            <Spinner label={t.loadingPreview} />
            <Text as='span' color='muted'>
              {t.waitingDescription}
            </Text>
          </Inline>
        ) : mode === 'error' ? (
          <InlineMessage.Root tone='danger' role='alert'>
            <InlineMessage.Icon tone='danger' />
            <InlineMessage.Content>
              <InlineMessage.Title>{t.loadFailedTitle}</InlineMessage.Title>
              <InlineMessage.Description>
                {t.retainedDescription}
              </InlineMessage.Description>
              <InlineMessage.Actions>
                <Button variant='outline' onClick={restore}>
                  {t.retryPreview}
                </Button>
              </InlineMessage.Actions>
            </InlineMessage.Content>
          </InlineMessage.Root>
        ) : mode === 'permission' ? (
          <EmptyState.Root>
            <EmptyState.Title>{t.accessUnavailable}</EmptyState.Title>
            <EmptyState.Description id='resource-access-note'>
              {t.accessDescription}
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button variant='outline' onClick={restore}>
                {t.restoreAccess}
              </Button>
            </EmptyState.Actions>
          </EmptyState.Root>
        ) : mode === 'empty' ? (
          <EmptyState.Root>
            <EmptyState.Title>{t.noRegistered}</EmptyState.Title>
            <EmptyState.Description>
              {t.addResourcesDescription}
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button
                variant='outline'
                onClick={() => {
                  setQuery('')
                  restore()
                }}
              >
                {t.showSample}
              </Button>
            </EmptyState.Actions>
          </EmptyState.Root>
        ) : visible.length === 0 ? (
          <EmptyState.Root>
            <EmptyState.Title>{t.noMatching}</EmptyState.Title>
            <EmptyState.Description>
              {t.tryAnotherDescription}
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button
                variant='outline'
                onClick={() => {
                  setQuery('')
                  search.current?.focus()
                }}
              >
                {t.resetSearch}
              </Button>
            </EmptyState.Actions>
          </EmptyState.Root>
        ) : (
          <>
            <div className='resource-selection'>
              <ChoiceLabel
                control={
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
                }
              >
                {t.selectVisibleEditable}
              </ChoiceLabel>
              <Button
                variant='ghost'
                disabled={!selected.length}
                onClick={() => {
                  setSelected([])
                  search.current?.focus()
                }}
              >
                {t.clearSelection}
              </Button>
            </div>
            <List.Root aria-label={t.listLabel}>
              {visible.map((item) => (
                <List.Item key={item.id} selected={selected.includes(item.id)}>
                  <Checkbox.Root
                    aria-label={t.selectItem(item.name)}
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
                          / {t.readOnlyPreview}
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
                      {reviewed.includes(item.id) ? t.reviewed : item.status}
                    </StatusBadge>
                    <Menu.Root>
                      <Menu.Trigger aria-label={t.actionsFor(item.name)}>
                        {t.actions}
                      </Menu.Trigger>
                      <Menu.Portal>
                        <Menu.Content align='end'>
                          <Menu.Item
                            disabled={!item.canManage}
                            onClick={() => {
                              setReviewed((current) => [
                                ...new Set([...current, item.id]),
                              ])
                              setNotice(t.markedReviewed(item.name))
                            }}
                          >
                            {t.markReviewed}
                          </Menu.Item>
                          <Menu.Item
                            disabled={
                              !item.canManage || !reviewed.includes(item.id)
                            }
                            onClick={() => {
                              setReviewed((current) =>
                                current.filter((id) => id !== item.id),
                              )
                              setNotice(t.reviewReset(item.name))
                            }}
                          >
                            {t.resetReview}
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
      <p>{t.footer}</p>
    </div>
  )
}
