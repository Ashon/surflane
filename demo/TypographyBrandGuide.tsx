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
const roles = [
  ['Display / hero', 'Manrope', '500', '0'],
  ['Headline / page and section', 'Manrope', '500', '0'],
  ['Subhead / card and column', 'Manrope', '500', '0'],
  ['Body', 'Manrope', '400', '0'],
  ['Emphasis inside body', 'Manrope', '500', '0'],
  ['Caption and label', 'Manrope', '400', '0'],
  ['Button and link', 'Manrope', '500', '0'],
  ['Hex, token, spec and code', 'JetBrains Mono', '400', '0'],
]
export function TypographyBrandGuide() {
  return (
    <section id='brand-type-roles' aria-labelledby='brand-type-roles-title'>
      <h2 id='brand-type-roles-title'>Brand type roles</h2>
      <p>
        Typeface, weight, and tracking follow each element's role on screen.
        Latin text uses Manrope, and Korean (Hangul) text uses Pretendard. Body
        text, controls, and code keep default tracking for comfortable reading
        density, and use sentence case. API names and identifiers keep their
        original spelling. Get font files from{' '}
        <a href='https://fonts.google.com/specimen/Manrope'>Google Fonts</a> and
        each typeface's public distribution package.
      </p>
      <Table.Container label='Brand typography roles' orientation='horizontal'>
        <Table.Root>
          <Table.Caption>Typeface, weight, and tracking by role</Table.Caption>
          <Table.Head>
            <Table.Row>
              {['Role', 'Typeface', 'Weight', 'Tracking'].map((label) => (
                <Table.HeaderCell key={label} scope='col'>
                  {label}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {roles.map(([role, face, weight, tracking]) => (
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
          Card and column subhead
        </Heading>
        <Text id='brand-body'>
          Review the deployment plan and <strong>check the build status</strong>{' '}
          before continuing.
        </Text>
        <Text variant='caption' id='brand-caption'>
          Last deployed in the selected time zone.
        </Text>
        <Field.Root>
          <Field.Label id='brand-label'>Service name</Field.Label>
          <Input placeholder='platform-api' />
        </Field.Root>
        <Button variant='outline' id='brand-button'>
          Deploy preview
        </Button>
        <Text variant='mono' id='brand-mono'>
          service_id = "platform-api-v2"
        </Text>
      </div>
      <p>
        The HTML heading level sets document structure. The Heading size prop
        sets the visual role. Headings and body text use Manrope, with hierarchy
        built from size and weight. Labels and captions use 400. Links, buttons,
        and emphasis in body text use 500. Shared styles keep the browser's
        default bold from rendering at 700.
      </p>
      <Text id='brand-japanese' lang='ja'>
        サービスのデプロイ状況を確認します。 Service deployments
      </Text>
      <p>
        Korean uses Pretendard and Japanese uses Noto Sans JP. Set lang on a
        language block to combine Manrope for Latin text with that language's
        glyphs. Check each package's license before redistributing font files.
      </p>
      <p>
        The scale below is a set of independent UI role tokens. Choose by
        reading density: documentation, workspace screens, or data tables.
      </p>
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
<Text variant='caption'>400 / Manrope / 0</Text>
<Text variant='mono'>400 / JetBrains Mono / 0</Text>`}
      />
    </section>
  )
}
