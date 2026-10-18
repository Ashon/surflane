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

const roles = [
  ['--chrome', 'Outer app surface, sidebar'],
  ['--canvas', 'Content sheet, dialogs'],
  ['--surface', 'Secondary surface within content'],
  ['--menu-background', 'Opaque surface for menus, select lists, and toasts'],
  ['--shadow-sheet', 'Subtle separation for the content sheet'],
  ['--shadow-float', 'Depth for transient popups and notifications'],
  ['--layer-backdrop', 'Blocking backdrop behind a Dialog'],
  ['--layer-dialog', 'Positioner for Dialog and Sheet/Drawer'],
  ['--layer-popup', 'Menus, select lists, popovers, toasts'],
  ['--layer-tooltip', 'Positioner for explanatory tooltips'],
]
function StackingLab() {
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [portal, setPortal] = useState(false)
  const [clip, setClip] = useState(true)
  const plane = (
    <div
      className='layer-demo-plane'
      data-layer-plane
      data-portalled={portal || undefined}
    >
      Overlay / z-index: 9999
    </div>
  )
  return (
    <>
      <div className='actions layer-demo-controls'>
        <Toggle pressed={portal} onPressedChange={setPortal}>
          Portal to demonstration stage
        </Toggle>
        <label className='pui-choice-label'>
          <Checkbox.Root checked={clip} onCheckedChange={setClip}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          Clip local host
        </label>
      </div>
      <div
        ref={setStage}
        className='layer-demo-stage'
        role='img'
        aria-label={
          portal
            ? 'Portalled overlay appears above the sibling plane and outside local clipping.'
            : 'Local overlay stays below the sibling plane despite its larger z-index.'
        }
      >
        <div
          className='layer-demo-host'
          data-clipped={clip || undefined}
          aria-hidden='true'
        >
          Parent context / z-index: 1{!portal && plane}
        </div>
        <div className='layer-demo-cover' aria-hidden='true'>
          Sibling context / z-index: 2
        </div>
        {portal &&
          stage &&
          createPortal(<div aria-hidden='true'>{plane}</div>, stage)}
      </div>
      <p role='status' aria-label='Stacking demonstration result'>
        {portal
          ? 'Portal: the overlay is a sibling of the two contexts and appears in front.'
          : "Local: the child stays in its parent's context; 9999 cannot outrank a sibling context at 2."}
      </p>
      <p>
        The two controls are independent. A stacking context sets the
        front-to-back order among siblings; overflow clips painting outside a
        box. Setting the parent's overflow to visible does not change the
        siblings' z-index order. This example limits the portal target to the
        demo stage. Real product popups use the shared Portal, as in the Base UI
        example below. The values 1, 2, and 9999 illustrate the principle; they
        are not product layer values.
      </p>
    </>
  )
}
function OverlayLab() {
  const [region, setRegion] = useState('staging')
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant='outline' />}>
        Open layered dialog
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Layered workspace preview</Dialog.Title>
        <Dialog.Description>
          Local example. The menu keeps this task's selection state even when it
          is portalled outside the sheet.
        </Dialog.Description>
        <Field.Root>
          <Field.Label>Preview environment</Field.Label>
          <NativeSelect
            value={region}
            onChange={(event) => setRegion(event.target.value)}
          >
            <option value='staging'>Staging preview</option>
            <option value='production'>Production preview</option>
          </NativeSelect>
        </Field.Root>
        <p>
          Selected environment: <strong data-layer-region>{region}</strong>
        </p>
        <div className='actions'>
          <Popover.Root>
            <Popover.Trigger render={<Button variant='outline' />}>
              Inspect overlay details
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                side='bottom'
                align='start'
                aria-label='Overlay details'
              >
                <h3>Overlay details</h3>
                <p>A real portal that uses the shared Popover.</p>
                <p>
                  Current selection: <strong>{region}</strong>
                </p>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <TooltipProvider>
            <Tooltip label='Tooltip uses the explanation layer above popup surfaces.'>
              <Button variant='outline'>Explain this layer</Button>
            </Tooltip>
          </TooltipProvider>
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant='outline' />}>
              Open nested dialog
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Nested inspection</Dialog.Title>
              <Dialog.Description>
                Escape closes only this dialog and returns focus to its trigger
                in the parent.
              </Dialog.Description>
              <Dialog.Close render={<Button variant='outline' />}>
                Close nested inspection
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Root>
        </div>
        <Dialog.Close render={<Button variant='outline' />}>
          Close layered preview
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  )
}
export function LayersFoundation() {
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    const update = () => {
      const css = getComputedStyle(document.documentElement)
      setValues(
        Object.fromEntries(
          roles.map(([name]) => [name, css.getPropertyValue(name).trim()]),
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
      <nav className='page-toc' aria-label='On this page'>
        {['surfaces', 'contexts', 'overlays', 'diagnostics', 'application'].map(
          (id) => (
            <a key={id} href={`#${id}`}>
              {id[0].toUpperCase() + id.slice(1)}
            </a>
          ),
        )}
      </nav>
      <section id='surfaces'>
        <h2>Surface and elevation roles</h2>
        <p>
          Surfaces group information; layers describe front-to-back
          relationships. Within the content sheet, separate content with
          spacing, headings, and secondary surfaces, and reserve shadows for UI
          that temporarily overlaps, such as floating menus and notifications.
          Don't wrap every section in nested cards or add a border for every
          state.
        </p>
        <div className='layer-shadow-comparison'>
          <div className='layer-shadow-sheet'>
            <strong>Content sheet</strong>
            <p>Surface for sustained reading and work</p>
          </div>
          <div className='layer-shadow-float'>
            <strong>Floating surface</strong>
            <p>Surface that temporarily overlaps the current context</p>
          </div>
        </div>
        <Table.Container
          label='Surface and layer tokens'
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>
              Surface, shadow, and layer tokens resolved for the current theme
            </Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>Token</Table.HeaderCell>
                <Table.HeaderCell scope='col'>Role</Table.HeaderCell>
                <Table.HeaderCell scope='col'>Resolved value</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {roles.map(([name, role]) => (
                <Table.Row key={name}>
                  <Table.HeaderCell scope='row'>
                    <Link href={`/tokens?q=${encodeURIComponent(name)}`}>
                      <code>{name}</code>
                    </Link>
                  </Table.HeaderCell>
                  <Table.Cell>{role}</Table.Cell>
                  <Table.Cell data-layer-token={name}>
                    <code>{values[name] ?? 'Reading…'}</code>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>
          These values order roles within a single stacking context.
          Sheet/Drawer uses 0 for the backdrop and 1 for the content inside one
          isolated positioner. Toasts and menus share the popup role; when the
          numbers are equal, also check DOM order and ancestor contexts.
          Tooltips only explain; they never replace required actions or error
          messages.
        </p>
      </section>
      <section id='contexts'>
        <h2>Stacking contexts and clipping</h2>
        <p>
          Raising a child's z-index alone cannot escape its parent's stacking
          context. Properties such as transform, opacity, and isolation, and
          some contain values, can create a new context. The comparison below
          uses real CSS and a React portal. Labels hidden inside the figure are
          also provided in the result sentence below it.
        </p>
        <StackingLab />
      </section>
      <section id='overlays'>
        <h2>Nested overlay contract</h2>
        <p>
          A layer number alone doesn't make a modal. Base UI manages initial
          focus, the Tab range, blocking background interaction, Escape order,
          and restoring focus to the trigger. Keep selection state and task data
          in the calling screen. Try the select list, popover, tooltip, and
          nested dialog below.
        </p>
        <OverlayLab />
        <CodeBlock
          language='tsx'
          label='Portalled selection inside a dialog'
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
        <h2>Diagnose before raising z-index</h2>
        <ol>
          <li>
            In the DOM, check the actual portal target and the ancestor contexts
            of the hidden element. The React tree and the DOM position can
            differ.
          </li>
          <li>
            Distinguish clipping by overflow, mask, or clip-path from z-index
            ordering. Also check that there is room for shadows and focus rings.
          </li>
          <li>
            Confirm that the layer token is applied to the correct positioner.
            Don't just add a larger value to the child popup.
          </li>
          <li>
            Also check that the overlay is reachable by pointer and keyboard,
            that Escape closes from the innermost layer out, and that focus
            returns to where it was.
          </li>
          <li>
            Don't let a notification above a dialog be the only error message.
            Keep important status and recovery paths in the current work area
            too.
          </li>
        </ol>
        <p>
          The browser's top layer is ordered separately from regular z-index.
          This system's Dialog is a Base UI portal; don't assume it is
          equivalent to native showModal(). When using it with third-party SDKs,
          fullscreen, or native popover, check the actual DOM and portal target.
        </p>
      </section>
      <section id='application'>
        <h2>Layer composition rules</h2>
        <ul>
          <li>
            Don't let a scroll area's overflow clip menus, notifications, or
            shadows. Show progress in the current work area as well.
          </li>
          <li>
            Keep the sidebar and main content on base surfaces, and use the
            shared portal and layer tokens for detail panels and menus.
          </li>
          <li>
            Keep code and table scroll areas separate from popups. Don't add a
            transform to the whole content area; it changes the coordinate
            reference for floating UI.
          </li>
        </ul>
        <p>
          Themes apply the shared typography scope on body and the root tokens
          to portals as well. In forced colors mode, don't rely on shadows alone
          to separate areas.
        </p>
        <p>
          References:{' '}
          <a href='https://www.w3.org/TR/CSS22/zindex.html'>
            W3C stacking order
          </a>{' '}
          ,{' '}
          <a href='https://react.dev/reference/react-dom/createPortal'>
            React createPortal
          </a>{' '}
          ,{' '}
          <a href='https://www.w3.org/TR/css-position-4/#top-layer'>
            W3C positioned layout / top layer
          </a>{' '}
          ,{' '}
          <a href='https://base-ui.com/react/components/dialog'>
            Base UI Dialog
          </a>
        </p>
      </section>
    </>
  )
}
