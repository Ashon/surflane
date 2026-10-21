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
import { useLocale } from './i18n'
import { text } from './i18n/pages/AccessibilityFoundation'
export function AccessibilityFoundation() {
  const t = text[useLocale().locale]
  const responsibilities = t.responsibilities
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const nameInput = useRef<HTMLInputElement>(null)
  return (
    <>
      <nav className='page-toc' aria-label={t.onThisPage}>
        {t.nav.map(({ id, label }) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <section id='principles'>
        <h2>{t.principlesTitle}</h2>
        <p>{t.principlesIntro}</p>
        <Table.Container label={t.tableLabel} orientation='horizontal'>
          <Table.Root>
            <Table.Caption>{t.caption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.areaHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>
                  {t.implementationHeader}
                </Table.HeaderCell>
                <Table.HeaderCell scope='col'>
                  {t.reviewHeader}
                </Table.HeaderCell>
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
          {t.buildOnStart}
          <Link href='/components'>{t.keyboardGuidanceLink}</Link>
          {t.buildOnEnd}
        </p>
      </section>
      <section id='forms'>
        <h2>{t.formsTitle}</h2>
        <p>{t.formsIntro}</p>
        <Form
          aria-label={t.formAriaLabel}
          errors={errors}
          onFormSubmit={(values) =>
            setMessage(t.validatedMessage(String(values.name)))
          }
          onReset={() => {
            setName('')
            setErrors({})
            setMessage(t.previewResetMessage)
          }}
        >
          <Field.Root name='name'>
            <Field.Label>{t.nameLabel}</Field.Label>
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
            <Field.Description>{t.nameDescription}</Field.Description>
            <Field.Error match='valueMissing'>
              {t.valueMissingError}
            </Field.Error>
            <Field.Error match='patternMismatch'>
              {t.patternMismatchError}
            </Field.Error>
            {errors.name && <Field.Error>{errors.name}</Field.Error>}
          </Field.Root>
          <Inline gap={3}>
            <Button type='submit'>{t.validatePreview}</Button>
            <Button type='reset' variant='outline'>
              {t.resetPreview}
            </Button>
            <Button
              type='button'
              variant='outline'
              disabled={!/^[a-z0-9-]+$/.test(name)}
              onClick={() => {
                flushSync(() => {
                  setErrors({
                    name: t.nameConflictError,
                  })
                  setMessage('')
                })
                nameInput.current?.focus()
              }}
            >
              {t.simulateNameConflict}
            </Button>
          </Inline>
        </Form>
        <p role='status' aria-atomic='true' data-validation-result>
          {message}
        </p>
        <p>{t.formsNotes}</p>
        <CodeBlock
          language='tsx'
          label={t.codeLabel}
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
        <h2>{t.keyboardTitle}</h2>
        <p>
          {t.keyboardIntroStart}
          <Link href='/tokens?q=--control-focus'>
            <code>--control-focus</code>
          </Link>
          {t.keyboardIntroMid}
          <Link href='/tokens?q=--control-focus-ring'>
            <code>--control-focus-ring</code>
          </Link>
          {t.keyboardIntroAfterRing}
          <Link href='/tokens?q=--control-height'>
            <code>--control-height</code>
          </Link>
          {t.keyboardIntroEnd}
        </p>
        <p>{t.keyboardDomOrder}</p>
        <p>{t.keyboardModals}</p>
        <div className='actions'>
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant='outline' />}>
              {t.openFocusPreview}
            </Dialog.Trigger>
            <Dialog.Content closeLabel={t.closeFocusPreview}>
              <Dialog.Header>
                <Dialog.Title>{t.focusPreviewTitle}</Dialog.Title>
                <Dialog.Description>
                  {t.focusPreviewDescription}
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <label>
                  {t.localNote}
                  <Input defaultValue={t.keyboardInputValue} />
                </label>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button variant='outline' />}>
                  {t.done}
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
        <h2>{t.feedbackTitle}</h2>
        <ul>
          <li>{t.feedbackItem1}</li>
          <li>{t.feedbackItem2}</li>
          <li>{t.feedbackItem3}</li>
          <li>{t.feedbackItem4}</li>
        </ul>
        <p>
          <Link href='/components/inline-message'>{t.inlineMessageLink}</Link>
          {' / '}
          <Link href='/components/toast'>{t.toastLink}</Link>
          {' / '}
          <Link href='/foundations/iconography'>{t.iconNamesLink}</Link>
        </p>
      </section>
      <section id='testing'>
        <h2>{t.testingTitle}</h2>
        <ol>
          <li>{t.testingItem1}</li>
          <li>{t.testingItem2}</li>
          <li>
            {t.testingItem3Start}
            <Link href='/foundations/color'>{t.colorContrastLink}</Link>
            {t.testingItem3Mid}
            <Link href='/foundations/motion'>{t.motionGuidanceLink}</Link>
            {t.testingItem3End}
          </li>
          <li>{t.testingItem4}</li>
          <li>{t.testingItem5}</li>
        </ol>
        <p>{t.testingClosing}</p>
        <p>
          <a href='https://www.w3.org/WAI/tutorials/forms/notifications/'>
            {t.waiFormNotifications}
          </a>
          {' / '}
          <a href='https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html'>
            {t.wcagFocusOrder}
          </a>
          {' / '}
          <a href='https://www.w3.org/WAI/WCAG22/Techniques/general/G202'>
            {t.w3cKeyboardControl}
          </a>
        </p>
      </section>
    </>
  )
}
