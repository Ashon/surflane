import React, { useState } from 'react'
import { NavigationMenu, Checkbox, DirectionProvider } from '@surflane/ui'
import { withBase } from './router'
function Flag({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label className='pui-choice-label'>
      <Checkbox.Root checked={checked} onCheckedChange={onChange}>
        <Checkbox.Indicator />
      </Checkbox.Root>
      {children}
    </label>
  )
}
export function NavigationMenuExample() {
  const [value, setValue] = useState<'products' | 'learn' | null>(null)
  const [rtl, setRtl] = useState(false),
    [vertical, setVertical] = useState(false),
    [disabled, setDisabled] = useState(false),
    [cancel, setCancel] = useState(false)
  const [current, setCurrent] = useState('workspace')
  const links = [
    {
      id: 'workspace',
      title: 'Workspace',
      description: 'Manage services, pipelines, and deployments.',
    },
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Explore the service inventory and its dependencies.',
    },
    {
      id: 'docs',
      title: 'Documentation',
      description: 'Read shared guides and product documentation.',
    },
  ]
  return (
    <div className='example-stack'>
      <div className='actions'>
        <Flag checked={rtl} onChange={setRtl}>
          RTL preview
        </Flag>
        <Flag checked={vertical} onChange={setVertical}>
          Vertical navigation
        </Flag>
        <Flag checked={disabled} onChange={setDisabled}>
          Disable Learn
        </Flag>
        <Flag checked={cancel} onChange={setCancel}>
          Cancel changes
        </Flag>
      </div>
      <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
        <div dir={rtl ? 'rtl' : 'ltr'}>
          <NavigationMenu.Root<'products' | 'learn'>
            aria-label='Platform navigation'
            value={value}
            orientation={vertical ? 'vertical' : 'horizontal'}
            onValueChange={(next, details) => {
              if (cancel) details.cancel()
              else setValue(next)
            }}
          >
            <NavigationMenu.List>
              <NavigationMenu.Item value='products'>
                <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
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
                        <strong>{link.title}</strong>
                        <span>{link.description}</span>
                      </NavigationMenu.Link>
                    ))}
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item value='learn'>
                <NavigationMenu.Trigger disabled={disabled}>
                  Learn
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <div className='navigation-demo-links'>
                    <NavigationMenu.Link href='#navigation-guide' closeOnClick>
                      <strong>Deployment guide</strong>
                      <span>
                        Understand deployment policies by environment.
                      </span>
                    </NavigationMenu.Link>
                    <NavigationMenu.Link
                      href={withBase('/foundations/layout')}
                      closeOnClick
                    >
                      <strong>Layout foundations</strong>
                      <span>
                        Inspect shared spacing, grid, and content widths.
                      </span>
                    </NavigationMenu.Link>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href='#navigation-guide' closeOnClick>
                  Guide
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Portal>
              <NavigationMenu.Positioner sideOffset={8} collisionPadding={12}>
                <NavigationMenu.Popup aria-label='Platform navigation destinations'>
                  <NavigationMenu.Viewport />
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Root>
        </div>
      </DirectionProvider>
      <p role='status'>
        Open section: {value ?? 'none'}. Current product: {current}.
      </p>
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
          aria-label='Deployment guide'
        >
          <strong>Deployment guide</strong>
          <p>
            Check which environments a policy allows or blocks. Keep redacted
            logs.
          </p>
        </section>
      </div>
    </div>
  )
}
