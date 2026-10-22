import type { ComponentDoc } from './componentDocs'
export const treeDocs: Record<string, ComponentDoc> = {
  tree: {
    usage:
      "Navigate a hierarchy and select resources. Tree pairs Headless Tree's explicit ARIA hierarchy attributes with TanStack Virtual, rendering only visible rows plus the focused row. Focus and selection are separate, and the expand button only shows or hides children. Examples cover controlled selection and expansion, single and multiple selection, RTL, disabled resources, an empty state, and 10,100 nodes.",
    avoid: [
      "Don't add a tree role to ordinary navigation lists. Use a nav with a plain list of links instead.",
      "Don't pass mutable or partially loaded data. Pass already-loaded, immutable data with unique IDs instead.",
      "Don't expect Tree to fetch or store data. The product owns server requests, permission checks, async child loading, moving data, and persistence.",
      "Don't expect arrow keys to skip disabled nodes. They take focus so they stay discoverable, but they can't be selected or expanded.",
      "Don't let a row's height differ from rowHeight, which the virtualization calculation depends on. Long names truncate visually instead and keep their full accessible name and title.",
      "Don't expect virtualization to reduce the size of transferred data. It only limits how many rows render.",
    ],
    keyboard: [
      'Tab enters the tree at its single current treeitem.',
      'Up and Down move through visible items. Home and End go to the first and last item.',
      'Right expands a group, then moves to its first child, and does nothing on a leaf. Left collapses a group or moves to the parent, and RTL reverses Left and Right.',
      '* expands all groups at the same level.',
      'Type characters quickly to jump to a visible name with that prefix. Repeat the same character to move to the next match.',
      "Enter or Space selects. Moving focus with arrow keys doesn't change the selection.",
      'In multiple selection, Space or click toggles, Shift selects a range, and Ctrl/Meta+A selects all visible selectable nodes.',
      'Moving to a virtualized row moves real DOM focus and the inner scroll position together.',
    ],
    anatomy:
      'ScrollArea → tree container → virtualized treeitems(level, posinset, setsize, expanded, selected, disabled) → disclosure button + truncated label; product-owned result summary',
    tokens: [
      '--space-1',
      '--space-2',
      '--space-4',
      '--radius-md',
      '--radius-full',
      '--selected',
      '--interaction-hover-bg',
      '--control-focus',
    ],
    code: `// Needs headless-tree and react-virtual:
// npm install @headless-tree/core @headless-tree/react @tanstack/react-virtual
import { Tree, type TreeNode } from '@surflane/ui/tree'

const nodes: TreeNode[] = [
  {
    id: 'projects',
    label: 'Projects',
    children: [
      { id: 'workspace', label: 'Workspace' },
      { id: 'reserved', label: 'Reserved environment', disabled: true },
    ],
  },
]
<Tree
  nodes={nodes}
  label='Resources'
  height={352}
  expandedIds={expanded}
  onExpandedIdsChange={setExpanded}
  selectedIds={selected}
  onSelectedIdsChange={setSelected}
  selectionMode='multiple'
  virtualized
/>

// Keep IDs unique and data immutable. Validate selected IDs in the product.
// Selection does not imply navigation or authorization.
// Fixed rowHeight defaults to 44px; custom heights must fit their content.`,
    props: [
      [
        'nodes / label',
        'readonly TreeNode[]; unique string IDs, labels, optional children/disabled; accessible tree name',
        'required',
      ],
      [
        'expandedIds / defaultExpandedIds',
        'controlled or initial expanded branch IDs; invalid IDs ignored',
        '[]',
      ],
      [
        'selectedIds / defaultSelectedIds',
        'controlled or initial selection; disabled/missing IDs ignored',
        '[]',
      ],
      [
        'onExpandedIdsChange / onSelectedIdsChange',
        'next normalized ID arrays; selection separate from focus',
        'optional',
      ],
      ['selectionMode', 'single / multiple', 'single'],
      [
        'virtualized / height / rowHeight',
        'windowed rows that keep the focused row; fixed pixel sizes',
        'true / 320 / 44',
      ],
      [
        'dir / emptyLabel / className',
        'RTL key/indent direction; empty-state copy; scroll-root class',
        'inherited / No items. / none',
      ],
    ],
  },
}
