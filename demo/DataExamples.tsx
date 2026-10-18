import React, { useState } from "react";
import {
  Table,
  List,
  Button,
  Input,
  Checkbox,
  StatusBadge,
  EmptyState,
  InlineMessage,
  Spinner,
} from "@surflane/ui";
export { dataExampleIds } from "./exampleGroups";
const environments = [
  {
    id: "demo-main",
    name: "DEMO main",
    region: "staging-cluster-01",
    count: 3,
  },
  {
    id: "documentation",
    name: "Documentation",
    region: "staging-cluster-02",
    count: 1,
  },
  {
    id: "inventory-main",
    name: "Inventory main",
    region: "prod-cluster-01",
    count: 2,
  },
];
function SearchMark() {
  return (
    <svg
      aria-hidden="true"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="m15 15 6 6" />
    </svg>
  );
}
function EmptyPreview() {
  const [mode, setMode] = useState<"empty" | "search" | "permission">("empty");
  const [created, setCreated] = useState(false),
    [notice, setNotice] = useState("");
  return (
    <div className="example-stack">
      <div className="actions">
        <Button
          variant="outline"
          onClick={() => {
            setMode("empty");
            setCreated(false);
            setNotice("");
          }}
        >
          Initial empty
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setMode("search");
            setCreated(false);
            setNotice("");
          }}
        >
          No search results
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setMode("permission");
            setCreated(false);
            setNotice("");
          }}
        >
          Permission required
        </Button>
      </div>
      {created ? (
        <List.Root aria-label="Registered preview environments">
          <List.Item>
            <List.Content>
              <List.Title>New environment preview</List.Title>
              <List.Description>
                Local example only; no resource created.
              </List.Description>
            </List.Content>
            <StatusBadge tone="success">Configured</StatusBadge>
          </List.Item>
        </List.Root>
      ) : (
        <EmptyState.Root>
          <EmptyState.Icon aria-hidden="true">
            <SearchMark />
          </EmptyState.Icon>
          <EmptyState.Title>
            {mode === "empty"
              ? "No environments registered"
              : mode === "search"
                ? "No matching environments"
                : "Environment access required"}
          </EmptyState.Title>
          <EmptyState.Description>
            {mode === "empty"
              ? "Register an environment to start deploying."
              : mode === "search"
                ? "Try another name or clear the current filters."
                : "Ask an environment administrator to grant access."}
          </EmptyState.Description>
          <EmptyState.Actions>
            {mode === "empty" ? (
              <Button
                onClick={() => {
                  setCreated(true);
                  setNotice("Preview environment added.");
                }}
              >
                Register preview environment
              </Button>
            ) : mode === "search" ? (
              <Button
                variant="outline"
                onClick={() => {
                  setMode("empty");
                  setNotice("Filters cleared.");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() =>
                  setNotice("Access request previewed; no message sent.")
                }
              >
                Preview access request
              </Button>
            )}
          </EmptyState.Actions>
        </EmptyState.Root>
      )}
      <p role="status" className="example-announcement">
        {notice}
      </p>
    </div>
  );
}
function MessagePreview() {
  const [state, setState] = useState<"error" | "pending" | "success">("error");
  const [notice, setNotice] = useState("");
  const tone =
    state === "error" ? "danger" : state === "pending" ? "progress" : "success";
  return (
    <div className="example-stack">
      <InlineMessage.Root tone={tone}>
        <InlineMessage.Icon tone={tone}>
          {state === "pending" ? <Spinner decorative size="sm" /> : undefined}
        </InlineMessage.Icon>
        <InlineMessage.Content>
          <InlineMessage.Title>
            {state === "error"
              ? "Environment discovery failed"
              : state === "pending"
                ? "Retrying environment discovery"
                : "Environment discovery complete"}
          </InlineMessage.Title>
          <InlineMessage.Description>
            {state === "error"
              ? "The preview endpoint did not respond. Check the connection and retry."
              : state === "pending"
                ? "Preview is waiting for a result. Use the controls below to resolve it."
                : "Three environments are available in this local preview."}
          </InlineMessage.Description>
          <InlineMessage.Actions>
            <Button
              variant="outline"
              onClick={() => {
                if (state === "error") {
                  setState("pending");
                  setNotice("Retry in progress.");
                } else if (state === "pending") {
                  setState("success");
                  setNotice("Discovery succeeded.");
                } else {
                  setState("error");
                  setNotice("Error example restored.");
                }
              }}
            >
              {state === "error"
                ? "Retry preview"
                : state === "pending"
                  ? "Complete retry"
                  : "Reset error example"}
            </Button>
            {state === "pending" && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setState("error");
                    setNotice("Discovery failed again. You can retry.");
                  }}
                >
                  Fail retry
                </Button>
              </>
            )}
          </InlineMessage.Actions>
        </InlineMessage.Content>
      </InlineMessage.Root>
      <p role="status" className="example-announcement">
        {notice}
      </p>
      <InlineMessage.Root tone="caution">
        <InlineMessage.Icon tone="caution" />
        <InlineMessage.Content>
          <InlineMessage.Title>Credentials expire soon</InlineMessage.Title>
          <InlineMessage.Description>
            Renew credentials before the next scheduled run.
          </InlineMessage.Description>
        </InlineMessage.Content>
      </InlineMessage.Root>
      <InlineMessage.Root>
        <InlineMessage.Icon />
        <InlineMessage.Content>
          <InlineMessage.Title>Local examples</InlineMessage.Title>
          <InlineMessage.Description>
            These controls do not contact DEMO or create resources.
          </InlineMessage.Description>
        </InlineMessage.Content>
      </InlineMessage.Root>
    </div>
  );
}
export function DataExample({ id }: { id: string }) {
  const [query, setQuery] = useState(""),
    [ascending, setAscending] = useState(true);
  const [selected, setSelected] = useState<string[]>([]),
    [inspected, setInspected] = useState("");
  if (id === "empty-state") return <EmptyPreview />;
  if (id === "inline-message") return <MessagePreview />;
  const rows = environments
    .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (ascending ? 1 : -1) * a.name.localeCompare(b.name));
  const toggle = (id: string, checked: boolean) =>
    setSelected((current) =>
      checked
        ? [...current.filter((v) => v !== id), id]
        : current.filter((v) => v !== id),
    );
  return (
    <div className="example-stack">
      <label>
        Filter environments
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by environment name"
        />
      </label>
      {rows.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Icon aria-hidden="true">
            <SearchMark />
          </EmptyState.Icon>
          <EmptyState.Title>No matching environments</EmptyState.Title>
          <EmptyState.Description>
            Clear the search to see registered environments.
          </EmptyState.Description>
          <EmptyState.Actions>
            <Button variant="outline" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </EmptyState.Actions>
        </EmptyState.Root>
      ) : id === "table" ? (
        <Table.Container label="Environment comparison">
          <Table.Root style={{ minWidth: 720 }}>
            <Table.Caption>
              Registered environments — local preview
            </Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope="col">Selection</Table.HeaderCell>
                <Table.HeaderCell
                  scope="col"
                  aria-sort={ascending ? "ascending" : "descending"}
                >
                  <Button
                    variant="ghost"
                    onClick={() => setAscending((v) => !v)}
                  >
                    Name
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path d={ascending ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
                    </svg>
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell scope="col">Cluster</Table.HeaderCell>
                <Table.HeaderCell scope="col">
                  Discovered services
                </Table.HeaderCell>
                <Table.HeaderCell scope="col">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {rows.map((row) => (
                <Table.Row key={row.id} selected={selected.includes(row.id)}>
                  <Table.Cell>
                    <Checkbox.Root
                      aria-label={`Select ${row.name}`}
                      checked={selected.includes(row.id)}
                      onCheckedChange={(checked) => toggle(row.id, checked)}
                    >
                      <Checkbox.Indicator />
                    </Checkbox.Root>
                  </Table.Cell>
                  <Table.HeaderCell scope="row">{row.name}</Table.HeaderCell>
                  <Table.Cell>{row.region}</Table.Cell>
                  <Table.Cell>{row.count}</Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInspected(
                          `${row.name}: ${row.count} services discovered.`,
                        )
                      }
                    >
                      Inspect {row.name}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
      ) : (
        <List.Root aria-label="Registered environments">
          {rows.map((row) => (
            <List.Item key={row.id} selected={selected.includes(row.id)}>
              <Checkbox.Root
                aria-label={`Select ${row.name}`}
                checked={selected.includes(row.id)}
                onCheckedChange={(checked) => toggle(row.id, checked)}
              >
                <Checkbox.Indicator />
              </Checkbox.Root>
              <List.Content>
                <List.Title>{row.name}</List.Title>
                <List.Description>
                  {row.region} / {row.count} discovered services
                </List.Description>
              </List.Content>
              <List.Actions>
                <StatusBadge tone="success">Configured</StatusBadge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setInspected(
                      `${row.name}: ${row.count} services discovered.`,
                    )
                  }
                >
                  Inspect {row.name}
                </Button>
              </List.Actions>
            </List.Item>
          ))}
        </List.Root>
      )}
      <p role="status">
        {selected.length} selected. {inspected}
      </p>
    </div>
  );
}
