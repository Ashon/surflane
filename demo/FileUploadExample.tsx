import React, { useState } from 'react'
import {
  FileUpload,
  Form,
  Button,
  Checkbox,
  type UploadTransport,
  ChoiceLabel,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/FileUploadExample'
function Flag({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  children: React.ReactNode
}) {
  return (
    <ChoiceLabel
      control={
        <Checkbox.Root checked={checked} onCheckedChange={onChange}>
          <Checkbox.Indicator />
        </Checkbox.Root>
      }
    >
      {children}
    </ChoiceLabel>
  )
}
export function FileUploadExample() {
  const t = text[useLocale().locale]
  const [disabled, setDisabled] = useState(false),
    [fail, setFail] = useState(false),
    [cancel, setCancel] = useState(false),
    [cancelReset, setCancelReset] = useState(false),
    [controlled, setControlled] = useState<readonly File[]>([]),
    [summary, setSummary] = useState(t.noFileSubmitted)
  const [late, setLate] = useState(false),
    [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const transport: UploadTransport = (file, { signal, onProgress }) =>
    new Promise((resolve, reject) => {
      let progress = 0
      const abort = () => {
        if (late) return
        clearInterval(timer)
        reject(new DOMException('Canceled', 'AbortError'))
      }
      const timer = setInterval(() => {
        progress += 20
        onProgress(progress)
        if (progress >= 100) {
          clearInterval(timer)
          signal.removeEventListener('abort', abort)
          if (fail) reject(new Error('Sample transport failed'))
          else resolve()
        }
      }, 200)
      signal.addEventListener('abort', abort, { once: true })
      if (signal.aborted) abort()
    })
  return (
    <div className='example-stack'>
      <div className='actions'>
        <Flag checked={disabled} onChange={setDisabled}>
          {t.disableFileControls}
        </Flag>
        <Flag checked={fail} onChange={setFail}>
          {t.failUploadPreview}
        </Flag>
        <Flag checked={late} onChange={setLate}>
          {t.lateResultAfterCancel}
        </Flag>
        <Flag checked={cancel} onChange={setCancel}>
          {t.cancelSelectionChanges}
        </Flag>
        <Flag checked={cancelReset} onChange={setCancelReset}>
          {t.cancelReset}
        </Flag>
      </div>
      <Form
        id='file-upload-preview-form'
        errors={formErrors}
        onReset={(event) => {
          if (cancelReset) event.preventDefault()
          else setFormErrors({})
        }}
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          const files = [...data.entries()].filter(
            (entry): entry is [string, File] =>
              entry[1] instanceof File && !!entry[1].name,
          )
          setSummary(
            JSON.stringify(
              files.map(([field, file]) => ({
                field,
                name: file.name,
                size: file.size,
              })),
            ),
          )
        }}
      >
        <FileUpload
          label={t.buildArtifacts}
          description={t.buildArtifactsDescription}
          name='artifacts'
          accept='.json,.txt,application/json,text/plain'
          multiple
          maxFiles={3}
          maxFileSize={1024}
          required
          disabled={disabled}
          transport={transport}
          onFilesChange={(_, details) => {
            if (cancel) details.cancel()
          }}
        />
        <div className='actions'>
          <Button type='submit'>{t.inspectSubmittedFiles}</Button>
          <Button
            type='button'
            variant='ghost'
            onClick={() =>
              setFormErrors({
                artifacts: t.rejectedByServer,
              })
            }
          >
            {t.showFieldError}
          </Button>
          <Button type='reset' variant='outline'>
            {t.resetFileForm}
          </Button>
        </div>
      </Form>
      <FileUpload
        label={t.controlledAttachment}
        description={t.controlledAttachmentDescription}
        name='attachment'
        form='file-upload-preview-form'
        accept='.csv,text/csv'
        files={controlled}
        disabled={disabled}
        onFilesChange={(files, details) => {
          if (cancel) details.cancel()
          else setControlled(files)
        }}
      />
      <p className='file-demo-result' role='status'>
        {summary}
      </p>
    </div>
  )
}
