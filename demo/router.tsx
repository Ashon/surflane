/// <reference types="vite/client" />
import React, { useSyncExternalStore } from 'react'
const positions = new Map<string, number>()
// Routes stay root-relative; a build base such as /surflane/ (a Pages project site without a custom domain) is added at the URL boundary.
// Specs import catalog modules outside Vite, where import.meta.env is undefined.
const basePath = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '')
export function withBase(href: string) {
  return href.startsWith('/') ? basePath + href : href
}
function routePath() {
  const path = location.pathname
  if (path === basePath) return '/'
  return basePath && path.startsWith(basePath + '/')
    ? path.slice(basePath.length)
    : path
}
function entryKey() {
  if (!history.state?.catalogEntry) {
    history.replaceState(
      { ...history.state, catalogEntry: crypto.randomUUID() },
      '',
    )
  }
  return history.state.catalogEntry as string
}
export function rememberCatalogScrollPosition() {
  const viewport = document.querySelector<HTMLElement>(
    '.catalog-document-scroll',
  )
  if (viewport?.dataset.route === normalizeRoute(routePath() + location.hash))
    positions.set(entryKey(), viewport.scrollTop)
}
export function catalogScrollPosition() {
  return positions.get(entryKey()) ?? history.state?.catalogScroll ?? 0
}
const subscribe = (notify: () => void) => {
  window.addEventListener('popstate', notify)
  window.addEventListener('hashchange', notify)
  return () => {
    window.removeEventListener('popstate', notify)
    window.removeEventListener('hashchange', notify)
  }
}
export function useLocation() {
  return useSyncExternalStore(
    subscribe,
    () => routePath() + location.search + location.hash,
  )
}
export function navigate(href: string) {
  rememberCatalogScrollPosition()
  history.replaceState(
    { ...history.state, catalogScroll: catalogScrollPosition() },
    '',
  )
  history.pushState(
    { catalogEntry: crypto.randomUUID(), catalogScroll: 0 },
    '',
    withBase(href),
  )
  window.dispatchEvent(new PopStateEvent('popstate'))
}
export function Link({
  href,
  onClick,
  ...props
}: React.ComponentProps<'a'> & { href: string }) {
  return (
    <a
      {...props}
      href={withBase(href)}
      onClick={(e) => {
        onClick?.(e)
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.altKey ||
          e.shiftKey ||
          props.target ||
          props.download
        )
          return
        if (!href.startsWith('/')) return
        e.preventDefault()
        navigate(href)
      }}
    />
  )
}
export function normalizeRoute(url: string) {
  const [rawPath, hash] = url.split('#')
  const path = rawPath.split('?')[0]
  const legacy: Record<string, string> = {
    layout: '/foundations/layout',
    typography: '/foundations/typography',
    tokens: '/tokens',
    components: '/components',
    'panels-title': '/components/drawer',
    'confirmations-title': '/patterns/inline-confirmation',
  }
  if (path === '/' && hash && legacy[hash]) return legacy[hash]
  return path.replace(/\/$/, '') || '/'
}
