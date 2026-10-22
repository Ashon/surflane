import React, { useState } from 'react'
import { OTPField, Field, Form, Button, DirectionProvider } from '@surflane/ui'
import { Flag } from './Flag'
import { useLocale } from './i18n'
import { text } from './i18n/pages/OTPFieldExample'
function Slots({
  prefix,
  grouped = false,
}: {
  prefix: string
  grouped?: boolean
}) {
  const t = text[useLocale().locale]
  const input = (index: number) => (
    <OTPField.Input
      key={index}
      aria-label={index === 0 ? undefined : t.character(prefix, index)}
    />
  )
  return grouped ? (
    <>
      <OTPField.Group>{[0, 1, 2].map(input)}</OTPField.Group>
      <OTPField.Separator />
      <OTPField.Group>{[3, 4, 5].map(input)}</OTPField.Group>
    </>
  ) : (
    <>{[0, 1, 2, 3, 4, 5].map(input)}</>
  )
}
export function OTPFieldExample() {
  const t = text[useLocale().locale]
  const [backup, setBackup] = useState('A7C9XZ'),
    [mask, setMask] = useState(false),
    [disabled, setDisabled] = useState(false),
    [readOnly, setReadOnly] = useState(false),
    [rtl, setRtl] = useState(false),
    [cancelChanges, setCancelChanges] = useState(false),
    [cancelReset, setCancelReset] = useState(false),
    [autoSubmit, setAutoSubmit] = useState(false)
  const [complete, setComplete] = useState(0),
    [rejected, setRejected] = useState(0),
    [generation, setGeneration] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({}),
    [result, setResult] = useState(t.noVerificationSubmitted)
  return (
    <div className='example-stack'>
      <div className='actions'>
        <Flag checked={disabled} onChange={setDisabled}>
          {t.disableCodes}
        </Flag>
        <Flag checked={readOnly} onChange={setReadOnly}>
          {t.readOnly}
        </Flag>
        <Flag checked={mask} onChange={setMask}>
          {t.maskCharacters}
        </Flag>
        <Flag checked={rtl} onChange={setRtl}>
          {t.rtlPreview}
        </Flag>
      </div>
      <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
        <div dir={rtl ? 'rtl' : 'ltr'} className='example-stack'>
          <Form
            id='otp-preview-form'
            errors={errors}
            onReset={(event) => {
              if (cancelReset) event.preventDefault()
            }}
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              if (data.get('verificationCode') === '000000') {
                setErrors({ verificationCode: t.rejectedExampleCode })
                return
              }
              setErrors({})
              setResult(t.verificationSubmitted(data.has('recoveryCode')))
            }}
          >
            <Field.Root name='verificationCode' key={generation}>
              <Field.Label>{t.verificationCode}</Field.Label>
              <Field.Description>{t.verificationDescription}</Field.Description>
              <OTPField.Root
                length={6}
                required
                mask={mask}
                disabled={disabled}
                readOnly={readOnly}
                autoSubmit={autoSubmit}
                onValueChange={(_, event) => {
                  if (cancelChanges) event.cancel()
                }}
                onValueInvalid={() => setRejected((n) => n + 1)}
                onValueComplete={() => setComplete((n) => n + 1)}
              >
                <Slots prefix={t.verification} grouped />
              </OTPField.Root>
              <Field.Error />
            </Field.Root>
            <div className='actions'>
              <Button type='submit'>{t.verifyPreview}</Button>
              <Button type='reset' variant='outline'>
                {t.resetCodes}
              </Button>
              <Button
                variant='ghost'
                type='button'
                onClick={() => setErrors({ verificationCode: t.codeExpired })}
              >
                {t.expireCode}
              </Button>
              <Button
                variant='ghost'
                type='button'
                onClick={() => {
                  setErrors({})
                  setGeneration((n) => n + 1)
                  setResult(t.newLocalCodeRequested)
                }}
              >
                {t.requestNewCode}
              </Button>
            </div>
          </Form>
          <Field.Root name='recoveryCode'>
            <Field.Label>{t.recoveryCode}</Field.Label>
            <Field.Description>{t.recoveryDescription}</Field.Description>
            <OTPField.Root
              length={6}
              form='otp-preview-form'
              validationType='alphanumeric'
              normalizeValue={(value) => value.toUpperCase()}
              value={backup}
              onValueChange={(next, event) => {
                if (cancelChanges) event.cancel()
                else setBackup(next)
              }}
              disabled={disabled}
              readOnly={readOnly}
              mask={mask}
            >
              <Slots prefix={t.recovery} />
            </OTPField.Root>
            <Field.Error />
          </Field.Root>
        </div>
      </DirectionProvider>
      <div className='actions'>
        <Flag checked={cancelChanges} onChange={setCancelChanges}>
          {t.cancelCodeChanges}
        </Flag>
        <Flag checked={cancelReset} onChange={setCancelReset}>
          {t.cancelReset}
        </Flag>
        <Flag checked={autoSubmit} onChange={setAutoSubmit}>
          {t.submitWhenComplete}
        </Flag>
      </div>
      <p role='status'>{t.status(result, complete, rejected)}</p>
    </div>
  )
}
