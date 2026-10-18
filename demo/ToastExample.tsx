import React, { useEffect, useRef, useState } from 'react'
import {
  Toast,
  Button,
  NativeSelect,
  Checkbox,
  InlineMessage,
  DirectionProvider,
  type StatusTone,
} from '@surflane/ui'
// This manager is deliberately outside React, while the hook below reads its Provider state.
const anchoredManager = Toast.createToastManager<{ source: string }>()
export function ToastExample() {
  const [presentation, setPresentation] = useState('stack')
  return (
    <div className='example-stack'>
      <label className='toast-duration'>
        Notification presentation
        <NativeSelect
          value={presentation}
          onChange={(event) => setPresentation(event.target.value)}
        >
          <option value='stack'>Global stack</option>
          <option value='list'>Expanded list</option>
          <option value='anchored'>Anchored feedback</option>
        </NativeSelect>
      </label>
      {presentation !== 'anchored' ? (
        <Toast.Provider key={presentation} timeout={5000} limit={3}>
          <ToastDemo layout={presentation === 'list' ? 'list' : 'stack'} />
        </Toast.Provider>
      ) : (
        <Toast.Provider key='anchored' toastManager={anchoredManager} limit={1}>
          <AnchoredDemo />
        </Toast.Provider>
      )}
    </div>
  )
}
function AnchoredDemo() {
  const anchor = useRef<HTMLButtonElement>(null)
  const { toasts } = Toast.useToastManager<{ source: string }>()
  return (
    <div className='example-stack'>
      <Button
        ref={anchor}
        onClick={() =>
          anchoredManager.add({
            id: 'anchored-preview',
            title: 'Link feedback preview',
            description: 'This notification stays near its trigger.',
            timeout: 0,
            data: { source: 'outside-react-manager' },
            positionerProps: {
              anchor: anchor.current,
              side: 'top',
              sideOffset: 8,
              collisionPadding: 12,
            },
          })
        }
      >
        Show anchored feedback
      </Button>
      <p>
        Anchored notifications use a separate Provider. This example mounts one
        Provider at a time.
      </p>
      <Toast.Portal>
        <Toast.Viewport
          layout='anchored'
          aria-label='Anchored preview notifications'
        >
          {toasts.map((toast) => (
            <Toast.Positioner
              key={toast.id}
              toast={toast}
              {...toast.positionerProps}
            >
              <Toast.Root toast={toast} swipeDirection={[]}>
                <Toast.Content>
                  <Toast.Text>
                    <Toast.Title />
                    <Toast.Description />
                  </Toast.Text>
                  <Toast.Close />
                </Toast.Content>
              </Toast.Root>
            </Toast.Positioner>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
    </div>
  )
}
function ToastDemo({ layout }: { layout: 'stack' | 'list' }) {
  const manager = Toast.useToastManager<{ source: string }>()
  const [duration, setDuration] = useState(5000),
    [archived, setArchived] = useState(false),
    [fail, setFail] = useState(false),
    [error, setError] = useState(false),
    [rtl, setRtl] = useState(false)
  const sequence = useRef(0),
    timers = useRef(new Set<ReturnType<typeof setTimeout>>())
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  function addNotice() {
    sequence.current++
    manager.add({
      id: 'export-preview',
      title: 'Export preview ready',
      description: `Prepared sample export ${sequence.current}.`,
      type: 'success',
      timeout: duration,
      data: { source: 'export-preview' },
    })
  }
  function archive() {
    setArchived(true)
    manager.add({
      id: 'archive-preview',
      title: 'Preview item archived',
      description: 'Undo restores the local preview item.',
      type: 'info',
      timeout: 0,
      actionProps: {
        children: 'Undo',
        onClick: () => {
          setArchived(false)
          manager.close('archive-preview')
        },
      },
    })
  }
  function task() {
    setError(false)
    const promise = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        timers.current.delete(timer)
        if (fail) {
          setError(true)
          reject(new Error('Preview export failed'))
        } else resolve()
      }, 500)
      timers.current.add(timer)
    })
    void manager
      .promise(promise, {
        loading: {
          title: 'Preparing export preview',
          description: 'Waiting for the sample task.',
          type: 'progress',
          timeout: 0,
        },
        success: {
          title: 'Export task complete',
          description: 'The sample export is ready.',
          type: 'success',
          timeout: duration,
        },
        error: {
          title: 'Export preview failed',
          description: 'Retry from the persistent message on this page.',
          type: 'error',
          timeout: 0,
        },
      })
      .catch(() => {})
  }
  return (
    <div className='example-stack'>
      <div className='toast-demo-settings'>
        <label className='toast-duration'>
          Notification duration
          <NativeSelect
            value={String(duration)}
            onChange={(event) => setDuration(Number(event.target.value))}
          >
            <option value='5000'>5 seconds</option>
            <option value='1500'>1.5 seconds — timing preview</option>
            <option value='0'>Until dismissed</option>
          </NativeSelect>
        </label>
        <label className='pui-choice-label'>
          <Checkbox.Root checked={fail} onCheckedChange={setFail}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          Fail async preview
        </label>
        <label className='pui-choice-label'>
          <Checkbox.Root checked={rtl} onCheckedChange={setRtl}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          RTL notifications
        </label>
      </div>
      <div className='toast-demo-actions'>
        <Button onClick={addNotice}>Show success</Button>
        <Button variant='outline' onClick={archive}>
          Archive preview item
        </Button>
        <Button variant='outline' onClick={task}>
          Preview async task
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            for (let n = 1; n <= 4; n++)
              manager.add({
                title: `Batch notification ${n}`,
                description: 'The newest 3 stay visible.',
                timeout: duration,
              })
          }}
        >
          Show batch
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            manager.add({
              id: 'urgent-preview',
              title: 'Attention preview',
              description: 'This notification needs immediate attention.',
              type: 'caution',
              priority: 'high',
              timeout: 0,
            })
          }
        >
          Show urgent notice
        </Button>
        <Button variant='outline' onClick={() => manager.close()}>
          Dismiss all
        </Button>
      </div>
      <p>
        Item status: {archived ? 'archived' : 'available'}. Repeated success
        updates one notification. F6 moves focus to notifications. Escape closes
        the focused notification.
      </p>
      {archived && (
        <Button
          variant='outline'
          onClick={() => {
            setArchived(false)
            manager.close('archive-preview')
          }}
        >
          Restore preview item
        </Button>
      )}
      {error && (
        <InlineMessage.Root tone='danger'>
          <InlineMessage.Icon tone='danger' />
          <InlineMessage.Content>
            <InlineMessage.Title>
              Export preview needs attention
            </InlineMessage.Title>
            <InlineMessage.Description>
              The task failed. This message remains after the toast closes.
            </InlineMessage.Description>
            <InlineMessage.Actions>
              <Button variant='outline' onClick={task}>
                Retry export preview
              </Button>
            </InlineMessage.Actions>
          </InlineMessage.Content>
        </InlineMessage.Root>
      )}
      <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
        <Toast.Portal>
          <Toast.Viewport
            layout={layout}
            dir={rtl ? 'rtl' : 'ltr'}
            aria-label='Preview notifications'
          >
            {manager.toasts.map((toast) => {
              const tone: StatusTone =
                toast.type === 'error'
                  ? 'danger'
                  : toast.type === 'success'
                    ? 'success'
                    : toast.type === 'progress'
                      ? 'progress'
                      : toast.type === 'caution'
                        ? 'caution'
                        : 'neutral'
              return (
                <Toast.Root
                  key={toast.id}
                  toast={toast}
                  tone={tone}
                  swipeDirection={rtl ? 'left' : 'right'}
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
              )
            })}
          </Toast.Viewport>
        </Toast.Portal>
      </DirectionProvider>
    </div>
  )
}
