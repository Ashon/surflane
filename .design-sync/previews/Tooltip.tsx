import * as React from 'react'
import {
  Button,
  Icon,
  Inline,
  Stack,
  Surface,
  Text,
  Tooltip,
  TooltipProvider,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// A tooltip shows on hover and keyboard focus. The preview focuses one trigger
// on mount, as Tab would, so its tooltip renders open.
function useFocusOnMount(id: string) {
  React.useEffect(() => {
    document.getElementById(id)?.focus()
  }, [id])
}

// The default side is right: a rail of icon buttons, each named by aria-label.
export const Default = () => {
  useFocusOnMount('rail-deployments')
  return (
    <Surface surface='canvas' padding={6}>
      <TooltipProvider>
        <Inline gap={4}>
          <Surface padding={2}>
            <Stack gap={2}>
              <Tooltip label='Services'>
                <Button variant='ghost' size='icon' aria-label='Services'>
                  <Icon name='monitor' />
                </Button>
              </Tooltip>
              <Tooltip label='Deployments'>
                <Button
                  id='rail-deployments'
                  variant='ghost'
                  size='icon'
                  aria-label='Deployments'
                >
                  <Icon name='upload' />
                </Button>
              </Tooltip>
              <Tooltip label='Schedules'>
                <Button variant='ghost' size='icon' aria-label='Schedules'>
                  <Icon name='calendar' />
                </Button>
              </Tooltip>
              <Tooltip label='Settings'>
                <Button variant='ghost' size='icon' aria-label='Settings'>
                  <Icon name='settings' />
                </Button>
              </Tooltip>
            </Stack>
          </Surface>
        </Inline>
      </TooltipProvider>
    </Surface>
  )
}

// shortcut sets a keyboard shortcut apart after the label.
export const Shortcut = () => {
  useFocusOnMount('rerun')
  return (
    <Surface surface='canvas' padding={6}>
      <TooltipProvider>
        <Stack gap={4}>
          <Text color='secondary'>
            Pipeline 2291 failed at the integration step.
          </Text>
          <Inline gap={2}>
            <Tooltip
              label='Run the pipeline again'
              shortcut='⌘⇧R'
              side='bottom'
              align='start'
            >
              <Button id='rerun' variant='outline'>
                <Icon name='play' />
                Rerun
              </Button>
            </Tooltip>
            <Tooltip label='Inspect the build logs' side='bottom'>
              <Button variant='outline'>Logs</Button>
            </Tooltip>
          </Inline>
        </Stack>
      </TooltipProvider>
    </Surface>
  )
}

export const Top = () => {
  useFocusOnMount('copy-url')
  return (
    <Surface surface='canvas' padding={6}>
      <TooltipProvider>
        <Stack gap={4}>
          <Text color='secondary'>Preview URL</Text>
          <Inline gap={2}>
            <Text variant='mono'>pr-2214.preview.checkout.dev</Text>
            <Tooltip label='Copy preview URL' side='top'>
              <Button
                id='copy-url'
                variant='ghost'
                size='icon-small'
                aria-label='Copy preview URL'
              >
                <Icon name='copy' />
              </Button>
            </Tooltip>
          </Inline>
        </Stack>
      </TooltipProvider>
    </Surface>
  )
}
