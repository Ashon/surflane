import React, { useMemo, useRef, useState } from 'react'
import {
  Button,
  Checkbox,
  InlineMessage,
  NativeSelect,
  Spinner,
  Tree,
  type TreeNode,
} from '@surflane/ui'
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
    <div className='example-stack tree-example'>
      <div className='tree-preview-settings'>
        <label>
          Preview dataset
          <NativeSelect
            ref={datasetControl}
            value={dataset}
            onChange={(event) => changeDataset(event.target.value)}
          >
            <option value='resources'>Resources</option>
            <option value='large'>Large tree / 10,100 nodes</option>
            <option value='empty'>Empty</option>
            <option value='loading'>Loading</option>
            <option value='error'>Error</option>
          </NativeSelect>
        </label>
        <label>
          Selection mode
          <NativeSelect
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as 'single' | 'multiple')
              setSelected([])
            }}
          >
            <option value='single'>Single</option>
            <option value='multiple'>Multiple</option>
          </NativeSelect>
        </label>
      </div>
      <div className='actions'>
        {(
          [
            ['Long labels', long, setLong],
            ['Right to left', rtl, setRtl],
            ['Virtualize rows', virtualized, setVirtualized],
          ] as const
        ).map(([label, checked, change]) => (
          <label className='pui-choice-label' key={label}>
            <Checkbox.Root checked={checked} onCheckedChange={change}>
              <Checkbox.Indicator />
            </Checkbox.Root>
            {label}
          </label>
        ))}
      </div>
      <div className='actions'>
        <Button variant='outline' onClick={() => setExpanded([])}>
          Collapse all preview groups
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
          Expand all preview groups
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
          Remove selected preview nodes
        </Button>
      </div>
      <p>
        {labels.size.toLocaleString('en-US')} loaded nodes. Selection and
        expansion are local. Reserved environment cannot be selected.
      </p>
      {dataset === 'loading' ? (
        <InlineMessage.Root tone='progress' role='status'>
          <Spinner size='sm' />
          <InlineMessage.Content>
            <InlineMessage.Title>Loading hierarchy preview</InlineMessage.Title>
            <InlineMessage.Description>
              No service request is sent. Change the preview dataset to inspect
              a result.
            </InlineMessage.Description>
          </InlineMessage.Content>
        </InlineMessage.Root>
      ) : dataset === 'error' ? (
        <InlineMessage.Root tone='danger' role='alert'>
          <InlineMessage.Content>
            <InlineMessage.Title>Hierarchy unavailable</InlineMessage.Title>
            <InlineMessage.Description>
              The local example is showing a failed load.
            </InlineMessage.Description>
            <InlineMessage.Actions>
              <Button
                onClick={() => {
                  changeDataset('resources')
                  datasetControl.current?.focus()
                }}
              >
                Retry local tree
              </Button>
            </InlineMessage.Actions>
          </InlineMessage.Content>
        </InlineMessage.Root>
      ) : (
        <Tree
          nodes={nodes}
          label='Resource hierarchy'
          selectedIds={selected}
          onSelectedIdsChange={setSelected}
          expandedIds={expanded}
          onExpandedIdsChange={setExpanded}
          selectionMode={mode}
          virtualized={virtualized}
          dir={rtl ? 'rtl' : 'ltr'}
          emptyLabel='No resources in this preview.'
          height={352}
        />
      )}
      <p role='status' aria-label='Tree selection'>
        {selected.length
          ? `Selected: ${selected.map((id) => labels.get(id) ?? id).join(', ')}`
          : 'No selected resources.'}
      </p>
    </div>
  )
}
