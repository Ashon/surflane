import React from 'react'
import '@fontsource-variable/noto-sans-jp'
import {
  Button,
  CodeBlock,
  Field,
  Heading,
  Input,
  Table,
  Text,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { text } from './i18n/pages/TypographyBrandGuide'
export function TypographyBrandGuide() {
  const t = text[useLocale().locale]
  return (
    <section id='brand-type-roles' aria-labelledby='brand-type-roles-title'>
      <h2 id='brand-type-roles-title'>{t.title}</h2>
      <p>
        {t.introStart}
        <a href='https://fonts.google.com/specimen/Manrope'>Google Fonts</a>
        {t.introEnd}
      </p>
      <Table.Container label={t.tableLabel} orientation='horizontal'>
        <Table.Root>
          <Table.Caption>{t.caption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              {[
                t.roleHeader,
                t.typefaceHeader,
                t.weightHeader,
                t.trackingHeader,
              ].map((label) => (
                <Table.HeaderCell key={label} scope='col'>
                  {label}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {t.roles.map(([role, face, weight, tracking]) => (
              <Table.Row key={role}>
                <Table.HeaderCell scope='row'>{role}</Table.HeaderCell>
                <Table.Cell>{face}</Table.Cell>
                <Table.Cell>{weight}</Table.Cell>
                <Table.Cell>{tracking}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
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
      <p>{t.headingNote}</p>
      <Text id='brand-japanese' lang='ja'>
        サービスのデプロイ状況を確認します。 Service deployments
      </Text>
      <p>{t.langNote}</p>
      <p>{t.scaleNote}</p>
      <CodeBlock
        language='tsx'
        code={`import '@surflane/design-tokens/tokens.css'
import '@surflane/design-tokens/foundations.css'
import '@surflane/design-tokens/typography.css'
// Load the actual font files once in the application entry.
// Body scope also covers dialogs, menus and other portals.
<body className='pui-typography'>{application}</body>

<Heading level={3} size='subsection'>
  Card subhead
</Heading>
<Text variant='caption'>400 / Manrope / +0.01em</Text>
<Text variant='mono'>400 / JetBrains Mono / 0</Text>`}
      />
    </section>
  )
}
