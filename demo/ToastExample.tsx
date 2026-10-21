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
import { useLocale } from './i18n'
import { text } from './i18n/pages/ToastExample'
// This manager is deliberately outside React, while the hook below reads its Provider state.
const anchoredManager = Toast.createToastManager<{ source: string }>()
export function ToastExample() {
  const t = text[useLocale().locale]
  const [presentation, setPresentation] = useState('stack')
  return (
    <div className='example-stack'>
      <label className='toast-duration'>
        {t.presentationLabel}
        <NativeSelect
          value={presentation}
          onChange={(event) => setPresentation(event.target.value)}
        >
          <option value='stack'>{t.presentationGlobalStack}</option>
          <option value='list'>{t.presentationExpandedList}</option>
          <option value='anchored'>{t.presentationAnchoredFeedback}</option>
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
  const t = text[useLocale().locale]
  const anchor = useRef<HTMLButtonElement>(null)
  const { toasts } = Toast.useToastManager<{ source: string }>()
  return (
    <div className='example-stack'>
      <Button
        ref={anchor}
        onClick={() =>
          anchoredManager.add({
            id: 'anchored-preview',
            title: t.linkFeedbackTitle,
            description: t.linkFeedbackDescription,
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
        {t.showAnchoredFeedback}
      </Button>
      <p>{t.anchoredIntro}</p>
      <Toast.Portal>
        <Toast.Viewport layout='anchored' aria-label={t.anchoredViewportLabel}>
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
  const t = text[useLocale().locale]
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
      title: t.exportPreviewReady,
      description: t.preparedSampleExport(sequence.current),
      type: 'success',
      timeout: duration,
      data: { source: 'export-preview' },
    })
  }
  function archive() {
    setArchived(true)
    manager.add({
      id: 'archive-preview',
      title: t.previewItemArchived,
      description: t.undoRestores,
      type: 'info',
      timeout: 0,
      actionProps: {
        children: t.undo,
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
          reject(new Error(t.previewExportFailed))
        } else resolve()
      }, 500)
      timers.current.add(timer)
    })
    void manager
      .promise(promise, {
        loading: {
          title: t.preparingExportPreview,
          description: t.waitingForSampleTask,
          type: 'progress',
          timeout: 0,
        },
        success: {
          title: t.exportTaskComplete,
          description: t.sampleExportReady,
          type: 'success',
          timeout: duration,
        },
        error: {
          title: t.exportPreviewFailed,
          description: t.retryFromPersistentMessage,
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
          {t.durationLabel}
          <NativeSelect
            value={String(duration)}
            onChange={(event) => setDuration(Number(event.target.value))}
          >
            <option value='5000'>{t.duration5s}</option>
            <option value='1500'>{t.duration1_5s}</option>
            <option value='0'>{t.durationUntilDismissed}</option>
          </NativeSelect>
        </label>
        <label className='pui-choice-label'>
          <Checkbox.Root checked={fail} onCheckedChange={setFail}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          {t.failAsyncPreview}
        </label>
        <label className='pui-choice-label'>
          <Checkbox.Root checked={rtl} onCheckedChange={setRtl}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          {t.rtlNotifications}
        </label>
      </div>
      <div className='toast-demo-actions'>
        <Button onClick={addNotice}>{t.showSuccess}</Button>
        <Button variant='outline' onClick={archive}>
          {t.archivePreviewItem}
        </Button>
        <Button variant='outline' onClick={task}>
          {t.previewAsyncTask}
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            for (let n = 1; n <= 4; n++)
              manager.add({
                title: t.batchNotification(n),
                description: t.newest3StayVisible,
                timeout: duration,
              })
          }}
        >
          {t.showBatch}
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            manager.add({
              id: 'urgent-preview',
              title: t.attentionPreview,
              description: t.needsImmediateAttention,
              type: 'caution',
              priority: 'high',
              timeout: 0,
            })
          }
        >
          {t.showUrgentNotice}
        </Button>
        <Button variant='outline' onClick={() => manager.close()}>
          {t.dismissAll}
        </Button>
      </div>
      <p>{t.itemStatus(archived)}</p>
      {archived && (
        <Button
          variant='outline'
          onClick={() => {
            setArchived(false)
            manager.close('archive-preview')
          }}
        >
          {t.restorePreviewItem}
        </Button>
      )}
      {error && (
        <InlineMessage.Root tone='danger'>
          <InlineMessage.Icon tone='danger' />
          <InlineMessage.Content>
            <InlineMessage.Title>
              {t.exportPreviewNeedsAttention}
            </InlineMessage.Title>
            <InlineMessage.Description>
              {t.taskFailedMessage}
            </InlineMessage.Description>
            <InlineMessage.Actions>
              <Button variant='outline' onClick={task}>
                {t.retryExportPreview}
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
            aria-label={t.previewNotificationsLabel}
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
