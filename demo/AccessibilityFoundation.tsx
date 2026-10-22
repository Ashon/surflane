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
import { FoundationPage, FoundationSection } from './FoundationPage'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/AccessibilityFoundation'
export function AccessibilityFoundation() {
  const t = text[useLocale().locale]
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const nameInput = useRef<HTMLInputElement>(null)
  return (
    <FoundationPage
      principles={t.principles}
      sections={t.sections}
      related={[
        '/foundations/interaction',
        '/foundations/color',
        '/foundations/content',
        '/components/dialog',
      ]}
    >
      <FoundationSection id='responsibilities'>
        <p>{t.responsibilitiesIntro}</p>
        <Table.Container bleed label={t.tableLabel} orientation='horizontal'>
          <Table.Root>
            <Table.Caption>{t.caption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.areaHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.buildHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.checkHeader}</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {t.responsibilities.map(([area, build, check]) => (
                <Table.Row key={area}>
                  <Table.HeaderCell scope='row'>{area}</Table.HeaderCell>
                  <Table.Cell>{build}</Table.Cell>
                  <Table.Cell>{check}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
      </FoundationSection>
      <FoundationSection id='keyboard'>
        <p>{t.keyboardOrder}</p>
        <p>
          {t.keyboardTargetStart}
          <Link href='/tokens?q=--control-target-size'>
            <code>--control-target-size</code>
          </Link>
          {t.keyboardTargetEnd}
        </p>
        <p>{t.keyboardDialog}</p>
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
      </FoundationSection>
      <FoundationSection id='recovery'>
        <p>{t.recoveryIntro}</p>
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
        <p>{t.recoveryNotes}</p>
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
      </FoundationSection>
      <FoundationSection id='announcements'>
        <ul>
          {t.announcements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </FoundationSection>
      <FoundationSection id='testing'>
        <ol>
          {t.testing.map((item) => (
            <li key={item}>{item}</li>
          ))}
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
      </FoundationSection>
    </FoundationPage>
  )
}
