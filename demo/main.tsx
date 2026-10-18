import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { Button, Breadcrumbs, ScrollArea, PageHeader } from '@surflane/ui'
import { transitionTheme } from '@surflane/design-tokens/theme-transition'
import { Overview } from './OverviewPage'
import { LandingHero } from './LandingHero'
import { PointerBlueprint } from './PointerBlueprint'
import { DeferredContent } from './DeferredContent'
const MobileCatalogNavigation = lazy(() => import('./MobileCatalogNavigation'))
const LayersFoundation = lazy(() =>
  import('./LayersFoundation').then((module) => ({
    default: module.LayersFoundation,
  })),
)
const InteractionFoundation = lazy(() =>
  import('./InteractionFoundation').then((module) => ({
    default: module.InteractionFoundation,
  })),
)
const ContentFoundation = lazy(() =>
  import('./ContentFoundation').then((module) => ({
    default: module.ContentFoundation,
  })),
)
const AccessibilityFoundation = lazy(() =>
  import('./AccessibilityFoundation').then((module) => ({
    default: module.AccessibilityFoundation,
  })),
)
const IconographyFoundation = lazy(() =>
  import('./IconographyFoundation').then((module) => ({
    default: module.IconographyFoundation,
  })),
)
const MotionFoundation = lazy(() =>
  import('./MotionFoundation').then((module) => ({
    default: module.MotionFoundation,
  })),
)
const ColorFoundation = lazy(() =>
  import('./ColorFoundation').then((module) => ({
    default: module.ColorFoundation,
  })),
)
const FoundationDemo = lazy(() =>
  import('./FoundationDemo').then((module) => ({
    default: module.FoundationDemo,
  })),
)
const TokenBrowser = lazy(() =>
  import('./TokenBrowser').then((module) => ({ default: module.TokenBrowser })),
)
const InteractionLab = lazy(() =>
  import('./InteractionLab').then((module) => ({
    default: module.InteractionLab,
  })),
)
const FoundationIndex = lazy(() =>
  import('./LibraryPages').then((module) => ({
    default: module.FoundationIndex,
  })),
)
const LibraryIndex = lazy(() =>
  import('./LibraryPages').then((module) => ({ default: module.LibraryIndex })),
)
const DetailPage = lazy(() =>
  import('./DetailPage').then((module) => ({ default: module.DetailPage })),
)
const CoveragePage = lazy(() =>
  import('./CoveragePage').then((module) => ({ default: module.CoveragePage })),
)
import { catalog, components, patterns, itemHref } from './catalog'
import {
  Link,
  normalizeRoute,
  useLocation,
  catalogScrollPosition,
  rememberCatalogScrollPosition,
} from './router'
import '@surflane/design-tokens/tokens.css'
import '@surflane/design-tokens/controls.css'
import '@surflane/design-tokens/motion.css'
import '@surflane/ui/styles.css'
import '@fontsource-variable/manrope'
import '@fontsource-variable/jetbrains-mono'
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import './style.css'
import '@surflane/design-tokens/typography.css'
function App() {
  const location = useLocation(),
    route = normalizeRoute(location)
  const [theme, setTheme] = useState(() => {
    const saved = document.documentElement.dataset.themeMode
    return saved && ['light', 'dark', 'system'].includes(saved)
      ? saved
      : 'light'
  })
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [documentScrolled, setDocumentScrolled] = useState(false)
  const navigationTrigger = useRef<HTMLButtonElement>(null)
  const navigationDestination = useRef<string | null>(null)
  const [mobileNavigation, setMobileNavigation] = useState(
    () => matchMedia('(max-width: 960px)').matches,
  )
  useEffect(() => {
    const media = matchMedia('(max-width: 960px)')
    const change = () => {
      setMobileNavigation(media.matches)
      if (!media.matches) setNavigationOpen(false)
    }
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])
  const closeForNavigation = (destination: string) => {
    if (mobileNavigation) navigationDestination.current = destination
    setNavigationOpen(false)
  }
  const navigationFinalFocus = () => {
    const destination = navigationDestination.current
    navigationDestination.current = null
    if (destination) {
      const target = document.getElementById(destination)
      target?.setAttribute('tabindex', '-1')
      return target
    }
    return matchMedia('(max-width: 960px)').matches
      ? navigationTrigger.current
      : document.querySelector<HTMLElement>('.catalog-brand')
  }
  const mode = useRef(theme),
    firstRoute = useRef(true)
  const applyMode = (next: string) => {
    mode.current = next
    document.documentElement.dataset.themeMode = next
    try {
      document.cookie = `surflane-theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`
    } catch {
      // Storage restrictions must not prevent an in-session theme change.
    }
    void transitionTheme(() => {
      const resolved =
        next === 'system'
          ? matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : next
      document.documentElement.dataset.theme = resolved
      // The mobile browser toolbar changes with the page, in the same frame.
      const chrome = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
      )
      if (chrome?.dataset[resolved]) chrome.content = chrome.dataset[resolved]
      flushSync(() => setTheme(next))
    })
  }
  const toggleTheme = () => {
    const modes = ['light', 'dark', 'system']
    applyMode(modes[(modes.indexOf(mode.current) + 1) % modes.length])
  }
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const changed = () => {
      if (mode.current === 'system') applyMode('system')
    }
    media.addEventListener('change', changed)
    return () => media.removeEventListener('change', changed)
  }, [])
  const item = catalog.find((i) => itemHref(i) === route)
  const pages: Record<string, [string, string, string]> = {
    '/': ['Surflane', 'Design system for platform development', 'Overview'],
    '/foundations': [
      'Foundations',
      'Standards for the layout, typography, color and motion that make up a screen.',
      'Foundations',
    ],
    '/foundations/layout': [
      'Layout',
      'Build operational and reading screens with width, spacing and grids.',
      'Foundations',
    ],
    '/foundations/typography': [
      'Typography',
      'Align the roles and reading rhythm of Hangul, Latin and code text.',
      'Foundations',
    ],
    '/tokens': [
      'Design tokens',
      'Review values and aliases for each theme and reference them in code.',
      'Foundations',
    ],
    '/components': [
      'Components',
      'Find the UI you need and review its examples and usage guidance.',
      'Components',
    ],
    '/patterns': [
      'Patterns',
      'Compose shared components into product workflows.',
      'Patterns',
    ],
    '/coverage': [
      'Coverage',
      'Review the full scope of web UI work and its current implementation status.',
      'Coverage',
    ],
    '/patterns/interaction-lab': [
      'Interaction lab',
      'A combined example that tests input, nested popups, panels and themes together.',
      'Patterns',
    ],
    '/foundations/lab': [
      'Foundation lab',
      'A combined example that tests layout, typography and tokens together.',
      'Foundations',
    ],
  }
  const [title, description, area] =
    pages[route] ??
    (item
      ? [
          item.name,
          item.summary,
          item.kind === 'component'
            ? 'Components'
            : item.kind === 'pattern'
              ? 'Patterns'
              : 'Foundations',
        ]
      : [
          'Page not found',
          'Check the address or find the item in the catalog.',
          'Overview',
        ])
  useEffect(() => {
    document.title = title === 'Surflane' ? title : title + ' | Surflane'
    setNavigationOpen(false)
    const primary = document.querySelector<HTMLElement>(
      '.catalog-primary a[aria-current]',
    )
    const primaryViewport = document.querySelector<HTMLElement>(
      '.catalog-primary-viewport',
    )
    if (primary && primaryViewport) {
      const link = primary.getBoundingClientRect(),
        viewport = primaryViewport.getBoundingClientRect()
      if (link.left < viewport.left)
        primaryViewport.scrollLeft -= viewport.left - link.left
      else if (link.right > viewport.right)
        primaryViewport.scrollLeft += link.right - viewport.right
    }
    if (firstRoute.current) {
      firstRoute.current = false
      return
    }
    // Same-page anchors retain browser anchor behavior; route changes announce the new page.
    document
      .querySelector<HTMLElement>('#page-title')
      ?.focus({ preventScroll: true })
    document
      .querySelector<HTMLElement>('.catalog-document-scroll')
      ?.scrollTo(0, catalogScrollPosition())
  }, [route, title])
  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>(
      '.catalog-navigation-viewport',
    )
    if (!scroller) return
    const reveal = () => {
      if (matchMedia('(max-width: 960px)').matches && !navigationOpen) return
      const active = scroller.querySelector<HTMLElement>(
        'a[aria-current="page"]',
      )
      if (!active) return
      const target = active.getBoundingClientRect(),
        viewport = scroller.getBoundingClientRect()
      const style = getComputedStyle(scroller)
      const room = Math.max(0, (viewport.height - target.height) / 2)
      const start = Math.min(
        parseFloat(style.scrollPaddingBlockStart) || 0,
        room,
      )
      const end = Math.min(parseFloat(style.scrollPaddingBlockEnd) || 0, room)
      // Keep the current item's entire rounded face outside the edge fades.
      // Scrolling locally preserves the Skip link's initial keyboard path.
      if (target.top < viewport.top + start)
        scroller.scrollTop -= viewport.top + start - target.top
      else if (target.bottom > viewport.bottom - end)
        scroller.scrollTop += target.bottom - (viewport.bottom - end)
    }
    reveal()
    const observer = new ResizeObserver(reveal)
    observer.observe(scroller)
    return () => observer.disconnect()
  }, [route, area, navigationOpen])
  const navLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      onClick={(event) => {
        if (
          mobileNavigation &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        )
          closeForNavigation('page-title')
      }}
      aria-current={route === href ? 'page' : undefined}
    >
      {label}
    </Link>
  )
  let content: React.ReactNode
  if (route === '/') content = <Overview />
  else if (route === '/foundations') content = <FoundationIndex />
  else if (route === '/foundations/layers') content = <LayersFoundation />
  else if (route === '/foundations/interaction')
    content = <InteractionFoundation />
  else if (route === '/foundations/content') content = <ContentFoundation />
  else if (route === '/foundations/accessibility')
    content = <AccessibilityFoundation />
  else if (route === '/foundations/iconography')
    content = <IconographyFoundation />
  else if (route === '/foundations/motion')
    content = <MotionFoundation toggleTheme={toggleTheme} />
  else if (route === '/foundations/color') content = <ColorFoundation />
  else if (route === '/foundations/layout')
    content = <FoundationDemo view='layout' />
  else if (route === '/foundations/typography')
    content = <FoundationDemo view='typography' />
  else if (route === '/foundations/lab')
    content = (
      <>
        <FoundationDemo />
        <TokenBrowser />
      </>
    )
  else if (route === '/tokens')
    content = (
      <TokenBrowser
        initialQuery={
          new URLSearchParams(window.location.search).get('q') ?? ''
        }
      />
    )
  else if (route === '/components') content = <LibraryIndex />
  else if (route === '/patterns') content = <LibraryIndex kind='pattern' />
  else if (route === '/coverage') content = <CoveragePage />
  else if (route === '/patterns/interaction-lab')
    content = <InteractionLab toggleTheme={toggleTheme} />
  else if (item) content = <DetailPage item={item} toggleTheme={toggleTheme} />
  else
    content = (
      <p>
        <Link href='/components'>Browse components</Link>
      </p>
    )
  const catalogNavigation = (
    <ScrollArea
      label='Catalog sections'
      orientation='vertical'
      scrollChain='contain'
      rootClassName='catalog-navigation-scroll'
      className='catalog-navigation-viewport'
    >
      <nav id='catalog-navigation-links' aria-label='Catalog navigation'>
        {area === 'Overview' || area === 'Coverage' ? (
          <div className='catalog-nav-group'>
            <span className='catalog-nav-label'>On this page</span>
            {(area === 'Overview'
              ? [
                  ['overview-foundations', 'Start with foundations'],
                  ['overview-components', 'Component pages'],
                  ['overview-direction', 'Design direction'],
                ]
              : [
                  ['coverage-scope', 'Scope and readiness'],
                  ['coverage-waves', 'Delivery waves'],
                  ['coverage-inventory', 'Coverage inventory'],
                  ['coverage-ready', 'Definition of ready'],
                  ['coverage-research', 'Research boundaries'],
                ]
            ).map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => closeForNavigation(id)}
              >
                {label}
              </a>
            ))}
          </div>
        ) : area === 'Foundations' ? (
          <div className='catalog-nav-group'>
            {navLink('/foundations', 'All foundations')}
            {catalog
              .filter((c) => c.kind === 'foundation')
              .map((c) => navLink(itemHref(c), c.name))}
          </div>
        ) : area === 'Components' ? (
          <>
            <div className='catalog-nav-group'>
              {navLink('/components', 'All components')}
            </div>
            {[...new Set(components.map((c) => c.group))].map((group) => (
              <div className='catalog-nav-group' key={group}>
                <span className='catalog-nav-label'>{group}</span>
                {components
                  .filter((c) => c.group === group)
                  .map((c) => navLink(itemHref(c), c.name))}
              </div>
            ))}
          </>
        ) : (
          <div className='catalog-nav-group'>
            {navLink('/patterns', 'All patterns')}
            {patterns.map((c) => navLink(itemHref(c), c.name))}
            {navLink('/patterns/interaction-lab', 'Interaction lab')}
          </div>
        )}
      </nav>
    </ScrollArea>
  )
  return (
    <>
      <PointerBlueprint />
      <a className='catalog-skip' href='#main-content'>
        Skip to content
      </a>
      <div className='catalog-app'>
        <header
          className='catalog-toprail'
          data-scrolled={documentScrolled || undefined}
        >
          <div className='catalog-toprail-inner'>
            <Link className='catalog-brand' href='/' aria-label='Surflane home'>
              <span className='catalog-brand-mark' aria-hidden='true' />
              <span className='catalog-brand-name'>Surflane</span>
            </Link>
            <ScrollArea
              orientation='horizontal'
              label='Primary sections'
              rootClassName='catalog-primary-scroll'
              className='catalog-primary-viewport'
            >
              <nav className='catalog-primary' aria-label='Primary navigation'>
                {[
                  ['/', 'Overview'],
                  ['/foundations', 'Foundations'],
                  ['/components', 'Components'],
                  ['/patterns', 'Patterns'],
                  ['/coverage', 'Coverage'],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    aria-current={
                      area === label
                        ? route === href
                          ? 'page'
                          : 'location'
                        : undefined
                    }
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </ScrollArea>
            <Button
              variant='ghost'
              className='catalog-theme-toggle'
              size='icon'
              aria-description={`Switch to ${theme === 'light' ? 'Dark' : theme === 'dark' ? 'System' : 'Light'} theme`}
              onClick={toggleTheme}
              aria-label={`Toggle theme: ${theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}`}
            >
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                aria-hidden='true'
              >
                {theme === 'light' ? (
                  <>
                    <circle cx='12' cy='12' r='4' />
                    <path d='M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5' />
                  </>
                ) : theme === 'dark' ? (
                  <path d='M20 13.2A8.5 8.5 0 0 1 10.8 4 8.5 8.5 0 1 0 20 13.2Z' />
                ) : (
                  <>
                    <rect x='3' y='4' width='18' height='13' rx='2' />
                    <path d='M8 21h8m-4-4v4' />
                  </>
                )}
              </svg>
            </Button>
            <Button
              ref={navigationTrigger}
              className='catalog-navigation-toggle'
              size='icon'
              aria-label='Browse catalog'
              aria-haspopup='dialog'
              variant='ghost'
              aria-expanded={navigationOpen}
              aria-controls='catalog-navigation-links'
              onClick={() => setNavigationOpen(!navigationOpen)}
            >
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                aria-hidden='true'
              >
                <path d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </Button>
          </div>
        </header>
        <ScrollArea
          tabIndex={-1}
          data-route={route}
          onScroll={(event) => {
            rememberCatalogScrollPosition()
            setDocumentScrolled(event.currentTarget.scrollTop > 1)
          }}
          orientation='vertical'
          scrollChain='contain'
          rootClassName='catalog-document-root'
          className='catalog-document-scroll'
        >
          {route === '/' && <LandingHero />}
          <div className='catalog-shell'>
            <aside
              className='catalog-sidebar'
              aria-label={`${area} navigation`}
            >
              <div className='catalog-navigation'>
                {!mobileNavigation && catalogNavigation}
              </div>
            </aside>
            <main
              id='main-content'
              className='sheet'
              tabIndex={-1}
              data-header-layout={
                route === '/' || route === '/coverage' ? 'title' : 'breadcrumb'
              }
            >
              {route !== '/' && (
                <PageHeader
                  as='header'
                  className='catalog-page-header'
                  title={title}
                  description={description}
                  headingProps={{ id: 'page-title', tabIndex: -1 }}
                  breadcrumb={
                    route !== '/' && route !== '/coverage' ? (
                      <Breadcrumbs.Root>
                        <Breadcrumbs.List>
                          <Breadcrumbs.Item>
                            <Link className='pui-link' href='/'>
                              Surflane
                            </Link>
                          </Breadcrumbs.Item>
                          {title !== area && area !== 'Overview' && (
                            <Breadcrumbs.Item>
                              <Breadcrumbs.Separator />
                              <Link
                                className='pui-link'
                                href={
                                  area === 'Foundations'
                                    ? '/foundations'
                                    : area === 'Components'
                                      ? '/components'
                                      : area === 'Patterns'
                                        ? '/patterns'
                                        : '/coverage'
                                }
                              >
                                {area}
                              </Link>
                            </Breadcrumbs.Item>
                          )}
                          <Breadcrumbs.Item>
                            <Breadcrumbs.Separator />
                            <Breadcrumbs.Current>
                              {route === '/' ? 'Overview' : title}
                            </Breadcrumbs.Current>
                          </Breadcrumbs.Item>
                        </Breadcrumbs.List>
                      </Breadcrumbs.Root>
                    ) : undefined
                  }
                />
              )}
              <div className='catalog-page-body' key={route}>
                <DeferredContent key={route} scope='page'>
                  {content}
                </DeferredContent>
              </div>
            </main>
          </div>
          <footer className='catalog-site-footer'>
            <div className='catalog-site-footer-inner'>
              <span className='catalog-site-footer-brand'>
                <span className='catalog-brand-mark' aria-hidden='true' />
                Surflane
              </span>
              <span>© 2026 ashon · MIT OR Apache-2.0</span>
              <nav aria-label='Project links'>
                <a href='https://github.com/Ashon/surflane'>GitHub</a>
                <a href='https://www.npmjs.com/package/@surflane/ui'>npm</a>
                <a href='https://github.com/Ashon/surflane/blob/main/SECURITY.md'>
                  Security
                </a>
              </nav>
            </div>
          </footer>
        </ScrollArea>
      </div>
      {mobileNavigation && (
        <Suspense fallback={null}>
          <MobileCatalogNavigation
            open={navigationOpen}
            onOpenChange={setNavigationOpen}
            area={area}
            finalFocus={navigationFinalFocus}
          >
            {catalogNavigation}
          </MobileCatalogNavigation>
        </Suspense>
      )}
    </>
  )
}
createRoot(document.getElementById('root')!).render(<App />)
