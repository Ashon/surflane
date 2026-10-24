import { DateLocaleProvider, DatePicker } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => (
  <DateLocaleProvider locale='en-US'>
    <DatePicker label='Nightly migration date' name='runDate' defaultOpen />
  </DateLocaleProvider>
)

export const WithTime = () => (
  <DateLocaleProvider locale='en-US'>
    <DatePicker
      label='Maintenance starts'
      name='maintenanceStart'
      granularity='minute'
      hourCycle={24}
      description='Local time in the cluster’s region.'
    />
  </DateLocaleProvider>
)

export const Invalid = () => (
  <DateLocaleProvider locale='en-US'>
    <DatePicker
      label='Certificate renewal'
      name='renewal'
      isRequired
      isInvalid
      errorMessage='Pick a date before the current certificate expires.'
    />
  </DateLocaleProvider>
)

export const Disabled = () => (
  <DateLocaleProvider locale='en-US'>
    <DatePicker
      label='Freeze ends'
      name='freezeEnd'
      isDisabled
      description='Set by the release manager.'
    />
  </DateLocaleProvider>
)

export const KoreanLocale = () => (
  <DateLocaleProvider locale='ko-KR'>
    <div lang='ko-KR'>
      <DatePicker
        label='배포 날짜'
        name='deployDate'
        description='서울 리전 기준입니다.'
      />
    </div>
  </DateLocaleProvider>
)
