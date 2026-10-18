import React, { useState } from "react";
import { Grid, Table, Select } from "@surflane/ui";
import { catalog, stageLabels, itemHref, referenceSources } from "./catalog";
import { StageLabel } from "./StageLabel";
import { Link } from "./router";
export function CoveragePage() {
  const [kind, setKind] = useState("all"),
    [phase, setPhase] = useState("all");
  const shown = catalog.filter(
    (i) =>
      (kind === "all" || kind === i.kind) &&
      (phase === "all" || phase === String(i.phase)),
  );
  return (
    <>
      <section id="coverage-scope">
        <h2>Scope and readiness</h2>
        <p>
          The scope is based on the web UI needed for platform development and
          the Base UI component list. The summary below and the per-item
          inventory show actual implementation and documentation readiness.
        </p>
        <dl className="coverage-summary">
          {Object.entries(stageLabels).map(([stage, label]) => (
            <div key={stage}>
              <dt>{label}</dt>
              <dd>{catalog.filter((i) => i.stage === stage).length}</dd>
            </div>
          ))}
        </dl>
        <p>
          <strong>Available</strong>: has a shared implementation and a working
          example. <strong>Primitive only</strong>: re-exports the upstream
          primitive; styling has not started. <strong>Planned</strong>: a shared
          implementation or dedicated guide is still pending. Product deployment
          and full accessibility certification are reviewed separately.
        </p>
      </section>
      <section id="coverage-waves">
        <h2>Delivery waves</h2>
        <ol className="delivery-waves" role="list">
          <li>
            <strong>Wave 0 — Existing controls and overlays</strong>
            <p>
              Move existing inputs, selection, confirmation, panels and
              scrolling to their own pages, and connect behavior with usage
              guidance.
            </p>
          </li>
          <li>
            <strong>Wave 1 — Daily product UI</strong>
            <p>
              Refine composition and interaction for Field, Checkbox, Radio,
              Switch, Tabs, status, tables, empty states and the sidebar.
            </p>
          </li>
          <li>
            <strong>Wave 2 — Rich interaction</strong>
            <p>
              Extend searchable selection, numeric input, Toast, data tables and
              run flows. Each component's own wave label takes precedence.
            </p>
          </li>
          <li>
            <strong>Wave 3 — Specialized UI</strong>
            <p>
              Review dedicated behavior and library fit for dates, files, trees,
              charts, OTP and command search.
            </p>
          </li>
        </ol>
      </section>
      <section id="coverage-inventory">
        <h2>Coverage inventory</h2>
        <div className="catalog-filters">
          <label>
            Layer
            <Select
              aria-label="Coverage layer"
              value={kind}
              onValueChange={setKind}
              options={[
                { value: "all", label: "All layers" },
                ...["foundation", "component", "pattern"].map((value) => ({
                  value,
                  label: value,
                })),
              ]}
            />
          </label>
          <label>
            Wave
            <Select
              aria-label="Coverage wave"
              value={phase}
              onValueChange={setPhase}
              options={[
                { value: "all", label: "All waves" },
                ...[0, 1, 2, 3].map((n) => ({
                  value: String(n),
                  label: "Wave " + n,
                })),
              ]}
            />
          </label>
        </div>
        <Grid columns={1} gap={0} bleed={4}>
          <Table.Container
            className="catalog-table-wrap"
            label="Coverage inventory table"
            orientation="horizontal"
          >
            <Table.Root>
              <Table.Caption>{shown.length} coverage items</Table.Caption>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell scope="col">Item</Table.HeaderCell>
                  <Table.HeaderCell scope="col">
                    Layer / category
                  </Table.HeaderCell>
                  <Table.HeaderCell scope="col">Basis</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Wave</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Stage</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {shown.map((i) => (
                  <Table.Row key={i.kind + i.id}>
                    <Table.HeaderCell scope="row">
                      <Link href={itemHref(i)}>{i.name}</Link>
                    </Table.HeaderCell>
                    <Table.Cell>
                      {i.kind} / {i.group}
                    </Table.Cell>
                    <Table.Cell>{i.basis}</Table.Cell>
                    <Table.Cell>{i.phase}</Table.Cell>
                    <Table.Cell>
                      <StageLabel item={i} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.Container>
        </Grid>
      </section>
      <section id="coverage-ready">
        <h2>Definition of ready</h2>
        <ul>
          <li>
            Keep a working example and docs for usage, anti-patterns, states,
            API and keyboard on the same page.
          </li>
          <li>
            Check light, dark and system themes, enter motion, instant close and
            reduced motion.
          </li>
          <li>
            Confirm labels, initial focus, focus movement and restoration, error
            messages, and 320px / long Korean and English text / zoom states.
          </li>
          <li>
            Check submit, reset and server errors for forms; portals, nesting
            and outside clicks for overlays; and loading, empty values and
            partial failure for data UI.
          </li>
          <li>
            React uses Base UI plus explicit library composition for specialized
            features, and Astro docs prefer framework-independent CSS. Domain
            rules stay in the product.
          </li>
        </ul>
      </section>
      <section id="coverage-research">
        <h2>Research and implementation boundaries</h2>
        <p>
          Base UI is the foundation for accessibility and behavior primitives.
          Tables, status, the app shell and document flows are composed from
          semantic HTML and shared styles. For dates, trees, charts and similar
          features, don't assume Base UI provides what it doesn't.
        </p>
        <ul>
          {referenceSources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.name}
              </a>
            </li>
          ))}
        </ul>
        <p>
          Component list and packages reviewed as of 2026-10-17 / Base UI 1.9.0.
          The framework utilities CSP / Direction / mergeProps / useRender are
          not counted as separate interactive components.
        </p>
      </section>
    </>
  );
}
