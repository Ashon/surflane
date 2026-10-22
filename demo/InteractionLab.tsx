import React, { useState } from 'react'
import {
  Button,
  Input,
  Select,
  NativeSelect,
  Popover,
  Dialog,
  Menu,
  ScrollArea,
} from '@surflane/ui'
import { ConfirmationDemo } from './ConfirmationDemo'
import { PanelsDemo } from './PanelsDemo'
import { useLocale } from './i18n'
import { text } from './i18n/pages/InteractionLab'
export function InteractionLab({ toggleTheme }: { toggleTheme: () => void }) {
  const t = text[useLocale().locale]
  const [result, setResult] = useState('')
  const [legacy, setLegacy] = useState('staging')
  const options = [
    { value: 'staging', label: t.staging },
    { value: 'production', label: t.production },
    { value: 'unavailable', label: t.unavailable, disabled: true },
  ]
  return (
    <>
      {' '}
      <section id='components'>
        <h2>{t.inputsSelection}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setResult(
              JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
            )
          }}
        >
          <div className='grid'>
            <label>
              {t.name}
              <Input
                name='name'
                defaultValue='UI preview'
                placeholder={t.enterName}
                required
              />
            </label>
            <label>
              {t.environment}
              <Select
                name='environment'
                options={options}
                defaultValue='staging'
                aria-label={t.environment}
              />
            </label>
            <label>
              {t.compatibilityField}
              <NativeSelect
                aria-label={t.compatibilityField}
                name='legacyEnvironment'
                value={legacy}
                onChange={(e) => setLegacy(e.target.value)}
              >
                <option value='staging'>{t.staging}</option>
                <option value='production'>{t.production}</option>
              </NativeSelect>
            </label>
            <label>
              {t.disabled}
              <Input placeholder={t.unavailable} disabled />
            </label>
          </div>
          <div className='actions'>
            <Button type='submit'>{t.submitPreview}</Button>
            <Button variant='outline' type='reset'>
              {t.reset}
            </Button>
          </div>
          <output aria-live='polite'>{result}</output>
        </form>
      </section>
      <section>
        <h2>{t.overlaysFocus}</h2>
        <div className='actions'>
          <Popover.Root>
            <Popover.Trigger
              render={<Button variant='outline' />}
              aria-label={t.openAccount}
            >
              {t.account}
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content side='top'>
                <Popover.Title>{t.account}</Popover.Title>
                <Popover.Description>{t.portaledContent}</Popover.Description>
                <Input
                  aria-label={t.accountNickname}
                  placeholder={t.nickname}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <Menu.Root>
            <Menu.Trigger render={<Button variant='outline' />}>
              {t.actions}
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Content>
                <Menu.Item className='pui-select-item'>{t.inspect}</Menu.Item>
                <Menu.Item className='pui-select-item'>
                  {t.exportAction}
                </Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant='outline' />}>
              {t.openDialog}
            </Dialog.Trigger>
            <Dialog.Content size='small' closeLabel={t.dismissDeploymentPlan}>
              <Dialog.Header>
                <Dialog.Title>{t.deploymentPlan}</Dialog.Title>
                <Dialog.Description>{t.dialogDescription}</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <label>
                  {t.dialogEnvironment}
                  <Select
                    aria-label={t.dialogEnvironment}
                    options={options}
                    defaultValue='staging'
                  />
                </label>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button variant='outline' />}>
                  {t.closeDialog}
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </section>
      <ConfirmationDemo />
      <PanelsDemo toggleTheme={toggleTheme} />
      <section>
        <h2>{t.scrollBuildRevisions}</h2>
        <ScrollArea
          label={t.buildRevisions}
          orientation='both'
          style={{ maxHeight: 160 }}
        >
          <table>
            <thead>
              <tr>
                <th>{t.service}</th>
                <th>{t.startRevision}</th>
                <th>{t.finishRevision}</th>
              </tr>
            </thead>
            <tbody>
              {['auth', 'compute', 'infra', 'identity', 'storage'].map((s) => (
                <tr key={s}>
                  <td>{s}</td>
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
      </section>
    </>
  )
}
