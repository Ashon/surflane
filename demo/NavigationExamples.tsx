import React, { useState } from 'react'
import {
  Stack,
  Grid,
  Text,
  Field,
  Tabs,
  Accordion,
  Collapsible,
  Avatar,
  Inline,
  Badge,
  StatusBadge,
  Kbd,
  Table,
  Separator,
  Link as TextLink,
  Breadcrumbs,
  Input,
  Checkbox,
  Select,
  Button,
  ChoiceLabel,
  DirectionProvider,
} from '@surflane/ui'
import { withBase } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/NavigationExamples'
export { navigationExampleIds } from './exampleGroups'
function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  children: React.ReactNode
}) {
  return (
    <ChoiceLabel
      control={
        <Checkbox.Root checked={checked} onCheckedChange={onChange}>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      {children}
    </ChoiceLabel>
  )
}
function TabsExample() {
  const t = text[useLocale().locale]
  const [selected, setSelected] = useState<string | number | null>('overview'),
    [automatic, setAutomatic] = useState(false),
    [hold, setHold] = useState(false),
    [rtl, setRtl] = useState(false),
    [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
      'horizontal',
    )
  return (
    <Stack gap={5}>
      <Grid columns={2} gap={5}>
        <Field.Root>
          <Field.Label>{t.tabOrientation}</Field.Label>
          <Select
            value={orientation}
            onValueChange={(v) => setOrientation(v as typeof orientation)}
            options={[
              { value: 'horizontal', label: t.horizontal },
              { value: 'vertical', label: t.vertical },
            ]}
          />
        </Field.Root>
        <div>
          <Toggle checked={automatic} onChange={setAutomatic}>
            {t.activateOnFocus}
          </Toggle>
          <Toggle checked={hold} onChange={setHold}>
            {t.preventTabChanges}
          </Toggle>
          <Toggle checked={rtl} onChange={setRtl}>
            {t.rightToLeft}
          </Toggle>
        </div>
      </Grid>
      {/* Right to left takes both the provider, for the arrow keys, and dir. */}
      <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
        <div dir={rtl ? 'rtl' : 'ltr'}>
          <Tabs.Root
            value={selected}
            orientation={orientation}
            onValueChange={(value, event) => {
              if (hold && event.reason === 'none') {
                event.cancel()
                return
              }
              setSelected(value)
            }}
          >
            <Tabs.List
              aria-label={t.deploymentSections}
              activateOnFocus={automatic}
            >
              <Tabs.Tab value='overview'>{t.overview}</Tabs.Tab>
              <Tabs.Tab value='logs'>{t.logs}</Tabs.Tab>
              <Tabs.Tab value='unavailable' disabled>
                {t.unavailable}
              </Tabs.Tab>
              <Tabs.Tab value='history'>{t.history}</Tabs.Tab>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Panel value='overview' keepMounted>
              <p>{t.reviewEnvironmentAndDeploymentScope}</p>
              <Field.Root>
                <Field.Label>{t.previewNote}</Field.Label>
                <Input placeholder={t.noteRetainedAcrossTabs} />
              </Field.Root>
            </Tabs.Panel>
            <Tabs.Panel value='logs' keepMounted>
              <p>{t.reviewBuildLogsForSelectedPipelineRun}</p>
              <StatusBadge tone='success'>{t.passed}</StatusBadge>
            </Tabs.Panel>
            <Tabs.Panel value='history' keepMounted>
              <p>{t.reviewRecentRunsAndChangeHistory}</p>
            </Tabs.Panel>
          </Tabs.Root>
        </div>
      </DirectionProvider>
    </Stack>
  )
}
function AccordionExample() {
  const t = text[useLocale().locale]
  const [multiple, setMultiple] = useState(false),
    [open, setOpen] = useState<string[]>(['identity'])
  return (
    <Stack gap={5}>
      <Toggle
        checked={multiple}
        onChange={(next) => {
          setMultiple(next)
          if (!next) setOpen((old) => old.slice(0, 1))
        }}
      >
        {t.allowMultipleSections}
      </Toggle>
      <Accordion.Root
        value={open}
        onValueChange={setOpen}
        multiple={multiple}
        keepMounted
      >
        <Accordion.Item value='identity'>
          <Accordion.Header>
            <Accordion.Trigger>{t.identityControls}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <p>{t.checkServiceAccountPermissionsAndTeamIsolation}</p>
            <Field.Root>
              <Field.Label>{t.caseNote}</Field.Label>
              <Input placeholder={t.retainedWhileCollapsed} />
            </Field.Root>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value='environments'>
          <Accordion.Header>
            <Accordion.Trigger>{t.environmentAccess}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <p>{t.compareAccessForAllowedAndBlockedEnvironments}</p>
            <StatusBadge tone='neutral'>{t.notRun}</StatusBadge>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value='unavailable' disabled>
          <Accordion.Header>
            <Accordion.Trigger>{t.unavailablePolicy}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>{t.unavailablePreview}</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </Stack>
  )
}
function CollapsibleExample() {
  const t = text[useLocale().locale]
  const [disabled, setDisabled] = useState(false)
  return (
    <Stack gap={5}>
      <Toggle checked={disabled} onChange={setDisabled}>
        {t.disableDisclosure}
      </Toggle>
      <Collapsible.Root disabled={disabled}>
        <Collapsible.Trigger>{t.technicalDetails}</Collapsible.Trigger>
        <Collapsible.Panel keepMounted>
          <p>{t.reviewDeploymentResultsAndRedactedBuildLogs}</p>
          <Field.Root>
            <Field.Label>{t.buildNote}</Field.Label>
            <Input placeholder={t.retainedWhileCollapsed} />
          </Field.Root>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Stack>
  )
}
function AvatarExample() {
  const t = text[useLocale().locale]
  const [broken, setBroken] = useState(false),
    [loading, setLoading] = useState('idle')
  return (
    <Stack gap={5}>
      <Inline gap={3}>
        <Avatar.Root
          role='img'
          aria-label={t.previewProfile}
          aria-description={t.online}
          size='large'
        >
          <Avatar.Image
            alt=''
            src={
              broken
                ? 'data:image/png;base64,invalid-avatar'
                : withBase('/avatar-preview.svg')
            }
            onLoadingStatusChange={setLoading}
          />
          <Avatar.Fallback aria-hidden='true'>CG</Avatar.Fallback>
          <Avatar.Status aria-hidden='true' />
        </Avatar.Root>
        <Avatar.Root role='img' aria-label={t.documentationPreviewUser}>
          <Avatar.Fallback aria-hidden='true'>CD</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root role='img' aria-label={t.unknownPreviewUser} size='small'>
          <Avatar.Fallback aria-hidden='true' />
        </Avatar.Root>
      </Inline>
      <Inline gap={3}>
        <Button variant='outline' onClick={() => setBroken(!broken)}>
          {broken ? t.restorePreviewImage : t.previewBrokenImage}
        </Button>
      </Inline>
      <Text color='secondary' role='status'>
        {t.imageStatus(loading)}
      </Text>
    </Stack>
  )
}
function BadgeExample() {
  const t = text[useLocale().locale]
  const badgeStates = t.badgeStates
  const [value, setValue] = useState('passed')
  const state = badgeStates.find((s) => s.value === value)!
  return (
    <Stack gap={5}>
      <Inline gap={3}>
        {badgeStates.map((s) => (
          <StatusBadge tone={s.tone} key={s.value}>
            {s.label}
          </StatusBadge>
        ))}
        <Badge>{t.threeEnvironments}</Badge>
      </Inline>
      <Field.Root>
        <Field.Label>{t.statusPreview}</Field.Label>
        <Select
          value={value}
          onValueChange={setValue}
          options={badgeStates.map((s) => ({ value: s.value, label: s.label }))}
        />
      </Field.Root>
      <div role='status' className='status-sentence'>
        <StatusBadge tone={state.tone}>{state.label}</StatusBadge>
        <span>{state.description}</span>
      </div>
    </Stack>
  )
}
function KbdExample() {
  const t = text[useLocale().locale]
  const labels = t.kbdLabels
  return (
    <Stack gap={5}>
      <Text color='secondary'>
        {t.kbdSearchBefore}
        <Kbd keys={['mod', 'k']} />
        {t.kbdSearchAfter}
      </Text>
      <Text variant='caption' color='muted'>
        <Kbd keys='up' labels={labels} /> <Kbd keys='down' labels={labels} />{' '}
        {t.kbdChoose} · <Kbd keys='enter' /> {t.kbdOpen} · <Kbd keys='escape' />{' '}
        {t.kbdClose}
      </Text>
      <Table.Root>
        <Table.Caption>{t.kbdCaption}</Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell scope='col'>{t.kbdAction}</Table.HeaderCell>
            <Table.HeaderCell scope='col'>{t.kbdApple}</Table.HeaderCell>
            <Table.HeaderCell scope='col'>{t.kbdOther}</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {t.kbdRows.map((row) => (
            <Table.Row key={row.label}>
              <Table.Cell>{row.label}</Table.Cell>
              <Table.Cell>
                <Kbd keys={row.keys} labels={labels} platform='apple' />
              </Table.Cell>
              <Table.Cell>
                <Kbd keys={row.keys} labels={labels} platform='other' />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  )
}
function SeparatorExample() {
  const t = text[useLocale().locale]
  const [inset, setInset] = useState(false)
  return (
    <Stack gap={5}>
      <Toggle checked={inset} onChange={setInset}>
        {t.useInsetSeparator}
      </Toggle>
      <Text color='secondary'>{t.environmentOverview}</Text>
      <Separator inset={inset} />
      <Text color='secondary'>{t.deploymentDetails}</Text>
      <Inline gap={3}>
        <span>{t.staging}</span>
        <Separator orientation='vertical' />
        <span>{t.production}</span>
      </Inline>
      {/* Values on one line: the dots separate them without being seen as text. */}
      <Text data-testid='separator-strip'>
        {t.strip.map((value, index) => (
          <React.Fragment key={value}>
            {index > 0 && <Separator variant='dot' />}
            {value}
          </React.Fragment>
        ))}
      </Text>
    </Stack>
  )
}
function LinkExample() {
  const t = text[useLocale().locale]
  return (
    <Stack gap={5}>
      <Text color='secondary'>
        <TextLink href='#link-preview-target'>
          {t.inspectPreviewDestination}
        </TextLink>
      </Text>
      <Text color='secondary'>
        <TextLink
          href='https://base-ui.com/react/overview/about'
          target='_blank'
          rel='noreferrer'
        >
          {t.baseUIDocumentationOpensInNewTab}
        </TextLink>
      </Text>
      <Text color='secondary' id='link-preview-target' tabIndex={-1}>
        {t.previewDestinationNativeAnchorsKeepBrowserBehavior}
      </Text>
    </Stack>
  )
}
function BreadcrumbExample() {
  const t = text[useLocale().locale]
  return (
    <Stack gap={5}>
      <Breadcrumbs.Root aria-label={t.projectBreadcrumb}>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href='#breadcrumb-preview-target'>
              {t.platformServices}
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Link href='#breadcrumb-preview-target'>
              {t.projects}
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Current>demo-e2e-01</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
      <Text color='secondary' id='breadcrumb-preview-target' tabIndex={-1}>
        {t.showsProjectPathAsOrderedList}
      </Text>
    </Stack>
  )
}
export function NavigationExample({ id }: { id: string }) {
  const examples: Record<string, React.ReactNode> = {
    tabs: <TabsExample />,
    accordion: <AccordionExample />,
    collapsible: <CollapsibleExample />,
    avatar: <AvatarExample />,
    badge: <BadgeExample />,
    kbd: <KbdExample />,
    separator: <SeparatorExample />,
    link: <LinkExample />,
    breadcrumbs: <BreadcrumbExample />,
  }
  return (
    <div className='component-example'>
      <div className='example-controls'>{examples[id]}</div>
    </div>
  )
}
