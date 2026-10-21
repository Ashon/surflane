import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { Button, Breadcrumbs, ScrollArea, PageHeader } from '@surflane/ui'
import { transitionTheme } from '@surflane/design-tokens/theme-transition'
import { Overview } from './OverviewPage'
import { LandingHero } from './LandingHero'
import { DeferredContent } from './DeferredContent'
const MobileCatalogNavigation = lazy(() => import('./MobileCatalogNavigation'))
// The decorative guide overlay waits for the first screen anyway; it loads after it.
const PointerBlueprint = lazy(() =>
  import('./PointerBlueprint').then((module) => ({
    default: module.PointerBlueprint,
  })),
)
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
const ThemeFoundation = lazy(() => import('./ThemeFoundation'))
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
  withBase,
} from './router'
import {
  documentLocale,
  loadKorean,
  LocaleProvider,
  localeNames,
  useLocale,
  useMessages,
} from './i18n'
import { useCatalogText } from './catalogText'
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
  const { locale, setLocale } = useLocale(),
    messages = useMessages()
  const text = useCatalogText()
  const nextLocale = locale === 'en' ? 'ko' : 'en'
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
  const primaryViewport = useRef<HTMLDivElement>(null)
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
  const pageAreas: Record<string, string> = {
    '/': 'Overview',
    '/foundations': 'Foundations',
    '/foundations/layout': 'Foundations',
    '/foundations/typography': 'Foundations',
    '/tokens': 'Foundations',
    '/components': 'Components',
    '/patterns': 'Patterns',
    '/coverage': 'Coverage',
    '/patterns/interaction-lab': 'Patterns',
    '/foundations/lab': 'Foundations',
  }
  const [title, description, area] =
    messages.pages[route] && pageAreas[route]
      ? [messages.pages[route][0], messages.pages[route][1], pageAreas[route]]
      : item
        ? [
            text.name(item),
            text.summary(item),
            item.kind === 'component'
              ? 'Components'
              : item.kind === 'pattern'
                ? 'Patterns'
                : 'Foundations',
          ]
        : [messages.notFound[0], messages.notFound[1], 'Overview']
  const areaName = messages.areas[area as keyof typeof messages.areas]
  useEffect(() => {
    document.title = title === 'Surflane' ? title : title + ' | Surflane'
    setNavigationOpen(false)
    const reveal = () => {
      const primary = document.querySelector<HTMLElement>(
        '.catalog-primary a[aria-current]',
      )
      const primaryViewport = document.querySelector<HTMLElement>(
        '.catalog-primary-viewport',
      )
      if (!primary || !primaryViewport) return
      const link = primary.getBoundingClientRect(),
        viewport = primaryViewport.getBoundingClientRect()
      if (link.left < viewport.left)
        primaryViewport.scrollLeft -= viewport.left - link.left
      else if (link.right > viewport.right)
        primaryViewport.scrollLeft += link.right - viewport.right
    }
    reveal()
    // Web fonts widen the tabs once they load; reveal the current tab again then.
    void document.fonts.ready.then(reveal)
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
  // On small screens the primary sections scroll; keep the current one clear of the edge fade.
  useEffect(() => {
    const viewport = primaryViewport.current
    const current = viewport?.querySelector<HTMLElement>('[aria-current]')
    if (!viewport || !current) return
    const view = viewport.getBoundingClientRect(),
      item = current.getBoundingClientRect(),
      inset = 24
    if (item.left < view.left + inset)
      viewport.scrollLeft -= view.left + inset - item.left
    else if (item.right > view.right - inset)
      viewport.scrollLeft += item.right - (view.right - inset)
  }, [area])
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
  else if (route === '/foundations/themes') content = <ThemeFoundation />
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
        <Link href='/components'>{messages.browseComponents}</Link>
      </p>
    )
  const catalogNavigation = (
    <ScrollArea
      label={messages.catalogSections}
      orientation='vertical'
      scrollChain='contain'
      rootClassName='catalog-navigation-scroll'
      className='catalog-navigation-viewport'
    >
      <nav
        id='catalog-navigation-links'
        aria-label={messages.catalogNavigation}
      >
        {area === 'Overview' || area === 'Coverage' ? (
          <div className='catalog-nav-group'>
            <span className='catalog-nav-label'>{messages.onThisPage}</span>
            {(area === 'Overview'
              ? [
                  'overview-foundations',
                  'overview-components',
                  'overview-direction',
                ]
              : [
                  'coverage-scope',
                  'coverage-waves',
                  'coverage-inventory',
                  'coverage-ready',
                  'coverage-research',
                ]
            ).map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => closeForNavigation(id)}
              >
                {messages.sections[id as keyof typeof messages.sections]}
              </a>
            ))}
          </div>
        ) : area === 'Foundations' ? (
          <div className='catalog-nav-group'>
            {navLink('/foundations', messages.allFoundations)}
            {catalog
              .filter((c) => c.kind === 'foundation')
              .map((c) => navLink(itemHref(c), text.name(c)))}
          </div>
        ) : area === 'Components' ? (
          <>
            <div className='catalog-nav-group'>
              {navLink('/components', messages.allComponents)}
            </div>
            {[...new Set(components.map((c) => c.group))].map((group) => (
              <div className='catalog-nav-group' key={group}>
                <span className='catalog-nav-label'>{text.group(group)}</span>
                {components
                  .filter((c) => c.group === group)
                  .map((c) => navLink(itemHref(c), text.name(c)))}
              </div>
            ))}
          </>
        ) : (
          <div className='catalog-nav-group'>
            {navLink('/patterns', messages.allPatterns)}
            {patterns.map((c) => navLink(itemHref(c), text.name(c)))}
            {navLink('/patterns/interaction-lab', messages.interactionLab)}
          </div>
        )}
      </nav>
    </ScrollArea>
  )
  return (
    <>
      <Suspense fallback={null}>
        <PointerBlueprint />
      </Suspense>
      <a className='catalog-skip' href='#main-content'>
        {messages.skipToContent}
      </a>
      {/* Ambient guide probes drift over the whole catalog; see PointerBlueprint. */}
      <div className='catalog-app' data-blueprint-ambient='running'>
        <header
          className='catalog-toprail'
          data-blueprint-ambient-avoid
          data-scrolled={documentScrolled || undefined}
        >
          <div className='catalog-toprail-inner'>
            <Link
              className='catalog-brand'
              href='/'
              aria-label={messages.brandHome}
              data-blueprint-ambient-anchor
            >
              <span className='catalog-brand-mark' aria-hidden='true' />
              <span className='catalog-brand-name'>Surflane</span>
            </Link>
            <ScrollArea
              ref={primaryViewport}
              orientation='horizontal'
              label={messages.primarySections}
              rootClassName='catalog-primary-scroll'
              className='catalog-primary-viewport'
            >
              <nav
                className='catalog-primary'
                aria-label={messages.primaryNavigation}
              >
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
                    {messages.areas[label as keyof typeof messages.areas]}
                  </Link>
                ))}
              </nav>
            </ScrollArea>
            <Button
              variant='ghost'
              className='catalog-theme-toggle'
              size='icon'
              aria-description={messages.switchTheme(
                messages.themes[
                  theme === 'light'
                    ? 'dark'
                    : theme === 'dark'
                      ? 'system'
                      : 'light'
                ],
              )}
              onClick={toggleTheme}
              aria-label={messages.toggleTheme(
                messages.themes[theme as keyof typeof messages.themes],
              )}
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
              variant='ghost'
              className='catalog-locale-toggle'
              size='icon'
              aria-label={messages.language(localeNames[locale])}
              aria-description={messages.switchLanguageTo(
                localeNames[nextLocale],
              )}
              title={messages.switchLanguageTo(localeNames[nextLocale])}
              onClick={() => setLocale(nextLocale)}
            >
              <span
                className='catalog-locale-glyph'
                lang={nextLocale}
                aria-hidden='true'
              >
                {nextLocale === 'ko' ? '가' : 'A'}
              </span>
            </Button>
            <Button
              ref={navigationTrigger}
              className='catalog-navigation-toggle'
              size='icon'
              aria-label={messages.browseCatalog}
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
              aria-label={messages.areaNavigation(areaName)}
            >
              <div className='catalog-navigation'>
                {!mobileNavigation && catalogNavigation}
              </div>
            </aside>
            <main id='main-content' className='sheet' tabIndex={-1}>
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
                          {title !== areaName && area !== 'Overview' && (
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
                                {areaName}
                              </Link>
                            </Breadcrumbs.Item>
                          )}
                          <Breadcrumbs.Item>
                            <Breadcrumbs.Separator />
                            <Breadcrumbs.Current>
                              {route === '/' ? messages.areas.Overview : title}
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
              <span>{messages.license}</span>
              {/* Plain text docs for AI tools; the catalog itself is a single-page app. */}
              <a href={withBase('/llms.txt')}>llms.txt</a>
              <nav aria-label={messages.projectLinks}>
                <a href='https://github.com/Ashon/surflane'>GitHub</a>
                <a href='https://www.npmjs.com/package/@surflane/ui'>npm</a>
                <a href='https://github.com/Ashon/surflane/blob/main/SECURITY.md'>
                  {messages.security}
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
const root = createRoot(document.getElementById('root')!)
const render = () =>
  root.render(
    <LocaleProvider>
      <App />
    </LocaleProvider>,
  )
// Korean readers wait for the Korean chunk, so the first paint is already in Korean.
if (documentLocale() === 'ko')
  loadKorean().then(render, (error) => {
    console.error(error)
    document.documentElement.lang = 'en'
    render()
  })
else render()
