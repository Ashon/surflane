import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    'Choose, drop, and remove files as one selection state.',
    'The native file input registers as a Field.Control, so the shared Form keeps required validation, server errors, and real File submission.',
    "Transfers don't start automatically. The transport you provide runs per file.",
    'The drop zone is a surface, not a dashed outline. Its background highlights while a file is dragged over it.',
    'Chosen files continue the drop zone as rows, divided by lines, so the field stays one plane and a drop on the list adds files too.',
    'Keyboard focus on the choose button and the field error display are preserved.',
  ],
  avoid: [
    "Don't treat accept as validation. It's a selection hint, and client-side validation doesn't replace server validation.",
    "Don't expect FileUpload to handle directory uploads, chunked transfers, resuming, or signed URL policies. Handle them in the transport or the product.",
    "Don't prefill files already uploaded to the server as if they were local Files. List them separately.",
    "Don't read actual files from Form.onFormSubmit's string model. Read FormData in onSubmit instead.",
  ],
  anatomy:
    'FileUpload owns Field.Root → Label + Description + dropzone (native Field.Control(type=file) + visible picker label, then one row per file with status/actions/progress) + rejection alert + Field.Error + one polite announcement',
  keyboard:
    'Tabbing to the native file input shows a focus ring on the choose button. Enter or Space opens the file picker. In the file list, Tab reaches the Upload, Cancel, Retry, and Remove buttons. Enter or Space activates them. Every file selection works without dragging. disabled blocks selection and submission, and cancels transfers in progress.',
  tokens: [
    '--control-border',
    '--control-focus',
    '--interaction-focus',
    '--surface',
    '--line',
    '--radius-lg',
    '--status-danger-fg',
    '--space-3',
    '--space-4',
    '--space-5',
  ],
  code: `import { FileUpload, Form } from '@surflane/ui'

<Form
  onSubmit={(event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const files = data.getAll('artifacts')
    // Submit using your application transport.
  }}
>
  <FileUpload
    name='artifacts'
    label='Build artifacts'
    description='Up to three JSON files, 1 MB each.'
    accept='.json,application/json'
    multiple
    required
    maxFiles={3}
    maxFileSize={1024 * 1024}
    transport={async (file, { signal, onProgress }) => {
      await yourUpload(file, { signal, onProgress })
    }}
  />
</Form>`,
  props: [
    [
      'label / description',
      'visible accessible label and instructions',
      'label required',
    ],
    [
      'files / defaultFiles / onFilesChange',
      'controlled / uncontrolled File[]; cancel() can reject changes',
      'empty',
    ],
    [
      'accept / capture / multiple / maxFiles / maxFileSize',
      'extension/MIME rules; native camera hint; selection count/byte limits',
      'any / — / false / unlimited / unlimited',
    ],
    ['onReject', 'per-file type/size/count/duplicate rejections', '—'],
    [
      'transport',
      '(file, { signal, onProgress }) => Promise<void>; explicit per-file upload',
      'no network built in',
    ],
    [
      'getUploadError',
      'maps transport errors to a user-facing string',
      'Upload failed. Try again.',
    ],
    [
      'name / form / required',
      'native FileList and form ownership; shared Form validation also requires React Form context',
      '— / nearest form / false',
    ],
    [
      'disabled',
      'blocks selection, removal, and submission; cancels active transfers',
      'false',
    ],
    [
      'labels',
      "localized action/status/rejection/announcement text; size(bytes) formats a file size and fileAction(action, file) names a file's buttons",
      'English defaults',
    ],
    [
      'Field.Root props / ref / className',
      'owns the Field; supports Form.errors/validation and actual div ref',
      "don't wrap in another Field.Root",
    ],
  ],
}
