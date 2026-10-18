import type { ComponentDoc } from './componentDocs'
export const contentDocs: Record<string, ComponentDoc> = {
  card: {
    usage:
      'Group related information and actions on one surface. The default 24px padding balances all four sides, and spacing sets the hierarchy of title, description, body, and actions. To align card grid text with the surrounding body text, set Grid.bleed and Card.Root.padding to the same token step. Do this only when the outer container has room for the extended surface and the focus indicator.',
    avoid:
      "Don't wrap every page section in a card or stack cards inside cards. Separate sections with headings and spacing instead. Don't turn the whole card into a fake button. Put purposeful links and buttons inside it instead.",
    anatomy: 'Root(Surface) → Header(Title + Description) + Body + Footer',
    keyboard:
      'Only the actions enter the Tab order. Root is a plain div with no focus or click behavior. Set Title.level to match the surrounding heading hierarchy. When the card needs a group name, connect it with aria-labelledby.',
    tokens: ['--surface', '--canvas', '--space-6', '--space-4', '--radius-lg'],
    code: `import { Card, Button } from '@surflane/ui'

<Card.Root aria-labelledby='environment-title'>
  <Card.Header>
    <Card.Title id='environment-title' level={3}>
      DEMO main
    </Card.Title>
    <Card.Description>Platform API environment</Card.Description>
  </Card.Header>
  <Card.Body>Three services are ready to deploy.</Card.Body>
  <Card.Footer>
    <Button onClick={inspect}>Inspect environment</Button>
  </Card.Footer>
</Card.Root>`,
    props: [
      ['Root.tone', 'subtle | canvas', 'subtle'],
      ['Root.padding', 'shared Space token step', '6 (24px)'],
      ['Title.level', '2 | 3 | 4 | 5 | 6', '3'],
      ['Header / Body / Footer', 'native div props', '—'],
      ['Description', 'native p props', '—'],
    ],
  },
  code: {
    usage:
      'Show code, configuration, and long identifiers with whitespace and line breaks preserved, ready to select and copy. The copy button shows its result in place: Copied, or Copy unavailable. Content scrolls horizontally by default. In documentation, set wrap so only long lines break.',
    avoid: [
      "Don't let syntax highlighting pass for syntax validation or an execution result. Report those separately instead.",
      "Don't inject code as HTML or execute it. Pass a plain source string to code instead.",
      "Don't treat a rejected clipboard write as success. Let a custom onCopy throw or reject on failure, so the button shows Copy unavailable.",
    ],
    anatomy:
      'Root → toolbar(label + language + copy action, which also shows the result) + labeled ScrollArea(pre/code)',
    keyboard: [
      'Tab reaches the copy button and the scroll area.',
      'Enter or Space copies. The result replaces the button label in place, so nothing else moves: Copied on success, Copy unavailable on failure.',
      'On failure, the source is selected for the keyboard copy shortcut.',
      "Changing the source clears the result, and late responses don't overwrite the new source's state.",
      'The label is a polite live region and returns to the action after 2 seconds.',
    ],
    tokens: [
      '--code-bg',
      '--font-code',
      '--space-4',
      '--radius-md',
      '--ink-body',
    ],
    code: `import { CodeBlock } from '@surflane/ui'

<CodeBlock
  label='Runner task'
  language='YAML'
  code={'name: platform-api\\n  environment: staging\\n'}
/>
<CodeBlock label='Wrapped source' code={source} wrap />`,
    props: [
      ['code', 'plain source string', 'required'],
      [
        'label / language',
        'scroll region name / Shiki grammar and visible language hint; unknown languages render plain',
        'Code / —',
      ],
      ['wrap', 'wrap long source lines visually', 'false'],
      [
        'onCopy',
        'optional clipboard writer (text) => void | Promise<void>',
        'navigator.clipboard.writeText',
      ],
      [
        'copyLabel / copiedLabel / copyErrorLabel',
        'localized action label and short in-button results',
        'Copy code / Copied / Copy unavailable',
      ],
    ],
  },
  pagination: {
    usage:
      'Let people browse same-kind results page by page. Place it after the list. Use onPageChange for in-page state, or getPageHref for real URL navigation. The current page has aria-current=page.',
    avoid: [
      "Don't split short lists. Show the whole list instead.",
      "Don't use it for step-by-step input flows. Use the form's own Back and Next actions instead.",
      "Don't request a page that became invalid after a filter change. Clamp page to the new pageCount instead.",
      "Don't invent a total page count when cursor-based navigation can't know it. Use plain Previous and Next buttons instead.",
    ],
    anatomy:
      'named nav → Previous control + list(page controls / decorative SVG gaps) + Next control',
    keyboard: [
      'Tab moves between the controls.',
      'Enter activates the controls, and buttons also respond to Space. Links keep browser behaviors such as opening in a new tab.',
      "Pagination renders nothing when there's one page or fewer. On small screens, it shows Previous, Next, and a current/total page summary.",
      'The caller decides how results are announced, how loading shows, and where focus goes after a page change.',
    ],
    tokens: [
      '--selected',
      '--control-border',
      '--control-height',
      '--radius-full',
      '--interaction-focus',
    ],
    code: `import { Pagination } from '@surflane/ui'

<Pagination
  page={page}
  pageCount={pageCount}
  onPageChange={setPage}
  aria-label='Pipeline run pages'
/>

<Pagination
  page={2}
  pageCount={10}
  getPageHref={(page) => \`/runs?page=\${page}\`}
/>`,
    props: [
      [
        'page / pageCount',
        '1-based controlled page / total page count',
        'required',
      ],
      [
        'onPageChange | getPageHref',
        'mutually exclusive state callback or URL builder',
        'required mode',
      ],
      ['siblings', '0 | 1 | 2 neighboring pages', '1'],
      [
        'disabled',
        'disable all controls without changing the current page',
        'false',
      ],
      [
        'labels',
        'previous / next / page(number) / more / summary(page,count)',
        'English labels',
      ],
      ['aria-label', 'navigation landmark name', 'Pagination'],
    ],
  },
}
