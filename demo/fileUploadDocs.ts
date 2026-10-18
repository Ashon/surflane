import type { ComponentDoc } from "./componentDocs";
export const fileUploadDocs: Record<string, ComponentDoc> = {
  "file-upload": {
    usage:
      "Manages choosing, dropping, and removing files as one selection state. The native file input is registered as a Field.Control, so the shared Form keeps required validation, server errors, and submission of real File objects. Transfers don't start automatically; the product-provided transport runs per file. The drop zone is distinguished by a surface rather than a dashed outline, and its background is highlighted while a file is dragged over it. Keyboard focus on the choose button and the field error display are preserved.",
    avoid:
      "accept is a selection hint, and client-side validation doesn't replace server validation. Directory uploads, chunked transfers, resuming, and signed URL policies are handled by the transport or the product. Don't prefill files already uploaded to the server as if they were local Files. If you need the actual files instead of Form.onFormSubmit's string model, read FormData in onSubmit.",
    anatomy:
      "FileUpload owns Field.Root → Label + Description + native Field.Control(type=file) + visible picker label/dropzone + rejection alert + Field.Error + file list/status/progress/actions + one polite announcement",
    keyboard:
      "Tabbing to the native file input shows a focus ring on the choose button. Enter/Space opens the file picker, and the list's Upload/Cancel/Retry/Remove buttons work with Tab and Enter/Space. The same file selection works without dragging. disabled blocks selection and submission and cancels transfers in progress.",
    tokens: [
      "--control-border",
      "--control-focus",
      "--interaction-focus",
      "--surface",
      "--radius-lg",
      "--status-danger-fg",
      "--space-4",
      "--space-5",
    ],
    code: 'import { FileUpload, Form } from "@surflane/ui";\n\n<Form onSubmit={event => {\n  event.preventDefault();\n  const data = new FormData(event.currentTarget);\n  const files = data.getAll("artifacts");\n  // Submit using your application transport.\n}}>\n  <FileUpload name="artifacts" label="Build artifacts"\n    description="Up to three JSON files, 1 MB each."\n    accept=".json,application/json" multiple required\n    maxFiles={3} maxFileSize={1024 * 1024}\n    transport={async (file, { signal, onProgress }) => {\n      await yourUpload(file, { signal, onProgress });\n    }} />\n</Form>',
    props: [
      [
        "label / description",
        "visible accessible label and instructions",
        "label required",
      ],
      [
        "files / defaultFiles / onFilesChange",
        "controlled / uncontrolled File[]; cancel() can reject changes",
        "empty",
      ],
      [
        "accept / capture / multiple / maxFiles / maxFileSize",
        "extension/MIME rules; native camera hint; selection count/byte limits",
        "any / — / false / unlimited / unlimited",
      ],
      ["onReject", "per-file type/size/count/duplicate rejections", "—"],
      [
        "transport",
        "(file, { signal, onProgress }) => Promise<void>; explicit per-file upload",
        "no network built in",
      ],
      [
        "getUploadError",
        "map transport errors to a user-facing string",
        "Upload failed. Try again.",
      ],
      [
        "name / form / required",
        "native FileList and form ownership; shared Form validation also requires React Form context",
        "— / nearest form / false",
      ],
      [
        "disabled",
        "prevent selection/removal/submission; cancel active transfers",
        "false",
      ],
      [
        "labels",
        "localized action/status/rejection/announcement text",
        "English defaults",
      ],
      [
        "Field.Root props / ref / className",
        "owns the Field; supports Form.errors/validation and actual div ref",
        "do not wrap in another Field.Root",
      ],
    ],
  },
};
