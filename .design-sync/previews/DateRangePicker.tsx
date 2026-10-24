import { DateLocaleProvider, DateRangePicker } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <DateLocaleProvider locale='en-US'>
    <DateRangePicker
      label='Production release window'
      startName='windowStart'
      endName='windowEnd'
      defaultOpen
    />
  </DateLocaleProvider>
)

export const Required = () => (
  <DateLocaleProvider locale='en-US'>
    <DateRangePicker
      label='Incident report period'
      startName='from'
      endName='to'
      isRequired
      description='Covers every alert routed to team:platform.'
    />
  </DateLocaleProvider>
)

export const Invalid = () => (
  <DateLocaleProvider locale='en-US'>
    <DateRangePicker
      label='Log retention export'
      startName='from'
      endName='to'
      isInvalid
      errorMessage='Exports can cover at most 31 days.'
    />
  </DateLocaleProvider>
)

export const Disabled = () => (
  <DateLocaleProvider locale='en-US'>
    <DateRangePicker
      label='Change freeze'
      startName='from'
      endName='to'
      isDisabled
      description='Only the release manager can move the freeze.'
    />
  </DateLocaleProvider>
)
