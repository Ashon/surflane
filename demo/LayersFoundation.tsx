import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Button,
  Checkbox,
  Dialog,
  Field,
  NativeSelect,
  Popover,
  Table,
  Toggle,
  Tooltip,
  TooltipProvider,
  ChoiceLabel,
} from '@surflane/ui'
import { FoundationPage, FoundationSection } from './FoundationPage'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/LayersFoundation'

function StackingLab() {
  const t = text[useLocale().locale]
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [portal, setPortal] = useState(false)
  const [clip, setClip] = useState(true)
  const plane = (
    <div
      className='layer-demo-plane'
      data-layer-plane
      data-portalled={portal || undefined}
    >
      {t.overlayPlane}
    </div>
  )
  return (
    <>
      <div className='actions layer-demo-controls'>
        <Toggle pressed={portal} onPressedChange={setPortal}>
          {t.portalToStage}
        </Toggle>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={clip} onCheckedChange={setClip}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.clipLocalHost}
        </ChoiceLabel>
      </div>
      <div
        ref={setStage}
        className='layer-demo-stage'
        role='img'
        aria-label={portal ? t.stageLabelPortaled : t.stageLabelLocal}
      >
        <div
          className='layer-demo-host'
          data-clipped={clip || undefined}
          aria-hidden='true'
        >
          {t.parentContext}
          {!portal && plane}
        </div>
        <div className='layer-demo-cover' aria-hidden='true'>
          {t.siblingContext}
        </div>
        {portal &&
          stage &&
          createPortal(<div aria-hidden='true'>{plane}</div>, stage)}
      </div>
      <p role='status' aria-label={t.stackResultLabel}>
        {portal ? t.statusPortal : t.statusLocal}
      </p>
      <p>{t.stackingNote}</p>
    </>
  )
}
function OverlayLab() {
  const t = text[useLocale().locale]
  const [region, setRegion] = useState('staging')
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant='outline' />}>
        {t.openLayeredDialog}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{t.layeredWorkspacePreview}</Dialog.Title>
          <Dialog.Description>
            {t.layeredWorkspaceDescription}
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Field.Root>
            <Field.Label>{t.previewEnvironment}</Field.Label>
            <NativeSelect
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              <option value='staging'>{t.stagingPreview}</option>
              <option value='production'>{t.productionPreview}</option>
            </NativeSelect>
          </Field.Root>
          <p>
            {t.selectedEnvironment} <strong data-layer-region>{region}</strong>
          </p>
          <div className='actions'>
            <Popover.Root>
              <Popover.Trigger render={<Button variant='outline' />}>
                {t.inspectOverlayDetails}
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side='bottom'
                  align='start'
                  aria-label={t.overlayDetails}
                >
                  <Popover.Title render={<h3 />}>
                    {t.overlayDetails}
                  </Popover.Title>
                  <Popover.Description>
                    {t.sharedPopoverNote}
                  </Popover.Description>
                  <p>
                    {t.currentSelection} <strong>{region}</strong>
                  </p>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
            <TooltipProvider>
              <Tooltip label={t.tooltipExplainLayer}>
                <Button variant='outline'>{t.explainThisLayer}</Button>
              </Tooltip>
            </TooltipProvider>
            <Dialog.Root>
              <Dialog.Trigger render={<Button variant='outline' />}>
                {t.openNestedDialog}
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>{t.nestedInspectionTitle}</Dialog.Title>
                  <Dialog.Description>
                    {t.nestedInspectionDescription}
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                  <Dialog.Close render={<Button variant='outline' />}>
                    {t.closeNestedInspection}
                  </Dialog.Close>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant='outline' />}>
            {t.closeLayeredPreview}
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
export function LayersFoundation() {
  const t = text[useLocale().locale]
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    const css = getComputedStyle(document.documentElement)
    setValues(
      Object.fromEntries(
        t.roles.map(([name]) => [name, css.getPropertyValue(name).trim()]),
      ),
    )
  }, [])
  return (
    <FoundationPage
      principles={t.principles}
      sections={t.sections}
      related={[
        '/foundations/hierarchy',
        '/foundations/accessibility',
        '/components/dialog',
        '/components/popover',
      ]}
    >
      <FoundationSection id='scale'>
        <p>{t.scaleIntro}</p>
        <Table.Container
          bleed
          label={t.surfaceTableLabel}
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>{t.tableCaption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.tokenHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.roleHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>
                  {t.resolvedHeader}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {t.roles.map(([name, role]) => (
                <Table.Row key={name}>
                  <Table.HeaderCell scope='row'>
                    <Link href={`/tokens?q=${encodeURIComponent(name)}`}>
                      <code>{name}</code>
                    </Link>
                  </Table.HeaderCell>
                  <Table.Cell>{role}</Table.Cell>
                  <Table.Cell data-layer-token={name}>
                    <code>{values[name] ?? t.reading}</code>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>{t.scaleNote}</p>
      </FoundationSection>
      <FoundationSection id='contexts'>
        <p>{t.contextsIntro}</p>
        <StackingLab />
      </FoundationSection>
      <FoundationSection id='overlays'>
        <p>{t.overlaysIntro}</p>
        <div className='actions'>
          <OverlayLab />
        </div>
      </FoundationSection>
      <FoundationSection id='diagnosis'>
        <ol>
          {t.diagnosis.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <p>
          {t.referencesLabel}{' '}
          <a href='https://www.w3.org/TR/CSS22/zindex.html'>
            {t.w3cStackingOrderLink}
          </a>
          ,{' '}
          <a href='https://react.dev/reference/react-dom/createPortal'>
            React createPortal
          </a>
          ,{' '}
          <a href='https://www.w3.org/TR/css-position-4/#top-layer'>
            {t.w3cPositionedLayoutLink}
          </a>
          ,{' '}
          <a href='https://base-ui.com/react/components/dialog'>
            Base UI Dialog
          </a>
        </p>
      </FoundationSection>
    </FoundationPage>
  )
}
