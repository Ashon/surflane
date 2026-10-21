import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Switch,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/FormContractExample'
const initial = {
  cleanup: true,
  refresh: true,
  source: 'live',
  regions: ['staging'],
}
export function FormContractExample() {
  const t = text[useLocale().locale]
  const [model, setModel] = useState(initial),
    [reject, setReject] = useState(false),
    [result, setResult] = useState(t.noActionTaken)
  function change<Key extends keyof typeof initial>(
    key: Key,
    value: (typeof initial)[Key],
    event: { cancel: () => void },
  ) {
    if (reject) {
      event.cancel()
      setResult(t.changeCanceledByCaller)
      return
    }
    setModel((previous) => ({ ...previous, [key]: value }))
  }
  return (
    <div className='form-contract-example example-stack'>
      <h3>{t.title}</h3>
      <p>{t.description}</p>
      <form
        id='reset-contract-form'
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setResult(
            JSON.stringify({
              cleanup: data.get('controlledCleanup'),
              refresh: data.get('controlledRefresh'),
              source: data.get('controlledSource'),
              environments: data.getAll('controlledEnvironments'),
            }),
          )
        }}
      >
        <div className='actions'>
          <Button type='submit'>{t.submitContract}</Button>
          <Button variant='outline' type='reset'>
            {t.nativeReset}
          </Button>
          <Button
            variant='outline'
            type='button'
            onClick={() => {
              setModel(initial)
              setResult(t.modelRestored)
            }}
          >
            {t.restoreInitialModel}
          </Button>
          <Button
            type='button'
            variant='outline'
            aria-pressed={reject}
            onClick={() => setReject(!reject)}
          >
            {t.rejectChanges}
          </Button>
        </div>
      </form>
      <label className='pui-choice-label'>
        <Checkbox.Root
          checked={model.cleanup}
          onCheckedChange={(next, event) => change('cleanup', next, event)}
          name='controlledCleanup'
          value='enabled'
          form='reset-contract-form'
        >
          <Checkbox.Indicator />
        </Checkbox.Root>
        <span>{t.controlledCleanup}</span>
      </label>
      <label className='pui-choice-label'>
        <Switch.Root
          checked={model.refresh}
          onCheckedChange={(next, event) => change('refresh', next, event)}
          name='controlledRefresh'
          value='enabled'
          uncheckedValue='disabled'
          form='reset-contract-form'
        >
          <Switch.Thumb />
        </Switch.Root>
        <span>{t.controlledRefresh}</span>
      </label>
      <RadioGroup
        value={model.source}
        onValueChange={(next, event) => change('source', next, event)}
        name='controlledSource'
        form='reset-contract-form'
        aria-label={t.controlledSource}
        ref={(node) => {
          node?.setAttribute('data-contract-ref', 'connected')
        }}
      >
        {[
          ['live', t.live],
          ['simulation', t.simulation],
        ].map(([value, label]) => (
          <label className='pui-choice-label' key={value}>
            <Radio.Root value={value}>
              <Radio.Indicator />
            </Radio.Root>
            <span>{label}</span>
          </label>
        ))}
      </RadioGroup>
      <CheckboxGroup
        value={model.regions}
        onValueChange={(next, event) => change('regions', next, event)}
        aria-label={t.controlledEnvironments}
        allValues={['staging', 'production']}
      >
        <label className='pui-choice-label'>
          <Checkbox.Root parent>
            <Checkbox.Indicator />
          </Checkbox.Root>
          <span>{t.allControlledEnvironments}</span>
        </label>
        {[
          ['staging', t.controlledStaging],
          ['production', t.controlledProduction],
        ].map(([value, label]) => (
          <label className='pui-choice-label' key={value}>
            <Checkbox.Root
              name='controlledEnvironments'
              value={value}
              form='reset-contract-form'
            >
              <Checkbox.Indicator />
            </Checkbox.Root>
            <span>{label}</span>
          </label>
        ))}
      </CheckboxGroup>
      <p role='status'>{result}</p>
    </div>
  )
}
