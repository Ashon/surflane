import React from 'react'
import {
  Button,
  Drawer,
  Sheet,
  Input,
  Select,
  type PanelSide,
} from '@surflane/ui'

export function PanelsDemo({
  toggleTheme,
  view = 'all',
}: {
  toggleTheme: () => void
  view?: 'all' | 'sheet' | 'drawer'
}) {
  return (
    <section aria-labelledby='panels-title'>
      <h2 id='panels-title'>Drawers and sheets</h2>
      <p className='note'>
        Review details or continue a task without leaving the screen. A Sheet
        opens from a chosen side. A Drawer is a task panel that closes with a
        swipe.
      </p>
      <div className='panel-examples' data-single={view !== 'all' || undefined}>
        {view !== 'drawer' && (
          <div className='panel-example'>
            <div className='eyebrow'>DETAILS / SETTINGS</div>
            <h3>Side sheets</h3>
            <p>
              Fixed header and actions, with a body that scrolls independently.
            </p>
            <div className='actions'>
              {(['left', 'right', 'top', 'bottom'] as PanelSide[]).map(
                (side) => (
                  <Sheet.Root side={side} key={side}>
                    <Sheet.Trigger render={<Button variant='outline' />}>
                      Open {side} sheet
                    </Sheet.Trigger>
                    <Sheet.Content closeLabel={`Close ${side} sheet`}>
                      <Sheet.Header>
                        <Sheet.Title>
                          {side[0].toUpperCase() + side.slice(1)} sheet
                        </Sheet.Title>
                        <Sheet.Description>
                          Review the selected environment and its deployment
                          history.
                        </Sheet.Description>
                      </Sheet.Header>
                      <Sheet.Body aria-label='Environment details' tabIndex={0}>
                        <div className='panel-summary'>
                          <span className='eyebrow'>ENVIRONMENT</span>
                          <strong>DEMO main</strong>
                          <span>demo.example.com / Staging</span>
                        </div>
                        <label>
                          Environment
                          <Select
                            aria-label='Sheet environment'
                            defaultValue='staging'
                            options={[
                              { value: 'staging', label: 'Staging' },
                              { value: 'production', label: 'Production' },
                            ]}
                          />
                        </label>
                        <h3>Deployment history</h3>
                        <ol className='panel-history'>
                          {Array.from({ length: 18 }, (_, i) => (
                            <li key={i}>
                              <span>
                                Deployment {String(i + 1).padStart(2, '0')}
                              </span>
                              <span>Build, smoke test, and health checks</span>
                            </li>
                          ))}
                        </ol>
                      </Sheet.Body>
                      <Sheet.Footer>
                        <Button variant='ghost' onClick={toggleTheme}>
                          Cycle panel theme
                        </Button>
                        <Sheet.Close render={<Button variant='outline' />}>
                          Done
                        </Sheet.Close>
                      </Sheet.Footer>
                    </Sheet.Content>
                  </Sheet.Root>
                ),
              )}
            </div>
          </div>
        )}
        {view !== 'sheet' && (
          <div className='panel-example'>
            <div className='eyebrow'>QUICK ACTION / MOBILE</div>
            <h3>Bottom drawer</h3>
            <p>A task panel for touch, mouse gestures, and the keyboard.</p>
            <div className='actions'>
              <Drawer.Root>
                <Drawer.Trigger render={<Button variant='outline' />}>
                  Open bottom drawer
                </Drawer.Trigger>
                <Drawer.Content closeLabel='Close drawer'>
                  <Drawer.Header>
                    <Drawer.Title>Prepare deployment</Drawer.Title>
                    <Drawer.Description>
                      This preview doesn't start a real deployment.
                    </Drawer.Description>
                  </Drawer.Header>
                  <Drawer.Body>
                    <div className='grid'>
                      <label>
                        Run name
                        <Input
                          placeholder='e.g. Staging rollout review'
                          name='previewName'
                        />
                      </label>
                      <label>
                        Target environment
                        <Select
                          aria-label='Drawer environment'
                          defaultValue='staging'
                          options={[
                            { value: 'staging', label: 'Staging' },
                            { value: 'production', label: 'Production' },
                          ]}
                        />
                      </label>
                    </div>
                    <div className='panel-summary'>
                      <strong>Environment access and project isolation</strong>
                      <span>
                        10 checks / temporary credentials / cleanup included
                      </span>
                    </div>
                    <Sheet.Root>
                      <Sheet.Trigger render={<Button variant='outline' />}>
                        Review drawer details
                      </Sheet.Trigger>
                      <Sheet.Content closeLabel='Close nested sheet'>
                        <Sheet.Header>
                          <Sheet.Title>Deployment details</Sheet.Title>
                          <Sheet.Description>
                            A Sheet nested on top of the Drawer. Closing it
                            returns to the previous task.
                          </Sheet.Description>
                        </Sheet.Header>
                        <Sheet.Body>
                          <p>
                            Authentication, environment access, and project
                            isolation.
                          </p>
                        </Sheet.Body>
                        <Sheet.Footer>
                          <Sheet.Close render={<Button />}>
                            Back to drawer
                          </Sheet.Close>
                        </Sheet.Footer>
                      </Sheet.Content>
                    </Sheet.Root>
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Button variant='ghost' onClick={toggleTheme}>
                      Cycle panel theme
                    </Button>
                    <Drawer.Close render={<Button variant='outline' />}>
                      Cancel preview
                    </Drawer.Close>
                    <Drawer.Close render={<Button />}>
                      Confirm preview
                    </Drawer.Close>
                  </Drawer.Footer>
                </Drawer.Content>
              </Drawer.Root>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
