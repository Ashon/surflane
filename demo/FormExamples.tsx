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
  ChoiceLabel,
  Toggle,
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
          {/* A toggle keeps one name; its pressed state says whether it is on. */}
          <Toggle pressed={disabled} onPressedChange={setDisabled}>
            {t.disableGroup}
          </Toggle>
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
            <Textarea rows={3} placeholder={t.deploymentPurposePlaceholder} />
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
            <Textarea
              rows={4}
              required
              maxLength={240}
              placeholder={t.textareaPlaceholder}
            />
            <Field.Description>{t.textareaDescription}</Field.Description>
            <Field.Error />
          </Field.Root>
          <Field.Root disabled>
            <Field.Label>{t.disabledNotes}</Field.Label>
            <Textarea rows={2} placeholder={t.unavailable} />
          </Field.Root>
          {buttons}
        </Form>
      )
      break
    case 'checkbox':
      example = (
        <Form onSubmit={submitNative}>
          <div className='surf-choice-group'>
            <ChoiceLabel
              control={
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
              }
            >
              {t.cleanUpTemporaryAccounts}
            </ChoiceLabel>
            <ChoiceLabel
              control={
                <Checkbox.Root indeterminate readOnly>
                  <Checkbox.Indicator />
                </Checkbox.Root>
              }
            >
              {t.partialSelection}
            </ChoiceLabel>
            <ChoiceLabel
              control={
                <Checkbox.Root defaultChecked readOnly>
                  <Checkbox.Indicator />
                </Checkbox.Root>
              }
            >
              {t.readOnlySelection}
            </ChoiceLabel>
            <ChoiceLabel
              control={
                <Checkbox.Root disabled>
                  <Checkbox.Indicator />
                </Checkbox.Root>
              }
            >
              {t.unavailableOption}
            </ChoiceLabel>
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
              <ChoiceLabel
                control={
                  <Checkbox.Root parent>
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                }
              >
                {t.allEnvironments}
              </ChoiceLabel>
              {[
                ['staging', t.staging],
                ['production', t.production],
              ].map(([value, label]) => (
                <ChoiceLabel
                  key={value}
                  control={
                    <Checkbox.Root name='environments' value={value}>
                      <Checkbox.Indicator />
                    </Checkbox.Root>
                  }
                >
                  {label}
                </ChoiceLabel>
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
              <ChoiceLabel
                control={
                  <Radio.Root value='live'>
                    <Radio.Indicator />
                  </Radio.Root>
                }
              >
                {t.actualDemo}
              </ChoiceLabel>
              <ChoiceLabel
                control={
                  <Radio.Root value='simulation'>
                    <Radio.Indicator />
                  </Radio.Root>
                }
              >
                {t.simulation}
              </ChoiceLabel>
              <ChoiceLabel
                control={
                  <Radio.Root value='unavailable' disabled>
                    <Radio.Indicator />
                  </Radio.Root>
                }
              >
                {t.unavailableSource}
              </ChoiceLabel>
            </RadioGroup>
          </Fieldset.Root>
          {buttons}
        </Form>
      )
      break
    case 'switch':
      example = (
        <Form onSubmit={submitNative}>
          <div className='surf-choice-group'>
            <ChoiceLabel
              control={
                <Switch.Root
                  name='refresh'
                  defaultChecked
                  value='enabled'
                  uncheckedValue='disabled'
                >
                  <Switch.Thumb />
                </Switch.Root>
              }
            >
              {t.refreshRunStatus}
            </ChoiceLabel>
            <ChoiceLabel
              control={
                <Switch.Root readOnly defaultChecked>
                  <Switch.Thumb />
                </Switch.Root>
              }
            >
              {t.readOnlySetting}
            </ChoiceLabel>
            <ChoiceLabel
              control={
                <Switch.Root disabled>
                  <Switch.Thumb />
                </Switch.Root>
              }
            >
              {t.unavailableSetting}
            </ChoiceLabel>
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
