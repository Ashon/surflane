import { Icon, Inline, Toggle } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const PressedAndUnpressed = () => (
  <Inline gap={2}>
    <Toggle defaultPressed>Follow logs</Toggle>
    <Toggle>Show timings</Toggle>
  </Inline>
)

export const WithIcon = () => (
  <Inline gap={2}>
    <Toggle defaultPressed>
      <Icon name='clock' />
      UTC timestamps
    </Toggle>
    <Toggle>
      <Icon name='sidebar' />
      Details panel
    </Toggle>
    <Toggle size='icon' aria-label='Dark log view' defaultPressed>
      <Icon name='moon' />
    </Toggle>
    <Toggle size='icon' aria-label='Full screen'>
      <Icon name='monitor' />
    </Toggle>
  </Inline>
)

export const Sizes = () => (
  <Inline gap={2}>
    <Toggle size='small' defaultPressed>
      Small
    </Toggle>
    <Toggle defaultPressed>Default</Toggle>
    <Toggle size='large' defaultPressed>
      Large
    </Toggle>
  </Inline>
)

export const Disabled = () => (
  <Inline gap={2}>
    <Toggle disabled>Wrap lines</Toggle>
    <Toggle disabled defaultPressed>
      Follow logs
    </Toggle>
  </Inline>
)
