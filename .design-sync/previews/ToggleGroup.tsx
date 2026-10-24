import { Icon, Toggle, ToggleGroup } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const SingleChoice = () => (
  <ToggleGroup aria-label='Time range' defaultValue={['24h']}>
    <Toggle value='1h'>1h</Toggle>
    <Toggle value='24h'>24h</Toggle>
    <Toggle value='7d'>7d</Toggle>
    <Toggle value='30d'>30d</Toggle>
  </ToggleGroup>
)

export const Multiple = () => (
  <ToggleGroup
    multiple
    aria-label='Visible log levels'
    defaultValue={['errors', 'warnings']}
  >
    <Toggle value='errors'>
      <Icon name='alert' />
      Errors
    </Toggle>
    <Toggle value='warnings'>
      <Icon name='warning' />
      Warnings
    </Toggle>
    <Toggle value='info'>
      <Icon name='info' />
      Info
    </Toggle>
  </ToggleGroup>
)

export const WithDisabledItem = () => (
  <ToggleGroup aria-label='Log source' defaultValue={['live']}>
    <Toggle value='live'>Live</Toggle>
    <Toggle value='replay'>Replay</Toggle>
    <Toggle value='archive' disabled>
      Archive
    </Toggle>
  </ToggleGroup>
)

export const Vertical = () => (
  <ToggleGroup
    orientation='vertical'
    aria-label='Dashboard layout'
    defaultValue={['list']}
  >
    <Toggle value='list'>List</Toggle>
    <Toggle value='grid'>Grid</Toggle>
    <Toggle value='timeline'>Timeline</Toggle>
  </ToggleGroup>
)

export const Disabled = () => (
  <ToggleGroup
    disabled
    aria-label='Environment view'
    defaultValue={['production']}
  >
    <Toggle value='staging'>Staging</Toggle>
    <Toggle value='production'>Production</Toggle>
  </ToggleGroup>
)
