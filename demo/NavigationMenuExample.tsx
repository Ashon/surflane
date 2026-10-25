import React, { useState } from 'react'
import { NavigationMenu, DirectionProvider } from '@surflane/ui'
import { Flag } from './Flag'
import { routeHref } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/NavigationMenuExample'
export function NavigationMenuExample() {
  const t = text[useLocale().locale]
  const [value, setValue] = useState<'products' | 'learn' | null>(null)
  const [rtl, setRtl] = useState(false),
    [vertical, setVertical] = useState(false),
    [disabled, setDisabled] = useState(false),
    [cancel, setCancel] = useState(false)
  const [current, setCurrent] = useState('workspace')
  const links = [
    {
      id: 'workspace',
      title: t.workspace,
      description: t.workspaceDescription,
    },
    {
      id: 'inventory',
      title: t.inventory,
      description: t.inventoryDescription,
    },
    {
      id: 'docs',
      title: t.documentation,
      description: t.documentationDescription,
    },
  ]
  return (
    <div className='example-stack'>
      <div className='actions'>
        <Flag checked={rtl} onChange={setRtl}>
          {t.rtlPreview}
        </Flag>
        <Flag checked={vertical} onChange={setVertical}>
          {t.verticalNavigation}
        </Flag>
        <Flag checked={disabled} onChange={setDisabled}>
          {t.disableLearn}
        </Flag>
        <Flag checked={cancel} onChange={setCancel}>
          {t.cancelChanges}
        </Flag>
      </div>
      <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
        <div dir={rtl ? 'rtl' : 'ltr'}>
          <NavigationMenu.Root<'products' | 'learn'>
            aria-label={t.platformNavigation}
            value={value}
            orientation={vertical ? 'vertical' : 'horizontal'}
            onValueChange={(next, details) => {
              if (cancel) details.cancel()
              else setValue(next)
            }}
          >
            <NavigationMenu.List>
              <NavigationMenu.Item value='products'>
                <NavigationMenu.Trigger>{t.products}</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <div className='navigation-demo-links'>
                    {links.map((link) => (
                      <NavigationMenu.Link
                        key={link.id}
                        href={`#navigation-${link.id}`}
                        active={current === link.id}
                        closeOnClick
                        onClick={() => setCurrent(link.id)}
                      >
                        <NavigationMenu.LinkTitle>
                          {link.title}
                        </NavigationMenu.LinkTitle>
                        <NavigationMenu.LinkDescription>
                          {link.description}
                        </NavigationMenu.LinkDescription>
                      </NavigationMenu.Link>
                    ))}
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item value='learn'>
                <NavigationMenu.Trigger disabled={disabled}>
                  {t.learn}
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <div className='navigation-demo-links'>
                    <NavigationMenu.Link href='#navigation-guide' closeOnClick>
                      <NavigationMenu.LinkTitle>
                        {t.deploymentGuide}
                      </NavigationMenu.LinkTitle>
                      <NavigationMenu.LinkDescription>
                        {t.deploymentGuideDescription}
                      </NavigationMenu.LinkDescription>
                    </NavigationMenu.Link>
                    <NavigationMenu.Link
                      href={routeHref('/foundations/layout')}
                      closeOnClick
                    >
                      <NavigationMenu.LinkTitle>
                        {t.layoutFoundations}
                      </NavigationMenu.LinkTitle>
                      <NavigationMenu.LinkDescription>
                        {t.layoutFoundationsDescription}
                      </NavigationMenu.LinkDescription>
                    </NavigationMenu.Link>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href='#navigation-guide' closeOnClick>
                  {t.guide}
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Portal>
              <NavigationMenu.Positioner sideOffset={8} collisionPadding={12}>
                <NavigationMenu.Popup
                  aria-label={t.platformNavigationDestinations}
                >
                  <NavigationMenu.Viewport />
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Root>
        </div>
      </DirectionProvider>
      <p role='status'>{t.status(value ?? t.none, current)}</p>
      <div className='navigation-demo-destinations'>
        {links.map((link) => (
          <section
            key={link.id}
            id={`navigation-${link.id}`}
            tabIndex={-1}
            aria-label={link.title}
          >
            <strong>{link.title}</strong>
            <p>{link.description}</p>
          </section>
        ))}
        <section
          id='navigation-guide'
          tabIndex={-1}
          aria-label={t.deploymentGuide}
        >
          <strong>{t.deploymentGuide}</strong>
          <p>{t.guideSectionDescription}</p>
        </section>
      </div>
    </div>
  )
}
