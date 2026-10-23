/// <reference types="vite/client" />
import React, { useSyncExternalStore } from 'react'
const positions = new Map<string, number>()
// Routes stay root-relative; a build base such as /surflane/ (a Pages project site without a custom domain) is added at the URL boundary.
// Specs import catalog modules outside Vite, where import.meta.env is undefined.
const basePath = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '')
/** A file in the public folder, such as /llms.txt: the base only, in every language. */
export function withBase(href: string) {
  return href.startsWith('/') ? basePath + href : href
}
export type Locale = 'en' | 'ko'
// English pages live at the root and Korean pages under /ko, so each URL holds one
// language and the build can write every page as static HTML.
const koreanPrefix = '/ko'
export function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return path === '/' ? koreanPrefix : koreanPrefix + path
}
function splitLocale(path: string): { locale: Locale; path: string } {
  return path === koreanPrefix || path.startsWith(koreanPrefix + '/')
    ? { locale: 'ko', path: path.slice(koreanPrefix.length) || '/' }
    : { locale: 'en', path }
}
// The prerender sets the URL it renders; in a browser the URL is the document's.
let serverPath: string | undefined
export function setServerPath(path: string) {
  serverPath = path
}
function documentPath() {
  if (serverPath !== undefined) return serverPath
  const path = location.pathname
  if (path === basePath) return '/'
  return basePath && path.startsWith(basePath + '/')
    ? path.slice(basePath.length)
    : path
}
/** The page's own path, with its language and without the base or a trailing slash. */
export function pagePath() {
  return documentPath().replace(/(.)\/$/, '$1')
}
export function urlLocale(): Locale {
  return splitLocale(documentPath()).locale
}
function routePath() {
  return splitLocale(documentPath()).path
}
/** A catalog page in the language being read, with the base. */
export function routeHref(href: string) {
  return href.startsWith('/') ? basePath + localePath(urlLocale(), href) : href
}
// crypto.randomUUID exists only in secure contexts; a dev server opened by LAN or
// Tailscale address is plain HTTP, so the key comes from getRandomValues instead.
const randomKey = () =>
  Array.from(crypto.getRandomValues(new Uint32Array(4)), (part) =>
    part.toString(36),
  ).join('-')
function entryKey() {
  if (!history.state?.catalogEntry) {
    history.replaceState({ ...history.state, catalogEntry: randomKey() }, '')
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
// The prerendered page has no query or fragment, so hydration starts from the path.
export function useLocation() {
  return useSyncExternalStore(
    subscribe,
    () => routePath() + location.search + location.hash,
    routePath,
  )
}
export function useUrlLocale() {
  return useSyncExternalStore(subscribe, urlLocale, urlLocale)
}
/** The same page in another language, in place: the history entry and scroll stay. */
export function switchLocale(locale: Locale) {
  history.replaceState(
    history.state,
    '',
    basePath +
      localePath(locale, routePath()) +
      location.search +
      location.hash,
  )
  window.dispatchEvent(new PopStateEvent('popstate'))
}
const preloads = new Set<(path: string) => Promise<unknown> | undefined>()
/**
 * Lets a page load what a link's page reads before the link is followed, such as its
 * docs. It returns nothing once that is loaded.
 */
export function onPreload(
  preload: (path: string) => Promise<unknown> | undefined,
) {
  preloads.add(preload)
}
function preload(href: string) {
  const path = href.split(/[?#]/)[0]
  return [...preloads].flatMap((preload) => preload(path) ?? [])
}
function startPreload(href: string) {
  // A load that fails here is retried, and reported, when the page renders.
  if (href.startsWith('/'))
    preload(href).forEach((request) => request.catch(() => {}))
}
let navigation = 0
export function navigate(href: string) {
  const ticket = ++navigation
  const pending = preload(href)
  if (!pending.length) return go(href)
  // A page that suspends shows its fallback for at least 300ms, so wait briefly for
  // what the next page reads and render it whole. A newer navigation wins.
  void Promise.race([
    Promise.allSettled(pending),
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]).then(() => {
    if (ticket === navigation) go(href)
  })
}
function go(href: string) {
  rememberCatalogScrollPosition()
  history.replaceState(
    { ...history.state, catalogScroll: catalogScrollPosition() },
    '',
  )
  history.pushState(
    { catalogEntry: randomKey(), catalogScroll: 0 },
    '',
    routeHref(href),
  )
  window.dispatchEvent(new PopStateEvent('popstate'))
}
export function Link({
  href,
  onClick,
  onPointerEnter,
  onFocus,
  ...props
}: React.ComponentProps<'a'> & { href: string }) {
  return (
    <a
      {...props}
      href={routeHref(href)}
      // Pointing at or focusing a link starts loading its page.
      onPointerEnter={(e) => {
        onPointerEnter?.(e)
        startPreload(href)
      }}
      onFocus={(e) => {
        onFocus?.(e)
        startPreload(href)
      }}
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
