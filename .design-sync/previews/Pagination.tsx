import { Pagination } from '@surflane/ui'

// Host setup, as the install guide gives it.
document.documentElement.dataset.theme = 'light'
document.body.classList.add('surf-typography')

const noop = () => {}

export const Default = () => (
  <Pagination
    page={4}
    pageCount={12}
    onPageChange={noop}
    aria-label='Deployment pages'
  />
)

export const FirstPage = () => (
  <Pagination
    page={1}
    pageCount={8}
    onPageChange={noop}
    aria-label='Pipeline run pages'
  />
)

export const FewPages = () => (
  <Pagination
    page={2}
    pageCount={3}
    onPageChange={noop}
    aria-label='Audit log pages'
  />
)

export const WideSiblings = () => (
  <Pagination
    page={10}
    pageCount={40}
    siblings={2}
    getPageHref={(page) => `#runs-page-${page}`}
    aria-label='Build pages'
  />
)

export const Disabled = () => (
  <Pagination
    page={3}
    pageCount={9}
    disabled
    onPageChange={noop}
    aria-label='Service pages, loading'
  />
)
