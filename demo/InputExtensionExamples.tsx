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
  ChoiceLabel,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/InputExtensionExamples'
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
    <ChoiceLabel
      control={
        <Checkbox.Root checked={checked} onCheckedChange={onChange}>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      {children}
    </ChoiceLabel>
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
  const t = text[useLocale().locale]
  const [disabled, setDisabled] = useState(false),
    [readOnly, setReadOnly] = useState(false),
    [cancelReset, setCancelReset] = useState(false),
    [cancelChange, setCancelChange] = useState(false),
    [result, setResult] = useState(t.noFormSubmitted)
  const [rtl, setRtl] = useState(false)
  const [tag, setTag] = useState('Operations'),
    [weight, setWeight] = useState(25),
    [committed, setCommitted] = useState(t.noValueCommitted)
  if (id === 'autocomplete')
    return (
      <div className='example-stack'>
        <div className='actions'>
          <Toggle checked={disabled} onChange={setDisabled}>
            {t.disableSuggestions}
          </Toggle>
          <Toggle checked={readOnly} onChange={setReadOnly}>
            {t.readOnly}
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
            <Field.Label>{t.pipelineSearch}</Field.Label>
            <Field.Description>{t.suggestionsDescription}</Field.Description>
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
                <Autocomplete.Input placeholder={t.searchPipelines} />
                <Autocomplete.Clear aria-label={t.clearInput} />
                <Autocomplete.Trigger aria-label={t.showSuggestions} />
              </Autocomplete.InputGroup>
              <Autocomplete.Content>
                <Autocomplete.Empty>{t.noSuggestions}</Autocomplete.Empty>
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
            <Button type='submit'>{t.submitSearch}</Button>
            <Button type='reset' variant='outline'>
              {t.resetSearch}
            </Button>
          </div>
        </Form>
        <Field.Root name='tag'>
          <Field.Label>{t.controlledSearchTag}</Field.Label>
          <Field.Description>{t.tagDescription}</Field.Description>
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
              <Autocomplete.Input placeholder={t.searchOrEnterTag} />
              <Autocomplete.Trigger aria-label={t.showTags} />
            </Autocomplete.InputGroup>
            <Autocomplete.Content>
              <Autocomplete.Empty>{t.noSuggestedTags}</Autocomplete.Empty>
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
            {cancelReset ? t.allowReset : t.cancelReset}
          </Button>
          <Button variant='outline' onClick={() => setCancelChange((v) => !v)}>
            {cancelChange ? t.allowQueryChanges : t.cancelQueryChanges}
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
            {t.disableSliders}
          </Toggle>
          <Toggle checked={rtl} onChange={setRtl}>
            {t.rightToLeft}
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
              setCommitted(t.workersCommitted(value))
            }
          >
            <Slider.Label>{t.parallelWorkers}</Slider.Label>
            <Slider.Value>
              {(_, values) => t.workersValue(values[0])}
            </Slider.Value>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb
                aria-valuetext={undefined}
                getAriaValueText={(_, value) => t.workersValue(value)}
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
            <Slider.Label>{t.rolloutWindow}</Slider.Label>
            <Slider.Value>
              {(_, values) => `${values[0]}–${values[1]}%`}
            </Slider.Value>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb
                index={0}
                aria-label={t.minimumCoverage}
                getAriaValueText={(_, v) => t.percent(v)}
              />
              <Slider.Thumb
                index={1}
                aria-label={t.maximumCoverage}
                getAriaValueText={(_, v) => t.percent(v)}
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
            <Slider.Label>{t.coverageWeight}</Slider.Label>
            <Slider.Value>{(_, values) => `${values[0]}%`}</Slider.Value>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb getAriaValueText={(_, v) => t.percent(v)} />
            </Slider.Control>
          </Slider.Root>
          <Field.Root name='exactWeight'>
            <Field.Label>{t.exactPercentage}</Field.Label>
            <Field.Description>
              {t.typeValueInsteadOfDragging}
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
                <NumberField.Decrement aria-label={t.decreasePercentage} />
                <NumberField.Input />
                <NumberField.Increment aria-label={t.increasePercentage} />
              </NumberField.Group>
            </NumberField.Root>
          </Field.Root>
          <div className='actions'>
            <Button type='submit'>{t.submitSliderValues}</Button>
            <Button type='reset' variant='outline'>
              {t.resetSliders}
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
          <Slider.Label>{t.priority}</Slider.Label>
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
            {cancelReset ? t.allowReset : t.cancelReset}
          </Button>
          <Button variant='outline' onClick={() => setCancelChange((v) => !v)}>
            {cancelChange ? t.allowWorkerChanges : t.cancelWorkerChanges}
          </Button>
        </div>
        <p role='status'>
          {result} {committed}
        </p>
      </div>
    </DirectionProvider>
  )
}
