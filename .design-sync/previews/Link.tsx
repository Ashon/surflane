import { Link, Stack, Text } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Default = () => <Link href='#'>View deployment logs</Link>

export const InText = () => (
  <Text>
    checkout-api failed its last health check. Read the{' '}
    <Link href='#'>incident runbook</Link> or open the{' '}
    <Link href='#'>service dashboard</Link> before rolling back.
  </Text>
)

export const External = () => (
  <Link href='#' target='_blank' rel='noreferrer'>
    Status page (opens in a new tab)
  </Link>
)

export const LinkList = () => (
  <Stack gap={2}>
    <Link href='#'>Environment variables</Link>
    <Link href='#'>Deploy hooks</Link>
    <Link href='#'>Access tokens</Link>
  </Stack>
)
