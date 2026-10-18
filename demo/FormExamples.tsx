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
export { formExampleIds } from './exampleGroups'
export function FormExample({ id }: { id: string }) {
  const [result, setResult] = useState('No preview action taken.')
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
      <Field.Label>Project name</Field.Label>
      <Field.Control
        required
        pattern={'[a-z0-9\\-]+'}
        placeholder='demo-e2e-01'
      />
      <Field.Description>
        Use lowercase letters, numbers, and hyphens.
      </Field.Description>
      <Field.Error />
    </Field.Root>
  )
  const buttons = (
    <div className='actions'>
      <Button type='submit'>Submit preview</Button>
      <Button type='reset' variant='outline'>
        Reset preview
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
            {disabled ? 'Enable group' : 'Disable group'}
          </Button>
          <Form onFormSubmit={submit}>
            <Fieldset.Root disabled={disabled}>
              <Fieldset.Legend>Deployment target</Fieldset.Legend>
              {project}
              <Field.Root name='environment'>
                <Field.Label>Environment</Field.Label>
                <Select
                  name='environment'
                  aria-label='Environment'
                  defaultValue='staging'
                  options={[
                    { value: 'staging', label: 'Staging' },
                    { value: 'production', label: 'Production' },
                  ]}
                />
                <Field.Description>
                  Select the environment to deploy to.
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
            setResult('Preview reset.')
          }}
        >
          {project}
          <Field.Root name='description'>
            <Field.Label>Description</Field.Label>
            <Field.Control
              render={<Textarea rows={3} />}
              placeholder='Describe the purpose of the deployment.'
            />
          </Field.Root>
          <div className='actions'>
            <Button type='submit'>Submit preview</Button>
            <Button type='reset' variant='outline'>
              Reset preview
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                setServerErrors({
                  project:
                    'This name is already in use. Enter a different name.',
                })
              }
            >
              Preview server error
            </Button>
          </div>
        </Form>
      )
      break
    case 'textarea':
      example = (
        <Form onFormSubmit={submit}>
          <Field.Root name='description'>
            <Field.Label>Description</Field.Label>
            <Field.Control
              render={<Textarea rows={4} />}
              required
              maxLength={240}
              placeholder='Enter multiple lines of Korean and English text.'
            />
            <Field.Description>
              Up to 240 characters. Drag the bottom handle to change the height.
            </Field.Description>
            <Field.Error />
          </Field.Root>
          <Field.Root disabled>
            <Field.Label>Disabled notes</Field.Label>
            <Field.Control
              render={<Textarea rows={2} />}
              placeholder='Unavailable'
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
              <span>Clean up temporary accounts</span>
            </label>
            <label className='pui-choice-label'>
              <Checkbox.Root indeterminate readOnly>
                <Checkbox.Indicator />
              </Checkbox.Root>
              <span>Partial selection</span>
            </label>
            <label className='pui-choice-label'>
              <Checkbox.Root defaultChecked readOnly>
                <Checkbox.Indicator />
              </Checkbox.Root>
              <span>Read-only selection</span>
            </label>
            <label className='pui-choice-label'>
              <Checkbox.Root disabled>
                <Checkbox.Indicator />
              </Checkbox.Root>
              <span>Unavailable option</span>
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
            <Fieldset.Legend>Environments</Fieldset.Legend>
            <CheckboxGroup
              allValues={['staging', 'production']}
              defaultValue={['staging']}
              aria-label='Environments'
            >
              <label className='pui-choice-label'>
                <Checkbox.Root parent>
                  <Checkbox.Indicator />
                </Checkbox.Root>
                <span>All environments</span>
              </label>
              {[
                ['staging', 'Staging'],
                ['production', 'Production'],
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
            <Fieldset.Legend>Log source</Fieldset.Legend>
            <RadioGroup
              name='source'
              defaultValue='live'
              aria-label='Log source'
            >
              <label className='pui-choice-label'>
                <Radio.Root value='live'>
                  <Radio.Indicator />
                </Radio.Root>
                <span>Actual DEMO</span>
              </label>
              <label className='pui-choice-label'>
                <Radio.Root value='simulation'>
                  <Radio.Indicator />
                </Radio.Root>
                <span>Simulation</span>
              </label>
              <label className='pui-choice-label'>
                <Radio.Root value='unavailable' disabled>
                  <Radio.Indicator />
                </Radio.Root>
                <span>Unavailable source</span>
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
              <span>Refresh run status</span>
            </label>
            <label className='pui-choice-label'>
              <Switch.Root readOnly defaultChecked>
                <Switch.Thumb />
              </Switch.Root>
              <span>Read-only setting</span>
            </label>
            <label className='pui-choice-label'>
              <Switch.Root disabled>
                <Switch.Thumb />
              </Switch.Root>
              <span>Unavailable setting</span>
            </label>
          </div>
          <p className='catalog-preview-note'>
            These settings change only in this preview.
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
