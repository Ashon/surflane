import React, { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import {
  Button,
  CodeBlock,
  Dialog,
  Field,
  Form,
  Input,
  Inline,
  Table,
} from '@surflane/ui'
import { Link } from './router'
const responsibilities = [
  [
    'Structure',
    'main, nav, headings, and a meaningful DOM order',
    'After a route change, check the h1, document title, and Skip to content',
  ],
  [
    'Keyboard',
    'Buttons, links, and forms keep their native semantics',
    'Operate with Tab, Shift+Tab, arrow keys, Enter, Space, and Escape',
  ],
  [
    'Forms',
    'Field labels, descriptions, error associations, and required state',
    'Preserve values and explain the cause and how to fix it',
  ],
  [
    'Feedback',
    'status or alert, matched to severity',
    'Avoid duplicate announcements; keep results and recovery actions in the page content',
  ],
  [
    'Perception',
    'Shared color, focus, size, and motion tokens',
    'Check across themes, zoom, text spacing, narrow widths, and high contrast',
  ],
]
export function AccessibilityFoundation() {
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const nameInput = useRef<HTMLInputElement>(null)
  return (
    <>
      <nav className='page-toc' aria-label='On this page'>
        {['principles', 'forms', 'keyboard', 'feedback', 'testing'].map(
          (id) => (
            <a key={id} href={`#${id}`}>
              {id[0].toUpperCase() + id.slice(1)}
            </a>
          ),
        )}
      </nav>
      <section id='principles'>
        <h2>Shared behavior, product responsibility</h2>
        <p>
          Base UI and the shared wrappers provide the foundation for
          interaction, focus, and styling. The screen name, document structure,
          data, error meaning, permissions, and task-completion messages are the
          product's responsibility. Using the components does not by itself make
          the whole screen accessible.
        </p>
        <Table.Container
          label='Accessibility responsibilities'
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>
              Connecting design, implementation, and review
            </Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>Area</Table.HeaderCell>
                <Table.HeaderCell scope='col'>Implementation</Table.HeaderCell>
                <Table.HeaderCell scope='col'>Review</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {responsibilities.map(([area, implementation, review]) => (
                <Table.Row key={area}>
                  <Table.HeaderCell scope='row'>{area}</Table.HeaderCell>
                  <Table.Cell>{implementation}</Table.Cell>
                  <Table.Cell>{review}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>
          New behavior follows the{' '}
          <Link href='/components'>keyboard guidance for each component</Link>.
          Don't add positive tabIndex values, clickable divs, unnamed icon
          buttons, or unnecessary ARIA roles.
        </p>
      </section>
      <section id='forms'>
        <h2>Recover without losing input</h2>
        <p>
          The example below validates locally. Submit an empty name or an
          invalid format, then check how the description and error are
          associated. After you enter a valid name, you can also reproduce a
          name conflict explicitly. No server requests are made and no resources
          are created.
        </p>
        <Form
          aria-label='Accessible validation preview'
          errors={errors}
          onFormSubmit={(values) =>
            setMessage(
              `Validated: ${String(values.name)}. This is a local example; no resources were created.`,
            )
          }
          onReset={() => {
            setName('')
            setErrors({})
            setMessage('Preview reset. You can enter a name again.')
          }}
        >
          <Field.Root name='name'>
            <Field.Label>Preview name (required)</Field.Label>
            <Field.Control
              id='a11y-preview-name'
              ref={nameInput}
              required
              pattern={'[a-z0-9\\-]+'}
              defaultValue=''
              onChange={(event) => {
                setName(event.target.value)
                setErrors({})
                setMessage('')
              }}
              placeholder='demo-e2e-01'
            />
            <Field.Description>
              Use lowercase letters, numbers, and hyphens. Example: demo-e2e-01.
            </Field.Description>
            <Field.Error match='valueMissing'>Enter a name.</Field.Error>
            <Field.Error match='patternMismatch'>
              Use only lowercase letters, numbers, and hyphens.
            </Field.Error>
            {errors.name && <Field.Error>{errors.name}</Field.Error>}
          </Field.Root>
          <Inline gap={3}>
            <Button type='submit'>Validate preview</Button>
            <Button type='reset' variant='outline'>
              Reset preview
            </Button>
            <Button
              type='button'
              variant='outline'
              disabled={!/^[a-z0-9-]+$/.test(name)}
              onClick={() => {
                flushSync(() => {
                  setErrors({
                    name: 'This name is already in use. Enter a different name.',
                  })
                  setMessage('')
                })
                nameInput.current?.focus()
              }}
            >
              Simulate name conflict
            </Button>
          </Inline>
        </Form>
        <p role='status' aria-atomic='true' data-validation-result>
          {message}
        </p>
        <p>
          The label and the required attribute convey that a field is required.
          Errors show the cause and how to fix it instead of only changing
          color. The name conflict example associates the error and moves focus
          to the input only after an explicit user action. Successful validation
          does not force focus to move.
        </p>
        <CodeBlock
          language='tsx'
          label='Accessible field composition'
          code={`<Field.Root name='name'>
  <Field.Label>Environment name (required)</Field.Label>
  <Field.Control required />
  <Field.Description>Use a unique environment name.</Field.Description>
  <Field.Error />
</Field.Root>

// Keep this live region mounted before updating its text.
<p role='status' aria-atomic='true'>
  {result}
</p>`}
        />
      </section>
      <section id='keyboard'>
        <h2>Follow a predictable focus path</h2>
        <p>
          Draw the actual focus outline with{' '}
          <Link href='/tokens?q=--control-focus'>
            <code>--control-focus</code>
          </Link>
          , and don't replace it with only the faint background of{' '}
          <Link href='/tokens?q=--control-focus-ring'>
            <code>--control-focus-ring</code>
          </Link>
          . Interactive areas use{' '}
          <Link href='/tokens?q=--control-height'>
            <code>--control-height</code>
          </Link>{' '}
          and the button size rules. Don't remove the focus indicator or hide it
          behind content.
        </p>
        <p>
          Tab order follows DOM order. Links navigate, buttons perform actions,
          and headings define document structure. When the route changes, update
          the document title and h1; table-of-contents links within the same
          page keep the browser's native anchor navigation.
        </p>
        <p>
          In modals, check Tab cycling, Escape, the close button, and focus
          restoration. The shared Dialog provides this behavior, so don't add a
          separate keyboard trap. When an action removes its trigger, the
          product decides the next meaningful focus target.
        </p>
        <div className='actions'>
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant='outline' />}>
              Open focus preview
            </Dialog.Trigger>
            <Dialog.Content closeLabel='Close focus preview'>
              <Dialog.Header>
                <Dialog.Title>Keyboard focus preview</Dialog.Title>
                <Dialog.Description>
                  Cycle with Tab and Shift+Tab; press Escape to close and return
                  to the trigger.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <label>
                  Local note
                  <Input defaultValue='Navigate with the keyboard' />
                </label>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button variant='outline' />}>
                  Done
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </div>
        <p>
          <Link href='/components/dialog'>Dialog API</Link>
          {' / '}
          <Link href='/components/select'>Select keyboard behavior</Link>
          {' / '}
          <Link href='/components/scroll-area'>Independent scroll areas</Link>
        </p>
      </section>
      <section id='feedback'>
        <h2>Announce once, preserve the result</h2>
        <ul>
          <li>
            Announce updates that don't need a focus change, such as completion
            or search results, briefly in a role=status region mounted in
            advance.
          </li>
          <li>
            Use alert only for errors that need immediate attention. Don't
            repeat the same sentence in the field, a toast, and a status region.
          </li>
          <li>
            Keep the failure reason and the retry and fix paths in the page
            content. Don't rely only on a toast's timing or motion.
          </li>
          <li>
            Use color, icons, and labels together, and give icon-only actions a
            name that describes their target and purpose.
          </li>
        </ul>
        <p>
          <Link href='/components/inline-message'>Inline message</Link>
          {' / '}
          <Link href='/components/toast'>Toast</Link>
          {' / '}
          <Link href='/foundations/iconography'>Icon names</Link>
        </p>
      </section>
      <section id='testing'>
        <h2>Test the complete task</h2>
        <ol>
          <li>
            Using only the keyboard, run the task through start, edit,
            completion, cancellation, and failure recovery. The visible focus
            must match the actual active element.
          </li>
          <li>
            Check at a 320 CSS px width and on desktop, and test 200% and 400%
            browser zoom and text spacing changes yourself. Present areas that
            need two-dimensional content, such as tables and code, as named,
            independent scroll areas.
          </li>
          <li>
            Check light, dark, system, forced colors, and reduced motion
            settings. Apply the{' '}
            <Link href='/foundations/color'>color contrast</Link> and{' '}
            <Link href='/foundations/motion'>motion guidance</Link> together.
          </li>
          <li>
            Confirm with real assistive technologies such as VoiceOver and NVDA
            that names, order, errors, and states make sense. axe checks and
            viewport resizing do not replace this manual check.
          </li>
          <li>
            Test the tasks users perform, such as entering data, saving,
            recovering from errors, reading, and copying code, from start to
            finish.
          </li>
        </ol>
        <p>
          This guide and the automated checks do not constitute accessibility
          certification or a completed full manual review. Don't mark untested
          items as complete.
        </p>
        <p>
          <a href='https://www.w3.org/WAI/tutorials/forms/notifications/'>
            WAI — Form notifications
          </a>
          {' / '}
          <a href='https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html'>
            WCAG — Focus order
          </a>
          {' / '}
          <a href='https://www.w3.org/WAI/WCAG22/Techniques/general/G202'>
            W3C — Keyboard control
          </a>
        </p>
      </section>
    </>
  )
}
