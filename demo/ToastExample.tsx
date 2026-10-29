import React, { useEffect, useRef, useState } from 'react'
import {
  Stack,
  Text,
  Field,
  Toast,
  Button,
  NativeSelect,
  Checkbox,
  InlineMessage,
  DirectionProvider,
  ChoiceLabel,
  Toaster,
  createToaster,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ToastExample'
// This manager is deliberately outside React, while the hook below reads its Provider state.
const anchoredManager = Toast.createToastManager<{ source: string }>()
// The preview's own helper, so its notifications stay apart from the catalog's.
const previewToast = createToaster()
export function ToastExample() {
  const t = text[useLocale().locale]
  const [presentation, setPresentation] = useState('stack')
  return (
    <Stack gap={5}>
      <Field.Root className='toast-duration'>
        <Field.Label>{t.presentationLabel}</Field.Label>
        <NativeSelect
          value={presentation}
          onChange={(event) => setPresentation(event.target.value)}
        >
          <option value='stack'>{t.presentationGlobalStack}</option>
          <option value='list'>{t.presentationExpandedList}</option>
          <option value='anchored'>{t.presentationAnchoredFeedback}</option>
        </NativeSelect>
      </Field.Root>
      {presentation !== 'anchored' ? (
        <ToastDemo
          key={presentation}
          layout={presentation === 'list' ? 'list' : 'stack'}
        />
      ) : (
        <Toast.Provider key='anchored' toastManager={anchoredManager} limit={1}>
          <AnchoredDemo />
        </Toast.Provider>
      )}
    </Stack>
  )
}
function AnchoredDemo() {
  const t = text[useLocale().locale]
  const anchor = useRef<HTMLButtonElement>(null)
  const { toasts } = Toast.useToastManager<{ source: string }>()
  return (
    <Stack gap={5}>
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
      <Text color='secondary'>{t.anchoredIntro}</Text>
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
                  <Toast.Close aria-label={t.dismiss} />
                </Toast.Content>
              </Toast.Root>
            </Toast.Positioner>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
    </Stack>
  )
}
function ToastDemo({ layout }: { layout: 'stack' | 'list' }) {
  const t = text[useLocale().locale]
  const [duration, setDuration] = useState(5000),
    [archived, setArchived] = useState(false),
    [fail, setFail] = useState(false),
    [error, setError] = useState(false),
    [rtl, setRtl] = useState(false)
  const sequence = useRef(0),
    timers = useRef(new Set<ReturnType<typeof setTimeout>>())
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      previewToast.dismiss()
    },
    [],
  )
  function addNotice() {
    sequence.current++
    previewToast.success(t.exportPreviewReady, {
      id: 'export-preview',
      description: t.preparedSampleExport(sequence.current),
      timeout: duration,
    })
  }
  function archive() {
    setArchived(true)
    previewToast.info(t.previewItemArchived, {
      id: 'archive-preview',
      description: t.undoRestores,
      timeout: 0,
      action: {
        label: t.undo,
        onClick: () => {
          setArchived(false)
          previewToast.dismiss('archive-preview')
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
    void previewToast
      .promise(promise, {
        loading: {
          title: t.preparingExportPreview,
          description: t.waitingForSampleTask,
        },
        success: {
          title: t.exportTaskComplete,
          description: t.sampleExportReady,
          timeout: duration,
        },
        error: {
          title: t.exportPreviewFailed,
          description: t.retryFromPersistentMessage,
        },
      })
      .catch(() => {})
  }
  return (
    <Stack gap={5}>
      <div className='toast-demo-settings'>
        <Field.Root className='toast-duration'>
          <Field.Label>{t.durationLabel}</Field.Label>
          <NativeSelect
            value={String(duration)}
            onChange={(event) => setDuration(Number(event.target.value))}
          >
            <option value='5000'>{t.duration5s}</option>
            <option value='1500'>{t.duration1_5s}</option>
            <option value='0'>{t.durationUntilDismissed}</option>
          </NativeSelect>
        </Field.Root>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={fail} onCheckedChange={setFail}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.failAsyncPreview}
        </ChoiceLabel>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={rtl} onCheckedChange={setRtl}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.rtlNotifications}
        </ChoiceLabel>
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
              previewToast(t.batchNotification(n), {
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
            previewToast.warning(t.attentionPreview, {
              id: 'urgent-preview',
              description: t.needsImmediateAttention,
              priority: 'high',
              timeout: 0,
            })
          }
        >
          {t.showUrgentNotice}
        </Button>
        <Button variant='outline' onClick={() => previewToast.dismiss()}>
          {t.dismissAll}
        </Button>
      </div>
      <Text color='secondary'>{t.itemStatus(archived)}</Text>
      {archived && (
        <Button
          variant='outline'
          onClick={() => {
            setArchived(false)
            previewToast.dismiss('archive-preview')
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
        <Toaster
          toast={previewToast}
          layout={layout}
          dir={rtl ? 'rtl' : 'ltr'}
          label={t.previewNotificationsLabel}
          closeLabel={t.dismissNotification}
          swipeDirection={rtl ? 'left' : 'right'}
        />
      </DirectionProvider>
    </Stack>
  )
}
