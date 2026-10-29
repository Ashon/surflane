import React, { useMemo, useRef, useState } from 'react'
import {
  Stack,
  Text,
  Inline,
  Field,
  Button,
  Checkbox,
  InlineMessage,
  NativeSelect,
  Spinner,
  ChoiceLabel,
} from '@surflane/ui'
import { Tree, type TreeNode } from '@surflane/ui/tree'
import { useLocale } from './i18n'
import { text } from './i18n/pages/TreeExample'
const small: TreeNode[] = [
  {
    id: 'projects',
    label: 'Projects',
    children: [
      {
        id: 'workspace',
        label: 'Workspace',
        children: [
          {
            id: 'staging',
            label: 'Staging environment',
            children: [
              { id: 'alpha', label: 'Alpha service' },
              { id: 'beta', label: 'Beta service' },
              { id: 'korean', label: '한글 배포 서비스' },
            ],
          },
          { id: 'reserved', label: 'Reserved environment', disabled: true },
        ],
      },
      {
        id: 'docs',
        label: 'Documentation',
        children: [
          { id: 'guides', label: 'Guides' },
          { id: 'api', label: 'API reference' },
        ],
      },
    ],
  },
  {
    id: 'shared',
    label: 'Shared resources',
    children: [
      { id: 'build-logs', label: 'Build logs' },
      { id: 'reports', label: 'Reports' },
    ],
  },
]
const large: TreeNode[] = Array.from({ length: 100 }, (_, group) => ({
  id: `batch-${group}`,
  label: `Batch ${String(group + 1).padStart(3, '0')}`,
  children: Array.from({ length: 100 }, (_, index) => ({
    id: `resource-${group}-${index}`,
    label: `Resource ${String(group + 1).padStart(3, '0')}-${String(index + 1).padStart(3, '0')}`,
  })),
}))
export function TreeExample() {
  const t = text[useLocale().locale]
  const datasetControl = useRef<HTMLButtonElement>(null)
  const [dataset, setDataset] = useState('resources'),
    [mode, setMode] = useState<'single' | 'multiple'>('single')
  const [long, setLong] = useState(false),
    [rtl, setRtl] = useState(false),
    [virtualized, setVirtualized] = useState(true)
  const [expanded, setExpanded] = useState<string[]>(['projects', 'workspace']),
    [selected, setSelected] = useState<string[]>([]),
    [removed, setRemoved] = useState<string[]>([])
  const nodes = useMemo(() => {
    function prepare(items: readonly TreeNode[]): TreeNode[] {
      return items
        .filter((item) => !removed.includes(item.id))
        .map((item) => ({
          ...item,
          label: long
            ? `${item.label} / platform-api-abcdefghijklmnopqrstuvwxyz0123456789`
            : item.label,
          children: item.children ? prepare(item.children) : undefined,
        }))
    }
    return dataset === 'empty'
      ? []
      : prepare(dataset === 'large' ? large : small)
  }, [dataset, long, removed])
  const labels = useMemo(() => {
    const map = new Map<string, string>()
    function visit(items: readonly TreeNode[]) {
      for (const item of items) {
        map.set(item.id, item.label)
        if (item.children) visit(item.children)
      }
    }
    visit(nodes)
    return map
  }, [nodes])
  function changeDataset(next: string) {
    setDataset(next)
    setRemoved([])
    setSelected([])
    setExpanded(next === 'large' ? ['batch-0'] : ['projects', 'workspace'])
  }
  return (
    <Stack gap={5} className='tree-example'>
      <div className='tree-preview-settings'>
        <Field.Root>
          <Field.Label>{t.previewDataset}</Field.Label>
          <NativeSelect
            ref={datasetControl}
            value={dataset}
            onChange={(event) => changeDataset(event.target.value)}
          >
            <option value='resources'>{t.datasetResources}</option>
            <option value='large'>{t.datasetLarge}</option>
            <option value='empty'>{t.datasetEmpty}</option>
            <option value='loading'>{t.datasetLoading}</option>
            <option value='error'>{t.datasetError}</option>
          </NativeSelect>
        </Field.Root>
        <Field.Root>
          <Field.Label>{t.selectionMode}</Field.Label>
          <NativeSelect
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as 'single' | 'multiple')
              setSelected([])
            }}
          >
            <option value='single'>{t.modeSingle}</option>
            <option value='multiple'>{t.modeMultiple}</option>
          </NativeSelect>
        </Field.Root>
      </div>
      <Inline gap={3}>
        {(
          [
            [t.longLabels, long, setLong],
            [t.rightToLeft, rtl, setRtl],
            [t.virtualizeRows, virtualized, setVirtualized],
          ] as const
        ).map(([label, checked, change]) => (
          <ChoiceLabel
            key={label}
            control={
              <Checkbox.Root checked={checked} onCheckedChange={change}>
                <Checkbox.Indicator />
              </Checkbox.Root>
            }
          >
            {label}
          </ChoiceLabel>
        ))}
      </Inline>
      <Inline gap={3}>
        <Button variant='outline' onClick={() => setExpanded([])}>
          {t.collapseAll}
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            setExpanded(
              dataset === 'large'
                ? large.map((item) => item.id)
                : ['projects', 'workspace', 'staging', 'docs', 'shared'],
            )
          }
        >
          {t.expandAll}
        </Button>
        <Button
          variant='ghost'
          disabled={!selected.length}
          onClick={() => {
            setRemoved((previous) => [...previous, ...selected])
            setSelected([])
            datasetControl.current?.focus()
          }}
        >
          {t.removeSelected}
        </Button>
      </Inline>
      <Text color='secondary'>{t.loadedNodes(labels.size)}</Text>
      {dataset === 'loading' ? (
        <InlineMessage.Root tone='progress' role='status'>
          <Spinner size='small' label={t.loadingTree} />
          <InlineMessage.Content>
            <InlineMessage.Title>{t.loadingTitle}</InlineMessage.Title>
            <InlineMessage.Description>
              {t.loadingDescription}
            </InlineMessage.Description>
          </InlineMessage.Content>
        </InlineMessage.Root>
      ) : dataset === 'error' ? (
        <InlineMessage.Root tone='danger' role='alert'>
          <InlineMessage.Content>
            <InlineMessage.Title>{t.errorTitle}</InlineMessage.Title>
            <InlineMessage.Description>
              {t.errorDescription}
            </InlineMessage.Description>
            <InlineMessage.Actions>
              <Button
                onClick={() => {
                  changeDataset('resources')
                  datasetControl.current?.focus()
                }}
              >
                {t.retryLocalTree}
              </Button>
            </InlineMessage.Actions>
          </InlineMessage.Content>
        </InlineMessage.Root>
      ) : (
        <Tree
          nodes={nodes}
          label={t.treeLabel}
          selectedIds={selected}
          onSelectedIdsChange={setSelected}
          expandedIds={expanded}
          onExpandedIdsChange={setExpanded}
          selectionMode={mode}
          virtualized={virtualized}
          dir={rtl ? 'rtl' : 'ltr'}
          labels={{
            empty: t.emptyLabel,
            expand: t.expandNode,
            collapse: t.collapseNode,
            scrollArea: t.treeScrollArea,
          }}
          height={352}
        />
      )}
      <Text color='secondary' role='status' aria-label={t.treeSelectionLabel}>
        {selected.length
          ? t.selected(selected.map((id) => labels.get(id) ?? id).join(', '))
          : t.noSelected}
      </Text>
    </Stack>
  )
}
