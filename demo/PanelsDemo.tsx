import React from 'react'
import {
  Grid,
  Card,
  Heading,
  Inline,
  List,
  Stack,
  Text,
  Field,
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
      <Stack gap={6}>
        <Text color='secondary'>{t.intro}</Text>
        <Grid columns={view === 'all' ? 2 : 1} gap={4}>
          {view !== 'drawer' && (
            <Card.Root>
              <Card.Header>
                <Text as='div' variant='caption' color='secondary'>
                  {t.detailsEyebrow}
                </Text>
                <Card.Title>{t.sideSheets}</Card.Title>
                <Card.Description>{t.sideSheetsNote}</Card.Description>
              </Card.Header>
              <Inline gap={2}>
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
                          <Stack gap={6}>
                            <Card.Root padding={5}>
                              <Card.Header>
                                <Text
                                  as='div'
                                  variant='caption'
                                  color='secondary'
                                >
                                  {t.environmentEyebrow}
                                </Text>
                                <Text weight='medium'>DEMO main</Text>
                                <Card.Description>
                                  demo.example.com / Staging
                                </Card.Description>
                              </Card.Header>
                            </Card.Root>
                            <Field.Root>
                              <Field.Label>{t.environmentLabel}</Field.Label>
                              <Select
                                defaultValue='staging'
                                options={[
                                  { value: 'staging', label: t.staging },
                                  { value: 'production', label: t.production },
                                ]}
                              />
                            </Field.Root>
                            <Stack gap={3}>
                              <Heading
                                level={3}
                                variant='subsection'
                                id={`panel-history-${side}`}
                              >
                                {t.deploymentHistory}
                              </Heading>
                              <List.Root
                                aria-labelledby={`panel-history-${side}`}
                              >
                                {Array.from({ length: 18 }, (_, i) => (
                                  <List.Item key={i}>
                                    <List.Content>
                                      <List.Title>
                                        {t.deployment(
                                          String(i + 1).padStart(2, '0'),
                                        )}
                                      </List.Title>
                                      <List.Description>
                                        {t.deploymentNote}
                                      </List.Description>
                                    </List.Content>
                                  </List.Item>
                                ))}
                              </List.Root>
                            </Stack>
                          </Stack>
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
              </Inline>
            </Card.Root>
          )}
          {view !== 'sheet' && (
            <Card.Root>
              <Card.Header>
                <Text as='div' variant='caption' color='secondary'>
                  {t.quickActionEyebrow}
                </Text>
                <Card.Title>{t.bottomDrawer}</Card.Title>
                <Card.Description>{t.bottomDrawerNote}</Card.Description>
              </Card.Header>
              <Inline gap={2}>
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
                      <Stack gap={6}>
                        <Grid columns={2} gap={5}>
                          <Field.Root>
                            <Field.Label>{t.runName}</Field.Label>
                            <Input
                              placeholder={t.runNamePlaceholder}
                              name='previewName'
                            />
                          </Field.Root>
                          <Field.Root>
                            <Field.Label>{t.targetEnvironment}</Field.Label>
                            <Select
                              defaultValue='staging'
                              options={[
                                { value: 'staging', label: t.staging },
                                { value: 'production', label: t.production },
                              ]}
                            />
                          </Field.Root>
                        </Grid>
                        <Card.Root padding={5}>
                          <Card.Header>
                            <Text weight='medium'>{t.environmentAccess}</Text>
                            <Card.Description>
                              {t.checksSummary}
                            </Card.Description>
                          </Card.Header>
                        </Card.Root>
                        <Inline>
                          <Sheet.Root>
                            <Sheet.Trigger
                              render={<Button variant='outline' />}
                            >
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
                        </Inline>
                      </Stack>
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
              </Inline>
            </Card.Root>
          )}
        </Grid>
      </Stack>
    </section>
  )
}
