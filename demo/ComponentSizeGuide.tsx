import React, { useId } from "react";
import {
  SizeProvider,
  Button,
  Input,
  Textarea,
  NativeSelect,
  Checkbox,
  Switch,
  Field,
  StatusBadge,
  Spinner,
  Card,
  Menu,
  Tabs,
  Table,
  CodeBlock,
  Stack,
  Inline,
} from "@surflane/ui";
import { componentSizes, sizeLabels } from "./ComponentSizePreview";
function Specimen({ size }: { size: (typeof componentSizes)[number] }) {
  const id = useId();
  return (
    <article
      className="size-scheme-specimen"
      aria-labelledby={`${id}-title`}
      data-size-specimen={size}
    >
      <header>
        <h3 id={`${id}-title`}>{sizeLabels[size]}</h3>
        <p>
          {size === "small"
            ? "Dense tools and secondary tasks"
            : size === "large"
              ? "Primary tasks and roomy input"
              : "Default size for most screens"}
        </p>
      </header>
      <SizeProvider size={size}>
        <Stack gap={4}>
          <Inline gap={2}>
            <Button>Run preview</Button>
            <Button variant="outline">Details</Button>
            <Button size="icon" aria-label={`${sizeLabels[size]} add item`}>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </Button>
          </Inline>
          <Field.Root>
            <Field.Label htmlFor={`${id}-input`}>Project name</Field.Label>
            <Input id={`${id}-input`} placeholder="Platform API" />
          </Field.Root>
          <Field.Root>
            <Field.Label htmlFor={`${id}-environment`}>Environment</Field.Label>
            <NativeSelect id={`${id}-environment`} defaultValue="staging">
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </NativeSelect>
          </Field.Root>
          <Field.Root>
            <Field.Label htmlFor={`${id}-notes`}>Notes</Field.Label>
            <Textarea
              id={`${id}-notes`}
              placeholder="Describe what to deploy."
            />
          </Field.Root>
          <Field.Root>
            <Field.Item>
              <Checkbox.Root defaultChecked>
                <Checkbox.Indicator />
              </Checkbox.Root>
              <Field.Label>Include logs</Field.Label>
            </Field.Item>
          </Field.Root>
          <Field.Root>
            <Field.Item>
              <Switch.Root defaultChecked>
                <Switch.Thumb />
              </Switch.Root>
              <Field.Label>Auto refresh</Field.Label>
            </Field.Item>
          </Field.Root>
          <Inline gap={2}>
            <StatusBadge tone="success">Available</StatusBadge>
            <Spinner label={`${sizeLabels[size]} loading preview`} />
          </Inline>
          <Tabs.Root defaultValue="overview">
            <Tabs.List aria-label={`${sizeLabels[size]} sections`}>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="history">History</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="overview">
              Review recent runs and build logs.
            </Tabs.Panel>
            <Tabs.Panel value="history">Recent run history.</Tabs.Panel>
          </Tabs.Root>
          <Menu.Root>
            <Menu.Trigger render={<Button variant="outline" />}>
              Open size menu
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Content>
                <Menu.Item>Inspect logs</Menu.Item>
                <Menu.Item>View history</Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
          <Card.Root>
            <Card.Header>
              <Card.Title>Deployment</Card.Title>
              <Card.Description>
                Keeps the same surface and spacing rules.
              </Card.Description>
            </Card.Header>
            <Card.Footer>
              <Button variant="ghost">Inspect</Button>
            </Card.Footer>
          </Card.Root>
        </Stack>
      </SizeProvider>
    </article>
  );
}
export function ComponentSizeGuide() {
  return (
    <section id="component-sizes" aria-labelledby="component-sizes-title">
      <h2 id="component-sizes-title">Component sizes</h2>
      <p>
        Small, Default and Large are three sizes of the same design language.
        Default is the current default. Sizes adjust control height and spacing
        instead of scaling the whole screen.
      </p>
      <Table.Container
        label="Component size scheme dimensions"
        orientation="horizontal"
      >
        <Table.Root>
          <Table.Caption>
            Desktop values / Small · Default · Large
          </Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope="col">Element</Table.HeaderCell>
              <Table.HeaderCell scope="col">Small</Table.HeaderCell>
              <Table.HeaderCell scope="col">Default</Table.HeaderCell>
              <Table.HeaderCell scope="col">Large</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {[
              ["Button / input height", "32px", "36px", "44px"],
              ["Control body text", "13 / 20px", "14 / 22px", "16 / 24px"],
              ["Checkbox / radio", "16px", "20px", "24px"],
              ["Popover padding", "12px", "16px", "24px"],
              ["Card padding", "16px", "24px", "32px"],
              ["Table cell vertical padding", "8px", "12px", "16px"],
              ["Badge vertical padding", "2px", "4px", "6px"],
              ["Avatar", "24px", "36px", "48px"],
              ["Tree row", "36px", "44px", "52px"],
            ].map(([label, ...values]) => (
              <Table.Row key={label}>
                <Table.HeaderCell scope="row">{label}</Table.HeaderCell>
                {values.map((value, i) => (
                  <Table.Cell key={i}>{value}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <p>
        On small screens and touch devices, buttons, inputs and menus keep a
        minimum height of 44px. Checkboxes and switches respond to clicks
        anywhere on the row, including the label. Size changes never distort
        chart coordinates and data, divider thickness, scrollbar thickness or
        the reading type hierarchy.
      </p>
      <div className="size-scheme-grid">
        {componentSizes.map((size) => (
          <Specimen key={size} size={size} />
        ))}
      </div>
      <h3>Composition and overrides</h3>
      <p>
        SizeProvider sets the size of a whole composition such as a form, table
        or menu. Menus, popovers and dialogs that open in a portal inherit the
        same size. A nested provider changes only the size inside it, and an
        individual size prop or explicit padding or height takes precedence on
        that component. Don't place a provider inside a table; wrap
        Table.Container from the outside instead.
      </p>
      <CodeBlock
        language="tsx"
        label="Component size composition"
        code={
          'import { SizeProvider, Button, Input, Select } from "@surflane/ui";\n\n<SizeProvider size="small">\n  <Input aria-label="Project name" />\n  <Select aria-label="Environment" options={environments} />\n  <Button>Apply</Button>\n  <Button size="large">Start deployment</Button>\n</SizeProvider>\n\n// The existing sm / md / lg aliases still work.\n// A numeric size on Input is the standard HTML character-width hint.'
        }
      />
    </section>
  );
}
