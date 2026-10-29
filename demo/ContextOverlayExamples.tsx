import React, { useState } from 'react'
import {
  Inline,
  Stack,
  Surface,
  Text,
  ContextMenu,
  Menu,
  PreviewCard,
  Checkbox,
  DirectionProvider,
  ChoiceLabel,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ContextOverlayExamples'
export { contextOverlayExampleIds } from './exampleGroups'
function Items({
  pinned,
  setPinned,
  setAction,
}: {
  pinned: boolean
  setPinned: (value: boolean) => void
  setAction: (value: string) => void
}) {
  const t = text[useLocale().locale]
  return (
    <>
      <Menu.Item onClick={() => setAction(t.logPreviewOpened)}>
        {t.openLogs}
      </Menu.Item>
      <Menu.CheckboxItem checked={pinned} onCheckedChange={setPinned}>
        <Menu.CheckboxItemIndicator />
        {t.pinLogs}
      </Menu.CheckboxItem>
      <Menu.Item disabled>{t.deleteLogs}</Menu.Item>
      <Menu.Separator />
      <Menu.SubmenuRoot>
        <Menu.SubmenuTrigger>{t.export}</Menu.SubmenuTrigger>
        <Menu.Portal>
          <ContextMenu.Content>
            <Menu.Item onClick={() => setAction(t.jsonExportPreviewed)}>
              {t.jsonLogs}
            </Menu.Item>
          </ContextMenu.Content>
        </Menu.Portal>
      </Menu.SubmenuRoot>
    </>
  )
}

export function ContextOverlayExample({ id }: { id: string }) {
  const t = text[useLocale().locale]
  const [pinned, setPinned] = useState(false)
  const [action, setAction] = useState(t.noLogActionTaken)
  const [disabled, setDisabled] = useState(false)
  const [rtl, setRtl] = useState(false)
  const [cancel, setCancel] = useState(false)
  if (id === 'context-menu')
    return (
      <Stack gap={5}>
        <Inline gap={3}>
          <ChoiceLabel
            control={
              <Checkbox.Root checked={disabled} onCheckedChange={setDisabled}>
                <Checkbox.Indicator />
              </Checkbox.Root>
            }
          >
            {t.disableContextMenu}
          </ChoiceLabel>
          <ChoiceLabel
            control={
              <Checkbox.Root checked={rtl} onCheckedChange={setRtl}>
                <Checkbox.Indicator />
              </Checkbox.Root>
            }
          >
            {t.rtlPreview}
          </ChoiceLabel>
        </Inline>
        <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
          <Surface dir={rtl ? 'rtl' : 'ltr'} padding={5}>
            <Stack gap={4}>
              <ContextMenu.Root disabled={disabled}>
                <ContextMenu.Trigger
                  className='context-evidence-target'
                  aria-describedby='context-hint'
                >
                  <Stack gap={2}>
                    <Text weight='medium'>{t.platformApiBuildLogs}</Text>
                    <Text id='context-hint' color='secondary'>
                      {t.contextHint}
                    </Text>
                  </Stack>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Content
                    aria-label={t.logContextActions}
                    collisionPadding={12}
                  >
                    <Items
                      pinned={pinned}
                      setPinned={setPinned}
                      setAction={setAction}
                    />
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
              <Inline>
                <Menu.Root>
                  <Menu.Trigger>{t.logActions}</Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Content aria-label={t.logActions}>
                      <Items
                        pinned={pinned}
                        setPinned={setPinned}
                        setAction={setAction}
                      />
                    </Menu.Content>
                  </Menu.Portal>
                </Menu.Root>
              </Inline>
            </Stack>
          </Surface>
        </DirectionProvider>
        <Text color='secondary' role='status'>
          {action} {pinned ? t.logsPinned : t.logsUnpinned}
        </Text>
      </Stack>
    )
  return (
    <Stack gap={5}>
      <ChoiceLabel
        control={
          <Checkbox.Root checked={cancel} onCheckedChange={setCancel}>
            <Checkbox.Indicator />
          </Checkbox.Root>
        }
      >
        {t.cancelPreviewOpening}
      </ChoiceLabel>
      <PreviewCard.Root
        onOpenChange={(open, details) => {
          if (open && cancel) details.cancel()
        }}
      >
        <Text color='secondary'>
          {/* Each language carries its own spaces: Korean attaches the particle. */}
          {t.readThe}
          <PreviewCard.Trigger href='#preview-destination'>
            {t.deploymentPolicyGuide}
          </PreviewCard.Trigger>
          {t.beforeConfiguringDeploymentChecks}
        </Text>
        <PreviewCard.Portal>
          <PreviewCard.Content>
            <strong>{t.deploymentPolicyGuideTitle}</strong>
            <p>{t.previewDescription}</p>
          </PreviewCard.Content>
        </PreviewCard.Portal>
      </PreviewCard.Root>
      <section
        id='preview-destination'
        tabIndex={-1}
        aria-labelledby='preview-destination-title'
      >
        <h3 id='preview-destination-title'>{t.deploymentPolicyGuideTitle}</h3>
        <p>{t.previewDescription}</p>
        <p>{t.destinationRepeatsSummary}</p>
      </section>
    </Stack>
  )
}
