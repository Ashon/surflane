import { SpacingScaleMark } from './BlueprintCanvas'
import React, { useRef, useState } from 'react'
import { SpacingMeasurements } from './SpacingMeasurements'
import { Button, CodeBlock, Inline, Input, Stack, Table } from '@surflane/ui'
import { Link } from './router'

const rules = [
  [
    'Closely related elements',
    '4–8px',
    'space-1 / space-2',
    'Icon and label, heading and description, label and input',
  ],
  [
    'Related controls',
    '12–16px',
    'space-3 / space-4',
    '8–12px between buttons, 16px between an input and its action button',
  ],
  [
    'Task groups',
    '24px',
    'space-6',
    'Separate field groups, filters and results',
  ],
  [
    'Sections',
    '32–48px',
    'space-8 / space-12',
    'Between independent topics or task steps',
  ],
  [
    'Inside containers',
    '16–32px',
    'space-4 / space-6 / space-8',
    'Popovers 16px, panels 24px, pages from 32px',
  ],
]

export function SpacingGuide() {
  const host = useRef<HTMLDivElement>(null)
  const [measurements, setMeasurements] = useState(true)
  return (
    <section id='spacing' aria-labelledby='spacing-title'>
      <h2 id='spacing-title'>Spacing and grouping</h2>
      <p>
        Spacing uses tokens on a 4px base unit. Group closely related items with
        small gaps and separate different tasks with larger ones. Decide how
        information relates before increasing all spacing evenly.
      </p>
      <div className='spacing-scale' aria-label='Spacing token scale'>
        {([1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20] as const).map((step) => (
          <div key={step}>
            <SpacingScaleMark step={step} />
            <Link href={`/tokens?q=--space-${step}`}>space-{step}</Link>
            <span>{step * 4}px</span>
          </div>
        ))}
      </div>
      <Table.Container
        label='Spacing usage guidelines'
        orientation='horizontal'
      >
        <Table.Root>
          <Table.Caption>Default spacing by relationship</Table.Caption>
          <Table.Head>
            <Table.Row>
              {['Relationship', 'Spacing', 'Token', 'Examples'].map((label) => (
                <Table.HeaderCell key={label} scope='col'>
                  {label}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rules.map(([relation, gap, token, usage]) => (
              <Table.Row key={relation}>
                <Table.HeaderCell scope='row'>{relation}</Table.HeaderCell>
                <Table.Cell>{gap}</Table.Cell>
                <Table.Cell>{token}</Table.Cell>
                <Table.Cell>{usage}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <h3>Spacing between inputs and actions</h3>
      <p>
        The example below uses 4px between heading and description, 8px between
        label and input, 16px between the input and the button row, and 8px
        between buttons. Popovers use the same combination.
      </p>
      <div className='actions spacing-measurement-controls'>
        <Button
          variant='outline'
          aria-pressed={measurements}
          onClick={() => setMeasurements((value) => !value)}
        >
          Spacing dimensions
        </Button>
        <span>
          Dimension lines measure the actual gaps between elements and take up
          no space.
        </span>
      </div>
      <Stack
        gap={4}
        ref={host}
        className='spacing-example spacing-form-example'
        data-testid='spacing-form'
      >
        <Stack gap={1} className='spacing-example'>
          <h4 data-spacing-title>Account details</h4>
          <p data-spacing-description>Enter the name to display.</p>
        </Stack>
        <label>
          <span data-spacing-label>Display name</span>
          <Input placeholder='Name' />
        </label>
        <Inline gap={2} data-spacing-actions>
          <Button type='button'>Save preview</Button>
          <Button type='button' variant='outline'>
            Cancel preview
          </Button>
        </Inline>
        <SpacingMeasurements hostRef={host} visible={measurements} />
      </Stack>
      <CodeBlock
        language='tsx'
        label='Spacing composition'
        code={
          '<Stack gap={4}>\n  <Stack gap={1}>{/* Title and description; margin: 0 */}</Stack>\n  <label>{/* Label + Input; gap: var(--space-2) */}</label>\n  <Inline gap={2}>{/* Action buttons */}</Inline>\n</Stack>'
        }
      />
      <p>
        Manage spacing in one place. Don't combine a Stack or Inline gap with
        child margins. The parent layout owns outer spacing and the container
        owns inner padding. In compact layouts, reduce group spacing from 24px
        to 16px but keep input height and focus indicators. On small screens,
        reduce page padding and let button rows wrap. Don't size spacing inside
        forms as a fraction of viewport height.
      </p>
      <p>
        A full-width divider turns sections into panels. Like a card, a panel
        keeps the same inset on all four sides, so use the container's inset on
        both sides of the divider; the 32–48px section spacing applies when
        whitespace alone separates sections. A card grid inside a panel then
        sits as evenly as a paragraph.
      </p>
      <p>
        Related tokens:{' '}
        <Link href='/tokens?q=--layout-gutter'>
          <code>--layout-gutter</code>
        </Link>{' '}
        (24px),{' '}
        <Link href='/tokens?q=--layout-section-gap'>
          <code>--layout-section-gap</code>
        </Link>{' '}
        (48px),{' '}
        <Link href='/tokens?q=--layout-page-inset'>
          <code>--layout-page-inset</code>
        </Link>{' '}
        (32px). The catalog's own sheet is an explicit exception: one 40px inset
        (24px at 960px and below) on every side, including above the page title,
        and on both sides of each section divider.
      </p>
    </section>
  )
}
