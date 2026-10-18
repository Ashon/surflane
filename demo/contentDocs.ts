import type { ComponentDoc } from "./componentDocs";
export const contentDocs: Record<string, ComponentDoc> = {
  card: {
    usage:
      "Groups related information and actions on a single surface. The default 24px padding keeps all four sides balanced, and spacing expresses the hierarchy of title, description, body, and actions. To align text inside a card grid with the surrounding body text, set the same token step on Grid.bleed and Card.Root.padding. Use this only when the outer container has room for the extended surface and the focus indicator.",
    avoid:
      "Don't repeat a card for every page section or stack cards inside cards. Don't turn the whole container into a fake button; provide purposeful links and buttons.",
    anatomy: "Root(Surface) → Header(Title + Description) + Body + Footer",
    keyboard:
      "Root is a plain div with no focus or click behavior. Only the actions enter the Tab order. Match the surrounding heading hierarchy with Title.level, and connect a group name with aria-labelledby when needed.",
    tokens: ["--surface", "--canvas", "--space-6", "--space-4", "--radius-lg"],
    code: 'import { Card, Button } from "@surflane/ui";\n\n<Card.Root aria-labelledby="environment-title">\n  <Card.Header>\n    <Card.Title id="environment-title" level={3}>DEMO main</Card.Title>\n    <Card.Description>Platform API environment</Card.Description>\n  </Card.Header>\n  <Card.Body>Three services are ready to deploy.</Card.Body>\n  <Card.Footer><Button onClick={inspect}>Inspect environment</Button></Card.Footer>\n</Card.Root>',
    props: [
      ["Root.tone", "subtle | canvas", "subtle"],
      ["Root.padding", "shared Space token step", "6 (24px)"],
      ["Title.level", "2 | 3 | 4 | 5 | 6", "3"],
      ["Header / Body / Footer", "native div props", "—"],
      ["Description", "native p props", "—"],
    ],
  },
  code: {
    usage:
      "Preserves whitespace and line breaks in code, configuration, and long identifiers, and supports selection and copying. Content scrolls horizontally by default; in documentation contexts, wrap breaks only the long lines.",
    avoid:
      "Don't let language-specific syntax highlighting be mistaken for syntax validation or execution results. Don't inject code as HTML or execute it. Don't treat a rejected clipboard write as success.",
    anatomy:
      "Root → toolbar(label + language + copy action) + labelled ScrollArea(pre/code) + copy status",
    keyboard:
      "Tab reaches the copy button and the scroll area, and Enter/Space copies. Copy failures are announced with role=status, and the original text remains selectable. When the source changes, the previous result is cleared, and late responses don't overwrite the new source's state.",
    tokens: [
      "--code-bg",
      "--font-code",
      "--space-4",
      "--radius-md",
      "--ink-body",
    ],
    code: 'import { CodeBlock } from "@surflane/ui";\n\n<CodeBlock label="Runner task" language="YAML"\n  code={"name: platform-api\\n  environment: staging\\n"} />\n<CodeBlock label="Wrapped source" code={source} wrap />',
    props: [
      ["code", "plain source string", "required"],
      [
        "label / language",
        "region name / Shiki grammar and visible language hint; unknown = plain",
        "Code / —",
      ],
      ["wrap", "wrap long source lines visually", "false"],
      [
        "onCopy",
        "optional clipboard writer (text) => void | Promise<void>",
        "navigator.clipboard.writeText",
      ],
      [
        "copyLabel / copiedLabel / copyErrorLabel",
        "localized action and outcome strings",
        "Copy code / Code copied. / manual-copy guidance",
      ],
    ],
  },
  pagination: {
    usage:
      "Place it after a list to browse results of the same kind page by page. Use onPageChange for in-page state and getPageHref for real URL navigation. The current page is marked with aria-current=page.",
    avoid:
      "Don't split short lists unnecessarily. Don't use it for step-by-step input flows, and don't request a page that became invalid after a filter change. Don't invent a total page count for cursor-based navigation where the count is unknown.",
    anatomy:
      "named nav → Previous control + list(page controls / decorative SVG gaps) + Next control",
    keyboard:
      "Uses standard Tab and Enter; buttons also support Space. Links keep browser behaviors such as opening in a new tab. The caller decides how results are announced, how loading is shown, and where focus goes after a page change. Pagination is hidden when there's one page or fewer. On small screens it shows previous, next, and a current/total page summary.",
    tokens: [
      "--selected",
      "--control-border",
      "--control-height",
      "--radius-full",
      "--interaction-focus",
    ],
    code: 'import { Pagination } from "@surflane/ui";\n\n<Pagination page={page} pageCount={pageCount}\n  onPageChange={setPage} aria-label="Pipeline run pages" />\n\n<Pagination page={2} pageCount={10}\n  getPageHref={(page) => `/runs?page=${page}`} />',
    props: [
      [
        "page / pageCount",
        "1-based controlled page / total page count",
        "required",
      ],
      [
        "onPageChange | getPageHref",
        "mutually exclusive state callback or URL builder",
        "required mode",
      ],
      ["siblings", "0 | 1 | 2 neighboring pages", "1"],
      [
        "disabled",
        "disable all controls without changing current page",
        "false",
      ],
      [
        "labels",
        "previous / next / page(number) / more / summary(page,count)",
        "English labels",
      ],
      ["aria-label", "navigation landmark name", "Pagination"],
    ],
  },
};
