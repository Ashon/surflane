import React, { useState } from 'react'
import {
  OTPField,
  Field,
  Form,
  Button,
  Checkbox,
  DirectionProvider,
} from '@surflane/ui'
function Flag({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (value: boolean) => void
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
function Slots({
  prefix,
  grouped = false,
}: {
  prefix: string
  grouped?: boolean
}) {
  const input = (index: number) => (
    <OTPField.Input
      key={index}
      aria-label={
        index === 0 ? undefined : `${prefix} character ${index + 1} of 6`
      }
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
    [result, setResult] = useState('No verification submitted.')
  return (
    <div className='example-stack'>
      <div className='actions'>
        <Flag checked={disabled} onChange={setDisabled}>
          Disable codes
        </Flag>
        <Flag checked={readOnly} onChange={setReadOnly}>
          Read only
        </Flag>
        <Flag checked={mask} onChange={setMask}>
          Mask characters
        </Flag>
        <Flag checked={rtl} onChange={setRtl}>
          RTL preview
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
                setErrors({
                  verificationCode:
                    'This example code was rejected. Request a new code.',
                })
                return
              }
              setErrors({})
              setResult(
                `Verification submitted. Recovery code included: ${data.has('recoveryCode') ? 'yes' : 'no'}.`,
              )
            }}
          >
            <Field.Root name='verificationCode' key={generation}>
              <Field.Label>Verification code</Field.Label>
              <Field.Description>
                Enter 6 digits. This local preview sends no code to a server.
              </Field.Description>
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
                <Slots prefix='Verification' grouped />
              </OTPField.Root>
              <Field.Error />
            </Field.Root>
            <div className='actions'>
              <Button type='submit'>Verify preview</Button>
              <Button type='reset' variant='outline'>
                Reset codes
              </Button>
              <Button
                variant='ghost'
                type='button'
                onClick={() =>
                  setErrors({
                    verificationCode: 'Code expired. Request a new code.',
                  })
                }
              >
                Expire code
              </Button>
              <Button
                variant='ghost'
                type='button'
                onClick={() => {
                  setErrors({})
                  setGeneration((n) => n + 1)
                  setResult(
                    'New local code requested. Verification input cleared.',
                  )
                }}
              >
                Request new code
              </Button>
            </div>
          </Form>
          <Field.Root name='recoveryCode'>
            <Field.Label>Recovery code</Field.Label>
            <Field.Description>
              A controlled value of uppercase letters and digits. This field
              belongs to the form above.
            </Field.Description>
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
              <Slots prefix='Recovery' />
            </OTPField.Root>
            <Field.Error />
          </Field.Root>
        </div>
      </DirectionProvider>
      <div className='actions'>
        <Flag checked={cancelChanges} onChange={setCancelChanges}>
          Cancel code changes
        </Flag>
        <Flag checked={cancelReset} onChange={setCancelReset}>
          Cancel reset
        </Flag>
        <Flag checked={autoSubmit} onChange={setAutoSubmit}>
          Submit when complete
        </Flag>
      </div>
      <p role='status'>
        {result} Completion events: {complete}. Rejected input events:{' '}
        {rejected}.
      </p>
    </div>
  )
}
