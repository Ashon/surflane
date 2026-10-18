import React, { useState } from "react";
import {
  FileUpload,
  Form,
  Button,
  Checkbox,
  type UploadTransport,
} from "@surflane/ui";
function Flag({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="pui-choice-label">
      <Checkbox.Root checked={checked} onCheckedChange={onChange}>
        <Checkbox.Indicator />
      </Checkbox.Root>
      {children}
    </label>
  );
}
export function FileUploadExample() {
  const [disabled, setDisabled] = useState(false),
    [fail, setFail] = useState(false),
    [cancel, setCancel] = useState(false),
    [cancelReset, setCancelReset] = useState(false),
    [controlled, setControlled] = useState<readonly File[]>([]),
    [summary, setSummary] = useState("No file form submitted.");
  const [late, setLate] = useState(false),
    [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const transport: UploadTransport = (file, { signal, onProgress }) =>
    new Promise((resolve, reject) => {
      let progress = 0;
      const abort = () => {
        if (late) return;
        clearInterval(timer);
        reject(new DOMException("Canceled", "AbortError"));
      };
      const timer = setInterval(() => {
        progress += 20;
        onProgress(progress);
        if (progress >= 100) {
          clearInterval(timer);
          signal.removeEventListener("abort", abort);
          if (fail) reject(new Error("Sample transport failed"));
          else resolve();
        }
      }, 200);
      signal.addEventListener("abort", abort, { once: true });
      if (signal.aborted) abort();
    });
  return (
    <div className="example-stack">
      <div className="actions">
        <Flag checked={disabled} onChange={setDisabled}>
          Disable file controls
        </Flag>
        <Flag checked={fail} onChange={setFail}>
          Fail upload preview
        </Flag>
        <Flag checked={late} onChange={setLate}>
          Late result after cancel
        </Flag>
        <Flag checked={cancel} onChange={setCancel}>
          Cancel selection changes
        </Flag>
        <Flag checked={cancelReset} onChange={setCancelReset}>
          Cancel reset
        </Flag>
      </div>
      <Form
        id="file-upload-preview-form"
        errors={formErrors}
        onReset={(event) => {
          if (cancelReset) event.preventDefault();
          else setFormErrors({});
        }}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const files = [...data.entries()].filter(
            (entry): entry is [string, File] =>
              entry[1] instanceof File && !!entry[1].name,
          );
          setSummary(
            JSON.stringify(
              files.map(([field, file]) => ({
                field,
                name: file.name,
                size: file.size,
              })),
            ),
          );
        }}
      >
        <FileUpload
          label="Build artifacts"
          description="Choose up to three JSON or text files, each no larger than 1 KB. The transport is simulated locally."
          name="artifacts"
          accept=".json,.txt,application/json,text/plain"
          multiple
          maxFiles={3}
          maxFileSize={1024}
          required
          disabled={disabled}
          transport={transport}
          onFilesChange={(_, details) => {
            if (cancel) details.cancel();
          }}
        />
        <div className="actions">
          <Button type="submit">Inspect submitted files</Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setFormErrors({
                artifacts: "These files were rejected by the example server.",
              })
            }
          >
            Show field error
          </Button>
          <Button type="reset" variant="outline">
            Reset file form
          </Button>
        </div>
      </Form>
      <FileUpload
        label="Controlled attachment"
        description="One optional CSV file, owned by the page and associated with the form above. Reset preserves this controlled selection."
        name="attachment"
        form="file-upload-preview-form"
        accept=".csv,text/csv"
        files={controlled}
        disabled={disabled}
        onFilesChange={(files, details) => {
          if (cancel) details.cancel();
          else setControlled(files);
        }}
      />
      <p className="file-demo-result" role="status">
        {summary}
      </p>
    </div>
  );
}
