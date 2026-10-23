import React, { useState } from 'react'
import {
  Tabs,
  Accordion,
  Collapsible,
  Avatar,
  Inline,
  Badge,
  StatusBadge,
  Separator,
  Link as TextLink,
  Breadcrumbs,
  Input,
  Checkbox,
  Select,
  Button,
  ChoiceLabel,
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
    [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
      'horizontal',
    )
  return (
    <div className='example-stack'>
      <div className='grid'>
        <label>
          {t.tabOrientation}
          <Select
            aria-label={t.tabOrientation}
            value={orientation}
            onValueChange={(v) => setOrientation(v as typeof orientation)}
            options={[
              { value: 'horizontal', label: t.horizontal },
              { value: 'vertical', label: t.vertical },
            ]}
          />
        </label>
        <div>
          <Toggle checked={automatic} onChange={setAutomatic}>
            {t.activateOnFocus}
          </Toggle>
          <Toggle checked={hold} onChange={setHold}>
            {t.preventTabChanges}
          </Toggle>
        </div>
      </div>
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
          <label>
            {t.previewNote}
            <Input placeholder={t.noteRetainedAcrossTabs} />
          </label>
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
  )
}
function AccordionExample() {
  const t = text[useLocale().locale]
  const [multiple, setMultiple] = useState(false),
    [open, setOpen] = useState<string[]>(['identity'])
  return (
    <div className='example-stack'>
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
            <label>
              {t.caseNote}
              <Input placeholder={t.retainedWhileCollapsed} />
            </label>
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
    </div>
  )
}
function CollapsibleExample() {
  const t = text[useLocale().locale]
  const [disabled, setDisabled] = useState(false)
  return (
    <div className='example-stack'>
      <Toggle checked={disabled} onChange={setDisabled}>
        {t.disableDisclosure}
      </Toggle>
      <Collapsible.Root disabled={disabled}>
        <Collapsible.Trigger>{t.technicalDetails}</Collapsible.Trigger>
        <Collapsible.Panel keepMounted>
          <p>{t.reviewDeploymentResultsAndRedactedBuildLogs}</p>
          <label>
            {t.buildNote}
            <Input placeholder={t.retainedWhileCollapsed} />
          </label>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  )
}
function AvatarExample() {
  const t = text[useLocale().locale]
  const [broken, setBroken] = useState(false),
    [loading, setLoading] = useState('idle')
  return (
    <div className='example-stack'>
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
      <p role='status'>{t.imageStatus(loading)}</p>
    </div>
  )
}
function BadgeExample() {
  const t = text[useLocale().locale]
  const badgeStates = t.badgeStates
  const [value, setValue] = useState('passed')
  const state = badgeStates.find((s) => s.value === value)!
  return (
    <div className='example-stack'>
      <div className='actions'>
        {badgeStates.map((s) => (
          <StatusBadge tone={s.tone} key={s.value}>
            {s.label}
          </StatusBadge>
        ))}
        <Badge>{t.threeEnvironments}</Badge>
      </div>
      <label>
        {t.statusPreview}
        <Select
          aria-label={t.statusPreview}
          value={value}
          onValueChange={setValue}
          options={badgeStates.map((s) => ({ value: s.value, label: s.label }))}
        />
      </label>
      <div role='status' className='status-sentence'>
        <StatusBadge tone={state.tone}>{state.label}</StatusBadge>
        <span>{state.description}</span>
      </div>
    </div>
  )
}
function SeparatorExample() {
  const t = text[useLocale().locale]
  const [inset, setInset] = useState(false)
  return (
    <div className='example-stack'>
      <Toggle checked={inset} onChange={setInset}>
        {t.useInsetSeparator}
      </Toggle>
      <p>{t.environmentOverview}</p>
      <Separator inset={inset} />
      <p>{t.deploymentDetails}</p>
      <div className='actions'>
        <span>{t.staging}</span>
        <Separator orientation='vertical' />
        <span>{t.production}</span>
      </div>
    </div>
  )
}
function LinkExample() {
  const t = text[useLocale().locale]
  return (
    <div className='example-stack'>
      <p>
        <TextLink href='#link-preview-target'>
          {t.inspectPreviewDestination}
        </TextLink>
      </p>
      <p>
        <TextLink
          href='https://base-ui.com/react/overview/about'
          target='_blank'
          rel='noreferrer'
        >
          {t.baseUIDocumentationOpensInNewTab}
        </TextLink>
      </p>
      <p id='link-preview-target' tabIndex={-1}>
        {t.previewDestinationNativeAnchorsKeepBrowserBehavior}
      </p>
    </div>
  )
}
function BreadcrumbExample() {
  const t = text[useLocale().locale]
  return (
    <div className='example-stack'>
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
      <p id='breadcrumb-preview-target' tabIndex={-1}>
        {t.showsProjectPathAsOrderedList}
      </p>
    </div>
  )
}
export function NavigationExample({ id }: { id: string }) {
  const examples: Record<string, React.ReactNode> = {
    tabs: <TabsExample />,
    accordion: <AccordionExample />,
    collapsible: <CollapsibleExample />,
    avatar: <AvatarExample />,
    badge: <BadgeExample />,
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
