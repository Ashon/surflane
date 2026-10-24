import { DateLocaleProvider, DateRangePicker, parseDate } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// A range in the shape the picker reads: @internationalized/date values, which
// the preview shim exposes on '@surflane/ui'.
const range = (start: string, end: string) => ({
  start: parseDate(start),
  end: parseDate(end),
})

export const Default = () => (
  <DateLocaleProvider locale='en-US'>
    <DateRangePicker
      label='Production release window'
      startName='windowStart'
      endName='windowEnd'
      defaultValue={range('2026-10-26', '2026-10-30')}
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
      description='Required. Covers every alert routed to team:platform.'
    />
  </DateLocaleProvider>
)

export const Invalid = () => (
  <DateLocaleProvider locale='en-US'>
    <DateRangePicker
      label='Log retention export'
      startName='from'
      endName='to'
      defaultValue={range('2026-08-01', '2026-09-30')}
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
      defaultValue={range('2026-12-21', '2027-01-04')}
      isDisabled
      description='Only the release manager can move the freeze.'
    />
  </DateLocaleProvider>
)
