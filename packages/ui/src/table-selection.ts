'use client'
import * as React from 'react'

export type TableSelectionOptions<Row> = {
  /** Rows on the current page, in display order. */
  rows: readonly Row[]
  getId: (row: Row) => string
  /** Rows that fail stay unselectable, such as read-only resources. */
  canSelect?: (row: Row) => boolean
  selected?: readonly string[]
  defaultSelected?: readonly string[]
  onSelectedChange?: (selected: string[]) => void
}
export type TableSelectionCheckbox = {
  checked: boolean
  indeterminate?: boolean
  disabled: boolean
  onCheckedChange: (checked: boolean) => void
}
/**
 * Row selection by stable ID that survives paging, sorting and filtering.
 * The page checkbox covers only the selectable rows on the current page;
 * hiddenCount reports selections the reader cannot see.
 */
export function useTableSelection<Row>({
  rows,
  getId,
  canSelect = () => true,
  selected: controlled,
  defaultSelected = [],
  onSelectedChange,
}: TableSelectionOptions<Row>) {
  const [uncontrolled, setUncontrolled] =
    React.useState<readonly string[]>(defaultSelected)
  const selected = controlled ?? uncontrolled
  const update = (next: string[]) => {
    if (controlled === undefined) setUncontrolled(next)
    onSelectedChange?.(next)
  }
  const chosen = new Set(selected)
  const onPage = new Set(rows.map(getId))
  const selectable = rows.filter(canSelect).map(getId)
  const pageChosen = selectable.filter((id) => chosen.has(id)).length
  const toggle = (id: string, checked: boolean) =>
    update(
      checked
        ? chosen.has(id)
          ? [...selected]
          : [...selected, id]
        : selected.filter((other) => other !== id),
    )
  const pageCheckbox: TableSelectionCheckbox = {
    checked: selectable.length > 0 && pageChosen === selectable.length,
    indeterminate: pageChosen > 0 && pageChosen < selectable.length,
    disabled: selectable.length === 0,
    onCheckedChange: (checked) =>
      update(
        checked
          ? [...new Set([...selected, ...selectable])]
          : selected.filter((id) => !selectable.includes(id)),
      ),
  }
  return {
    selected: selected as readonly string[],
    isSelected: (id: string) => chosen.has(id),
    toggle,
    clear: () => update([]),
    /** Selected rows that are not on the current page. */
    hiddenCount: selected.filter((id) => !onPage.has(id)).length,
    pageCheckbox,
    rowCheckbox: (row: Row): TableSelectionCheckbox => {
      const id = getId(row)
      return {
        checked: chosen.has(id),
        disabled: !canSelect(row),
        onCheckedChange: (checked) => toggle(id, checked),
      }
    },
  }
}
