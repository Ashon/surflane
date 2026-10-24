import * as React from 'react'
import {
  Button,
  Heading,
  Inline,
  Stack,
  Surface,
  Text,
  Toaster,
  createToaster,
  type ToastHelper,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// The page, with one Toaster. The preview calls its helper on mount, as the
// buttons would on click.
function App({
  run,
  layout,
}: {
  run: (toast: ToastHelper) => void
  layout?: 'stack' | 'list'
}) {
  const [toast] = React.useState(() => createToaster())
  React.useEffect(() => {
    run(toast)
    return () => toast.dismiss()
  }, [toast, run])
  return (
    <Surface surface='canvas' padding={6}>
      <Stack gap={4}>
        <Stack gap={1}>
          <Heading level={1} size='section'>
            Releases
          </Heading>
          <Text color='secondary'>checkout-api</Text>
        </Stack>
        <Inline gap={2}>
          <Button onClick={() => run(toast)}>Deploy</Button>
        </Inline>
      </Stack>
      <Toaster toast={toast} layout={layout} timeout={0} />
    </Surface>
  )
}

const stack = (toast: ToastHelper) => {
  toast('Copied deploy URL', { id: 'copied' })
  toast.info('Token expires in 7 days', {
    id: 'token',
    description: 'Rotate ci-deploy before Friday.',
  })
  toast.success('Deployed checkout-api', {
    id: 'deployed',
    description: 'Build 418 is live in us-east-1.',
  })
}
export const Default = () => <App run={stack} />

const list = (toast: ToastHelper) => {
  toast.error('Rollback failed', {
    id: 'rollback',
    description: 'billing-worker is still on build 311.',
  })
  toast.info('Environment archived', {
    id: 'archived',
    description: 'preview-pr-2214 stops billing tonight.',
    action: { label: 'Undo', onClick: () => toast.dismiss('archived') },
  })
}
export const List = () => <App run={list} layout='list' />

const loading = (toast: ToastHelper) => {
  toast.loading('Deploying billing-worker', {
    id: 'deploying',
    description: 'Step 3 of 5: running migrations.',
  })
}
export const Loading = () => <App run={loading} />
