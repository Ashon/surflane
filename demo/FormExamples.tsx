import React, { useState } from 'react'
import { FormContractExample } from './FormContractExample'
import {
  Button,
  Select,
  Field,
  Fieldset,
  Form,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/FormExamples'
export { formExampleIds } from './exampleGroups'
export function FormExample({ id }: { id: string }) {
  const t = text[useLocale().locale]
  const [result, setResult] = useState(t.noPreviewActionTaken)
  const [disabled, setDisabled] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const submit = (values: Record<string, unknown>) =>
    setResult(JSON.stringify(values))
  const submitNative = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget),
      values: Record<string, unknown> = {}
    for (const key of new Set(data.keys())) {
      const all = data.getAll(key)
      values[key] = all.length > 1 ? all : all[0]
    }
    submit(values)
  }
  const project = (
    <Field.Root name='project'>
      <Field.Label>{t.projectNameLabel}</Field.Label>
      <Field.Control
        required
        pattern={'[a-z0-9\\-]+'}
        placeholder='demo-e2e-01'
      />
      <Field.Description>{t.projectNameDescription}</Field.Description>
      <Field.Error />
    </Field.Root>
  )
  const buttons = (
    <div className='actions'>
      <Button type='submit'>{t.submitPreview}</Button>
      <Button type='reset' variant='outline'>
        {t.resetPreview}
      </Button>
    </div>
  )
  let example: React.ReactNode
  switch (id) {
    case 'field':
      example = (
        <Form onFormSubmit={submit}>
          {project}
          {buttons}
        </Form>
      )
      break
    case 'fieldset':
      example = (
        <div className='example-stack'>
          <Button
            variant='outline'
            aria-pressed={disabled}
            onClick={() => setDisabled(!disabled)}
          >
            {disabled ? t.enableGroup : t.disableGroup}
          </Button>
          <Form onFormSubmit={submit}>
            <Fieldset.Root disabled={disabled}>
              <Fieldset.Legend>{t.deploymentTarget}</Fieldset.Legend>
              {project}
              <Field.Root name='environment'>
                <Field.Label>{t.environment}</Field.Label>
                <Select
                  name='environment'
                  aria-label={t.environment}
                  defaultValue='staging'
                  options={[
                    { value: 'staging', label: t.staging },
                    { value: 'production', label: t.production },
                  ]}
                />
                <Field.Description>
                  {t.selectEnvironmentToDeploy}
                </Field.Description>
              </Field.Root>
            </Fieldset.Root>
            {buttons}
          </Form>
        </div>
      )
      break
    case 'form':
      example = (
        <Form
          onFormSubmit={submit}
          errors={serverErrors}
          onReset={() => {
            setServerErrors({})
            setResult(t.previewReset)
          }}
        >
          {project}
          <Field.Root name='description'>
            <Field.Label>{t.description}</Field.Label>
            <Field.Control
              render={<Textarea rows={3} />}
              placeholder={t.deploymentPurposePlaceholder}
            />
          </Field.Root>
          <div className='actions'>
            <Button type='submit'>{t.submitPreview}</Button>
            <Button type='reset' variant='outline'>
              {t.resetPreview}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                setServerErrors({
                  project: t.nameAlreadyInUse,
                })
              }
            >
              {t.previewServerError}
            </Button>
          </div>
        </Form>
      )
      break
    case 'textarea':
      example = (
        <Form onFormSubmit={submit}>
          <Field.Root name='description'>
            <Field.Label>{t.description}</Field.Label>
            <Field.Control
              render={<Textarea rows={4} />}
              required
              maxLength={240}
              placeholder={t.textareaPlaceholder}
            />
            <Field.Description>{t.textareaDescription}</Field.Description>
            <Field.Error />
          </Field.Root>
          <Field.Root disabled>
            <Field.Label>{t.disabledNotes}</Field.Label>
            <Field.Control
              render={<Textarea rows={2} />}
              placeholder={t.unavailable}
            />
          </Field.Root>
          {buttons}
        </Form>
      )
      break
    case 'checkbox':
      example = (
        <Form onSubmit={submitNative}>
          <div className='pui-choice-group'>
            <label className='pui-choice-label'>
              <Checkbox.Root
                name='cleanup'
                value='enabled'
                defaultChecked
                className={(state) =>
                  state.checked ? 'preview-checked' : undefined
                }
              >
                <Checkbox.Indicator />
              </Checkbox.Root>
              <span>{t.cleanUpTemporaryAccounts}</span>
            </label>
            <label className='pui-choice-label'>
              <Checkbox.Root indeterminate readOnly>
                <Checkbox.Indicator />
              </Checkbox.Root>
              <span>{t.partialSelection}</span>
            </label>
            <label className='pui-choice-label'>
              <Checkbox.Root defaultChecked readOnly>
                <Checkbox.Indicator />
              </Checkbox.Root>
              <span>{t.readOnlySelection}</span>
            </label>
            <label className='pui-choice-label'>
              <Checkbox.Root disabled>
                <Checkbox.Indicator />
              </Checkbox.Root>
              <span>{t.unavailableOption}</span>
            </label>
          </div>
          {buttons}
        </Form>
      )
      break
    case 'checkbox-group':
      example = (
        <Form onSubmit={submitNative}>
          <Fieldset.Root>
            <Fieldset.Legend>{t.environments}</Fieldset.Legend>
            <CheckboxGroup
              allValues={['staging', 'production']}
              defaultValue={['staging']}
              aria-label={t.environments}
            >
              <label className='pui-choice-label'>
                <Checkbox.Root parent>
                  <Checkbox.Indicator />
                </Checkbox.Root>
                <span>{t.allEnvironments}</span>
              </label>
              {[
                ['staging', t.staging],
                ['production', t.production],
              ].map(([value, label]) => (
                <label className='pui-choice-label' key={value}>
                  <Checkbox.Root name='environments' value={value}>
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                  <span>{label}</span>
                </label>
              ))}
            </CheckboxGroup>
          </Fieldset.Root>
          {buttons}
        </Form>
      )
      break
    case 'radio-group':
      example = (
        <Form onSubmit={submitNative}>
          <Fieldset.Root>
            <Fieldset.Legend>{t.logSource}</Fieldset.Legend>
            <RadioGroup
              name='source'
              defaultValue='live'
              aria-label={t.logSource}
            >
              <label className='pui-choice-label'>
                <Radio.Root value='live'>
                  <Radio.Indicator />
                </Radio.Root>
                <span>{t.actualDemo}</span>
              </label>
              <label className='pui-choice-label'>
                <Radio.Root value='simulation'>
                  <Radio.Indicator />
                </Radio.Root>
                <span>{t.simulation}</span>
              </label>
              <label className='pui-choice-label'>
                <Radio.Root value='unavailable' disabled>
                  <Radio.Indicator />
                </Radio.Root>
                <span>{t.unavailableSource}</span>
              </label>
            </RadioGroup>
          </Fieldset.Root>
          {buttons}
        </Form>
      )
      break
    case 'switch':
      example = (
        <Form onSubmit={submitNative}>
          <div className='pui-choice-group'>
            <label className='pui-choice-label'>
              <Switch.Root
                name='refresh'
                defaultChecked
                value='enabled'
                uncheckedValue='disabled'
              >
                <Switch.Thumb />
              </Switch.Root>
              <span>{t.refreshRunStatus}</span>
            </label>
            <label className='pui-choice-label'>
              <Switch.Root readOnly defaultChecked>
                <Switch.Thumb />
              </Switch.Root>
              <span>{t.readOnlySetting}</span>
            </label>
            <label className='pui-choice-label'>
              <Switch.Root disabled>
                <Switch.Thumb />
              </Switch.Root>
              <span>{t.unavailableSetting}</span>
            </label>
          </div>
          <p className='catalog-preview-note'>
            {t.settingsChangeOnlyInPreview}
          </p>
          {buttons}
        </Form>
      )
      break
    default:
      return null
  }
  return (
    <>
      <div className='component-example'>
        <div className='example-controls'>{example}</div>
        <p role='status' className='note'>
          {result}
        </p>
      </div>
      {id === 'form' && <FormContractExample />}
    </>
  )
}
