import { Stack, TimeField } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// A wall-clock time in the shape of @internationalized/date's Time
// (hour, minute, second, millisecond), which the field reads.
const time = (hour: number, minute = 0, second = 0) =>
  ({ hour, minute, second, millisecond: 0 }) as never

export const Default = () => (
  <Stack style={{ maxWidth: '20rem' }}>
    <TimeField
      label='Maintenance window starts'
      name='windowStart'
      defaultValue={time(2, 30)}
      hourCycle={24}
      description='Server time, 24-hour clock.'
    />
  </Stack>
)

export const TwelveHour = () => (
  <Stack style={{ maxWidth: '20rem' }}>
    <TimeField
      label='Daily report time'
      name='reportTime'
      defaultValue={time(9, 0)}
      hourCycle={12}
    />
  </Stack>
)

export const Seconds = () => (
  <Stack style={{ maxWidth: '20rem' }}>
    <TimeField
      label='Cron offset'
      name='offset'
      defaultValue={time(0, 15, 30)}
      granularity='second'
      hourCycle={24}
      description='When each hourly job starts.'
    />
  </Stack>
)

export const Empty = () => (
  <Stack style={{ maxWidth: '20rem' }}>
    <TimeField
      label='Freeze starts'
      name='freezeStart'
      hourCycle={24}
      isRequired
    />
  </Stack>
)

export const Invalid = () => (
  <Stack style={{ maxWidth: '20rem' }}>
    <TimeField
      label='Deploy window starts'
      name='deployStart'
      defaultValue={time(19, 45)}
      hourCycle={24}
      isInvalid
      errorMessage='Deploys must start between 09:00 and 18:00.'
    />
  </Stack>
)

export const ReadOnlyAndDisabled = () => (
  <Stack gap={4} style={{ maxWidth: '20rem' }}>
    <TimeField
      label='Backup runs at'
      name='backup'
      defaultValue={time(3, 0)}
      hourCycle={24}
      isReadOnly
    />
    <TimeField
      label='Scale-down at'
      name='scaleDown'
      defaultValue={time(22, 0)}
      hourCycle={24}
      isDisabled
    />
  </Stack>
)
