import type { ComponentDoc } from "./componentDocs";
export const richContentDocs: Record<string, ComponentDoc> = {
  "syntax-highlighter": {
    usage:
      "Platform Quiet is a dedicated code theme with neutral surfaces and low-chroma OKLCH colors. Keywords are purple, strings sage, functions and types blue, and numbers amber, while properties and punctuation stay neutral. Comments stay readable too, without italics or faded opacity. When you need a copy action, use CodeBlock, which uses the same highlighter. Highlighting is not code validation or an execution result.",
    avoid:
      "Don't inject HTML or execute the source. Unsupported languages, engine load failures, and sources over 50,000 characters stay as plain text. Don't strip or auto-correct whitespace, line breaks, or Hangul text.",
    anatomy:
      "labelled ScrollArea → pre → code → semantic token spans; inline mode returns only code",
    keyboard:
      "The source keeps native text selection and copying. It scrolls horizontally in a ScrollArea, and wrap breaks lines visually without changing the source. Colors meet at least 4.5:1 in both themes and use the system text color in forced colors mode.",
    tokens: [
      "--code-bg",
      "--font-code",
      "--syntax-keyword",
      "--syntax-string",
      "--syntax-comment",
    ],
    code: 'import { SyntaxHighlighter, CodeBlock } from "@surflane/ui";\n\n<SyntaxHighlighter code={source} language="tsx" label="Source preview" />\n<CodeBlock code={source} language="tsx" label="Copyable example" />',
    props: [
      ["code", "original source string", "required"],
      [
        "language",
        "tsx / jsx / typescript / javascript / css / html / json / bash / yaml / python / sql / markdown / text; ts/js/sh/yml aliases",
        "text",
      ],
      [
        "inline",
        "render code only; caller owns the surrounding pre/scroll layout",
        "false",
      ],
      [
        "label / wrap",
        "scroll region name / visual wrapping",
        "Highlighted source / false",
      ],
      ["ref", "underlying code HTMLElement", "—"],
    ],
  },
  markdown: {
    usage:
      "Renders CommonMark documents plus GFM tables, task lists, strikethrough, and footnotes in a shared reading style. Code fences reuse CodeBlock's highlighting, copy action, and horizontal scrolling.",
    avoid:
      "Don't render MDX or executable HTML. The calling screen decides remote document fetching, permissions, link destinations, and image visibility. Task lists are read-only and don't replace form inputs.",
    anatomy:
      "named article → scoped heading hierarchy and anchors → prose / links / lists / blockquote → Table.ScrollArea / highlighted CodeBlock / notes",
    keyboard:
      "Links and copy buttons keep native Tab/Enter behavior. Headings start at h2 by default, and each instance's IDs are linked to its internal links. HTML is excluded, and unsafe URLs are blocked by the default URL policy. Long tables and code scroll independently instead of overflowing the document.",
    tokens: [
      "--type-reading-size",
      "--type-reading-leading",
      "--layout-reading",
      "--code-bg",
      "--syntax-keyword",
      "--ink-body",
    ],
    code: 'import { Markdown } from "@surflane/ui";\n\n<Markdown source={documentSource} label="Deployment guide"\n  headingLevel={2} codeWrap={false} />',
    props: [
      ["source", "CommonMark + GitHub flavored Markdown string", "required"],
      [
        "label",
        "article and nested code/table region names",
        "Markdown content",
      ],
      [
        "headingLevel",
        "render Markdown h1 at this semantic level; deeper headings clamp to h6",
        "2",
      ],
      [
        "codeWrap",
        "visually wrap fenced code without changing copied text",
        "false",
      ],
      ["ref / className", "root HTMLDivElement / additional class", "—"],
    ],
  },
};
