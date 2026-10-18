import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Switch,
} from '@surflane/ui'
const initial = {
  cleanup: true,
  refresh: true,
  source: 'live',
  regions: ['staging'],
}
export function FormContractExample() {
  const [model, setModel] = useState(initial),
    [reject, setReject] = useState(false),
    [result, setResult] = useState('No contract action taken.')
  function change<Key extends keyof typeof initial>(
    key: Key,
    value: (typeof initial)[Key],
    event: { cancel: () => void },
  ) {
    if (reject) {
      event.cancel()
      setResult('Change canceled by caller.')
      return
    }
    setModel((previous) => ({ ...previous, [key]: value }))
  }
  return (
    <div className='form-contract-example example-stack'>
      <h3>Controlled values and external form ownership</h3>
      <p>
        The calling screen owns the values. Native reset doesn't overwrite
        controlled values. An explicit restore action resets the model.
      </p>
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
          <Button type='submit'>Submit contract</Button>
          <Button variant='outline' type='reset'>
            Native reset
          </Button>
          <Button
            variant='outline'
            type='button'
            onClick={() => {
              setModel(initial)
              setResult('Controlled model restored.')
            }}
          >
            Restore initial model
          </Button>
          <Button
            type='button'
            variant='outline'
            aria-pressed={reject}
            onClick={() => setReject(!reject)}
          >
            Reject changes
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
        <span>Controlled cleanup</span>
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
        <span>Controlled refresh</span>
      </label>
      <RadioGroup
        value={model.source}
        onValueChange={(next, event) => change('source', next, event)}
        name='controlledSource'
        form='reset-contract-form'
        aria-label='Controlled source'
        ref={(node) => {
          node?.setAttribute('data-contract-ref', 'connected')
        }}
      >
        {[
          ['live', 'Live'],
          ['simulation', 'Simulation'],
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
        aria-label='Controlled environments'
        allValues={['staging', 'production']}
      >
        <label className='pui-choice-label'>
          <Checkbox.Root parent>
            <Checkbox.Indicator />
          </Checkbox.Root>
          <span>All controlled environments</span>
        </label>
        {[
          ['staging', 'Controlled Staging'],
          ['production', 'Controlled Production'],
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
