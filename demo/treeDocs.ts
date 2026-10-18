import type { ComponentDoc } from "./componentDocs";
export const treeDocs: Record<string, ComponentDoc> = {
  tree: {
    usage:
      "Use it to navigate a hierarchy and select resources. It combines Headless Tree's explicit ARIA hierarchy attributes with TanStack Virtual and renders only the visible rows plus the currently focused row. Focus and selection are separate, and the expand button only changes whether children are shown. Examples cover controlled selection and expansion, single and multiple selection, RTL, disabled resources, an empty state, and 10,100 nodes.",
    avoid:
      "Don't add an unnecessary tree role to ordinary navigation lists. This API takes already-loaded immutable data with unique IDs. Server requests, permission checks, async child loading, moving data, and persistence are the product's responsibility. Disabled nodes can receive arrow-key focus so they stay discoverable, but they can't be selected or expanded. Keep row height identical to the virtualization calculation; long names are visually truncated while the full accessible name and title are preserved. Virtualization doesn't reduce the size of transferred data.",
    keyboard:
      "Tab enters the single current treeitem. Up/Down move through visible items, Home/End go to the first/last item, Right expands and then moves to the first child, and Left collapses or moves to the parent. Right does nothing on a leaf. Left and Right are reversed in RTL. Enter/Space selects; moving focus with arrow keys doesn't change the selection. In multiple selection, Space/click toggles, Shift selects a range, and Ctrl/Meta+A selects all visible selectable nodes. Typing characters quickly jumps to a visible name with that prefix, and repeating the same character moves to the next match. * expands all groups at the same level. Moving to a virtualized row moves real DOM focus and the inner scroll position together.",
    anatomy:
      "ScrollArea → tree container → virtualized treeitems(level, posinset, setsize, expanded, selected, disabled) → disclosure button + truncated label; product-owned result summary",
    tokens: [
      "--space-1",
      "--space-2",
      "--space-4",
      "--radius-md",
      "--radius-full",
      "--selected",
      "--interaction-hover-bg",
      "--control-focus",
    ],
    code: `import {Tree, type TreeNode} from "@surflane/ui";\n\nconst nodes: TreeNode[] = [{id:"projects", label:"Projects", children:[\n  {id:"workspace", label:"Workspace"},\n  {id:"reserved", label:"Reserved environment", disabled:true}\n]}];\n<Tree nodes={nodes} label="Resources" height={352}\n  expandedIds={expanded} onExpandedIdsChange={setExpanded}\n  selectedIds={selected} onSelectedIdsChange={setSelected}\n  selectionMode="multiple" virtualized />\n\n// Keep IDs unique and data immutable. Validate selected IDs in the product.\n// Selection does not imply navigation or authorization.\n// Fixed rowHeight defaults to44px; custom heights must fit their content.`,
    props: [
      [
        "nodes / label",
        "readonly TreeNode[]; unique string IDs, labels, optional children/disabled; accessible tree name",
        "required",
      ],
      [
        "expandedIds / defaultExpandedIds",
        "controlled or initial expanded branch IDs; invalid IDs ignored",
        "[]",
      ],
      [
        "selectedIds / defaultSelectedIds",
        "controlled or initial selection; disabled/missing IDs ignored",
        "[]",
      ],
      [
        "onExpandedIdsChange / onSelectedIdsChange",
        "next normalized ID arrays; selection separate from focus",
        "optional",
      ],
      ["selectionMode", "single / multiple", "single"],
      [
        "virtualized / height / rowHeight",
        "windowed rows with focus retention; fixed pixels",
        "true / 320 / 44",
      ],
      [
        "dir / emptyLabel / className",
        "RTL key/indent direction; empty-state copy; scroll-root class",
        "inherited / No items. / none",
      ],
    ],
  },
};
