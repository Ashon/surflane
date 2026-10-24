import { Icon, Inline, LinkButton } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

export const Variants = () => (
  <Inline gap={2}>
    <LinkButton href='#' variant='primary'>
      New deployment
    </LinkButton>
    <LinkButton href='#' variant='secondary'>
      View runs
    </LinkButton>
    <LinkButton href='#' variant='outline'>
      Open settings
    </LinkButton>
    <LinkButton href='#' variant='ghost'>
      Back to services
    </LinkButton>
  </Inline>
)

export const Sizes = () => (
  <Inline gap={2}>
    <LinkButton href='#' variant='outline' size='small'>
      Docs
    </LinkButton>
    <LinkButton href='#' variant='outline'>
      Docs
    </LinkButton>
    <LinkButton href='#' variant='outline' size='large'>
      Docs
    </LinkButton>
  </Inline>
)

export const WithIcon = () => (
  <Inline gap={2}>
    <LinkButton href='#' variant='primary'>
      <Icon name='play' />
      Open pipeline
    </LinkButton>
    <LinkButton href='#' variant='outline' target='_blank' rel='noreferrer'>
      Status page
      <Icon name='external-link' />
    </LinkButton>
  </Inline>
)

export const CallToAction = () => (
  <Inline gap={2}>
    <LinkButton href='#' variant='primary' size='large'>
      Browse components
    </LinkButton>
    <LinkButton href='#' variant='outline' size='large'>
      Quick start
    </LinkButton>
  </Inline>
)
