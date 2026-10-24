import React, { useEffect, useState } from 'react'
import {
  Button,
  CodeBlock,
  Dialog,
  Input,
  Sheet,
  Table,
  Link as TextLink,
} from '@surflane/ui'
import { FoundationPage, FoundationSection } from './FoundationPage'
import { codeText } from './codeText'
import { Link } from './router'
import { EasingLab } from './EasingLab'
import { useLocale } from './i18n'
import { text } from './i18n/pages/MotionFoundation'
const tokenNames = [
  '--motion-feedback',
  '--duration-fast',
  '--motion-reveal',
  '--dialog-enter-duration',
  '--dialog-enter-offset',
  '--dialog-exit-duration',
  '--duration-base',
  '--toast-enter-duration',
  '--toast-stack-duration',
  '--motion-ease',
  '--motion-spatial-ease',
  '--toast-stack-ease',
  '--theme-transition-duration',
  '--theme-transition-ease',
] as const
function useMotionEnvironment() {
  const [environment, setEnvironment] = useState({
    reduced: false,
    supported: false,
    theme: '',
    values: {} as Record<string, string>,
  })
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      const css = getComputedStyle(document.documentElement)
      setEnvironment({
        reduced: media.matches,
        supported: typeof document.startViewTransition === 'function',
        theme: document.documentElement.dataset.theme ?? 'default',
        values: Object.fromEntries(
          tokenNames.map((token) => [
            token,
            css.getPropertyValue(token).trim(),
          ]),
        ),
      })
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    media.addEventListener('change', update)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', update)
    }
  }, [])
  return environment
}
export function MotionFoundation({ toggleTheme }: { toggleTheme: () => void }) {
  const t = text[useLocale().locale]
  const environment = useMotionEnvironment()
  const [draft, setDraft] = useState('Platform API release')
  return (
    <FoundationPage
      principles={t.principles}
      sections={t.sections}
      related={[
        '/foundations/interaction',
        '/foundations/themes',
        '/foundations/accessibility',
        '/components/dialog',
      ]}
    >
      <FoundationSection id='tokens'>
        <p>{t.tokensIntro}</p>
        <Table.Container bleed label={t.tableLabel} orientation='horizontal'>
          <Table.Root>
            <Table.Caption>{t.caption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.tokenHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.roleHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>
                  {t.resolvedHeader}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {tokenNames.map((token) => (
                <Table.Row key={token}>
                  <Table.HeaderCell scope='row'>
                    <Link href={`/tokens?q=${encodeURIComponent(token)}`}>
                      <code>{token}</code>
                    </Link>
                  </Table.HeaderCell>
                  <Table.Cell>{t.tokenRoles[token]}</Table.Cell>
                  <Table.Cell data-motion-token={token}>
                    {environment.values[token] ?? t.reading}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>{t.tokensNote}</p>
      </FoundationSection>
      <FoundationSection id='transitions'>
        <p>{t.transitionsIntro}</p>
        <Table.Container
          bleed
          label={t.transitionsTableLabel}
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>{t.transitionsCaption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                {[
                  t.compHeader,
                  t.entryHeader,
                  t.exitHeader,
                  t.behaviorHeader,
                ].map((label) => (
                  <Table.HeaderCell key={label} scope='col'>
                    {label}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {[
                [
                  'Dialog / Alert dialog',
                  environment.values['--dialog-enter-duration'],
                  environment.values['--dialog-exit-duration'],
                  t.behaviorDialog,
                ],
                [
                  'Sheet / Drawer',
                  environment.values['--duration-base'],
                  environment.values['--duration-base'],
                  t.behaviorSheet,
                ],
                [
                  'Accordion',
                  environment.values['--motion-reveal'],
                  environment.values['--motion-reveal'],
                  t.behaviorAccordion,
                ],
                [
                  'Collapsible',
                  environment.values['--motion-reveal'],
                  '0ms',
                  t.behaviorCollapsible,
                ],
                [
                  'Toast',
                  environment.values['--toast-enter-duration'],
                  '0ms',
                  t.behaviorToast,
                ],
                [
                  t.transRowToastStack,
                  environment.values['--toast-stack-duration'],
                  '0ms',
                  t.behaviorToastStack,
                ],
                [
                  t.transRowTheme,
                  environment.values['--theme-transition-duration'],
                  t.exitSameScene,
                  t.behaviorTheme,
                ],
              ].map(([component, entry, exit, behavior]) => (
                <Table.Row key={component}>
                  <Table.HeaderCell scope='row'>{component}</Table.HeaderCell>
                  <Table.Cell>{entry ?? t.reading}</Table.Cell>
                  <Table.Cell>{exit ?? t.reading}</Table.Cell>
                  <Table.Cell>{behavior}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>{t.panelsIntro}</p>
        <div className='actions'>
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant='outline' />}>
              {t.openMotionDialog}
            </Dialog.Trigger>
            <Dialog.Content closeLabel={t.closeMotionDialog}>
              <Dialog.Header>
                <Dialog.Title>{t.dialogMotionPreview}</Dialog.Title>
                <Dialog.Description>
                  {t.dialogMotionPreviewDesc}
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <label>
                  {t.previewDraftLabel}
                  <Input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                </label>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant='ghost' onClick={toggleTheme}>
                  {t.cycleThemeInDialog}
                </Button>
                <Dialog.Close render={<Button variant='outline' />}>
                  {t.done}
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
          <Sheet.Root side='right'>
            <Sheet.Trigger render={<Button variant='outline' />}>
              {t.openMotionSheet}
            </Sheet.Trigger>
            <Sheet.Content closeLabel={t.closeMotionSheet}>
              <Sheet.Header>
                <Sheet.Title>{t.sheetMotionPreview}</Sheet.Title>
                <Sheet.Description>
                  {t.sheetMotionPreviewDesc}
                </Sheet.Description>
              </Sheet.Header>
              <Sheet.Body>
                <p>{t.sheetBodyNote}</p>
                <TextLink render={<Link href='/components/sheet' />}>
                  {t.sheetUsageApi}
                </TextLink>
              </Sheet.Body>
              <Sheet.Footer>
                <Button variant='ghost' onClick={toggleTheme}>
                  {t.cycleThemeInSheet}
                </Button>
                <Sheet.Close render={<Button variant='outline' />}>
                  {t.done}
                </Sheet.Close>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet.Root>
        </div>
        <p>{codeText(t.transitionsNote)}</p>
      </FoundationSection>
      <FoundationSection id='theme'>
        <p>{codeText(t.themeIntro)}</p>
        <ul aria-label={t.environmentLabel}>
          <li>
            {t.resolvedThemeLabel}{' '}
            <strong data-motion-theme>{environment.theme}</strong>
          </li>
          <li>
            {t.reducedMotionLabel}{' '}
            <strong data-motion-preference>
              {environment.reduced ? t.reduceValue : t.noPreferenceValue}
            </strong>
          </li>
          <li>
            {t.viewTransitionsLabel}{' '}
            <strong data-motion-support>
              {environment.supported ? t.availableValue : t.unavailableValue}
            </strong>
          </li>
        </ul>
        <div className='actions'>
          <Button variant='outline' onClick={toggleTheme}>
            {t.cyclePreviewTheme}
          </Button>
        </div>
        <CodeBlock
          language='tsx'
          label={t.codeLabel}
          code={`import { flushSync } from 'react-dom'
import { transitionTheme } from '@surflane/design-tokens/theme-transition'
// @surflane/ui/all.css brings it; with per-component stylesheets, import it once.
import '@surflane/design-tokens/motion.css'

// Resolve system mode before committing the theme.
await transitionTheme(() => {
  document.documentElement.dataset.theme = resolvedTheme
  flushSync(() => setMode(nextMode))
})`}
        />
        <p>{codeText(t.themeNote)}</p>
      </FoundationSection>
      <FoundationSection id='reduced'>
        <ul>
          {t.reduced.map((item) => (
            <li key={item}>{codeText(item)}</li>
          ))}
        </ul>
        <p>
          <a href='https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html'>
            {t.w3cReducedMotionLink}
          </a>
          {' / '}
          <a href='https://base-ui.com/react/handbook/animation'>
            {t.baseUiAnimationLink}
          </a>
        </p>
      </FoundationSection>
      <FoundationSection id='easing'>
        <EasingLab />
      </FoundationSection>
    </FoundationPage>
  )
}
