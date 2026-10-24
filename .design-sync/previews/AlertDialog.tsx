import * as React from 'react'
import {
  AlertDialog,
  Button,
  Heading,
  Inline,
  Stack,
  StatusBadge,
  Surface,
  Text,
} from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

// The settings page the confirmation opens over.
const Page = ({
  title,
  meta,
  children,
}: {
  title: string
  meta: string
  children: React.ReactNode
}) => (
  <Surface surface='canvas' padding={6}>
    <Stack gap={4}>
      <Stack gap={1}>
        <Inline gap={2}>
          <Heading level={1} size='section'>
            {title}
          </Heading>
          <StatusBadge tone='neutral'>Idle</StatusBadge>
        </Inline>
        <Text color='secondary'>{meta}</Text>
      </Stack>
      <Inline gap={2}>{children}</Inline>
    </Stack>
  </Surface>
)

// Focus starts on the safe cancel action; the destructive action is named.
export const DeleteEnvironment = () => {
  const cancel = React.useRef<HTMLButtonElement>(null)
  return (
    <Page
      title='staging-eu'
      meta='6 services · eu-west-1 · last deploy 3 days ago'
    >
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Trigger render={<Button variant='destructive' />}>
          Delete environment
        </AlertDialog.Trigger>
        <AlertDialog.Content initialFocus={cancel}>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete staging-eu?</AlertDialog.Title>
            <AlertDialog.Description>
              This removes its 6 services, their secrets and 14 days of logs. It
              can’t be undone.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close
              ref={cancel}
              render={<Button variant='outline' />}
            >
              Keep environment
            </AlertDialog.Close>
            <Button variant='destructive'>Delete environment</Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Page>
  )
}

export const RevokeToken = () => {
  const cancel = React.useRef<HTMLButtonElement>(null)
  return (
    <Page
      title='ci-deploy'
      meta='Deploy token · used by 4 pipelines · created by platform-team'
    >
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Trigger render={<Button variant='outline' />}>
          Revoke token
        </AlertDialog.Trigger>
        <AlertDialog.Content initialFocus={cancel}>
          <AlertDialog.Header>
            <AlertDialog.Title>Revoke ci-deploy?</AlertDialog.Title>
            <AlertDialog.Description>
              4 pipelines use this token. Their next runs fail until they get a
              new one.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close
              ref={cancel}
              render={<Button variant='outline' />}
            >
              Keep token
            </AlertDialog.Close>
            <Button variant='destructive'>Revoke token</Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Page>
  )
}

// size='default' gives a longer confirmation Dialog's width.
export const SizeDefault = () => {
  const cancel = React.useRef<HTMLButtonElement>(null)
  return (
    <Page title='billing-worker' meta='Production · us-east-1 · build 512'>
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Trigger render={<Button variant='outline' />}>
          Roll back
        </AlertDialog.Trigger>
        <AlertDialog.Content size='default' initialFocus={cancel}>
          <AlertDialog.Header>
            <AlertDialog.Title>
              Roll back production to build 511?
            </AlertDialog.Title>
            <AlertDialog.Description>
              Build 512’s database migration drops the legacy_invoices table.
              Rolling back restores the code but not the dropped rows; restore
              them from the 02:00 UTC snapshot first.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close
              ref={cancel}
              render={<Button variant='outline' />}
            >
              Stay on build 512
            </AlertDialog.Close>
            <Button variant='destructive'>Roll back to 511</Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Page>
  )
}
