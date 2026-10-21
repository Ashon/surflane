import { SpacingScaleMark } from './BlueprintCanvas'
import React, { useRef, useState } from 'react'
import { SpacingMeasurements } from './SpacingMeasurements'
import { Button, CodeBlock, Inline, Input, Stack, Table } from '@surflane/ui'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/SpacingGuide'

export function SpacingGuide() {
  const t = text[useLocale().locale]
  const host = useRef<HTMLDivElement>(null)
  const [measurements, setMeasurements] = useState(true)
  const rules = t.rules
  return (
    <section id='spacing' aria-labelledby='spacing-title'>
      <h2 id='spacing-title'>{t.title}</h2>
      <p>{t.intro}</p>
      <div className='spacing-scale' aria-label={t.scaleLabel}>
        {([1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20] as const).map((step) => (
          <div key={step}>
            <SpacingScaleMark step={step} />
            <Link href={`/tokens?q=--space-${step}`}>space-{step}</Link>
            <span>{step * 4}px</span>
          </div>
        ))}
      </div>
      <Table.Container label={t.tableLabel} orientation='horizontal'>
        <Table.Root>
          <Table.Caption>{t.caption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              {[t.relationship, t.spacing, t.token, t.examples].map((label) => (
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
      <h3>{t.inputsActionsTitle}</h3>
      <p>{t.inputsActionsIntro}</p>
      <div className='actions spacing-measurement-controls'>
        <Button
          variant='outline'
          aria-pressed={measurements}
          onClick={() => setMeasurements((value) => !value)}
        >
          {t.spacingDimensions}
        </Button>
        <span>{t.dimensionLines}</span>
      </div>
      <Stack
        gap={4}
        ref={host}
        className='spacing-example spacing-form-example'
        data-testid='spacing-form'
      >
        <Stack gap={1} className='spacing-example'>
          <h4 data-spacing-title>{t.accountDetails}</h4>
          <p data-spacing-description>{t.enterNameToDisplay}</p>
        </Stack>
        <label>
          <span data-spacing-label>{t.displayName}</span>
          <Input placeholder={t.namePlaceholder} />
        </label>
        <Inline gap={2} data-spacing-actions>
          <Button type='button'>{t.savePreview}</Button>
          <Button type='button' variant='outline'>
            {t.cancelPreview}
          </Button>
        </Inline>
        <SpacingMeasurements hostRef={host} visible={measurements} />
      </Stack>
      <CodeBlock
        language='tsx'
        label={t.codeLabel}
        code={
          '<Stack gap={4}>\n  <Stack gap={1}>{/* Title and description; margin: 0 */}</Stack>\n  <label>{/* Label + Input; gap: var(--space-2) */}</label>\n  <Inline gap={2}>{/* Action buttons */}</Inline>\n</Stack>'
        }
      />
      <p>{t.manageSpacing}</p>
      <p>{t.divider}</p>
      <p>
        {t.relatedTokensLabel}{' '}
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
        (32px). {t.relatedTokensRest}
      </p>
    </section>
  )
}
