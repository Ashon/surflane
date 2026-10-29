import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Banner,
  AppShell,
  Button,
  Checkbox,
  Icon,
  type IconName,
  Menu,
  NavigationMenu,
  PageHeader,
  ScrollArea,
  Sheet,
  ChoiceLabel,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/AppShellExample'
export function AppShellExample({
  toggleTheme,
  id,
}: {
  toggleTheme: () => void
  id?: string
}) {
  const t = text[useLocale().locale]
  const destinations: [string, IconName][] = [
    [t.overview, 'monitor'],
    [t.resources, 'copy'],
    [t.activity, 'play'],
    [t.settings, 'settings'],
  ]
  const responsive = id === 'responsive-navigation'
  const [notice, setNotice] = useState(false)
  const [bar, setBar] = useState(false),
    [section, setSection] = useState(0)
  const [longContent, setLongContent] = useState(false),
    [longNavigation, setLongNavigation] = useState(false)
  const contentViewport = useRef<HTMLDivElement>(null)
  const [longLabels, setLongLabels] = useState(false),
    [readOnly, setReadOnly] = useState(false)
  const sidebar = useRef<HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [view, setView] = useState(t.overview),
    [account, setAccount] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    mobilePanel = useRef<HTMLDivElement>(null),
    selectedInPanel = useRef(false)
  const profile = 'Surflane'
  const previewId = React.useId()
  // The dialog must close when its desktop navigation becomes available.
  useEffect(() => {
    const media = matchMedia('(max-width: 760px)')
    let lastFocused: Element | null = document.activeElement
    const trackFocus = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target !== document.body)
        lastFocused = event.target
    }
    document.addEventListener('focusin', trackFocus)
    const update = () => {
      if (!media.matches) setMobileOpen(false)
      else if (
        sidebar.current?.contains(document.activeElement) ||
        sidebar.current?.contains(lastFocused)
      )
        trigger.current?.focus({ preventScroll: true })
    }
    media.addEventListener('change', update)
    return () => {
      media.removeEventListener('change', update)
      document.removeEventListener('focusin', trackFocus)
    }
  }, [])
  // A new view starts at the top; reset after it renders so the old content's height doesn't matter.
  useLayoutEffect(() => {
    contentViewport.current?.scrollTo({ top: 0 })
  }, [view, account])
  // The sidebar names its links with the visible group label; the sheet titles itself.
  const links = (panel = false) => (
    <AppShell.Nav
      {...(panel
        ? { 'aria-label': t.mobileNavAria }
        : { label: t.workspaceGroup })}
    >
      {[
        ...destinations,
        ...(longNavigation
          ? Array.from({ length: 16 }, (_, index): [string, IconName] => [
              t.savedView(index + 1),
              'copy',
            ])
          : []),
      ]
        .filter(([label]) => !readOnly || label !== t.settings)
        .map(([label, icon]) => (
          <AppShell.Link
            key={label}
            href={`#${previewId}-workspace`}
            label={
              longLabels && label === t.resources ? t.resourcesLongLabel : label
            }
            icon={<Icon name={icon} decorative />}
            aria-current={view === label ? 'page' : undefined}
            onClick={(e) => {
              if (e.button || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)
                return
              e.preventDefault()
              setView(label)
              setAccount(false)
              if (panel) {
                selectedInPanel.current = true
                setMobileOpen(false)
              } else heading.current?.focus({ preventScroll: true })
            }}
          />
        ))}
    </AppShell.Nav>
  )
  // The account row is a Link row rendered as the menu's trigger.
  const accountMenu = (
    <Menu.Root>
      <AppShell.Link
        render={<Menu.Trigger />}
        icon={<Icon name='info' decorative />}
        label={t.previewUser}
        aria-label={t.accountMenuAria}
      />
      <Menu.Portal>
        <Menu.Content>
          <Menu.Item
            onClick={() => {
              setAccount(true)
            }}
          >
            {t.viewPreviewProfile}
          </Menu.Item>
          <Menu.Item onClick={toggleTheme}>{t.switchTheme}</Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
  return (
    <>
      <div className='actions app-shell-preview-options'>
        <ChoiceLabel
          control={
            <Checkbox.Root
              checked={longNavigation}
              onCheckedChange={setLongNavigation}
            >
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.overflowNavigation}
        </ChoiceLabel>
        <ChoiceLabel
          control={
            <Checkbox.Root
              checked={longContent}
              onCheckedChange={setLongContent}
            >
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.longWorkspaceContent}
        </ChoiceLabel>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={notice} onCheckedChange={setNotice}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.systemNotice}
        </ChoiceLabel>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={bar} onCheckedChange={setBar}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.pageBar}
        </ChoiceLabel>
        {responsive && (
          <>
            <ChoiceLabel
              control={
                <Checkbox.Root
                  checked={longLabels}
                  onCheckedChange={setLongLabels}
                >
                  <Checkbox.Indicator />
                </Checkbox.Root>
              }
            >
              {t.longNavigationLabels}
            </ChoiceLabel>
            <ChoiceLabel
              control={
                <Checkbox.Root
                  checked={readOnly}
                  onCheckedChange={(checked) => {
                    setReadOnly(checked)
                    if (checked && view === t.settings) setView(t.overview)
                  }}
                >
                  <Checkbox.Indicator />
                </Checkbox.Root>
              }
            >
              {t.readOnlyNavigation}
            </ChoiceLabel>
          </>
        )}
      </div>
      <div
        className='catalog-example-frame'
        data-kind='pattern'
        data-content='workspace'
      >
        {/* The frame rounds and clips the shell; the shell's own edge is square. */}
        <div className='app-shell-preview-clip'>
          <AppShell.Root
            layout='workspace'
            persist='surflane-preview-sidebar'
            collapseBelow={1280}
            className='app-shell-preview'
          >
            {/* A notice for the whole product spans the shell above everything. */}
            {notice && (
              <Banner.Root
                tone='caution'
                onDismiss={() => setNotice(false)}
                dismissLabel={t.noticeDismiss}
              >
                <Banner.Icon />
                <Banner.Content>
                  <Banner.Title>{t.noticeTitle}</Banner.Title>
                  <Banner.Description>{t.noticeDescription}</Banner.Description>
                </Banner.Content>
              </Banner.Root>
            )}
            <AppShell.Header>
              <AppShell.Brand
                mark={<Icon name='monitor' decorative />}
                name={profile}
              />
              {/* The same bottom sheet as the catalog's own mobile menu. */}
              <Sheet.Root
                side='bottom'
                open={mobileOpen}
                onOpenChange={(open) => setMobileOpen(open)}
              >
                <Sheet.Trigger
                  render={
                    <AppShell.MenuTrigger
                      ref={trigger}
                      label={t.openNavAria}
                      onClick={() => {
                        selectedInPanel.current = false
                      }}
                    />
                  }
                />
                <Sheet.Content
                  ref={mobilePanel}
                  className='app-shell-mobile-panel navigation-sheet'
                  flush
                  aria-modal='true'
                  closeLabel={t.closeNav}
                  initialFocus={() =>
                    mobilePanel.current?.querySelector<HTMLElement>(
                      'a[aria-current="page"]',
                    ) ?? true
                  }
                  finalFocus={() => {
                    if (matchMedia('(min-width: 761px)').matches)
                      return (
                        sidebar.current?.querySelector<HTMLElement>(
                          'a[aria-current="page"]',
                        ) ?? heading.current
                      )
                    return selectedInPanel.current
                      ? heading.current
                      : trigger.current
                  }}
                >
                  <Sheet.Header>
                    <Sheet.Title>{t.workspaceNavigation}</Sheet.Title>
                    <Sheet.Description>{t.sheetDescription}</Sheet.Description>
                  </Sheet.Header>
                  <Sheet.Body>{links(true)}</Sheet.Body>
                  <Sheet.Footer stacked>
                    {accountMenu}
                    <Button
                      variant='secondary'
                      onClick={() => setMobileOpen(false)}
                    >
                      {t.closeMenu}
                    </Button>
                  </Sheet.Footer>
                </Sheet.Content>
              </Sheet.Root>
            </AppShell.Header>
            <AppShell.Sidebar ref={sidebar} aria-label={t.sidebarAria}>
              <AppShell.Brand
                mark={<span className='catalog-brand-mark' />}
                name={profile}
                data-blueprint-guide
              />
              <AppShell.SidebarToggle
                labels={{
                  collapse: t.collapseSidebar,
                  expand: t.expandSidebar,
                }}
              />
              <ScrollArea
                orientation='vertical'
                label={t.destinationsLabel}
                rootClassName='app-shell-menu-scroll'
              >
                {links()}
              </ScrollArea>
              <AppShell.Footer>{accountMenu}</AppShell.Footer>
            </AppShell.Sidebar>
            <AppShell.Content
              id={`${previewId}-workspace`}
              ref={(element) => {
                heading.current = element?.querySelector('h3') ?? null
              }}
            >
              <ScrollArea
                ref={contentViewport}
                orientation='vertical'
                fade='none'
                label={t.contentLabel}
                rootClassName='app-shell-content-scroll'
                className='app-shell-content-viewport'
              >
                <AppShell.Page>
                  {/* The page's own tabs, at its top on the brand row's line. */}
                  {bar && (
                    <AppShell.Bar>
                      <NavigationMenu.Root aria-label={t.pageLinks(view)}>
                        <NavigationMenu.List>
                          {t.pageSections.map((name, index) => (
                            <NavigationMenu.Item key={name}>
                              <NavigationMenu.Link
                                href={`#${previewId}-section-${index}`}
                                active={index === section}
                                onClick={(event) => {
                                  event.preventDefault()
                                  setSection(index)
                                }}
                              >
                                {name}
                              </NavigationMenu.Link>
                            </NavigationMenu.Item>
                          ))}
                        </NavigationMenu.List>
                      </NavigationMenu.Root>
                    </AppShell.Bar>
                  )}
                  <PageHeader
                    title={view}
                    level={3}
                    headingProps={{ tabIndex: -1 }}
                    description={t.previewDescription(profile)}
                  />
                  <p>{t.separateNote}</p>
                  <p>{t.productNote}</p>
                  {longContent &&
                    Array.from({ length: 12 }, (_, index) => (
                      <section key={index}>
                        <h4>{t.sectionHeading(index + 1)}</h4>
                        <p>{t.scrollSample}</p>
                      </section>
                    ))}
                  {account && <p role='status'>{t.previewProfileStatus}</p>}
                </AppShell.Page>
              </ScrollArea>
            </AppShell.Content>
          </AppShell.Root>
        </div>
      </div>
    </>
  )
}
