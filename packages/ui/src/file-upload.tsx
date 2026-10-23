'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { Field } from './field.js'
import { Button } from './button.js'
import { Progress } from './progress.js'
import { StatusBadge } from './badge.js'
import { skin } from './parts.js'
import { useResetValue, useRootRef } from './form-state.js'
export type UploadState =
  'ready' | 'uploading' | 'success' | 'error' | 'canceled'
export type UploadTransport = (
  file: File,
  context: {
    signal: AbortSignal
    onProgress: (percent: number | null) => void
  },
) => Promise<void>
export type FileRejection = {
  file: File
  reason: 'type' | 'size' | 'count' | 'duplicate'
}
export type FileChangeDetails = {
  reason: 'select' | 'drop' | 'remove'
  isCanceled: boolean
  cancel: () => void
}
export type FileUploadLabels = {
  choose: string
  drop: string
  upload: string
  retry: string
  cancel: string
  remove: string
  status: Record<UploadState, string>
  rejection: (rejection: FileRejection) => string
  changed: (count: number) => string
  complete: (file: File) => string
  canceled: (file: File) => string
  failed: (file: File) => string
  reset: string
  progress: (file: File) => string
  /** Shown when an upload fails and getUploadError gives no message. */
  uploadError: string
  /** A file's size, as the list shows it. */
  size: (bytes: number) => string
  /** A file's action button name, given the action's text and the file, so a
   * language can put the file name first. */
  fileAction: (action: string, file: File) => string
}
const labelsDefault: FileUploadLabels = {
  choose: 'Choose files',
  drop: 'or drop files here',
  upload: 'Upload',
  retry: 'Retry',
  cancel: 'Cancel',
  remove: 'Remove',
  status: {
    ready: 'Ready',
    uploading: 'Uploading',
    success: 'Uploaded',
    error: 'Failed',
    canceled: 'Canceled',
  },
  rejection: ({ file, reason }) =>
    `${file.name}: ${reason === 'type' ? 'file type is not accepted' : reason === 'size' ? 'file is too large' : reason === 'count' ? 'file limit reached' : 'file is already selected'}.`,
  changed: (count) => `${count} file${count === 1 ? '' : 's'} selected.`,
  complete: (file) => `${file.name}: upload complete.`,
  canceled: (file) => `${file.name}: upload canceled.`,
  failed: (file) => `${file.name}: upload failed.`,
  reset: 'Files reset.',
  progress: (file) => `${file.name} upload progress`,
  uploadError: 'Upload failed. Try again.',
  size: (bytes) => {
    const unit = bytes >= 1024 * 1024 ? 'MB' : bytes >= 1024 ? 'KB' : 'B'
    return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(bytes / (unit === 'MB' ? 1024 * 1024 : unit === 'KB' ? 1024 : 1))} ${unit}`
  },
  fileAction: (action, file) => `${action} ${file.name}`,
}
export type FileUploadProps = Omit<
  React.ComponentPropsWithoutRef<typeof Field.Root>,
  'children' | 'name' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop'
> &
  Pick<
    React.HTMLAttributes<HTMLDivElement>,
    'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop'
  > & {
    label: React.ReactNode
    description?: React.ReactNode
    name?: string
    form?: string
    capture?: React.InputHTMLAttributes<HTMLInputElement>['capture']
    accept?: string
    multiple?: boolean
    required?: boolean
    maxFiles?: number
    maxFileSize?: number
    files?: readonly File[]
    defaultFiles?: readonly File[]
    onFilesChange?: (files: File[], details: FileChangeDetails) => void
    onReject?: (rejections: FileRejection[]) => void
    transport?: UploadTransport
    getUploadError?: (error: unknown) => string
    labels?: Partial<Omit<FileUploadLabels, 'status'>> & {
      status?: Partial<FileUploadLabels['status']>
    }
  }
type Metadata = {
  status: UploadState
  progress: number | null
  error?: string
}
type Request = { controller: AbortController }
function signature(file: File) {
  return JSON.stringify([file.name, file.size, file.type, file.lastModified])
}
function accepts(file: File, accept: string) {
  const rules = accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
  return (
    !rules.length ||
    rules.some((rule) =>
      rule.startsWith('.')
        ? file.name.toLowerCase().endsWith(rule)
        : rule.endsWith('/*')
          ? file.type.toLowerCase().startsWith(rule.slice(0, -1))
          : file.type.toLowerCase() === rule,
    )
  )
}
/** Native selection/validation and a cancellable transport adapter; no network request is built in. */
export const FileUpload = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  FileUploadProps
>(function FileUpload(
  {
    label,
    description,
    name,
    form,
    accept = '',
    capture,
    multiple = false,
    required = false,
    maxFiles = Infinity,
    maxFileSize = Infinity,
    files: controlled,
    defaultFiles = [],
    onFilesChange,
    onReject,
    transport,
    getUploadError,
    labels: customLabels,
    disabled = false,
    className,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    ...props
  },
  forwardedRef,
) {
  const labels = {
    ...labelsDefault,
    ...customLabels,
    status: { ...labelsDefault.status, ...customLabels?.status },
  }
  const [root, ref] = useRootRef(forwardedRef),
    input = React.useRef<HTMLInputElement>(null)
  const uid = React.useId(),
    inputId = `${uid}-input`,
    errorId = `${uid}-selection-errors`
  const [metadata, setMetadata] = React.useState(new Map<File, Metadata>()),
    [rejections, setRejections] = React.useState<FileRejection[]>([]),
    [announcement, announce] = React.useState(''),
    [dragging, setDragging] = React.useState(false)
  const notifying = React.useRef(false),
    lastSynced = React.useRef<readonly File[] | null>(null),
    skipNotifyFor = React.useRef<readonly File[] | null>(null)
  const primaryButtons = React.useRef(new WeakMap<File, HTMLButtonElement>()),
    removeButtons = React.useRef(new WeakMap<File, HTMLButtonElement>()),
    focusRemove = React.useRef<File | null>(null),
    focusPicker = React.useRef<File | null>(null)
  const requests = React.useRef(new Map<File, Request>()),
    mounted = React.useRef(false),
    dragDepth = React.useRef(0)
  const identities = React.useRef(new WeakMap<File, string>()),
    nextId = React.useRef(0)
  function syncInput(next: readonly File[]) {
    if (!input.current) return
    const transfer = new DataTransfer()
    next.forEach((file) => transfer.items.add(file))
    input.current.files = transfer.files
  }
  function abortAll() {
    requests.current.forEach((request) => request.controller.abort())
    requests.current.clear()
  }
  const [files, setFiles, revision] = useResetValue(
    controlled,
    defaultFiles,
    root,
    form,
    () => {
      abortAll()
      setMetadata(new Map())
      setRejections([])
      dragDepth.current = 0
      setDragging(false)
      skipNotifyFor.current = controlled ?? defaultFiles
      syncInput(controlled ?? defaultFiles)
      announce(labels.reset)
    },
  )
  const latestFiles = React.useRef(files)
  latestFiles.current = files
  React.useLayoutEffect(() => {
    syncInput(files)
    if (
      lastSynced.current !== null &&
      lastSynced.current !== files &&
      skipNotifyFor.current !== files &&
      input.current
    ) {
      notifying.current = true
      try {
        input.current.dispatchEvent(new Event('change', { bubbles: true }))
      } finally {
        notifying.current = false
      }
    }
    lastSynced.current = files
    skipNotifyFor.current = null
  }, [files, revision])
  React.useLayoutEffect(() => {
    if (focusPicker.current && !files.includes(focusPicker.current)) {
      input.current?.focus()
      focusPicker.current = null
    }
    if (focusRemove.current) {
      removeButtons.current.get(focusRemove.current)?.focus()
      focusRemove.current = null
    }
  }, [files, metadata])
  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      abortAll()
    }
  }, [])
  React.useEffect(() => {
    const selected = new Set(files)
    requests.current.forEach((request, file) => {
      if (!selected.has(file)) {
        requests.current.delete(file)
        request.controller.abort()
      }
    })
    setMetadata((previous) => {
      if ([...previous.keys()].every((file) => selected.has(file)))
        return previous
      return new Map([...previous].filter(([file]) => selected.has(file)))
    })
  }, [files])
  function update(file: File, next: Metadata) {
    setMetadata((previous) => new Map(previous).set(file, next))
  }
  function cancel(file: File) {
    const request = requests.current.get(file)
    if (!request) return
    requests.current.delete(file)
    request.controller.abort()
    update(file, { status: 'canceled', progress: null })
    announce(labels.canceled(file))
  }
  React.useEffect(() => {
    if (disabled) {
      ;[...requests.current.keys()].forEach(cancel)
      dragDepth.current = 0
      setDragging(false)
    }
  }, [disabled])
  function commit(next: File[], reason: FileChangeDetails['reason']) {
    const details: FileChangeDetails = {
      reason,
      isCanceled: false,
      cancel() {
        this.isCanceled = true
      },
    }
    let accepted = false
    try {
      onFilesChange?.(next, details)
      accepted = !details.isCanceled
    } finally {
      if (accepted && controlled === undefined) {
        files.forEach((file) => {
          if (!next.includes(file)) {
            const request = requests.current.get(file)
            requests.current.delete(file)
            request?.controller.abort()
          }
        })
        setFiles(next)
        syncInput(next)
      } else syncInput(files)
    }
    if (accepted) announce(labels.changed(next.length))
    return accepted
  }
  function select(incoming: readonly File[], reason: 'select' | 'drop') {
    if (disabled) {
      syncInput(files)
      return
    }
    const next = multiple ? [...files] : [],
      rejected: FileRejection[] = []
    const limit = multiple ? Math.max(0, Math.floor(maxFiles)) : 1
    for (const file of incoming) {
      let rejection: FileRejection['reason'] | undefined
      if (!accepts(file, accept)) rejection = 'type'
      else if (file.size > maxFileSize) rejection = 'size'
      else if (next.some((current) => signature(current) === signature(file)))
        rejection = 'duplicate'
      else if (next.length >= limit) rejection = 'count'
      if (rejection) rejected.push({ file, reason: rejection })
      else next.push(file)
    }
    // A fully rejected single selection must not erase a previously accepted file.
    const selected = next.length || multiple ? next : [...files]
    setRejections(rejected)
    if (
      selected.length !== files.length ||
      selected.some((file, index) => file !== files[index])
    )
      commit(selected, reason)
    else syncInput(files)
    onReject?.(rejected)
  }
  async function upload(file: File) {
    if (
      disabled ||
      !transport ||
      requests.current.has(file) ||
      !latestFiles.current.includes(file)
    )
      return
    const request: Request = { controller: new AbortController() }
    requests.current.set(file, request)
    const current = () =>
      mounted.current &&
      requests.current.get(file) === request &&
      !request.controller.signal.aborted &&
      latestFiles.current.includes(file)
    update(file, { status: 'uploading', progress: null })
    try {
      await transport(file, {
        signal: request.controller.signal,
        onProgress(percent) {
          if (current())
            update(file, {
              status: 'uploading',
              progress:
                percent === null || !Number.isFinite(percent)
                  ? null
                  : Math.max(0, Math.min(100, percent)),
            })
        },
      })
      if (current()) {
        if (
          primaryButtons.current.get(file) ===
          input.current?.ownerDocument.activeElement
        )
          focusRemove.current = file
        update(file, { status: 'success', progress: 100 })
        announce(labels.complete(file))
      }
    } catch (error) {
      if (current()) {
        let message = labels.uploadError
        try {
          message = getUploadError?.(error) || message
        } catch {}
        update(file, { status: 'error', progress: null, error: message })
        announce(labels.failed(file))
      }
    } finally {
      if (requests.current.get(file) === request) requests.current.delete(file)
    }
  }
  const hasFiles = (event: React.DragEvent) =>
    Array.from(event.dataTransfer.types).includes('Files')
  return (
    <Field.Root
      {...props}
      ref={ref}
      name={name}
      disabled={disabled}
      className={skin('pui-field pui-file-upload', className)}
      data-dragging={dragging || undefined}
    >
      <Field.Label>{label}</Field.Label>
      {description != null && description !== false && (
        <Field.Description>{description}</Field.Description>
      )}
      <div
        className='pui-file-dropzone'
        onDragEnter={(event) => {
          onDragEnter?.(event)
          if (!event.defaultPrevented && hasFiles(event) && !disabled) {
            event.preventDefault()
            dragDepth.current++
            setDragging(true)
          }
        }}
        onDragLeave={(event) => {
          onDragLeave?.(event)
          dragDepth.current = Math.max(0, dragDepth.current - 1)
          if (!dragDepth.current) setDragging(false)
        }}
        onDragOver={(event) => {
          onDragOver?.(event)
          if (hasFiles(event)) {
            event.preventDefault()
            event.dataTransfer.dropEffect = disabled ? 'none' : 'copy'
          }
        }}
        onDrop={(event) => {
          onDrop?.(event)
          dragDepth.current = 0
          setDragging(false)
          if (!event.defaultPrevented && hasFiles(event)) {
            event.preventDefault()
            select(Array.from(event.dataTransfer.files), 'drop')
          }
        }}
      >
        <div className='pui-file-picker'>
          <Field.Control
            ref={input}
            id={inputId}
            name={name}
            form={form}
            type='file'
            accept={accept}
            capture={capture}
            multiple={multiple}
            required={required}
            disabled={disabled}
            className='pui-file-native'
            aria-describedby={errorId}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.preventBaseUIHandler()
            }}
            onChange={(event) => {
              if (!notifying.current) {
                event.preventBaseUIHandler()
                select(Array.from(event.currentTarget.files ?? []), 'select')
              }
            }}
          />
          <label
            htmlFor={inputId}
            className='pui-button pui-file-trigger'
            data-variant='outline'
            data-disabled={disabled || undefined}
          >
            <Icon name='upload' />
            {labels.choose}
          </label>
          <p className='pui-file-drop-hint'>{labels.drop}</p>
        </div>
        {/* The files continue the drop zone's plane, so a drop on them adds more. */}
        {files.length > 0 && (
          <ul className='pui-file-list' role='list'>
            {files.map((file) => {
              const state = metadata.get(file) ?? {
                status: 'ready',
                progress: null,
              }
              if (!identities.current.has(file))
                identities.current.set(file, `${uid}-${++nextId.current}`)
              const itemId = identities.current.get(file)!
              return (
                <li key={itemId} className='pui-file-item'>
                  <div className='pui-file-info'>
                    <strong>{file.name}</strong>
                    <span>{labels.size(file.size)}</span>
                    <StatusBadge
                      tone={
                        state.status === 'success'
                          ? 'success'
                          : state.status === 'error'
                            ? 'danger'
                            : state.status === 'uploading'
                              ? 'progress'
                              : 'neutral'
                      }
                    >
                      {labels.status[state.status]}
                    </StatusBadge>
                  </div>
                  <div className='pui-file-actions'>
                    {transport && state.status !== 'success' && (
                      <Button
                        ref={(node) => {
                          if (node) primaryButtons.current.set(file, node)
                          else primaryButtons.current.delete(file)
                        }}
                        type='button'
                        size='small'
                        variant='outline'
                        disabled={disabled}
                        aria-describedby={
                          state.error ? `${itemId}-error` : undefined
                        }
                        aria-label={labels.fileAction(
                          state.status === 'uploading'
                            ? labels.cancel
                            : state.status === 'ready'
                              ? labels.upload
                              : labels.retry,
                          file,
                        )}
                        onClick={() => {
                          if (state.status === 'uploading') cancel(file)
                          else void upload(file)
                        }}
                      >
                        {state.status === 'uploading'
                          ? labels.cancel
                          : state.status === 'ready'
                            ? labels.upload
                            : labels.retry}
                      </Button>
                    )}
                    <Button
                      type='button'
                      size='small'
                      variant='ghost'
                      ref={(node) => {
                        if (node) removeButtons.current.set(file, node)
                        else removeButtons.current.delete(file)
                      }}
                      disabled={disabled}
                      aria-label={labels.fileAction(labels.remove, file)}
                      onClick={() => {
                        setRejections([])
                        if (
                          commit(
                            files.filter((current) => current !== file),
                            'remove',
                          )
                        )
                          focusPicker.current = file
                      }}
                    >
                      {labels.remove}
                    </Button>
                  </div>
                  {state.status === 'uploading' && (
                    <Progress.Root
                      value={state.progress}
                      aria-label={labels.progress(file)}
                    >
                      <Progress.Track>
                        <Progress.Indicator />
                      </Progress.Track>
                    </Progress.Root>
                  )}
                  {state.error && (
                    <p id={`${itemId}-error`} className='pui-file-upload-error'>
                      {state.error}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div id={errorId} role='alert' className='pui-file-errors'>
        {rejections.length > 0 && (
          <ul>
            {rejections.map((rejection, index) => (
              <li key={index}>{labels.rejection(rejection)}</li>
            ))}
          </ul>
        )}
      </div>
      <Field.Error />
      <span className='pui-feedback-sr' role='status'>
        {announcement}
      </span>
    </Field.Root>
  )
})
