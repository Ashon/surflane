import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Button,
  Checkbox,
  CodeBlock,
  Dialog,
  Field,
  NativeSelect,
  Popover,
  Table,
  Toggle,
  Tooltip,
  TooltipProvider,
} from '@surflane/ui'
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
        <label className='pui-choice-label'>
          <Checkbox.Root checked={clip} onCheckedChange={setClip}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          {t.clipLocalHost}
        </label>
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
        <Dialog.Title>{t.layeredWorkspacePreview}</Dialog.Title>
        <Dialog.Description>{t.layeredWorkspaceDescription}</Dialog.Description>
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
                <h3>{t.overlayDetails}</h3>
                <p>{t.sharedPopoverNote}</p>
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
              <Dialog.Title>{t.nestedInspectionTitle}</Dialog.Title>
              <Dialog.Description>
                {t.nestedInspectionDescription}
              </Dialog.Description>
              <Dialog.Close render={<Button variant='outline' />}>
                {t.closeNestedInspection}
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Root>
        </div>
        <Dialog.Close render={<Button variant='outline' />}>
          {t.closeLayeredPreview}
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  )
}
export function LayersFoundation() {
  const t = text[useLocale().locale]
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    const update = () => {
      const css = getComputedStyle(document.documentElement)
      setValues(
        Object.fromEntries(
          t.roles.map(([name]) => [name, css.getPropertyValue(name).trim()]),
        ),
      )
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])
  return (
    <>
      <nav className='page-toc' aria-label={t.onThisPage}>
        {t.nav.map(({ id, label }) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <section id='surfaces'>
        <h2>{t.surfacesTitle}</h2>
        <p>{t.surfacesIntro}</p>
        <div className='layer-shadow-comparison'>
          <div className='layer-shadow-sheet'>
            <strong>{t.contentSheet}</strong>
            <p>{t.contentSheetNote}</p>
          </div>
          <div className='layer-shadow-float'>
            <strong>{t.floatingSurface}</strong>
            <p>{t.floatingSurfaceNote}</p>
          </div>
        </div>
        <Table.Container label={t.surfaceTableLabel} orientation='horizontal'>
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
        <p>{t.surfacesValuesNote}</p>
      </section>
      <section id='contexts'>
        <h2>{t.contextsTitle}</h2>
        <p>{t.contextsIntro}</p>
        <StackingLab />
      </section>
      <section id='overlays'>
        <h2>{t.overlaysTitle}</h2>
        <p>{t.overlaysIntro}</p>
        <OverlayLab />
        <CodeBlock
          language='tsx'
          label={t.portaledSelectionLabel}
          code={`<Dialog.Root>
  <Dialog.Trigger render={<Button />}>Open workspace</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Workspace</Dialog.Title>
    <Dialog.Description>Review the selected environment.</Dialog.Description>
    <Field.Root>
      <Field.Label>Environment</Field.Label>
      <NativeSelect value={environment} onChange={onEnvironmentChange}>
        <option value='staging'>Staging</option>
        <option value='production'>Production</option>
      </NativeSelect>
    </Field.Root>
  </Dialog.Content>
</Dialog.Root>`}
        />
      </section>
      <section id='diagnostics'>
        <h2>{t.diagnoseTitle}</h2>
        <ol>
          <li>{t.diagnoseStep1}</li>
          <li>{t.diagnoseStep2}</li>
          <li>{t.diagnoseStep3}</li>
          <li>{t.diagnoseStep4}</li>
          <li>{t.diagnoseStep5}</li>
        </ol>
        <p>{t.topLayerNote}</p>
      </section>
      <section id='application'>
        <h2>{t.applicationTitle}</h2>
        <ul>
          <li>{t.compositionRule1}</li>
          <li>{t.compositionRule2}</li>
          <li>{t.compositionRule3}</li>
        </ul>
        <p>{t.themePortalNote}</p>
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
      </section>
    </>
  )
}
