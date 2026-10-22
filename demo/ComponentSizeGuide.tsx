import React, { useId } from 'react'
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
} from '@surflane/ui'
import { componentSizes } from './ComponentSizePreview'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ComponentSizeGuide'
function Specimen({ size }: { size: (typeof componentSizes)[number] }) {
  const t = text[useLocale().locale]
  const id = useId()
  const labels = {
    small: t.sizeSmall,
    default: t.sizeDefault,
    large: t.sizeLarge,
  }
  return (
    <article
      className='size-scheme-specimen'
      aria-labelledby={`${id}-title`}
      data-size-specimen={size}
    >
      <header>
        <h3 id={`${id}-title`}>{labels[size]}</h3>
        <p>
          {size === 'small'
            ? t.denseTools
            : size === 'large'
              ? t.primaryTasks
              : t.defaultSizeIntro}
        </p>
      </header>
      <SizeProvider size={size}>
        <Stack gap={4}>
          <Inline gap={2}>
            <Button>{t.runPreview}</Button>
            <Button variant='outline'>{t.details}</Button>
            <Button size='icon' aria-label={t.addItem(labels[size])}>
              <svg
                viewBox='0 0 24 24'
                width='16'
                height='16'
                aria-hidden='true'
                fill='none'
                stroke='currentColor'
              >
                <path d='M12 5v14M5 12h14' />
              </svg>
            </Button>
          </Inline>
          <Field.Root>
            <Field.Label htmlFor={`${id}-input`}>{t.projectName}</Field.Label>
            <Input id={`${id}-input`} placeholder='Platform API' />
          </Field.Root>
          <Field.Root>
            <Field.Label htmlFor={`${id}-environment`}>
              {t.environment}
            </Field.Label>
            <NativeSelect id={`${id}-environment`} defaultValue='staging'>
              <option value='staging'>{t.staging}</option>
              <option value='production'>{t.production}</option>
            </NativeSelect>
          </Field.Root>
          <Field.Root>
            <Field.Label htmlFor={`${id}-notes`}>{t.notes}</Field.Label>
            <Textarea id={`${id}-notes`} placeholder={t.describePlaceholder} />
          </Field.Root>
          <Field.Root>
            <Field.Item>
              <Checkbox.Root defaultChecked>
                <Checkbox.Indicator />
              </Checkbox.Root>
              <Field.Label>{t.includeLogs}</Field.Label>
            </Field.Item>
          </Field.Root>
          <Field.Root>
            <Field.Item>
              <Switch.Root defaultChecked>
                <Switch.Thumb />
              </Switch.Root>
              <Field.Label>{t.autoRefresh}</Field.Label>
            </Field.Item>
          </Field.Root>
          <Inline gap={2}>
            <StatusBadge tone='success'>{t.available}</StatusBadge>
            <Spinner label={t.loadingPreview(labels[size])} />
          </Inline>
          <Tabs.Root defaultValue='overview'>
            <Tabs.List aria-label={t.sections(labels[size])}>
              <Tabs.Tab value='overview'>{t.overview}</Tabs.Tab>
              <Tabs.Tab value='history'>{t.history}</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value='overview'>{t.overviewPanel}</Tabs.Panel>
            <Tabs.Panel value='history'>{t.historyPanel}</Tabs.Panel>
          </Tabs.Root>
          <Menu.Root>
            <Menu.Trigger render={<Button variant='outline' />}>
              {t.openSizeMenu}
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Content>
                <Menu.Item>{t.inspectLogs}</Menu.Item>
                <Menu.Item>{t.viewHistory}</Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
          <Card.Root>
            <Card.Header>
              <Card.Title>{t.deployment}</Card.Title>
              <Card.Description>{t.deploymentDescription}</Card.Description>
            </Card.Header>
            <Card.Footer>
              <Button variant='ghost'>{t.inspect}</Button>
            </Card.Footer>
          </Card.Root>
        </Stack>
      </SizeProvider>
    </article>
  )
}
export function ComponentSizeGuide() {
  const t = text[useLocale().locale]
  return (
    <section id='component-sizes' aria-labelledby='component-sizes-title'>
      <h2 id='component-sizes-title'>{t.title}</h2>
      <p>{t.intro}</p>
      <Table.Container bleed label={t.tableLabel} orientation='horizontal'>
        <Table.Root>
          <Table.Caption>{t.caption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope='col'>{t.element}</Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.sizeSmall}</Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.sizeDefault}</Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.sizeLarge}</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {t.rows.map(([label, ...values]) => (
              <Table.Row key={label}>
                <Table.HeaderCell scope='row'>{label}</Table.HeaderCell>
                {values.map((value, i) => (
                  <Table.Cell key={i}>{value}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <p>{t.touchTargets}</p>
      <div className='size-scheme-grid'>
        {componentSizes.map((size) => (
          <Specimen key={size} size={size} />
        ))}
      </div>
      <h3>{t.compositionTitle}</h3>
      <p>{t.compositionIntro}</p>
      <CodeBlock
        language='tsx'
        label={t.codeLabel}
        code={`import { SizeProvider, Button, Input, Select } from '@surflane/ui'

<SizeProvider size='small'>
  <Input aria-label='Project name' />
  <Select aria-label='Environment' options={environments} />
  <Button>Apply</Button>
  <Button size='large'>Start deployment</Button>
</SizeProvider>

// The existing sm / md / lg aliases still work.
// A numeric size on Input is the standard HTML character-width hint.`}
      />
    </section>
  )
}
