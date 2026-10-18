import React, { useState } from "react";
import {
  Button,
  Field,
  Markdown,
  NativeSelect,
  ScrollArea,
  SyntaxHighlighter,
  Textarea,
} from "@surflane/ui";
const examples: Record<string, string> = {
  tsx: 'import { Button } from "@surflane/ui";\n\n// Built from the same design tokens.\nexport function RunAction() {\n  const count = 3;\n  return <Button disabled={count === 0}>Deploy service</Button>;\n}\n',
  css: ".workspace {\n  color: var(--ink-body);\n  padding: 24px;\n  background: var(--canvas);\n}\n",
  yaml: "name: platform-api\nenvironment: staging\nretries: 3\nenabled: true\n# Keep credentials outside source control.\n",
  json: '{\n  "name": "Platform workspace",\n  "available": true,\n  "environments": ["staging", "production"]\n}\n',
  bash: '# Inspect the local example\nnpm run build:catalog\nprintf "%s\\n" "Build complete"\n',
  unsupported:
    "<script>Source text remains readable and never executes.</script>\n한글과 English stay selectable.\n",
};
export const markdownExampleSource = `# Deployment

Review **deployment results** in a shared design language. Jump to [Results](#results) or review the [design tokens](/tokens). The inline identifier is \`service_id\`.

> Never convey status with color alone; provide a label and context with it.

## Results

| Environment | Status | Runs |
| :--- | :--- | ---: |
| Staging | Passed | 12 |
| Production | Needs review | 3 |

- [x] Review the build logs
- [ ] Confirm the next action

### Example code

\`\`\`tsx
import { Button } from "@surflane/ui";

<Button onClick={inspect}>Inspect logs</Button>
\`\`\`

\`\`\`yaml
environment: staging
retries: 3
\`\`\`

~~Outdated guidance~~ is replaced by the current documentation.[^scope]

[^scope]: This is a local rendering example.
`;
export function RichContentExample({ id }: { id: string }) {
  const [language, setLanguage] = useState("tsx");
  const [code, setCode] = useState(examples.tsx);
  const [source, setSource] = useState(markdownExampleSource);
  const [wrap, setWrap] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [view, setView] = useState("split");
  if (id === "markdown")
    return (
      <div className="example-stack">
        <div className="markdown-demo-toolbar">
          <div role="group" aria-label="Markdown view" className="actions">
            {[
              ["split", "Side by side"],
              ["source", "Source"],
              ["preview", "Preview"],
            ].map(([value, label]) => (
              <Button
                key={value}
                variant="ghost"
                aria-pressed={view === value}
                onClick={() => setView(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <span className="markdown-demo-hint">
            Edit source to update the preview
          </span>
        </div>
        <div className="markdown-workbench" data-view={view}>
          <div className="markdown-source-pane" hidden={view === "preview"}>
            <Field.Root>
              <div className="markdown-pane-heading">
                <Field.Label htmlFor="markdown-source">
                  Markdown source
                </Field.Label>
                <span>Markdown</span>
              </div>
              <Textarea
                id="markdown-source"
                className="rich-source-editor"
                value={source}
                spellCheck={false}
                onChange={(event) => setSource(event.target.value)}
              />
            </Field.Root>
          </div>
          <div className="markdown-preview-pane" hidden={view === "source"}>
            <div className="markdown-pane-heading">
              <span>Rendered preview</span>
              <span>Live</span>
            </div>
            <ScrollArea
              orientation="vertical"
              label="Rendered Markdown example"
              className="markdown-preview-scroll"
            >
              <Markdown
                source={source}
                label="Markdown preview"
                codeWrap={wrap}
                headingLevel={3}
              />
              {duplicate && (
                <div className="markdown-second-preview">
                  <Markdown
                    source={source}
                    label="Second Markdown preview"
                    codeWrap={wrap}
                    headingLevel={3}
                  />
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        <div className="actions">
          <Button
            variant="outline"
            onClick={() => setSource(markdownExampleSource)}
          >
            Restore Markdown example
          </Button>
          <Button
            variant="outline"
            aria-pressed={wrap}
            onClick={() => setWrap((value) => !value)}
          >
            Wrap code lines
          </Button>
          <Button
            variant="outline"
            aria-pressed={duplicate}
            onClick={() => setDuplicate((value) => !value)}
          >
            Compare two instances
          </Button>
        </div>
      </div>
    );
  return (
    <div className="example-stack">
      <div className="syntax-theme-intro">
        <strong>Platform Quiet</strong>
        <p>
          Restrained color on a neutral background separates code structure from
          values. Light and dark themes use the same semantic roles.
        </p>
        <ul className="syntax-theme-legend" aria-label="Syntax color roles">
          {[
            ["keyword", "Keyword"],
            ["string", "String"],
            ["function", "Function / type"],
            ["number", "Number"],
            ["comment", "Comment"],
          ].map(([role, label]) => (
            <li key={role}>
              <code data-syntax={role}>{label}</code>
            </li>
          ))}
        </ul>
      </div>
      <Field.Root>
        <Field.Label htmlFor="syntax-language">Source language</Field.Label>
        <NativeSelect
          id="syntax-language"
          value={language}
          onChange={(event) => {
            setLanguage(event.target.value);
            setCode(examples[event.target.value]);
          }}
        >
          {Object.keys(examples).map((value) => (
            <option key={value} value={value}>
              {value === "unsupported"
                ? "Unsupported / plain fallback"
                : value.toUpperCase()}
            </option>
          ))}
        </NativeSelect>
      </Field.Root>
      <Field.Root>
        <Field.Label htmlFor="syntax-source">Source code</Field.Label>
        <Textarea
          id="syntax-source"
          className="rich-source-editor"
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
      </Field.Root>
      <div className="actions">
        <Button
          variant="outline"
          aria-pressed={wrap}
          onClick={() => setWrap((value) => !value)}
        >
          Wrap source lines
        </Button>
        <Button variant="outline" onClick={() => setCode(examples[language])}>
          Restore source
        </Button>
      </div>
      <SyntaxHighlighter
        code={code}
        language={language}
        label="Highlighted source preview"
        wrap={wrap}
      />
    </div>
  );
}
