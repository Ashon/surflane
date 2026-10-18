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
    'Complete tasks with Tab, Shift+Tab, arrow keys, Enter, Space, and Escape',
  ],
  [
    'Forms',
    'Field labels, descriptions, error associations, and required state',
    'Preserve values, and state the cause and the fix',
  ],
  [
    'Feedback',
    'status or alert, matched to severity',
    'Announce once, and keep results and recovery actions in the page content',
  ],
  [
    'Perception',
    'Shared color, focus, size, and motion tokens',
    'Check themes, zoom, text spacing, narrow widths, and high contrast',
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
          Using the components doesn't make a screen accessible on its own. Base
          UI and the shared wrappers handle interaction, focus, and styling. The
          product owns the screen name, document structure, data, error meaning,
          permissions, and task-completion messages.
        </p>
        <Table.Container
          label='Accessibility responsibilities'
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>
              What to implement and review in each area
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
          Build new behavior on the{' '}
          <Link href='/components'>keyboard guidance for each component</Link>.
          Don't add positive tabIndex values, clickable divs, unnamed icon
          buttons, or unnecessary ARIA roles.
        </p>
      </section>
      <section id='forms'>
        <h2>Recover without losing input</h2>
        <p>
          Submit an empty name or an invalid format, then check how the
          description and error are associated. Enter a valid name to try
          Simulate name conflict. The example validates locally, sends no server
          requests, and creates no resources.
        </p>
        <Form
          aria-label='Accessible validation preview'
          errors={errors}
          onFormSubmit={(values) =>
            setMessage(
              `Validated: ${String(values.name)}. This local example created no resources.`,
            )
          }
          onReset={() => {
            setName('')
            setErrors({})
            setMessage('Preview reset. Enter a name to try again.')
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
          Mark required fields with the label and the required attribute. Errors
          state the cause and the fix, not just a color change. The name
          conflict associates its error and moves focus to the input only after
          an explicit user action. Successful validation leaves focus where it
          is.
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
          Draw the focus outline with{' '}
          <Link href='/tokens?q=--control-focus'>
            <code>--control-focus</code>
          </Link>
          . Don't replace it with the faint{' '}
          <Link href='/tokens?q=--control-focus-ring'>
            <code>--control-focus-ring</code>
          </Link>{' '}
          background alone. Size interactive areas with{' '}
          <Link href='/tokens?q=--control-height'>
            <code>--control-height</code>
          </Link>{' '}
          and the button size rules. Don't remove the focus indicator or hide it
          behind content.
        </p>
        <p>
          Tab order follows DOM order. Links navigate, buttons run actions, and
          headings define document structure. On a route change, update the
          document title and h1. Same-page table-of-contents links keep the
          browser's native anchor navigation.
        </p>
        <p>
          In modals, check Tab cycling, Escape, the close button, and focus
          restoration. The shared Dialog provides this behavior, so don't add
          your own keyboard trap. When an action removes its trigger, the
          product picks the next meaningful focus target.
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
                  Cycle with Tab and Shift+Tab. Press Escape to close and return
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
            Announce updates that don't move focus, such as completion or search
            results, in a role=status region. Mount it in advance and keep the
            message brief.
          </li>
          <li>
            Use alert only for errors that need immediate attention. Don't
            repeat the same sentence in the field, a toast, and a status region.
          </li>
          <li>
            Keep the failure reason and the retry and fix paths in the page
            content. Don't rely on a toast's timing or motion alone.
          </li>
          <li>
            Use color, icons, and labels together. Name icon-only actions by
            their target and purpose.
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
            Run the task by keyboard alone: start, edit, complete, cancel, and
            recover from failure. Visible focus must match the actual active
            element.
          </li>
          <li>
            Check at a 320 CSS px width and on desktop. Test 200% and 400%
            browser zoom and text spacing changes yourself. Put two-dimensional
            content, such as tables and code, in named, independent scroll
            areas.
          </li>
          <li>
            Check light, dark, system, forced colors, and reduced motion
            settings. Apply the{' '}
            <Link href='/foundations/color'>color contrast</Link> and{' '}
            <Link href='/foundations/motion'>motion guidance</Link> together.
          </li>
          <li>
            Confirm names, order, errors, and states with real assistive
            technologies, such as VoiceOver and NVDA. axe checks and viewport
            resizing don't replace this manual check.
          </li>
          <li>
            Test the tasks users perform from start to finish, such as entering
            data, saving, recovering from errors, reading, and copying code.
          </li>
        </ol>
        <p>
          Don't mark untested items as complete. This guide and the automated
          checks aren't an accessibility certification or a completed full
          manual review.
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
