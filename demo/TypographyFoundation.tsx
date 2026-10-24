import React from 'react'
import '@fontsource-variable/noto-sans-jp'
import {
  Button,
  CodeBlock,
  Field,
  Heading,
  Input,
  Stack,
  Surface,
  Table,
  Text,
} from '@surflane/ui'
import { FoundationPage, FoundationSection } from './FoundationPage'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/TypographyFoundation'

/** Display and body type in Latin and Hangul, set in the bundled faces. */
export function TypeSpecimens() {
  const t = text[useLocale().locale]
  return (
    <div className='font-specimens'>
      <Surface>
        <Stack gap={3}>
          <Text variant='caption' color='muted'>
            {t.displaySpecimenCaption}
          </Text>
          <Heading level={3} size='display'>
            Platform engineering
            <br />
            <span lang='ko'>플랫폼 개발의 공통 언어</span>
          </Heading>
        </Stack>
      </Surface>
      <Surface>
        <Stack gap={3}>
          <Text variant='caption' color='muted'>
            {t.bodySpecimenCaption}
          </Text>
          <Text id='specimen-latin'>
            Ship every service through the same pipeline.
          </Text>
          <Text id='specimen-hangul' lang='ko'>
            모든 서비스를 같은 파이프라인으로 배포합니다.
          </Text>
          <Text id='brand-japanese' lang='ja'>
            サービスのデプロイ状況を確認します。
          </Text>
        </Stack>
      </Surface>
    </div>
  )
}

/** Every type role at its size, with size / line height and tracking. */
export function TypeScale() {
  const t = text[useLocale().locale]
  const headings = [
    [t.roleDisplay, '32–40 / 38–48px, −0.02em', 'display'],
    [t.roleTitle, '28–32 / 35–40px, −0.02em', 'title'],
    [t.rolePage, '24 / 32px, −0.01em', 'page'],
    [t.roleSection, '20 / 28px, −0.01em', 'section'],
    [t.roleSubsection, '16 / 24px', 'subsection'],
  ] as const
  const roles = [
    [t.roleReading, '16 / 28px', 'reading'],
    [t.roleBody, '14 / 22px', 'body'],
    [t.roleLabel, '14 / 20px', 'label'],
    [t.roleCompact, '13 / 20px', 'table'],
    [t.roleCaption, '12 / 18px, +0.01em', 'caption'],
    [t.roleCode, '13 / 20px', 'mono'],
    [t.roleMetric, '24 / 28px, −0.01em', 'metric'],
  ] as const
  const meta = (name: string, size: string) => (
    <Text as='div' variant='caption' color='muted' className='type-scale-meta'>
      <span>{name}</span>
      <span>{size}</span>
    </Text>
  )
  return (
    <div className='type-scale' aria-label={t.typographyRoles}>
      {headings.map(([name, size, role]) => (
        <div className='type-scale-row' key={role}>
          {meta(name, size)}
          <Heading level={3} size={role} lang='ko'>
            플랫폼 서비스 / Platform services
          </Heading>
        </div>
      ))}
      {roles.map(([name, size, role]) => (
        <div className='type-scale-row' key={role}>
          {meta(name, size)}
          <Text
            id={role === 'mono' ? 'specimen-code' : undefined}
            variant={role}
            lang={role === 'mono' || role === 'metric' ? undefined : 'ko'}
          >
            {role === 'metric'
              ? '128 / 256'
              : role === 'mono'
                ? 'service_id = "platform-api-v2"'
                : '빌드 0123456789를 API로 배포합니다.'}
          </Text>
        </div>
      ))}
    </div>
  )
}

export function TypographyFoundation() {
  const t = text[useLocale().locale]
  return (
    <FoundationPage
      principles={t.principles}
      sections={t.sections}
      related={[
        '/foundations/layout',
        '/foundations/color',
        '/foundations/content',
        '/patterns/documentation',
      ]}
    >
      <FoundationSection id='typefaces'>
        <p>{t.typefacesIntro}</p>
        <Table.Container
          bleed
          label={t.typefaceTableLabel}
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>{t.typefaceCaption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.textHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>
                  {t.typefaceHeader}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {t.typefaces.map(([use, face]) => (
                <Table.Row key={use}>
                  <Table.HeaderCell scope='row'>{use}</Table.HeaderCell>
                  <Table.Cell>{face}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <TypeSpecimens />
        <p>
          {t.sourcesStart}
          <a href='https://fonts.google.com/specimen/Manrope'>Google Fonts</a>
          {t.sourcesEnd}
        </p>
      </FoundationSection>
      <FoundationSection id='roles'>
        <p>{t.rolesIntro}</p>
        <TypeScale />
        <p>{t.weightsIntro}</p>
        <div className='brand-type-examples'>
          <Heading level={3} size='subsection' id='brand-subhead'>
            {t.subhead}
          </Heading>
          <Text id='brand-body'>
            {t.bodyStart}
            <strong>{t.bodyStrong}</strong>
            {t.bodyEnd}
          </Text>
          <Text variant='caption' id='brand-caption'>
            {t.captionNote}
          </Text>
          <Field.Root>
            <Field.Label id='brand-label'>{t.serviceName}</Field.Label>
            <Input placeholder='platform-api' />
          </Field.Root>
          <Button variant='outline' id='brand-button'>
            {t.deployPreview}
          </Button>
          <Text variant='mono' id='brand-mono'>
            service_id = "platform-api-v2"
          </Text>
        </div>
        <p>{t.setupIntro}</p>
        <CodeBlock
          language='tsx'
          label={t.codeLabel}
          code={`import '@surflane/design-tokens/tokens.css'
import '@surflane/css/foundations.css'
import '@surflane/css/typography.css'
// Load the actual font files once in the application entry.
<body className='surf-typography'>{application}</body>

<Heading level={3} size='subsection'>
  Card subhead
</Heading>
<Text variant='caption'>400 / Manrope / +0.01em</Text>
<Text variant='mono'>400 / JetBrains Mono / 0</Text>`}
        />
      </FoundationSection>
      <FoundationSection id='measure'>
        <p>
          {t.measureStart}
          <Link href='/tokens?q=--surf-layout-reading-measure'>
            <code>--surf-layout-reading-measure</code>
          </Link>
          {t.measureEnd}
        </p>
        <p>{t.leading}</p>
      </FoundationSection>
      <FoundationSection id='korean'>
        <p>{t.koreanIntro}</p>
        <ul>
          {t.korean.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </FoundationSection>
    </FoundationPage>
  )
}
