import { useState } from 'react'
import { Field, Inline, NumberField, Slider, Stack } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const workers = (n: number) => `${n} worker${n === 1 ? '' : 's'}`

export const Default = () => (
  <Stack style={{ maxWidth: '26rem' }}>
    <Slider.Root name='workers' defaultValue={6} min={1} max={16}>
      <Slider.Label>Parallel workers</Slider.Label>
      <Slider.Value>{(_, values) => workers(values[0])}</Slider.Value>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb getAriaValueText={(_, value) => workers(value)} />
      </Slider.Control>
    </Slider.Root>
  </Stack>
)

export const Range = () => (
  <Stack style={{ maxWidth: '26rem' }}>
    <Slider.Root
      name='rolloutWindow'
      defaultValue={[20, 60]}
      min={0}
      max={100}
      step={5}
      minStepsBetweenValues={2}
    >
      <Slider.Label>Rollout window</Slider.Label>
      <Slider.Value>
        {(_, values) => `${values[0]}–${values[1]}% of traffic`}
      </Slider.Value>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb
          index={0}
          aria-label='Minimum traffic'
          getAriaValueText={(_, v) => `${v}%`}
        />
        <Slider.Thumb
          index={1}
          aria-label='Maximum traffic'
          getAriaValueText={(_, v) => `${v}%`}
        />
      </Slider.Control>
    </Slider.Root>
  </Stack>
)

export const Disabled = () => (
  <Stack style={{ maxWidth: '26rem' }}>
    <Slider.Root name='retention' defaultValue={30} min={7} max={90} disabled>
      <Slider.Label>Log retention</Slider.Label>
      <Slider.Value>{(_, values) => `${values[0]} days`}</Slider.Value>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb getAriaValueText={(_, v) => `${v} days`} />
      </Slider.Control>
    </Slider.Root>
  </Stack>
)

export const Vertical = () => (
  <Inline gap={8}>
    <Slider.Root
      name='priority'
      defaultValue={7}
      min={0}
      max={10}
      orientation='vertical'
    >
      <Slider.Label>Queue priority</Slider.Label>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb />
      </Slider.Control>
    </Slider.Root>
    <Slider.Root
      name='cpu'
      defaultValue={40}
      min={0}
      max={100}
      step={5}
      orientation='vertical'
    >
      <Slider.Label>CPU limit</Slider.Label>
      <Slider.Value>{(_, values) => `${values[0]}%`}</Slider.Value>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb getAriaValueText={(_, v) => `${v}%`} />
      </Slider.Control>
    </Slider.Root>
  </Inline>
)

export const WithNumberField = () => {
  const [weight, setWeight] = useState(25)
  return (
    <Stack gap={4} style={{ maxWidth: '26rem' }}>
      <Slider.Root
        name='weight'
        value={weight}
        onValueChange={(next) =>
          setWeight(Array.isArray(next) ? next[0] : next)
        }
        min={0}
        max={100}
        step={5}
      >
        <Slider.Label>Traffic weight</Slider.Label>
        <Slider.Value>{(_, values) => `${values[0]}%`}</Slider.Value>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
          </Slider.Track>
          <Slider.Thumb getAriaValueText={(_, v) => `${v}%`} />
        </Slider.Control>
      </Slider.Root>
      <Field.Root name='exactWeight'>
        <Field.Label>Exact percentage</Field.Label>
        <NumberField.Root
          value={weight}
          onValueChange={(v) => setWeight(v ?? 0)}
          min={0}
          max={100}
          step={5}
        >
          <NumberField.Group>
            <NumberField.Decrement aria-label='Decrease percentage' />
            <NumberField.Input />
            <NumberField.Increment aria-label='Increase percentage' />
          </NumberField.Group>
        </NumberField.Root>
        <Field.Description>Type a value instead of dragging.</Field.Description>
      </Field.Root>
    </Stack>
  )
}
