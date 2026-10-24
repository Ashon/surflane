import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
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
    '--surf-selected',
    '--surf-control-border',
    '--surf-control-height',
    '--surf-radius-full',
    '--surf-interaction-focus',
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
}
