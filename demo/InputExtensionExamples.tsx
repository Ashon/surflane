import React, { useState } from 'react'
import {
  Autocomplete,
  Slider,
  NumberField,
  Field,
  Form,
  Button,
  Checkbox,
  DirectionProvider,
} from '@surflane/ui'
export { inputExtensionExampleIds } from './exampleGroups'
const suggestions = [
  'staging deployment',
  'identity control',
  'project isolation',
  'service discovery',
  // Korean sample: exercises Hangul composition before accepting a suggestion.
  '스테이징 배포 환경',
]
const tags = [
  { id: 'ops', title: 'Operations' },
  { id: 'audit', title: 'Audit' },
  { id: 'release', title: 'Release' },
]
function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
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
function serialize(form: HTMLFormElement) {
  const data = new FormData(form)
  return JSON.stringify(
    Object.fromEntries(
      [...new Set(data.keys())].map((name) => [
        name,
        data.getAll(name).length > 1 ? data.getAll(name) : data.get(name),
      ]),
    ),
  )
}
export function InputExtensionExample({ id }: { id: string }) {
  const [disabled, setDisabled] = useState(false),
    [readOnly, setReadOnly] = useState(false),
    [cancelReset, setCancelReset] = useState(false),
    [cancelChange, setCancelChange] = useState(false),
    [result, setResult] = useState('No form submitted.')
  const [rtl, setRtl] = useState(false)
  const [tag, setTag] = useState('Operations'),
    [weight, setWeight] = useState(25),
    [committed, setCommitted] = useState('No value committed.')
  if (id === 'autocomplete')
    return (
      <div className='example-stack'>
        <div className='actions'>
          <Toggle checked={disabled} onChange={setDisabled}>
            Disable suggestions
          </Toggle>
          <Toggle checked={readOnly} onChange={setReadOnly}>
            Read only
          </Toggle>
        </div>
        <Form
          id='autocomplete-example-form'
          onSubmit={(e) => {
            e.preventDefault()
            setResult(serialize(e.currentTarget))
          }}
          onReset={(e) => {
            if (cancelReset) e.preventDefault()
          }}
        >
          <Field.Root name='query'>
            <Field.Label>Pipeline search</Field.Label>
            <Field.Description>
              Suggestions are optional; any nonempty search text is valid.
            </Field.Description>
            <Autocomplete.Root
              name='query'
              items={suggestions}
              defaultValue='staging'
              required
              disabled={disabled}
              readOnly={readOnly}
              onValueChange={(_, event) => {
                if (cancelChange) event.cancel()
              }}
            >
              <Autocomplete.InputGroup>
                <Autocomplete.Input placeholder='Search pipelines…' />
                <Autocomplete.Clear />
                <Autocomplete.Trigger />
              </Autocomplete.InputGroup>
              <Autocomplete.Content>
                <Autocomplete.Empty>
                  No suggestions. You can still use this search text.
                </Autocomplete.Empty>
                <Autocomplete.List>
                  {(text: string) => (
                    <Autocomplete.Item key={text} value={text}>
                      {text}
                    </Autocomplete.Item>
                  )}
                </Autocomplete.List>
              </Autocomplete.Content>
            </Autocomplete.Root>
            <Field.Error />
          </Field.Root>
          <div className='actions'>
            <Button type='submit'>Submit search</Button>
            <Button type='reset' variant='outline'>
              Reset search
            </Button>
          </div>
        </Form>
        <Field.Root name='tag'>
          <Field.Label>Controlled search tag</Field.Label>
          <Field.Description>
            Object suggestions supply labels, while the input remains free text.
            This field belongs to the form above.
          </Field.Description>
          <Autocomplete.Root
            name='tag'
            form='autocomplete-example-form'
            items={tags}
            itemToStringValue={(item) => item.title}
            value={tag}
            onValueChange={setTag}
            disabled={disabled}
            readOnly={readOnly}
          >
            <Autocomplete.InputGroup>
              <Autocomplete.Input placeholder='Search or enter a tag…' />
              <Autocomplete.Trigger aria-label='Show tags' />
            </Autocomplete.InputGroup>
            <Autocomplete.Content>
              <Autocomplete.Empty>No suggested tags.</Autocomplete.Empty>
              <Autocomplete.List>
                {(item: (typeof tags)[number]) => (
                  <Autocomplete.Item key={item.id} value={item}>
                    {item.title}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Content>
          </Autocomplete.Root>
          <Field.Error />
        </Field.Root>
        <div className='actions'>
          <Button variant='outline' onClick={() => setCancelReset((v) => !v)}>
            {cancelReset ? 'Allow reset' : 'Cancel reset'}
          </Button>
          <Button variant='outline' onClick={() => setCancelChange((v) => !v)}>
            {cancelChange ? 'Allow query changes' : 'Cancel query changes'}
          </Button>
        </div>
        <p role='status'>{result}</p>
      </div>
    )
  return (
    <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
      <div className='example-stack' dir={rtl ? 'rtl' : 'ltr'}>
        <div className='actions'>
          <Toggle checked={disabled} onChange={setDisabled}>
            Disable sliders
          </Toggle>
          <Toggle checked={rtl} onChange={setRtl}>
            Right to left
          </Toggle>
        </div>
        <Form
          id='slider-example-form'
          onSubmit={(e) => {
            e.preventDefault()
            setResult(serialize(e.currentTarget))
          }}
          onReset={(e) => {
            if (cancelReset) e.preventDefault()
          }}
        >
          <Slider.Root
            name='workers'
            defaultValue={3}
            min={1}
            max={16}
            step={1}
            disabled={disabled}
            onValueChange={(_, event) => {
              if (cancelChange) event.cancel()
            }}
            onValueCommitted={(value) =>
              setCommitted(`${value} workers committed.`)
            }
          >
            <Slider.Label>Parallel workers</Slider.Label>
            <Slider.Value>{(_, values) => `${values[0]} workers`}</Slider.Value>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb
                aria-valuetext={undefined}
                getAriaValueText={(_, value) => `${value} workers`}
              />
            </Slider.Control>
          </Slider.Root>
          <Slider.Root
            name='window'
            defaultValue={[20, 60]}
            min={0}
            max={100}
            step={5}
            minStepsBetweenValues={2}
            thumbCollisionBehavior='none'
            disabled={disabled}
          >
            <Slider.Label>Rollout window</Slider.Label>
            <Slider.Value>
              {(_, values) => `${values[0]}–${values[1]}%`}
            </Slider.Value>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb
                index={0}
                aria-label='Minimum coverage'
                getAriaValueText={(_, v) => `${v} percent`}
              />
              <Slider.Thumb
                index={1}
                aria-label='Maximum coverage'
                getAriaValueText={(_, v) => `${v} percent`}
              />
            </Slider.Control>
          </Slider.Root>
          <Slider.Root
            name='weight'
            value={weight}
            onValueChange={setWeight}
            min={0}
            max={100}
            step={5}
            disabled={disabled}
          >
            <Slider.Label>Coverage weight</Slider.Label>
            <Slider.Value>{(_, values) => `${values[0]}%`}</Slider.Value>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb getAriaValueText={(_, v) => `${v} percent`} />
            </Slider.Control>
          </Slider.Root>
          <Field.Root name='exactWeight'>
            <Field.Label>Exact percentage</Field.Label>
            <Field.Description>
              A direct numeric alternative to dragging.
            </Field.Description>
            <NumberField.Root
              name='exactWeight'
              value={weight}
              onValueChange={(v) => setWeight(v ?? 0)}
              min={0}
              max={100}
              step={5}
              disabled={disabled}
            >
              <NumberField.Group>
                <NumberField.Decrement aria-label='Decrease percentage' />
                <NumberField.Input />
                <NumberField.Increment aria-label='Increase percentage' />
              </NumberField.Group>
            </NumberField.Root>
          </Field.Root>
          <div className='actions'>
            <Button type='submit'>Submit slider values</Button>
            <Button type='reset' variant='outline'>
              Reset sliders
            </Button>
          </div>
        </Form>
        <Slider.Root
          name='priority'
          form='slider-example-form'
          defaultValue={4}
          min={0}
          max={10}
          orientation='vertical'
          disabled={disabled}
        >
          <Slider.Label>Priority</Slider.Label>
          <Slider.Value />
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
            </Slider.Track>
            <Slider.Thumb />
          </Slider.Control>
        </Slider.Root>
        <div className='actions'>
          <Button variant='outline' onClick={() => setCancelReset((v) => !v)}>
            {cancelReset ? 'Allow reset' : 'Cancel reset'}
          </Button>
          <Button variant='outline' onClick={() => setCancelChange((v) => !v)}>
            {cancelChange ? 'Allow primary changes' : 'Cancel primary changes'}
          </Button>
        </div>
        <p role='status'>
          {result} {committed}
        </p>
      </div>
    </DirectionProvider>
  )
}
