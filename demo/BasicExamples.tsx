import React, { useRef, useState } from 'react'
import {
  Button,
  Stack,
  Inline,
  Input,
  Select,
  NativeSelect,
  Popover,
  Menu,
  Tooltip,
  TooltipProvider,
  Dialog,
  AlertDialog,
  Sheet,
  Drawer,
  ScrollArea,
} from '@surflane/ui'
import { PanelsDemo } from './PanelsDemo'
import { useLocale } from './i18n'
import { text } from './i18n/pages/BasicExamples'
export function BasicExample({
  id,
  toggleTheme,
}: {
  id: string
  toggleTheme: () => void
}) {
  const t = text[useLocale().locale]
  const regions = [
    { value: 'staging', label: t.staging },
    { value: 'production', label: t.production },
    { value: 'unavailable', label: t.unavailable, disabled: true },
  ]
  const [message, setMessage] = useState(t.noPreviewActionTaken)
  const [selected, setSelected] = useState('staging')
  const [open, setOpen] = useState(false)
  const cancel = useRef<HTMLButtonElement>(null)
  let example: React.ReactNode
  switch (id) {
    case 'button':
      example = (
        <div className='example-stack'>
          <div className='actions'>
            <Button
              variant='primary'
              onClick={() => setMessage(t.primaryActionPreviewed)}
            >
              {t.runPreview}
            </Button>
            <Button
              variant='outline'
              onClick={() => setMessage(t.secondaryActionPreviewed)}
            >
              {t.inspectDetails}
            </Button>
            <Button
              variant='ghost'
              onClick={() => setMessage(t.ghostActionPreviewed)}
            >
              {t.viewHistory}
            </Button>
            <Button
              variant='destructive'
              onClick={() => setMessage(t.destructiveStyleOnly)}
            >
              {t.discardPreview}
            </Button>
            <Button disabled>{t.unavailable}</Button>
          </div>
          <div className='button-variant-guide'>
            <p>{t.defaultIsFormerName}</p>
            <ScrollArea label={t.buttonVariantsAndSizes}>
              <table className='button-variant-table'>
                <caption>{t.emphasisLevelAndSize}</caption>
                <thead>
                  <tr>
                    <th scope='col'>{t.role}</th>
                    {t.sizes.map((size) => (
                      <th key={size} scope='col'>
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.variantRows.map(([variant, label, description]) => (
                    <tr key={variant}>
                      <th scope='row'>
                        {label}
                        <span>{description}</span>
                      </th>
                      {(['small', 'default', 'large'] as const).map((size) => (
                        <td key={size}>
                          <Button
                            variant={variant}
                            size={size}
                            aria-label={`${label}, ${size}`}
                            onClick={() => setMessage(t.previewed(label, size))}
                          >
                            {label}
                          </Button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </div>
      )
      break
    case 'input':
      example = (
        <div className='grid'>
          <label>
            {t.name}
            <Input placeholder={t.enterName} />
          </label>
          <label>
            {t.readOnly}
            <Input readOnly value='demo-e2e-01' />
          </label>
          <label>
            {t.projectID}
            <Input
              placeholder='project-id'
              aria-invalid='true'
              aria-describedby='input-error'
            />
            <span id='input-error' className='field-error'>
              {t.checkProjectID}
            </span>
          </label>
          <label>
            {t.disabled}
            <Input disabled placeholder={t.unavailable} />
          </label>
        </div>
      )
      break
    case 'select':
    case 'native-select':
      example = (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setMessage(
              t.submittedEnvironment(
                new FormData(e.currentTarget).get('environment'),
              ),
            )
          }}
        >
          <label>
            {t.environment}
            {id === 'select' ? (
              <Select
                name='environment'
                options={regions}
                defaultValue='staging'
                aria-label={t.environment}
              />
            ) : (
              <NativeSelect
                name='environment'
                aria-label={t.environment}
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value='staging'>{t.staging}</option>
                <option value='production'>{t.production}</option>
                <option disabled value='unavailable'>
                  {t.unavailable}
                </option>
              </NativeSelect>
            )}
          </label>
          <div className='actions'>
            <Button type='submit'>{t.submitPreview}</Button>
            <Button type='reset' variant='outline'>
              {t.reset}
            </Button>
          </div>
        </form>
      )
      break
    case 'popover':
      example = (
        <Popover.Root>
          <Popover.Trigger render={<Button variant='outline' />}>
            {t.inspectAccount}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>
              <Stack gap={4} className='spacing-example'>
                <Stack gap={1} className='spacing-example'>
                  <Popover.Title>{t.previewAccount}</Popover.Title>
                  <Popover.Description>{t.reviewDetails}</Popover.Description>
                </Stack>
                <label>
                  {t.nickname}
                  <Input placeholder={t.displayName} />
                </label>
                <Inline gap={2}>
                  <Popover.Close render={<Button variant='outline' />}>
                    {t.done}
                  </Popover.Close>
                </Inline>
              </Stack>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )
      break
    case 'menu':
      example = (
        <Menu.Root>
          <Menu.Trigger render={<Button variant='outline' />}>
            {t.openActions}
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Content>
              <Menu.Item onClick={() => setMessage(t.inspectSelected)}>
                {t.inspect}
              </Menu.Item>
              <Menu.Item onClick={() => setMessage(t.exportSelected)}>
                {t.exportPreview}
              </Menu.Item>
              <Menu.Item disabled>{t.deleteUnavailable}</Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu.Root>
      )
      break
    case 'tooltip':
      example = (
        <TooltipProvider delayDuration={200}>
          <Tooltip label={t.inspectBuildLogs}>
            <Button variant='outline'>{t.inspectLogs}</Button>
          </Tooltip>
        </TooltipProvider>
      )
      break
    case 'dialog':
      example = (
        <Dialog.Root>
          <Dialog.Trigger render={<Button variant='outline' />}>
            {t.openDeploymentPlan}
          </Dialog.Trigger>
          <Dialog.Content closeLabel={t.closeDeploymentPlan}>
            <Dialog.Header>
              <Dialog.Title>{t.deploymentPlan}</Dialog.Title>
              <Dialog.Description>
                {t.doesNotStartDeployment}
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <label>
                {t.environment}
                <Select
                  options={regions}
                  defaultValue='staging'
                  aria-label={t.dialogEnvironment}
                />
              </label>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close render={<Button variant='outline' />}>
                {t.cancel}
              </Dialog.Close>
              <Dialog.Close render={<Button />}>{t.savePreview}</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      )
      break
    case 'alert-dialog':
      example = (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
          <AlertDialog.Trigger render={<Button variant='outline' />}>
            {t.previewDiscardConfirmation}
          </AlertDialog.Trigger>
          <AlertDialog.Content initialFocus={cancel}>
            <AlertDialog.Header>
              <AlertDialog.Title>{t.discardThisDraft}</AlertDialog.Title>
              <AlertDialog.Description>
                {t.discardsOnlyPreviewDraft}
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Close
                ref={cancel}
                render={<Button variant='outline' />}
              >
                {t.keepDraft}
              </AlertDialog.Close>
              <Button
                variant='destructive'
                onClick={() => {
                  setMessage(t.previewDraftDiscarded)
                  setOpen(false)
                }}
              >
                {t.discardPreviewDraft}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      )
      break
    case 'inline-confirmation':
      example = (
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger render={<Button variant='outline' />}>
            {t.previewResetConfirmation}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>
              <Popover.Title>{t.resetPreviewFiltersTitle}</Popover.Title>
              <Popover.Description>
                {t.resetsSelectedFilters}
              </Popover.Description>
              <div className='actions'>
                <Popover.Close render={<Button variant='outline' />}>
                  {t.keepFilters}
                </Popover.Close>
                <Button
                  onClick={() => {
                    setMessage(t.previewFiltersReset)
                    setOpen(false)
                  }}
                >
                  {t.resetPreviewFilters}
                </Button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )
      break
    case 'sheet':
    case 'drawer':
      return <PanelsDemo toggleTheme={toggleTheme} view={id} />
    case 'scroll-area':
      example = (
        <ScrollArea
          label={t.buildRevisions}
          orientation='both'
          style={{ maxHeight: 200 }}
        >
          <table>
            <caption>{t.previewBuildRevisions}</caption>
            <thead>
              <tr>
                <th scope='col'>{t.service}</th>
                <th scope='col'>{t.startRevision}</th>
                <th scope='col'>{t.finishRevision}</th>
              </tr>
            </thead>
            <tbody>
              {[
                'platform-api',
                'auth-gateway',
                'billing-service',
                'search-indexer',
                'notification-worker',
                'payments-api',
              ].map((s) => (
                <tr key={s}>
                  <th scope='row'>{s}</th>
                  <td>
                    <code>sha256:8af4935c6e2b1542a302a89238c0</code>
                  </td>
                  <td>
                    <code>sha256:28c04592d081b1b83f1b2d46177a</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      )
      break
    default:
      return null
  }
  return (
    <div className='component-example'>
      <div className='example-controls'>{example}</div>
      {[
        'button',
        'select',
        'native-select',
        'menu',
        'alert-dialog',
        'inline-confirmation',
      ].includes(id) && (
        <p role='status' className='note'>
          {message}
        </p>
      )}
    </div>
  )
}
