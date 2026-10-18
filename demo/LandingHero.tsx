import React from "react";
import {
  AppShell,
  Avatar,
  Button,
  CodeBlock,
  Heading,
  Icon,
  PageHeader,
  StatusBadge,
  Table,
  Text,
  type IconName,
  type StatusTone,
} from "@surflane/ui";
import { Link } from "./router";

const destinations: [string, IconName][] = [
  ["Overview", "monitor"],
  ["Services", "copy"],
  ["Deployments", "play"],
  ["Settings", "settings"],
];
const deployments: [string, string, StatusTone, string][] = [
  ["platform-api", "production", "success", "Healthy"],
  ["auth-gateway", "production", "progress", "Deploying"],
  ["billing-service", "staging", "success", "Healthy"],
  ["search-indexer", "staging", "danger", "Failed"],
  ["notification-worker", "development", "success", "Healthy"],
];

export function LandingHero() {
  return (
    // The hero heading is the page title on "/", so route changes focus it like any page header.
    <section className="landing-hero" aria-labelledby="page-title">
      <div className="landing-hero-copy">
        <Text variant="label" color="secondary" className="landing-eyebrow">
          Design system for platform development
        </Text>
        <Heading level={1} size="display" id="page-title" tabIndex={-1}>
          The interface layer for platform teams.
        </Heading>
        <Text variant="reading" color="secondary">
          Tokens, accessible React components and tested patterns for consoles,
          dashboards and developer tools. Ready for Server Components.
        </Text>
        <div className="actions">
          <Link
            className="pui-button"
            data-variant="primary"
            data-size="large"
            href="/components"
          >
            Browse components
          </Link>
          <a
            className="pui-button"
            data-variant="outline"
            data-size="large"
            href="https://github.com/Ashon/surflane/blob/main/docs/frameworks.md"
          >
            Read the quick start
          </a>
        </div>
        <CodeBlock
          className="landing-install"
          label="Install"
          code="npm i @surflane/ui @surflane/design-tokens"
          copyLabel="Copy install command"
          copiedLabel="Install command copied."
        />
        <Text variant="caption" color="muted">
          React 19 · Server Components · MIT OR Apache-2.0
        </Text>
      </div>
      <div
        className="landing-console"
        aria-hidden="true"
        inert
        data-blueprint-decorative
      >
        <AppShell.Root layout="workspace">
          <AppShell.Sidebar data-blueprint-guide>
            <div className="landing-console-brand" data-blueprint-guide>
              <Avatar.Root size="sm" data-blueprint-guide>
                <Avatar.Fallback>PC</Avatar.Fallback>
              </Avatar.Root>
              <AppShell.Label data-blueprint-guide>
                platform-core
              </AppShell.Label>
            </div>
            <nav className="landing-console-nav">
              {destinations.map(([label, icon]) => (
                <AppShell.Link
                  key={label}
                  href="#"
                  label={label}
                  icon={<Icon name={icon} decorative />}
                  aria-current={label === "Deployments" ? "page" : undefined}
                />
              ))}
            </nav>
            <AppShell.Footer>
              <div className="landing-console-account" data-blueprint-guide>
                <Avatar.Root size="sm" data-blueprint-guide>
                  <Avatar.Fallback>AS</Avatar.Fallback>
                </Avatar.Root>
                <AppShell.Label data-blueprint-guide>ashon</AppShell.Label>
              </div>
            </AppShell.Footer>
          </AppShell.Sidebar>
          <AppShell.Content>
            <div className="landing-console-sheet" data-blueprint-guide>
              <PageHeader
                size="workspace"
                level={2}
                title="Deployments"
                description="Services across production, staging and development."
                actions={
                  <Button variant="primary" size="small">
                    New deployment
                  </Button>
                }
              />
              <Table.Container label="Recent deployments">
                <Table.Root>
                  <Table.Head>
                    <Table.Row>
                      <Table.HeaderCell scope="col">Service</Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        Environment
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {deployments.map(([service, env, tone, status]) => (
                      <Table.Row key={service}>
                        <Table.Cell>
                          <code>{service}</code>
                        </Table.Cell>
                        <Table.Cell>{env}</Table.Cell>
                        <Table.Cell>
                          <StatusBadge tone={tone}>{status}</StatusBadge>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Table.Container>
            </div>
          </AppShell.Content>
        </AppShell.Root>
      </div>
    </section>
  );
}
