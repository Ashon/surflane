import * as React from 'react'
import { Surface, Text, Toast } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

type Tone = 'neutral' | 'info' | 'success' | 'danger' | 'caution' | 'progress'
type Item = {
  id: string
  type: Tone
  title: string
  description?: string
  actionProps?: { children: string }
}

// One rendered toast: the parts the Toaster composes for each notification.
function Notifications() {
  const { toasts } = Toast.useToastManager()
  return toasts.map((item) => (
    <Toast.Root
      key={item.id}
      toast={item}
      tone={(item.type as Tone) ?? 'neutral'}
    >
      <Toast.Content>
        <Toast.Icon />
        <Toast.Text>
          <Toast.Title />
          <Toast.Description />
          <Toast.Action />
        </Toast.Text>
        <Toast.Close />
      </Toast.Content>
    </Toast.Root>
  ))
}

// A Provider and Viewport of the story's own. The viewport is fixed to the
// bottom-right corner of the app area behind it.
function Region({
  items,
  layout = 'list',
}: {
  items: Item[]
  layout?: 'stack' | 'list'
}) {
  const [manager] = React.useState(() => Toast.createToastManager())
  React.useEffect(() => {
    items.forEach((item) => manager.add({ ...item, timeout: 0 }))
  }, [manager, items])
  return (
    <Toast.Provider toastManager={manager} timeout={0}>
      <Surface style={{ minHeight: 360 }}>
        <Text variant='caption' color='secondary'>
          Deployments · checkout-api
        </Text>
      </Surface>
      <Toast.Viewport layout={layout} aria-label='Notifications'>
        <Notifications />
      </Toast.Viewport>
    </Toast.Provider>
  )
}

const tones: Item[] = [
  {
    id: 'deployed',
    type: 'success',
    title: 'Deployed checkout-api',
    description: 'Build 418 is live in us-east-1.',
  },
  {
    id: 'budget',
    type: 'caution',
    title: 'Error budget at 15%',
    description: 'search-indexer burned 9% in the last hour.',
  },
  {
    id: 'rollback',
    type: 'danger',
    title: 'Rollback failed',
    description: 'billing-worker is still on build 311.',
  },
]

export const Tones = () => <Region items={tones} />

export const WithAction = () => (
  <Region
    items={[
      {
        id: 'archived',
        type: 'info',
        title: 'Environment archived',
        description: 'preview-pr-2214 stops billing tonight.',
        actionProps: { children: 'Undo' },
      },
    ]}
  />
)

export const Loading = () => (
  <Region
    items={[
      {
        id: 'deploying',
        type: 'progress',
        title: 'Deploying billing-worker',
        description: 'Step 3 of 5: running migrations.',
      },
    ]}
  />
)

export const Stacked = () => (
  <Region
    layout='stack'
    items={[
      { id: 'copied', type: 'neutral', title: 'Copied deploy URL' },
      {
        id: 'export',
        type: 'success',
        title: 'Audit log export ready',
        description: '3 files, 18 MB.',
      },
      {
        id: 'token',
        type: 'info',
        title: 'Token expires in 7 days',
        description: 'Rotate ci-deploy before Friday.',
      },
    ]}
  />
)
