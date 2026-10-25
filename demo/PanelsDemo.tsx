import React from 'react'
import {
  Button,
  Drawer,
  Sheet,
  Input,
  Select,
  type PanelSide,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/PanelsDemo'

export function PanelsDemo({
  toggleTheme,
  view = 'all',
}: {
  toggleTheme: () => void
  view?: 'all' | 'sheet' | 'drawer'
}) {
  const t = text[useLocale().locale]
  return (
    <section aria-labelledby='panels-title'>
      <h2 id='panels-title'>{t.title}</h2>
      <p className='note'>{t.intro}</p>
      <div className='panel-examples' data-single={view !== 'all' || undefined}>
        {view !== 'drawer' && (
          <div className='panel-example'>
            <div className='eyebrow'>{t.detailsEyebrow}</div>
            <h3>{t.sideSheets}</h3>
            <p>{t.sideSheetsNote}</p>
            <div className='actions'>
              {(['left', 'right', 'top', 'bottom'] as PanelSide[]).map(
                (side) => (
                  <Sheet.Root side={side} key={side}>
                    <Sheet.Trigger render={<Button variant='outline' />}>
                      {t.openSheet(side)}
                    </Sheet.Trigger>
                    <Sheet.Content closeLabel={t.closeSheet(side)}>
                      <Sheet.Header>
                        <Sheet.Title>{t.sheetTitle(side)}</Sheet.Title>
                        <Sheet.Description>
                          {t.sheetDescription}
                        </Sheet.Description>
                      </Sheet.Header>
                      <Sheet.Body
                        aria-label={t.environmentDetails}
                        tabIndex={0}
                      >
                        <div className='panel-summary'>
                          <span className='eyebrow'>
                            {t.environmentEyebrow}
                          </span>
                          <strong>DEMO main</strong>
                          <span>demo.example.com / Staging</span>
                        </div>
                        <label>
                          {t.environmentLabel}
                          <Select
                            aria-label={t.sheetEnvironment}
                            defaultValue='staging'
                            options={[
                              { value: 'staging', label: t.staging },
                              { value: 'production', label: t.production },
                            ]}
                          />
                        </label>
                        <h3>{t.deploymentHistory}</h3>
                        <ol className='panel-history'>
                          {Array.from({ length: 18 }, (_, i) => (
                            <li key={i}>
                              <span>
                                {t.deployment(String(i + 1).padStart(2, '0'))}
                              </span>
                              <span>{t.deploymentNote}</span>
                            </li>
                          ))}
                        </ol>
                      </Sheet.Body>
                      <Sheet.Footer>
                        <Button variant='ghost' onClick={toggleTheme}>
                          {t.cyclePanelTheme}
                        </Button>
                        <Sheet.Close render={<Button variant='outline' />}>
                          {t.done}
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
            <div className='eyebrow'>{t.quickActionEyebrow}</div>
            <h3>{t.bottomDrawer}</h3>
            <p>{t.bottomDrawerNote}</p>
            <div className='actions'>
              <Drawer.Root>
                <Drawer.Trigger render={<Button variant='outline' />}>
                  {t.openBottomDrawer}
                </Drawer.Trigger>
                <Drawer.Content closeLabel={t.closeDrawer}>
                  <Drawer.Header>
                    <Drawer.Title>{t.prepareDeployment}</Drawer.Title>
                    <Drawer.Description>{t.previewNote}</Drawer.Description>
                  </Drawer.Header>
                  <Drawer.Body>
                    <div className='grid'>
                      <label>
                        {t.runName}
                        <Input
                          placeholder={t.runNamePlaceholder}
                          name='previewName'
                        />
                      </label>
                      <label>
                        {t.targetEnvironment}
                        <Select
                          aria-label={t.targetEnvironment}
                          defaultValue='staging'
                          options={[
                            { value: 'staging', label: t.staging },
                            { value: 'production', label: t.production },
                          ]}
                        />
                      </label>
                    </div>
                    <div className='panel-summary'>
                      <strong>{t.environmentAccess}</strong>
                      <span>{t.checksSummary}</span>
                    </div>
                    <Sheet.Root>
                      <Sheet.Trigger render={<Button variant='outline' />}>
                        {t.reviewDrawerDetails}
                      </Sheet.Trigger>
                      <Sheet.Content closeLabel={t.closeNestedSheet}>
                        <Sheet.Header>
                          <Sheet.Title>{t.deploymentDetails}</Sheet.Title>
                          <Sheet.Description>
                            {t.nestedSheetDescription}
                          </Sheet.Description>
                        </Sheet.Header>
                        <Sheet.Body>
                          <p>{t.nestedSheetBody}</p>
                        </Sheet.Body>
                        <Sheet.Footer>
                          <Sheet.Close render={<Button />}>
                            {t.backToDrawer}
                          </Sheet.Close>
                        </Sheet.Footer>
                      </Sheet.Content>
                    </Sheet.Root>
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Button variant='ghost' onClick={toggleTheme}>
                      {t.cyclePanelTheme}
                    </Button>
                    <Drawer.Close render={<Button variant='outline' />}>
                      {t.cancelPreview}
                    </Drawer.Close>
                    <Drawer.Close render={<Button />}>
                      {t.confirmPreview}
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
