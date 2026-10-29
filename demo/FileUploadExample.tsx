import React, { useState } from 'react'
import {
  Stack,
  Text,
  Inline,
  FileUpload,
  Form,
  Button,
  type UploadTransport,
} from '@surflane/ui'
import { Flag } from './Flag'
import { useLocale } from './i18n'
import { text } from './i18n/pages/FileUploadExample'
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
    <Stack gap={5}>
      <Inline gap={3}>
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
      </Inline>
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
          labels={t.labels}
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
        <Inline gap={3}>
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
        </Inline>
      </Form>
      <FileUpload
        labels={
          t.labels && {
            ...t.labels,
            choose: t.chooseOne,
            drop: t.dropOne,
          }
        }
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
      <Text color='secondary' className='file-demo-result' role='status'>
        {summary}
      </Text>
    </Stack>
  )
}
