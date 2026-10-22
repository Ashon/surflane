import React, { useState } from 'react'
import {
  Combobox,
  NumberField,
  Field,
  Form,
  Button,
  Checkbox,
  ChoiceLabel,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/AdvancedFormExamples'
export { advancedFormExampleIds } from './exampleGroups'
const regions = [
  'Staging web',
  'Staging API',
  'Production edge',
  'Reserved environment',
  // Korean sample: exercises Hangul filtering and IME composition.
  '서울 스테이징 환경',
]
function Flags({
  disabled,
  readOnly,
  setDisabled,
  setReadOnly,
}: {
  disabled: boolean
  readOnly: boolean
  setDisabled: (v: boolean) => void
  setReadOnly: (v: boolean) => void
}) {
  const t = text[useLocale().locale]
  return (
    <div className='actions'>
      <ChoiceLabel
        control={
          <Checkbox.Root checked={disabled} onCheckedChange={setDisabled}>
            <Checkbox.Indicator />
          </Checkbox.Root>
        }
      >
        {t.disableControls}
      </ChoiceLabel>
      <ChoiceLabel
        control={
          <Checkbox.Root checked={readOnly} onCheckedChange={setReadOnly}>
            <Checkbox.Indicator />
          </Checkbox.Root>
        }
      >
        {t.readOnly}
      </ChoiceLabel>
    </div>
  )
}
export function AdvancedFormExample({ id }: { id: string }) {
  const t = text[useLocale().locale]
  const roles = [
    { value: 'reader', label: t.roleReader },
    { value: 'operator', label: t.roleOperator },
    { value: 'auditor', label: t.roleAuditor },
  ]
  const [result, setResult] = useState(t.noFormSubmitted),
    [disabled, setDisabled] = useState(false),
    [readOnly, setReadOnly] = useState(false),
    [cancelReset, setCancelReset] = useState(false),
    [cancelChanges, setCancelChanges] = useState(false)
  const [controlled, setControlled] = useState(3)
  const [controlledRegion, setControlledRegion] = useState<string | null>(
    'Staging API',
  )
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const values = Object.fromEntries(
      [...new Set(data.keys())].map((name) => [
        name,
        name === 'roles' ? data.getAll(name) : data.get(name),
      ]),
    )
    setResult(JSON.stringify(values))
  }
  if (id === 'combobox')
    return (
      <div className='example-stack'>
        <Flags {...{ disabled, readOnly, setDisabled, setReadOnly }} />
        <Form
          id='advanced-selection-form'
          onSubmit={submit}
          onReset={(e) => {
            if (cancelReset) e.preventDefault()
          }}
        >
          <Field.Root name='environment'>
            <Field.Label>{t.targetEnvironment}</Field.Label>
            <Field.Description>{t.chooseOneEnvironment}</Field.Description>
            <Combobox.Root
              items={regions}
              name='environment'
              defaultValue='Staging web'
              disabled={disabled}
              readOnly={readOnly}
              required
              onValueChange={(_, event) => {
                if (cancelChanges) event.cancel()
              }}
            >
              <Combobox.InputGroup>
                <Combobox.Input placeholder={t.searchEnvironments} />
                <Combobox.Clear />
                <Combobox.Trigger />
              </Combobox.InputGroup>
              <Combobox.Content>
                <Combobox.Empty>{t.noMatchingEnvironments}</Combobox.Empty>
                <Combobox.List>
                  {(region: string) => (
                    <Combobox.Item
                      key={region}
                      value={region}
                      disabled={region === 'Reserved environment'}
                    >
                      <Combobox.ItemIndicator />
                      {region}
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Content>
            </Combobox.Root>
            <Field.Error />
          </Field.Root>
          <Field.Root name='roles'>
            <Field.Label>{t.testUserRoles}</Field.Label>
            <Field.Description>{t.chooseOneOrMoreRoles}</Field.Description>
            <Combobox.Root
              items={roles}
              name='roles'
              multiple
              defaultValue={[roles[0]]}
              disabled={disabled}
              readOnly={readOnly}
            >
              <Combobox.InputGroup>
                <Combobox.Chips>
                  <Combobox.Value>
                    {(selected: typeof roles) =>
                      selected.map((role) => (
                        <Combobox.Chip key={role.value}>
                          {role.label}
                          <Combobox.ChipRemove
                            aria-label={t.removeRole(role.label)}
                          />
                        </Combobox.Chip>
                      ))
                    }
                  </Combobox.Value>
                  <Combobox.Input placeholder={t.searchRoles} />
                </Combobox.Chips>
                <Combobox.Trigger aria-label={t.showRoles} />
              </Combobox.InputGroup>
              <Combobox.Content>
                <Combobox.Empty>{t.noMatchingRoles}</Combobox.Empty>
                <Combobox.List>
                  {(role: (typeof roles)[number]) => (
                    <Combobox.Item key={role.value} value={role}>
                      <Combobox.ItemIndicator />
                      {role.label}
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Content>
            </Combobox.Root>
            <Field.Error />
          </Field.Root>
          <div className='actions'>
            <Button type='submit'>{t.submitSelection}</Button>
            <Button type='reset' variant='outline'>
              {t.resetSelection}
            </Button>
          </div>
        </Form>
        <Field.Root name='controlledEnvironment'>
          <Field.Label>{t.controlledEnvironment}</Field.Label>
          <Field.Description>
            {t.controlledEnvironmentDescription}
          </Field.Description>
          <Combobox.Root
            items={regions}
            form='advanced-selection-form'
            name='controlledEnvironment'
            value={controlledRegion}
            onValueChange={setControlledRegion}
            disabled={disabled}
            readOnly={readOnly}
          >
            <Combobox.InputGroup>
              <Combobox.Input placeholder={t.searchLinkedEnvironments} />
              <Combobox.Trigger aria-label={t.showLinkedEnvironments} />
            </Combobox.InputGroup>
            <Combobox.Content>
              <Combobox.Empty>{t.noMatchingLinkedEnvironments}</Combobox.Empty>
              <Combobox.List>
                {(region: string) => (
                  <Combobox.Item
                    key={region}
                    value={region}
                    disabled={region === 'Reserved environment'}
                  >
                    <Combobox.ItemIndicator />
                    {region}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Content>
          </Combobox.Root>
        </Field.Root>
        <div className='actions'>
          <Button variant='outline' onClick={() => setCancelReset((v) => !v)}>
            {cancelReset ? t.allowReset : t.cancelReset}
          </Button>
          <Button variant='outline' onClick={() => setCancelChanges((v) => !v)}>
            {cancelChanges ? t.allowSelectionChanges : t.cancelSelectionChanges}
          </Button>
        </div>
        <p role='status'>{result}</p>
      </div>
    )
  return (
    <div className='example-stack'>
      <Flags {...{ disabled, readOnly, setDisabled, setReadOnly }} />
      <Form
        onSubmit={submit}
        onReset={(e) => {
          if (cancelReset) e.preventDefault()
        }}
      >
        <Field.Root name='attempts'>
          <Field.Label>{t.retryAttempts}</Field.Label>
          <Field.Description>{t.chooseAttempts}</Field.Description>
          <NumberField.Root
            name='attempts'
            defaultValue={2}
            min={1}
            max={8}
            step={1}
            required
            disabled={disabled}
            readOnly={readOnly}
            onValueChange={(_, event) => {
              if (cancelChanges) event.cancel()
            }}
          >
            <NumberField.Group>
              <NumberField.Decrement aria-label={t.decreaseAttempts} />
              <NumberField.Input placeholder={t.attemptsPlaceholder} />
              <NumberField.Increment aria-label={t.increaseAttempts} />
            </NumberField.Group>
          </NumberField.Root>
          <Field.Error />
        </Field.Root>
        <Field.Root name='budget'>
          <Field.Label>{t.budgetPreview}</Field.Label>
          <Field.Description>{t.budgetDescription}</Field.Description>
          <NumberField.Root
            name='budget'
            defaultValue={1250.5}
            min={0}
            step={0.5}
            locale='en-US'
            format={{ style: 'currency', currency: 'USD' }}
            disabled={disabled}
            readOnly={readOnly}
          >
            <NumberField.Group>
              <NumberField.Decrement aria-label={t.decreaseBudget} />
              <NumberField.Input />
              <NumberField.Increment aria-label={t.increaseBudget} />
            </NumberField.Group>
          </NumberField.Root>
          <Field.Error />
        </Field.Root>
        <Field.Root name='controlled'>
          <Field.Label>{t.controlledConcurrency}</Field.Label>
          <Field.Description>{t.concurrencyDescription}</Field.Description>
          <NumberField.Root
            name='controlled'
            value={controlled}
            onValueChange={(v) => setControlled(v ?? 0)}
            min={0}
            max={10}
            disabled={disabled}
            readOnly={readOnly}
          >
            <NumberField.Group>
              <NumberField.Decrement aria-label={t.decreaseConcurrency} />
              <NumberField.Input />
              <NumberField.Increment aria-label={t.increaseConcurrency} />
            </NumberField.Group>
          </NumberField.Root>
          <Field.Error />
        </Field.Root>
        <div className='actions'>
          <Button type='submit'>{t.submitNumbers}</Button>
          <Button type='reset' variant='outline'>
            {t.resetNumbers}
          </Button>
        </div>
      </Form>
      <div className='actions'>
        <Button variant='outline' onClick={() => setCancelReset((v) => !v)}>
          {cancelReset ? t.allowReset : t.cancelReset}
        </Button>
        <Button variant='outline' onClick={() => setCancelChanges((v) => !v)}>
          {cancelChanges ? t.allowNumberChanges : t.cancelNumberChanges}
        </Button>
      </div>
      <p role='status'>{result}</p>
    </div>
  )
}
