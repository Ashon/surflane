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
export function InteractionLab({ toggleTheme }: { toggleTheme: () => void }) {
  const [result, setResult] = useState('')
  const [legacy, setLegacy] = useState('staging')
  const options = [
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' },
    { value: 'unavailable', label: 'Unavailable', disabled: true },
  ]
  return (
    <>
      {' '}
      <section id='components'>
        <h2>Inputs and selection</h2>
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
              Name
              <Input
                name='name'
                defaultValue='UI preview'
                placeholder='Enter a name'
                required
              />
            </label>
            <label>
              Environment
              <Select
                name='environment'
                options={options}
                defaultValue='staging'
                aria-label='Environment'
              />
            </label>
            <label>
              Compatibility field
              <NativeSelect
                aria-label='Compatibility field'
                name='legacyEnvironment'
                value={legacy}
                onChange={(e) => setLegacy(e.target.value)}
              >
                <option value='staging'>Staging</option>
                <option value='production'>Production</option>
              </NativeSelect>
            </label>
            <label>
              Disabled
              <Input placeholder='Unavailable' disabled />
            </label>
          </div>
          <div className='actions'>
            <Button type='submit'>Submit preview</Button>
            <Button variant='outline' type='reset'>
              Reset
            </Button>
          </div>
          <output aria-live='polite'>{result}</output>
        </form>
      </section>
      <section>
        <h2>Overlays and focus</h2>
        <div className='actions'>
          <Popover.Root>
            <Popover.Trigger
              render={<Button variant='outline' />}
              aria-label='Open account'
            >
              Account
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content side='top'>
                <Popover.Title>Account</Popover.Title>
                <Popover.Description>
                  Portaled content keeps the same tokens.
                </Popover.Description>
                <Input aria-label='Account nickname' placeholder='Nickname' />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <Menu.Root>
            <Menu.Trigger render={<Button variant='outline' />}>
              Actions
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Content>
                <Menu.Item className='pui-select-item'>Inspect</Menu.Item>
                <Menu.Item className='pui-select-item'>Export</Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant='outline' />}>
              Open dialog
            </Dialog.Trigger>
            <Dialog.Content
              className='demo-dialog'
              closeLabel='Dismiss deployment plan'
            >
              <Dialog.Header>
                <Dialog.Title>Deployment plan</Dialog.Title>
                <Dialog.Description>
                  Check the nested select menu, Escape, and focus restoration.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <label>
                  Dialog environment
                  <Select
                    aria-label='Dialog environment'
                    options={options}
                    defaultValue='staging'
                  />
                </label>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button variant='outline' />}>
                  Close dialog
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </section>
      <ConfirmationDemo />
      <PanelsDemo toggleTheme={toggleTheme} />
      <section>
        <h2>Scroll and build revisions</h2>
        <ScrollArea
          label='Build revisions'
          orientation='both'
          style={{ maxHeight: 160 }}
        >
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Start revision</th>
                <th>Finish revision</th>
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
