import React, { useState } from 'react'
import {
  AppShell,
  Button,
  Checkbox,
  CodeBlock,
  Icon,
  InlineMessage,
  Input,
  PageHeader,
  SizeProvider,
  StatusBadge,
  Switch,
  Table,
  Toggle,
  ToggleGroup,
  Link as TextLink,
} from '@surflane/ui'
import {
  accentPresets,
  contrastRatio,
  createTheme,
  maxChroma,
  neutralPresets,
  radiusPresets,
  themeCss,
  type Theme,
} from '@surflane/design-tokens/theme-builder'
import { useLocale } from './i18n'
import { FoundationPage, FoundationSection } from './FoundationPage'
import { Link } from './router'
import { SliderField } from './SliderField'
import { text } from './i18n/pages/ThemeFoundation'

type Copy = (typeof text)['en']
type NeutralName = keyof typeof neutralPresets
type AccentName = keyof typeof accentPresets
type RadiusName = keyof typeof radiusPresets
type Inputs = {
  neutral: { preset: NeutralName | 'custom'; hue?: number; chroma: number }
  accent: { preset: AccentName | 'custom'; hue: number; chroma: number }
  radius: RadiusName
}
const defaults: Inputs = {
  neutral: { preset: 'slate', ...neutralPresets.slate, chroma: 1 },
  accent: { preset: 'cyan', ...accentPresets.cyan },
  radius: 'default',
}
// The default slate keeps each step's own hue; the slider starts at its average.
const slateHue = 248
const accentLightness = 0.82
function Presets<Name extends string>({
  label,
  names,
  value,
  t,
  swatch,
  onChange,
}: {
  label: string
  names: Name[]
  value: Name | 'custom'
  t: Copy
  swatch?: (name: Name) => string
  onChange: (name: Name) => void
}) {
  return (
    <ToggleGroup
      aria-label={label}
      className='theme-presets'
      value={value === 'custom' ? [] : [value]}
      onValueChange={(next) => {
        if (next[0]) onChange(next[0] as Name)
      }}
    >
      {names.map((name) => (
        <Toggle key={name} value={name}>
          {swatch && (
            <span
              className='theme-swatch'
              aria-hidden='true'
              style={{ background: swatch(name) }}
            />
          )}
          {t.presets[name as keyof Copy['presets']]}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}
function Brand({ workspace }: { workspace: string }) {
  return (
    <div className='theme-preview-brand'>
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <rect width='24' height='24' rx='6' />
        <path d='m6.5 9.5 5.5-3 5.5 3-5.5 3z' />
        <path d='m6.5 12.75 5.5 3 5.5-3' />
        <path d='m6.5 15.75 5.5 3 5.5-3' />
      </svg>
      <span>
        <AppShell.Label>Acme Platform</AppShell.Label>
        <small>{workspace}</small>
      </span>
    </div>
  )
}
const deployments = [
  ['checkout-api', 'production', 184, 'success'],
  ['search-indexer', 'staging', 412, 'caution'],
  ['report-builder', 'development', 96, 'danger'],
] as const
function Preview({
  theme,
  mode,
  t,
  number,
}: {
  theme: Theme
  mode: 'dark' | 'light'
  t: Copy
  number: (value: number) => string
}) {
  const [selected, setSelected] = useState(['search-indexer'])
  const style = { ...theme[mode], ...theme.shared } as React.CSSProperties
  return (
    <section
      className='theme-preview'
      data-theme={mode}
      style={style}
      aria-label={t.previewLabel}
    >
      <SizeProvider size='small'>
        <AppShell.Root layout='workspace' shortcut={false}>
          {/* Phones hide the sidebar; the header keeps the product visible. */}
          <AppShell.Header>
            <Brand workspace={t.workspace} />
          </AppShell.Header>
          <AppShell.Sidebar>
            <Brand workspace={t.workspace} />
            <nav aria-label='Acme Platform'>
              {(
                [
                  [t.overview, 'monitor'],
                  [t.deployments, 'play'],
                  [t.services, 'menu'],
                  [t.settings, 'settings'],
                ] as const
              ).map(([label, icon]) => (
                <AppShell.Link
                  key={label}
                  href='#theme-preview'
                  label={label}
                  icon={<Icon name={icon} decorative />}
                  aria-current={label === t.deployments ? 'page' : undefined}
                  onClick={(event) => event.preventDefault()}
                />
              ))}
            </nav>
          </AppShell.Sidebar>
          <AppShell.Content>
            <AppShell.Page className='theme-preview-sheet'>
              <PageHeader
                size='page'
                level={3}
                title={t.pageTitle}
                description={t.pageDescription}
                actions={
                  <>
                    <Button variant='outline'>{t.export}</Button>
                    <Button variant='primary'>{t.newDeployment}</Button>
                  </>
                }
              />
              <InlineMessage.Root tone='caution'>
                <InlineMessage.Icon tone='caution' />
                <InlineMessage.Content>
                  <InlineMessage.Title>{t.reviewTitle}</InlineMessage.Title>
                  <InlineMessage.Description>
                    {t.reviewBody}
                  </InlineMessage.Description>
                </InlineMessage.Content>
              </InlineMessage.Root>
              <div className='theme-preview-controls'>
                <Input
                  aria-label={t.searchServices}
                  placeholder={t.searchServices}
                />
                <label className='theme-preview-choice'>
                  <Switch.Root defaultChecked>
                    <Switch.Thumb />
                  </Switch.Root>
                  {t.autoPromote}
                </label>
                <label className='theme-preview-choice'>
                  <Checkbox.Root defaultChecked>
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                  {t.notifyOwners}
                </label>
              </div>
              <Table.Container bleed label={t.tableLabel}>
                <Table.Root density='compact'>
                  <Table.Head>
                    <Table.Row>
                      <Table.HeaderCell scope='col'>
                        <span className='pui-feedback-sr'>{t.selection}</span>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope='col'>
                        {t.service}
                      </Table.HeaderCell>
                      <Table.HeaderCell scope='col'>
                        {t.environment}
                      </Table.HeaderCell>
                      <Table.HeaderCell scope='col' numeric>
                        {t.duration}
                      </Table.HeaderCell>
                      <Table.HeaderCell scope='col'>
                        {t.status}
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {deployments.map(([name, environment, seconds, tone]) => (
                      <Table.Row key={name} selected={selected.includes(name)}>
                        <Table.Cell>
                          <Checkbox.Root
                            aria-label={t.selectRow(name)}
                            checked={selected.includes(name)}
                            onCheckedChange={(checked) =>
                              setSelected((old) =>
                                checked
                                  ? [...old, name]
                                  : old.filter((id) => id !== name),
                              )
                            }
                          >
                            <Checkbox.Indicator />
                          </Checkbox.Root>
                        </Table.Cell>
                        <Table.HeaderCell scope='row'>
                          <TextLink
                            href='#theme-preview'
                            onClick={(event) => event.preventDefault()}
                          >
                            {name}
                          </TextLink>
                        </Table.HeaderCell>
                        <Table.Cell>{environment}</Table.Cell>
                        <Table.Cell numeric>{number(seconds)}</Table.Cell>
                        <Table.Cell>
                          <StatusBadge tone={tone}>
                            {tone === 'success'
                              ? t.live
                              : tone === 'caution'
                                ? t.review
                                : t.failed}
                          </StatusBadge>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Table.Container>
            </AppShell.Page>
          </AppShell.Content>
        </AppShell.Root>
      </SizeProvider>
    </section>
  )
}
const pairs = [
  ['body', '--ink-body', '--canvas'],
  ['muted', '--ink-muted', '--canvas'],
  ['heading', '--ink', '--chrome'],
  ['recessed', '--ink-muted', '--surface'],
  ['onAccent', '--on-brand', '--brand'],
  ['link', '--brand-ink', '--canvas'],
] as const
function ContrastReport({ theme, t }: { theme: Theme; t: Copy }) {
  const ratio = (mode: 'dark' | 'light', fg: string, bg: string) =>
    contrastRatio(theme[mode][fg], theme[mode][bg])
  return (
    <Table.Container bleed label={t.contrastCaption}>
      <Table.Root density='compact'>
        <Table.Caption>{t.contrastCaption}</Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell scope='col'>{t.pair}</Table.HeaderCell>
            <Table.HeaderCell scope='col' numeric>
              {t.dark}
            </Table.HeaderCell>
            <Table.HeaderCell scope='col' numeric>
              {t.light}
            </Table.HeaderCell>
            <Table.HeaderCell scope='col'>{t.status}</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {pairs.map(([key, fg, bg]) => {
            const dark = ratio('dark', fg, bg),
              light = ratio('light', fg, bg)
            const pass = Math.min(dark, light) >= 4.5
            return (
              <Table.Row key={key}>
                <Table.HeaderCell scope='row'>
                  {t.pairs[key]}{' '}
                  <code className='theme-pair-tokens'>
                    {fg} / {bg}
                  </code>
                </Table.HeaderCell>
                <Table.Cell numeric>{t.ratio(dark.toFixed(2))}</Table.Cell>
                <Table.Cell numeric>{t.ratio(light.toFixed(2))}</Table.Cell>
                <Table.Cell>
                  <StatusBadge tone={pass ? 'success' : 'danger'}>
                    {pass ? t.pass : t.fail}
                  </StatusBadge>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </Table.Container>
  )
}
export function ThemeFoundation() {
  const { locale } = useLocale()
  const t = text[locale]
  const tag = locale === 'ko' ? 'ko-KR' : 'en-US'
  const number = (value: number) => value.toLocaleString(tag)
  const [inputs, setInputs] = useState<Inputs>(defaults)
  const [mode, setMode] = useState<'dark' | 'light'>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )
  const neutral =
    inputs.neutral.preset === 'custom'
      ? { hue: inputs.neutral.hue, chroma: inputs.neutral.chroma }
      : neutralPresets[inputs.neutral.preset]
  const theme = createTheme({
    neutral,
    accent: { hue: inputs.accent.hue, chroma: inputs.accent.chroma },
    radius: radiusPresets[inputs.radius],
  })
  const limit = maxChroma(accentLightness, inputs.accent.hue)
  const label = [
    inputs.neutral.preset === 'custom'
      ? `neutral ${inputs.neutral.hue ?? slateHue}/${inputs.neutral.chroma}`
      : inputs.neutral.preset,
    inputs.accent.preset === 'custom'
      ? `accent ${inputs.accent.hue}/${inputs.accent.chroma}`
      : `accent ${inputs.accent.preset}`,
    `radius ${inputs.radius}`,
  ].join(', ')
  const css = themeCss(theme, `Surflane theme: ${label}`)
  const files = [
    inputs.neutral.preset === 'custom' ? null : inputs.neutral.preset,
    inputs.accent.preset === 'custom' ? null : `accent-${inputs.accent.preset}`,
    `radius-${inputs.radius}`,
  ].filter(Boolean)
  return (
    <FoundationPage
      principles={t.principles}
      sections={t.sections}
      related={['/foundations/color', '/foundations/motion', '/tokens']}
    >
      <FoundationSection id='selection'>
        <p>{t.selectionIntro}</p>
        <CodeBlock
          language='html'
          label={t.selectionLabel}
          code={`<html data-theme="light">
  <body>
    <!-- A dark preview inside the light page -->
    <section data-theme="dark">…</section>
  </body>
</html>`}
        />
        <p>
          {t.transitionStart}
          <Link href='/foundations/motion'>{t.transitionLink}</Link>
          {t.transitionEnd}
        </p>
      </FoundationSection>
      <FoundationSection id='shadcn'>
        <p>{t.shadcnIntro}</p>
        <CodeBlock
          language='css'
          label={t.shadcnLabel}
          code={`@import 'tailwindcss';
@import '@surflane/design-tokens/tokens.css' layer(components);
${files
  .map(
    (file) =>
      `@import '@surflane/design-tokens/themes/${file}.css' layer(components);`,
  )
  .join('\n')}
@import '@surflane/design-tokens/shadcn.css' layer(components);
@import '@surflane/design-tokens/tailwind.css';

/* In your shadcn CSS, keep @theme inline. Delete the :root and .dark
   color blocks and the @custom-variant dark line. */`}
        />
      </FoundationSection>
      <FoundationSection id='builder'>
        <p>{t.builderIntro}</p>
        <div className='theme-builder'>
          <section className='theme-inputs' aria-label={t.controls}>
            <fieldset>
              <legend>{t.neutral}</legend>
              <p className='theme-hint'>{t.neutralHint}</p>
              <Presets
                label={t.neutral}
                names={Object.keys(neutralPresets) as NeutralName[]}
                value={inputs.neutral.preset}
                t={t}
                onChange={(preset) =>
                  setInputs((old) => ({
                    ...old,
                    neutral: { preset, chroma: 1, ...neutralPresets[preset] },
                  }))
                }
              />
              <SliderField
                label={t.neutralHue}
                value={inputs.neutral.hue ?? slateHue}
                min={0}
                max={359}
                step={1}
                format={(value) => `${value}°`}
                onChange={(hue) =>
                  setInputs((old) => ({
                    ...old,
                    neutral: { ...old.neutral, preset: 'custom', hue },
                  }))
                }
              />
              <SliderField
                label={t.neutralChroma}
                value={inputs.neutral.chroma}
                min={0}
                max={2}
                step={0.1}
                format={(value) => `${value.toFixed(1)}×`}
                onChange={(chroma) =>
                  setInputs((old) => ({
                    ...old,
                    neutral: {
                      ...old.neutral,
                      preset: 'custom',
                      hue: old.neutral.hue ?? slateHue,
                      chroma,
                    },
                  }))
                }
              />
            </fieldset>
            <fieldset>
              <legend>{t.accent}</legend>
              <p className='theme-hint'>{t.accentHint}</p>
              <Presets
                label={t.accent}
                names={Object.keys(accentPresets) as AccentName[]}
                value={inputs.accent.preset}
                t={t}
                swatch={(name) =>
                  createTheme({ accent: accentPresets[name] }).dark['--brand']
                }
                onChange={(preset) =>
                  setInputs((old) => ({
                    ...old,
                    accent: { preset, ...accentPresets[preset] },
                  }))
                }
              />
              <SliderField
                label={t.accentHue}
                value={inputs.accent.hue}
                min={0}
                max={359}
                step={1}
                format={(value) => `${value}°`}
                onChange={(hue) =>
                  setInputs((old) => ({
                    ...old,
                    accent: { ...old.accent, preset: 'custom', hue },
                  }))
                }
              />
              <SliderField
                label={t.accentChroma}
                value={inputs.accent.chroma}
                min={0}
                max={0.2}
                step={0.005}
                format={(value) => value.toFixed(3)}
                onChange={(chroma) =>
                  setInputs((old) => ({
                    ...old,
                    accent: { ...old.accent, preset: 'custom', chroma },
                  }))
                }
              />
              {inputs.accent.chroma > limit && (
                <p className='theme-hint' role='status'>
                  {t.chromaClamped(limit.toFixed(3))}
                </p>
              )}
            </fieldset>
            <fieldset>
              <legend>{t.radius}</legend>
              <p className='theme-hint'>{t.radiusHint}</p>
              <Presets
                label={t.radius}
                names={Object.keys(radiusPresets) as RadiusName[]}
                value={inputs.radius}
                t={t}
                onChange={(radius) => setInputs((old) => ({ ...old, radius }))}
              />
            </fieldset>
            <Button variant='ghost' onClick={() => setInputs(defaults)}>
              {t.resetTheme}
            </Button>
          </section>
          <div className='theme-stage' id='theme-preview'>
            <ToggleGroup
              aria-label={t.previewMode}
              value={[mode]}
              onValueChange={(next) => {
                if (next[0]) setMode(next[0] as 'dark' | 'light')
              }}
            >
              <Toggle value='dark'>{t.dark}</Toggle>
              <Toggle value='light'>{t.light}</Toggle>
            </ToggleGroup>
            <Preview theme={theme} mode={mode} t={t} number={number} />
          </div>
        </div>
        <h3>{t.contrastTitle}</h3>
        <p>{t.contrastIntro}</p>
        <ContrastReport theme={theme} t={t} />
        <h3>{t.cssTitle}</h3>
        <p>{t.cssIntro}</p>
        <CodeBlock
          language='css'
          label={t.cssLabel}
          copyLabel={t.copyCss}
          code={css.trim()}
        />
        <h3>{t.presetTitle}</h3>
        <p>{t.presetIntro}</p>
        <CodeBlock
          language='css'
          label={t.presetLabel}
          code={[
            "@import '@surflane/design-tokens/tokens.css';",
            ...files.map(
              (file) => `@import '@surflane/design-tokens/themes/${file}.css';`,
            ),
          ].join('\n')}
        />
        <h3>{t.codeTitle}</h3>
        <p>{t.codeIntro}</p>
        <CodeBlock
          language='ts'
          label={t.builderLabel}
          code={`import { createTheme, themeCss } from '@surflane/design-tokens/theme-builder'

const theme = createTheme({
  neutral: { hue: ${inputs.neutral.hue ?? slateHue}, chroma: ${inputs.neutral.chroma} },
  accent: { hue: ${inputs.accent.hue}, chroma: ${inputs.accent.chroma} },
  radius: ${radiusPresets[inputs.radius]},
})
const css = themeCss(theme)`}
        />
      </FoundationSection>
    </FoundationPage>
  )
}
export default ThemeFoundation
