import { Avatar, Inline, Stack, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// A neutral profile picture, inlined so the preview needs no network.
const portrait =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#e2ebf2"/><circle cx="48" cy="35" r="18" fill="#3b434b"/><path d="M12 96v-7a36 36 0 0 1 72 0v7" fill="#3b434b"/></svg>',
  )

export const Sizes = () => (
  <Inline gap={3}>
    <Avatar.Root role='img' aria-label='Mina Park' size='small'>
      <Avatar.Fallback aria-hidden='true'>MP</Avatar.Fallback>
    </Avatar.Root>
    <Avatar.Root role='img' aria-label='Mina Park'>
      <Avatar.Fallback aria-hidden='true'>MP</Avatar.Fallback>
    </Avatar.Root>
    <Avatar.Root role='img' aria-label='Mina Park' size='large'>
      <Avatar.Fallback aria-hidden='true'>MP</Avatar.Fallback>
    </Avatar.Root>
  </Inline>
)

export const ImageAndFallbacks = () => (
  <Inline gap={3}>
    <Avatar.Root role='img' aria-label='Daniel Okafor' size='large'>
      <Avatar.Image src={portrait} alt='' />
      <Avatar.Fallback aria-hidden='true'>DO</Avatar.Fallback>
    </Avatar.Root>
    <Avatar.Root role='img' aria-label='Sofia Reyes' size='large'>
      <Avatar.Fallback aria-hidden='true'>SR</Avatar.Fallback>
    </Avatar.Root>
    <Avatar.Root role='img' aria-label='Deploy bot' size='large'>
      <Avatar.Fallback aria-hidden='true' />
    </Avatar.Root>
  </Inline>
)

export const WithStatus = () => (
  <Inline gap={3}>
    <Avatar.Root role='img' aria-label='Mina Park' aria-description='On call'>
      <Avatar.Image src={portrait} alt='' />
      <Avatar.Fallback aria-hidden='true'>MP</Avatar.Fallback>
      <Avatar.Status aria-hidden='true' />
    </Avatar.Root>
    <Avatar.Root
      role='img'
      aria-label='Jonas Weber'
      aria-description='On call'
      size='large'
    >
      <Avatar.Fallback aria-hidden='true'>JW</Avatar.Fallback>
      <Avatar.Status aria-hidden='true' />
    </Avatar.Root>
  </Inline>
)

const rotation = [
  { initials: 'MP', name: 'Mina Park', role: 'Primary on call, platform-core' },
  { initials: 'JW', name: 'Jonas Weber', role: 'Secondary, payments' },
  { initials: 'AL', name: 'Aisha Leclerc', role: 'Incident commander' },
]

export const OnCallRoster = () => (
  <Stack gap={3}>
    {rotation.map((person, index) => (
      <Inline key={person.name} gap={3}>
        <Avatar.Root size='default'>
          <Avatar.Fallback aria-hidden='true'>
            {person.initials}
          </Avatar.Fallback>
          {index === 0 && <Avatar.Status aria-hidden='true' />}
        </Avatar.Root>
        <Stack gap={0}>
          <Text weight='medium'>{person.name}</Text>
          <Text variant='caption' color='muted'>
            {person.role}
          </Text>
        </Stack>
      </Inline>
    ))}
  </Stack>
)
