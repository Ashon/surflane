import React, { useRef } from 'react'
import { Grid, Inline, Stack, Surface, Text, ThemeSwitch } from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ThemeSwitchExample'

export function ThemeSwitchExample() {
  const { locale } = useLocale()
  const t = text[locale]
  // Each preview takes its own theme, not the page's: target scopes it to the frame.
  const group = useRef<HTMLDivElement>(null)
  const cycle = useRef<HTMLDivElement>(null)
  return (
    <Grid columns={2} gap={4}>
      <Surface ref={cycle} surface='canvas' padding={5}>
        <Inline gap={3}>
          {/* Remembered under its own key, so a reload keeps the choice. */}
          <ThemeSwitch target={cycle} persist='surflane-preview-theme' />
          <Text color='secondary'>{t.cycleNote}</Text>
        </Inline>
      </Surface>
      <Surface ref={group} surface='canvas' padding={5}>
        <Stack gap={4}>
          <ThemeSwitch variant='group' target={group} persist={false} />
          <Text color='secondary'>{t.groupNote}</Text>
        </Stack>
      </Surface>
    </Grid>
  )
}
