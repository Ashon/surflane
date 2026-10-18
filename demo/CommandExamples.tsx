import React, { useState } from 'react'
import {
  Toggle,
  ToggleGroup,
  Toolbar,
  Menubar,
  Menu,
  Button,
  Checkbox,
  DirectionProvider,
} from '@surflane/ui'
export { commandExampleIds } from './exampleGroups'
function Glyph({ kind }: { kind: 'pin' | 'refresh' | 'list' | 'grid' }) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      aria-hidden='true'
    >
      <path
        d={
          kind === 'pin'
            ? 'm8 3 8 0-1 6 4 4H5l4-4-1-6ZM12 13v8'
            : kind === 'refresh'
              ? 'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5'
              : kind === 'list'
                ? 'M7 6h14M7 12h14M7 18h14M2 6h1M2 12h1M2 18h1'
                : 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'
        }
      />
    </svg>
  )
}
function Flag({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label className='pui-choice-label'>
      <Checkbox.Root checked={checked} onCheckedChange={onChange}>
        <Checkbox.Indicator />
      </Checkbox.Root>
      {children}
    </label>
  )
}
export function CommandExample({ id }: { id: string }) {
  const [disabled, setDisabled] = useState(false),
    [vertical, setVertical] = useState(false),
    [rtl, setRtl] = useState(false),
    [cancel, setCancel] = useState(false),
    [pinned, setPinned] = useState(false),
    [timings, setTimings] = useState(true)
  const [source, setSource] = useState<string[]>(['live']),
    [visible, setVisible] = useState<string[]>(['requests', 'errors']),
    [passed, setPassed] = useState(true),
    [density, setDensity] = useState('comfortable')
  const [message, setMessage] = useState('No command executed.')
  const flags = (
    <div className='actions'>
      <Flag checked={disabled} onChange={setDisabled}>
        Disable commands
      </Flag>
      {id !== 'toggle' && (
        <>
          <Flag checked={vertical} onChange={setVertical}>
            Vertical layout
          </Flag>
          <Flag checked={rtl} onChange={setRtl}>
            Right to left
          </Flag>
        </>
      )}
    </div>
  )
  let example: React.ReactNode
  if (id === 'toggle')
    example = (
      <>
        <div className='actions'>
          <Toggle
            disabled={disabled}
            onPressedChange={(pressed, event) => {
              if (cancel) {
                event.cancel()
                return
              }
              setMessage(pressed ? 'Logs pinned.' : 'Logs unpinned.')
            }}
          >
            <Glyph kind='pin' />
            Pin logs
          </Toggle>
          <Toggle
            pressed={timings}
            disabled={disabled}
            onPressedChange={(next, event) => {
              if (cancel) event.cancel()
              else setTimings(next)
            }}
          >
            Show timings
          </Toggle>
          <Toggle disabled>Unavailable mode</Toggle>
        </div>
        <Button variant='outline' onClick={() => setCancel((v) => !v)}>
          {cancel ? 'Allow changes' : 'Cancel changes'}
        </Button>
        <p>Controlled timings: {timings ? 'shown' : 'hidden'}</p>
      </>
    )
  else if (id === 'toggle-group')
    example = (
      <>
        <ToggleGroup
          aria-label='Log source'
          orientation={vertical ? 'vertical' : 'horizontal'}
          value={source}
          disabled={disabled}
          onValueChange={(next, event) => {
            if (cancel) event.cancel()
            else setSource(next)
          }}
        >
          <Toggle value='live'>Live</Toggle>
          <Toggle value='simulation'>Simulation</Toggle>
          <Toggle value='unavailable' disabled>
            Unavailable
          </Toggle>
        </ToggleGroup>
        <ToggleGroup
          aria-label='Visible log details'
          orientation={vertical ? 'vertical' : 'horizontal'}
          value={visible}
          multiple
          disabled={disabled}
          onValueChange={setVisible}
        >
          <Toggle value='requests'>Requests</Toggle>
          <Toggle value='errors'>Errors</Toggle>
          <Toggle value='timings'>Timings</Toggle>
        </ToggleGroup>
        <Button variant='outline' onClick={() => setCancel((v) => !v)}>
          {cancel ? 'Allow source changes' : 'Cancel source changes'}
        </Button>
        <p>
          Source: {source.join(', ') || 'none'} / Visible:{' '}
          {visible.join(', ') || 'none'}
        </p>
      </>
    )
  else if (id === 'toolbar')
    example = (
      <>
        <Toolbar.Root
          aria-label='Run tools'
          orientation={vertical ? 'vertical' : 'horizontal'}
          disabled={disabled}
        >
          <Toolbar.Group>
            <Toolbar.Button onClick={() => setMessage('Run list refreshed.')}>
              <Glyph kind='refresh' />
              Refresh
            </Toolbar.Button>
            <Toolbar.Button
              render={<Toggle pressed={pinned} onPressedChange={setPinned} />}
            >
              <Glyph kind='pin' />
              Pin results
            </Toolbar.Button>
            <Toolbar.Button
              disabled
              onClick={() => setMessage('Unavailable delete executed.')}
            >
              Delete runs
            </Toolbar.Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Input
            aria-label='Filter services'
            placeholder='Search services…'
            onChange={(e) => setMessage(`Tool filter: ${e.target.value}`)}
          />
          <Menu.Root>
            <Toolbar.Button render={<Menu.Trigger />}>
              More actions
            </Toolbar.Button>
            <Menu.Portal>
              <Menu.Content align='start'>
                <Menu.Item onClick={() => setMessage('Log export previewed.')}>
                  Export logs
                </Menu.Item>
                <Menu.Item disabled>Delete environment</Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
          <Toolbar.Link href='#toolbar-help'>Toolbar help</Toolbar.Link>
        </Toolbar.Root>
        <p>Pinned results: {pinned ? 'yes' : 'no'}</p>
        <p id='toolbar-help'>
          Arrow keys move between toolbar controls. The search input keeps its
          native editing keys.
        </p>
      </>
    )
  else
    example = (
      <>
        <Menubar
          key={vertical ? 'vertical' : 'horizontal'}
          aria-label='Deployment commands'
          modal={false}
          orientation={vertical ? 'vertical' : 'horizontal'}
          disabled={disabled}
        >
          <Menu.Root>
            <Menu.Trigger>Run</Menu.Trigger>
            <Menu.Portal>
              <Menu.Content align='start'>
                <Menu.Item
                  onClick={() => setMessage('New deployment preview prepared.')}
                >
                  New preview
                </Menu.Item>
                <Menu.Item onClick={() => setMessage('Log export previewed.')}>
                  Export logs
                </Menu.Item>
                <Menu.Item disabled>Delete runs</Menu.Item>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>More tools</Menu.SubmenuTrigger>
                  <Menu.Portal>
                    <Menu.Content align='start'>
                      <Menu.Item
                        onClick={() =>
                          setMessage('Package validation previewed.')
                        }
                      >
                        Validate package
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger>View</Menu.Trigger>
            <Menu.Portal>
              <Menu.Content align='start'>
                <Menu.CheckboxItem checked={passed} onCheckedChange={setPassed}>
                  <Menu.CheckboxItemIndicator />
                  Show passed checks
                </Menu.CheckboxItem>
                <Menu.Separator />
                <Menu.RadioGroup value={density} onValueChange={setDensity}>
                  <Menu.GroupLabel>Detail level</Menu.GroupLabel>
                  <Menu.RadioItem value='compact'>
                    <Menu.RadioItemIndicator />
                    Compact
                  </Menu.RadioItem>
                  <Menu.RadioItem value='comfortable'>
                    <Menu.RadioItemIndicator />
                    Comfortable
                  </Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger>Help</Menu.Trigger>
            <Menu.Portal>
              <Menu.Content align='start'>
                <Menu.LinkItem href='#command-help'>Command help</Menu.LinkItem>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
        </Menubar>
        <p>
          Passed checks: {passed ? 'visible' : 'hidden'} / Detail: {density}
        </p>
        <p id='command-help'>
          Menus group the application commands. These previews run no remote
          work.
        </p>
      </>
    )
  return (
    <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
      <div className='example-stack' dir={rtl ? 'rtl' : 'ltr'}>
        {flags}
        {example}
        <p role='status'>{message}</p>
      </div>
    </DirectionProvider>
  )
}
