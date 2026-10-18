import React, { useEffect, useId, useRef, useState } from "react";
import {
  Table,
  Checkbox,
  Button,
  FilterBar,
  Input,
  NativeSelect,
  Menu,
  Pagination,
  EmptyState,
  InlineMessage,
  Spinner,
  StatusBadge,
  Icon,
} from "@surflane/ui";
import { Link } from "./router";
const resources = [
  {
    id: "workspace",
    name: "Workspace",
    product: "Workspace",
    region: "production",
    manage: true,
    href: "/patterns/app-shell",
  },
  {
    id: "docs",
    name: "Documentation",
    product: "Documentation",
    region: "development",
    manage: false,
    href: "/foundations/typography",
  },
  {
    id: "inventory",
    name: "Inventory main",
    product: "Inventory",
    region: "staging",
    manage: true,
    href: "/components/table",
  },
  {
    id: "discovery",
    name: "Environment discovery",
    product: "Workspace",
    region: "production",
    manage: true,
    href: "/patterns/form-workflow",
  },
  {
    id: "inventory",
    name: "Inventory review",
    product: "Inventory",
    region: "development",
    manage: true,
    href: "/patterns/resource-list",
  },
  {
    id: "layout",
    name: "Layout guide",
    product: "Documentation",
    region: "development",
    manage: false,
    href: "/foundations/layout",
  },
  {
    id: "release",
    name: "Release pipeline",
    product: "Workspace",
    region: "staging",
    manage: true,
    href: "/components/badge",
  },
  {
    id: "runtime",
    name: "Runtime inventory",
    product: "Inventory",
    region: "production",
    manage: true,
    href: "/components/list",
  },
  {
    id: "long",
    name: "Project deployment / platform-api-abcdefghijklmnopqrstuvwxyz0123456789",
    product: "Documentation",
    region: "staging",
    manage: true,
    href: "/components/code",
  },
];
type Mode = "ready" | "loading" | "error" | "permission" | "empty";
type SortKey = "name" | "product" | "region";
const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});
export function DataTableExample() {
  const [mode, setMode] = useState<Mode>("ready"),
    [query, setQuery] = useState(""),
    [product, setProduct] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; ascending: boolean }>({
    key: "name",
    ascending: true,
  });
  const [page, setPage] = useState(1),
    [size, setSize] = useState(3),
    [selected, setSelected] = useState<string[]>([]),
    [reviewed, setReviewed] = useState<string[]>([]);
  const [columns, setColumns] = useState({ product: true, region: true }),
    [notice, setNotice] = useState("");
  const input = useRef<HTMLInputElement>(null),
    focusSearch = useRef(false),
    resultId = useId();
  useEffect(() => {
    if (mode === "ready" && focusSearch.current) {
      focusSearch.current = false;
      input.current?.focus();
    }
  }, [mode]);
  const filtered = resources.filter(
    (row) =>
      (product === "all" || row.product === product) &&
      `${row.name} ${row.product} ${row.region}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  const sorted = [...filtered].sort((a, b) => {
    const comparison = collator.compare(a[sort.key], b[sort.key]);
    return (
      (sort.ascending ? comparison : -comparison) ||
      collator.compare(a.id, b.id)
    );
  });
  const pageCount = Math.ceil(sorted.length / size),
    current = Math.max(1, Math.min(page, pageCount || 1)),
    rows = sorted.slice((current - 1) * size, current * size);
  const selectable = rows.filter((row) => row.manage).map((row) => row.id),
    pageSelected = selectable.filter((id) => selected.includes(id));
  const hiddenSelections = selected.filter(
    (id) => !rows.some((row) => row.id === id),
  ).length;
  const ready = mode === "ready",
    active = Boolean(query.trim()) || product !== "all";
  function resetFilters() {
    setQuery("");
    setProduct("all");
    setPage(1);
    input.current?.focus();
  }
  function recover() {
    focusSearch.current = true;
    setMode("ready");
  }
  function updateSort(key: SortKey) {
    setSort((old) => ({
      key,
      ascending: old.key === key ? !old.ascending : true,
    }));
    setPage(1);
  }
  function toggle(id: string, checked: boolean) {
    setSelected((old) =>
      checked
        ? [...new Set([...old, id])]
        : old.filter((value) => value !== id),
    );
  }
  function column(key: "product" | "region", checked: boolean) {
    setColumns((old) => ({ ...old, [key]: checked }));
    if (!checked && sort.key === key) {
      setSort({ key: "name", ascending: true });
      setPage(1);
    }
  }
  const sortHeader = (key: SortKey, label: string) => (
    <Table.HeaderCell
      scope="col"
      aria-sort={
        sort.key === key
          ? sort.ascending
            ? "ascending"
            : "descending"
          : undefined
      }
    >
      <Button
        variant="ghost"
        aria-label={`Sort by ${label}`}
        onClick={() => updateSort(key)}
      >
        {label}
        {sort.key === key && (
          <Icon
            name="chevron-down"
            decorative
            style={{ transform: sort.ascending ? "rotate(180deg)" : undefined }}
          />
        )}
      </Button>
    </Table.HeaderCell>
  );
  return (
    <div className="data-table-example">
      <label className="data-table-state">
        Preview table state
        <NativeSelect
          value={mode}
          onChange={(event) => {
            const next = event.target.value as Mode;
            setMode(next);
            setNotice("");
            if (next === "permission") setSelected([]);
          }}
        >
          {["ready", "loading", "error", "permission", "empty"].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </NativeSelect>
      </label>
      <FilterBar.Root
        label="Filter table resources"
        onSubmit={(event) => event.preventDefault()}
        onReset={(event) => {
          event.preventDefault();
          resetFilters();
        }}
      >
        <FilterBar.Controls>
          <FilterBar.Field width="search">
            Search resources
            <Input
              ref={input}
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Name, product or environment…"
              aria-controls={resultId}
              disabled={!ready}
            />
          </FilterBar.Field>
          <FilterBar.Field>
            Product
            <NativeSelect
              value={product}
              disabled={!ready}
              onChange={(event) => {
                setProduct(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">All products</option>
              {["Workspace", "Inventory", "Documentation"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </NativeSelect>
          </FilterBar.Field>
          <FilterBar.Actions>
            <Button type="reset" variant="outline" disabled={!ready || !active}>
              Clear table filters
            </Button>
          </FilterBar.Actions>
        </FilterBar.Controls>
        <FilterBar.Summary>
          {ready
            ? `${filtered.length} of ${resources.length} resources / ${selected.length} selected / ${hiddenSelections} outside this page`
            : mode === "loading"
              ? "Loading table preview"
              : mode === "error"
                ? "Table request failed"
                : mode === "permission"
                  ? "Resource access required"
                  : "No registered resources"}
        </FilterBar.Summary>
      </FilterBar.Root>
      <div id={resultId}>
        {mode === "loading" ? (
          <InlineMessage.Root tone="progress">
            <InlineMessage.Icon tone="progress">
              <Spinner size="sm" decorative />
            </InlineMessage.Icon>
            <InlineMessage.Content>
              <InlineMessage.Title>Loading table preview</InlineMessage.Title>
              <InlineMessage.Description>
                The local preview waits for manual completion.
              </InlineMessage.Description>
              <InlineMessage.Actions>
                <Button variant="outline" onClick={recover}>
                  Complete table preview
                </Button>
              </InlineMessage.Actions>
            </InlineMessage.Content>
          </InlineMessage.Root>
        ) : mode === "error" ? (
          <InlineMessage.Root tone="danger">
            <InlineMessage.Content>
              <InlineMessage.Title>
                Resources could not be loaded
              </InlineMessage.Title>
              <InlineMessage.Description>
                Your filters and selection are retained.
              </InlineMessage.Description>
              <InlineMessage.Actions>
                <Button variant="outline" onClick={recover}>
                  Retry table preview
                </Button>
              </InlineMessage.Actions>
            </InlineMessage.Content>
          </InlineMessage.Root>
        ) : mode === "permission" ? (
          <EmptyState.Root>
            <EmptyState.Title>Resource access required</EmptyState.Title>
            <EmptyState.Description>
              Selection was cleared because the access scope changed.
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button variant="outline" onClick={recover}>
                Restore preview access
              </Button>
            </EmptyState.Actions>
          </EmptyState.Root>
        ) : mode === "empty" || !filtered.length ? (
          <EmptyState.Root>
            <EmptyState.Title>
              {mode === "empty"
                ? "No registered resources"
                : "No matching resources"}
            </EmptyState.Title>
            <EmptyState.Description>
              {mode === "empty"
                ? "This is an initial empty-state example."
                : "Change the search or product filter to see more rows."}
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button
                variant="outline"
                onClick={mode === "empty" ? recover : resetFilters}
              >
                {mode === "empty"
                  ? "Restore table preview"
                  : "Reset table filters"}
              </Button>
            </EmptyState.Actions>
          </EmptyState.Root>
        ) : (
          <>
            <div className="data-table-toolbar">
              <div className="actions">
                <Button
                  variant="outline"
                  disabled={!selected.length}
                  onClick={() => {
                    const ids = selected.filter((id) =>
                      resources.some((row) => row.id === id && row.manage),
                    );
                    setReviewed((old) => [...new Set([...old, ...ids])]);
                    setSelected([]);
                    setNotice(
                      `${ids.length} resources marked reviewed in this preview.`,
                    );
                  }}
                >
                  Mark {selected.length} selected reviewed
                </Button>
                <Button
                  variant="ghost"
                  disabled={!selected.length}
                  onClick={() => {
                    setSelected([]);
                    setNotice("Selection cleared.");
                  }}
                >
                  Clear selection
                </Button>
              </div>
              <Menu.Root>
                <Menu.Trigger render={<Button variant="outline" />}>
                  Columns
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Content>
                    <Menu.CheckboxItem checked disabled>
                      <Menu.CheckboxItemIndicator />
                      Name (required)
                    </Menu.CheckboxItem>
                    {(["product", "region"] as const).map((key) => (
                      <Menu.CheckboxItem
                        key={key}
                        checked={columns[key]}
                        closeOnClick={false}
                        onCheckedChange={(checked) => column(key, checked)}
                      >
                        <Menu.CheckboxItemIndicator />
                        {key === "product" ? "Product" : "Environment"}
                      </Menu.CheckboxItem>
                    ))}
                  </Menu.Content>
                </Menu.Portal>
              </Menu.Root>
            </div>
            <Table.Container
              label="Resource table horizontal scroll"
              orientation="horizontal"
            >
              <Table.Root className="data-table-preview">
                <Table.Caption>
                  Resource inventory / local data table preview
                </Table.Caption>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell scope="col">
                      <Checkbox.Root
                        aria-label="Select manageable rows on this page"
                        checked={
                          selectable.length > 0 &&
                          pageSelected.length === selectable.length
                        }
                        indeterminate={
                          pageSelected.length > 0 &&
                          pageSelected.length < selectable.length
                        }
                        disabled={!selectable.length}
                        onCheckedChange={(checked) =>
                          setSelected((old) =>
                            checked
                              ? [...new Set([...old, ...selectable])]
                              : old.filter((id) => !selectable.includes(id)),
                          )
                        }
                      >
                        <Checkbox.Indicator />
                      </Checkbox.Root>
                    </Table.HeaderCell>
                    {sortHeader("name", "Name")}
                    {columns.product && sortHeader("product", "Product")}
                    {columns.region && sortHeader("region", "Environment")}
                    <Table.HeaderCell scope="col">State</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {rows.map((row) => (
                    <Table.Row
                      key={row.id}
                      selected={selected.includes(row.id)}
                    >
                      <Table.Cell>
                        <Checkbox.Root
                          aria-label={`Select ${row.name}`}
                          checked={selected.includes(row.id)}
                          disabled={!row.manage}
                          onCheckedChange={(checked) => toggle(row.id, checked)}
                        >
                          <Checkbox.Indicator />
                        </Checkbox.Root>
                      </Table.Cell>
                      <Table.HeaderCell scope="row">
                        <Link className="pui-link" href={row.href}>
                          {row.name}
                        </Link>
                      </Table.HeaderCell>
                      {columns.product && (
                        <Table.Cell>{row.product}</Table.Cell>
                      )}
                      {columns.region && <Table.Cell>{row.region}</Table.Cell>}
                      <Table.Cell>
                        <StatusBadge
                          tone={
                            !row.manage
                              ? "neutral"
                              : reviewed.includes(row.id)
                                ? "success"
                                : "caution"
                          }
                        >
                          {!row.manage
                            ? "Read-only"
                            : reviewed.includes(row.id)
                              ? "Reviewed"
                              : "Needs review"}
                        </StatusBadge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.Container>
            <div className="data-table-pagination">
              <label>
                Rows per page
                <NativeSelect
                  value={String(size)}
                  onChange={(event) => {
                    setSize(Number(event.target.value));
                    setPage(1);
                  }}
                >
                  {[3, 5, 10].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </NativeSelect>
              </label>
              <Pagination
                page={current}
                pageCount={pageCount}
                onPageChange={setPage}
                aria-label="Resource result pages"
              />
            </div>
            <p>
              {(current - 1) * size + 1}–
              {Math.min(current * size, filtered.length)} of {filtered.length}{" "}
              resources. Header selection applies only to manageable rows on
              this page.
            </p>
          </>
        )}
      </div>
      <p role="status" aria-label="Table action result">
        {notice}
      </p>
    </div>
  );
}
