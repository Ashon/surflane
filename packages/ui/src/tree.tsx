"use client";
import * as React from "react";
import { useComponentSize, type ComponentSize } from "./sizing.js";
import {
  buildProxiedInstance,
  syncDataLoaderFeature,
  type ItemInstance,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import {
  defaultRangeExtractor,
  useVirtualizer,
  type Virtualizer,
} from "@tanstack/react-virtual";
import { ScrollArea } from "./scroll-area.js";

export type TreeNode = {
  id: string;
  label: string;
  children?: readonly TreeNode[];
  disabled?: boolean;
};
export type TreeProps = {
  nodes: readonly TreeNode[];
  label: string;
  expandedIds?: readonly string[];
  defaultExpandedIds?: readonly string[];
  onExpandedIdsChange?: (ids: string[]) => void;
  selectedIds?: readonly string[];
  defaultSelectedIds?: readonly string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  selectionMode?: "single" | "multiple";
  height?: number;
  rowHeight?: number;
  size?: ComponentSize;
  virtualized?: boolean;
  emptyLabel?: string;
  dir?: "ltr" | "rtl";
  className?: string;
};
const normalize = (text: string) => text.normalize("NFKC").toLocaleLowerCase();
/** Loaded, immutable hierarchy. Remote loading, permission checks and mutations remain caller-owned. */
export function Tree({
  nodes,
  label,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedIdsChange,
  selectedIds,
  defaultSelectedIds = [],
  onSelectedIdsChange,
  selectionMode = "single",
  height = 320,
  rowHeight: explicitRowHeight,
  size,
  virtualized = true,
  emptyLabel = "No items.",
  dir,
  className,
}: TreeProps) {
  const scheme = useComponentSize(size);
  const touchFloor = React.useSyncExternalStore(
    (listener) => {
      const query = matchMedia("(max-width: 760px), (pointer: coarse)");
      query.addEventListener("change", listener);
      return () => query.removeEventListener("change", listener);
    },
    () => matchMedia("(max-width: 760px), (pointer: coarse)").matches,
    () => false,
  );
  const rowHeight =
    explicitRowHeight ??
    Math.max(
      touchFloor && scheme ? 44 : 0,
      scheme === "small" ? 36 : scheme === "large" ? 52 : 44,
    );
  const rootId = React.useId();
  const model = React.useMemo(() => {
    const data = new Map<string, TreeNode>();
    const parents = new Map<string, string>();
    function add(children: readonly TreeNode[], parent: string) {
      for (const node of children) {
        if (data.has(node.id) || node.id === rootId)
          throw new Error(`Tree node IDs must be unique: ${node.id}`);
        data.set(node.id, node);
        parents.set(node.id, parent);
        if (node.children) add(node.children, node.id);
      }
    }
    add(nodes, rootId);
    data.set(rootId, { id: rootId, label, children: nodes });
    return { data, parents };
  }, [nodes, rootId, label]);
  const [localExpanded, setLocalExpanded] =
    React.useState<readonly string[]>(defaultExpandedIds);
  const [localSelected, setLocalSelected] =
    React.useState<readonly string[]>(defaultSelectedIds);
  const [localFocus, setLocalFocus] = React.useState<string | null>(
    () => (selectedIds ?? defaultSelectedIds)[0] ?? null,
  );
  const expanded = React.useMemo(
    () =>
      [...new Set(expandedIds ?? localExpanded)].filter(
        (id) => model.data.get(id)?.children?.length,
      ),
    [expandedIds, localExpanded, model],
  );
  const selected = React.useMemo(() => {
    const ids = [...new Set(selectedIds ?? localSelected)].filter(
      (id) => model.data.has(id) && !model.data.get(id)?.disabled,
    );
    return selectionMode === "single" ? ids.slice(-1) : ids;
  }, [selectedIds, localSelected, model, selectionMode]);
  const visibleIds = React.useMemo(() => {
    const result: string[] = [],
      open = new Set(expanded);
    function visit(children: readonly TreeNode[]) {
      for (const node of children) {
        result.push(node.id);
        if (open.has(node.id) && node.children) visit(node.children);
      }
    }
    visit(nodes);
    return result;
  }, [nodes, expanded]);
  const focused = React.useMemo(() => {
    const visible = new Set(visibleIds);
    let id = localFocus;
    while (id && !visible.has(id)) id = model.parents.get(id) ?? null;
    return id ?? visibleIds[0] ?? null;
  }, [localFocus, model, visibleIds]);
  const viewport = React.useRef<HTMLDivElement>(null),
    container = React.useRef<HTMLDivElement>(null);
  const virtualizerRef = React.useRef<Virtualizer<
    HTMLDivElement,
    Element
  > | null>(null);
  const pendingFocus = React.useRef<string | null>(null),
    focusWithin = React.useRef(false),
    anchor = React.useRef<string | null>(null);
  const typeahead = React.useRef({ text: "", time: 0 });
  function changeExpanded(ids: string[]) {
    const next = [...new Set(ids)];
    if (expandedIds === undefined) setLocalExpanded(next);
    onExpandedIdsChange?.(next);
  }
  function changeSelected(ids: string[]) {
    const allowed = [...new Set(ids)].filter(
      (id) => model.data.has(id) && !model.data.get(id)?.disabled,
    );
    const next = selectionMode === "single" ? allowed.slice(-1) : allowed;
    if (selectedIds === undefined) setLocalSelected(next);
    onSelectedIdsChange?.(next);
  }
  const tree = useTree<TreeNode>({
    rootItemId: rootId,
    instanceBuilder: buildProxiedInstance,
    features: [syncDataLoaderFeature],
    getItemName: (item) => item.getItemData().label,
    isItemFolder: (item) => !!item.getItemData().children?.length,
    dataLoader: {
      getItem: (id) => model.data.get(id)!,
      getChildren: (id) =>
        model.data.get(id)?.children?.map((node) => node.id) ?? [],
    },
    state: { expandedItems: expanded, focusedItem: focused },
    setExpandedItems: (update) =>
      changeExpanded(typeof update === "function" ? update(expanded) : update),
    setFocusedItem: (update) =>
      setLocalFocus(typeof update === "function" ? update(focused) : update),
    scrollToItem: (item) =>
      virtualizerRef.current?.scrollToIndex(item.getItemMeta().index, {
        align: "auto",
      }),
  });
  const items = tree.getItems();
  const focusedIndex = visibleIds.indexOf(focused ?? "");
  const virtualizer = useVirtualizer<HTMLDivElement, Element>({
    count: items.length,
    getScrollElement: () => viewport.current,
    estimateSize: () => rowHeight,
    getItemKey: (index) => items[index].getId(),
    overscan: 4,
    enabled: virtualized,
    initialRect: { height, width: 0 },
    rangeExtractor: (range) =>
      [
        ...new Set([
          ...defaultRangeExtractor(range),
          ...(focusedIndex >= 0 ? [focusedIndex] : []),
        ]),
      ].sort((a, b) => a - b),
  });
  virtualizerRef.current = virtualizer;
  function focusItem(item: ItemInstance<TreeNode> | undefined) {
    if (!item) return;
    pendingFocus.current = item.getId();
    item.setFocused();
    if (virtualized)
      virtualizer.scrollToIndex(item.getItemMeta().index, { align: "auto" });
    else if (viewport.current) {
      const top = item.getItemMeta().index * rowHeight;
      if (top < viewport.current.scrollTop) viewport.current.scrollTop = top;
      else if (
        top + rowHeight >
        viewport.current.scrollTop + viewport.current.clientHeight
      )
        viewport.current.scrollTop =
          top + rowHeight - viewport.current.clientHeight;
    }
    const element = item.getElement();
    if (element) {
      pendingFocus.current = null;
      element.focus({ preventScroll: true });
    }
  }
  React.useLayoutEffect(() => {
    const needsRecovery =
      focusWithin.current && document.activeElement === document.body;
    const id =
      pendingFocus.current && visibleIds.includes(pendingFocus.current)
        ? pendingFocus.current
        : needsRecovery
          ? focused
          : null;
    if (id) {
      const item = tree.getItemInstance(id);
      item.getElement()?.focus({ preventScroll: true });
      pendingFocus.current = null;
    }
  }, [focused, items, tree]);
  React.useEffect(() => {
    virtualizer.measure();
  }, [rowHeight, virtualizer]);
  function select(item: ItemInstance<TreeNode>, range = false) {
    const id = item.getId();
    if (item.getItemData().disabled) return;
    if (selectionMode === "single") changeSelected([id]);
    else if (range && anchor.current && visibleIds.includes(anchor.current)) {
      const a = visibleIds.indexOf(anchor.current),
        b = visibleIds.indexOf(id);
      changeSelected(visibleIds.slice(Math.min(a, b), Math.max(a, b) + 1));
    } else
      changeSelected(
        selected.includes(id)
          ? selected.filter((key) => key !== id)
          : [...selected, id],
      );
    if (!range) anchor.current = id;
  }
  function keydown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      (event.target as HTMLElement).closest("button")
    )
      return;
    const targetId = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-tree-id]",
    )?.dataset.treeId;
    const item = targetId
      ? tree.getItemInstance(targetId)
      : focused
        ? tree.getItemInstance(focused)
        : items[0];
    if (!item) return;
    if (
      [
        "ArrowDown",
        "ArrowUp",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
      ].includes(event.key)
    )
      typeahead.current = { text: "", time: 0 };
    const index = item.getItemMeta().index;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight",
      backward = rtl ? "ArrowRight" : "ArrowLeft";
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "a" &&
      selectionMode === "multiple"
    ) {
      event.preventDefault();
      changeSelected(visibleIds);
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (
      [
        "ArrowDown",
        "ArrowUp",
        "Home",
        "End",
        forward,
        backward,
        "Enter",
        " ",
        "*",
      ].includes(event.key)
    )
      event.preventDefault();
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const next = items[index + (event.key === "ArrowDown" ? 1 : -1)];
      focusItem(next);
      if (event.shiftKey && selectionMode === "multiple" && next)
        select(next, true);
    } else if (event.key === "Home") focusItem(items[0]);
    else if (event.key === "End") focusItem(items.at(-1));
    else if (
      event.key === forward &&
      !item.getItemData().disabled &&
      item.isFolder()
    ) {
      if (item.isExpanded()) focusItem(items[index + 1]);
      else item.expand();
    } else if (event.key === backward) {
      if (item.isFolder() && item.isExpanded() && !item.getItemData().disabled)
        item.collapse();
      else if (item.getItemMeta().level > 0) focusItem(item.getParent());
    } else if (event.key === "Enter" || event.key === " ")
      select(item, event.shiftKey);
    else if (event.key === "*")
      changeExpanded([
        ...expanded,
        ...items
          .filter(
            (sibling) =>
              sibling.getItemMeta().parentId === item.getItemMeta().parentId &&
              sibling.isFolder() &&
              !sibling.getItemData().disabled,
          )
          .map((sibling) => sibling.getId()),
      ]);
    else if (event.key.length === 1) {
      const now = performance.now(),
        char = normalize(event.key),
        previous =
          now - typeahead.current.time < 700 ? typeahead.current.text : "";
      const prefix = previous === char ? char : previous + char;
      typeahead.current = { text: prefix, time: now };
      for (let offset = 1; offset <= items.length; offset++) {
        const next = items[(index + offset) % items.length];
        if (normalize(next.getItemName()).startsWith(prefix)) {
          event.preventDefault();
          focusItem(next);
          break;
        }
      }
    }
  }
  const containerProps = tree.getContainerProps(label);
  const rows = virtualized
    ? virtualizer
        .getVirtualItems()
        .map((row) => ({ index: row.index, start: row.start }))
    : items.map((_, index) => ({ index, start: index * rowHeight }));
  return (
    <ScrollArea
      orientation="vertical"
      label={`${label} scroll area`}
      tabIndex={-1}
      ref={viewport}
      scrollChain="contain"
      rootClassName={["pui-tree-scroll", className].filter(Boolean).join(" ")}
      dir={dir}
      rootStyle={{ blockSize: height, direction: dir }}
      className="pui-tree-viewport"
    >
      {items.length ? (
        <div
          {...containerProps}
          ref={(element) => {
            container.current = element;
            containerProps.ref(element);
          }}
          dir={dir}
          className="pui-tree"
          data-ui-size={scheme}
          aria-multiselectable={selectionMode === "multiple" || undefined}
          onKeyDown={keydown}
          onFocusCapture={() => {
            focusWithin.current = true;
          }}
          onBlurCapture={(event) => {
            if (
              event.relatedTarget &&
              !event.currentTarget.contains(event.relatedTarget as Node)
            ) {
              focusWithin.current = false;
              typeahead.current.text = "";
            }
          }}
          style={{
            blockSize: virtualized
              ? virtualizer.getTotalSize()
              : items.length * rowHeight,
          }}
        >
          {rows.map(({ index, start }) => {
            const item = items[index],
              node = item.getItemData(),
              props = item.getProps();
            return (
              <div
                {...props}
                key={item.getId()}
                className="pui-tree-item"
                data-tree-id={node.id}
                aria-disabled={node.disabled || undefined}
                aria-selected={
                  node.disabled ? undefined : selected.includes(node.id)
                }
                title={node.label}
                onFocus={() => item.setFocused()}
                onClick={(event) => {
                  focusItem(item);
                  select(item, event.shiftKey);
                }}
                style={{
                  position: "absolute",
                  insetInline: 0,
                  top: start,
                  blockSize: rowHeight,
                  paddingInlineStart: `calc(var(--space-2) + ${Math.min(item.getItemMeta().level, 8)} * var(--space-4))`,
                }}
              >
                {item.isFolder() ? (
                  <button
                    type="button"
                    className="pui-tree-toggle"
                    tabIndex={-1}
                    disabled={node.disabled}
                    aria-label={`${item.isExpanded() ? "Collapse" : "Expand"} ${node.label}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      focusItem(item);
                      if (item.isExpanded()) item.collapse();
                      else item.expand();
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      data-expanded={item.isExpanded() || undefined}
                    >
                      <path d="m9 5 7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <span className="pui-tree-leaf" aria-hidden="true" />
                )}
                <span className="pui-tree-label">{node.label}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div role="status" className="pui-tree-empty">
          {emptyLabel}
        </div>
      )}
    </ScrollArea>
  );
}
