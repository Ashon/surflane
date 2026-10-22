import { SpacingScaleMark } from './BlueprintCanvas'
import React, { useRef, useState } from 'react'
import { SpacingMeasurements } from './SpacingMeasurements'
import { Button, CodeBlock, Inline, Input, Stack, Table } from '@surflane/ui'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/SpacingGuide'

/** Token names in a table cell, each linked to the token browser. */
const tokenList = (value: string) =>
  value.split(', ').map((token, index) => (
    <React.Fragment key={token}>
      {index > 0 && ', '}
      <Link href={`/tokens?q=${token}`}>
        <code>{token}</code>
      </Link>
    </React.Fragment>
  ))

/** The Layout page's spacing section: the scale, gaps by relationship, and a measured form. */
export function SpacingGuide() {
  const t = text[useLocale().locale]
  const host = useRef<HTMLDivElement>(null)
  const [measurements, setMeasurements] = useState(true)
  return (
    <>
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
      <Table.Container bleed label={t.tableLabel} orientation='horizontal'>
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
            {t.rules.map(([relation, gap, tokens, example]) => (
              <Table.Row key={relation}>
                <Table.HeaderCell scope='row'>{relation}</Table.HeaderCell>
                <Table.Cell>{gap}</Table.Cell>
                <Table.Cell>{tokenList(tokens)}</Table.Cell>
                <Table.Cell>{example}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <p>{t.measureIntro}</p>
      <div className='actions spacing-measurement-controls'>
        <Button
          variant='outline'
          aria-pressed={measurements}
          onClick={() => setMeasurements((value) => !value)}
        >
          {t.spacingDimensions}
        </Button>
      </div>
      <Stack
        gap={4}
        ref={host}
        className='spacing-example spacing-form-example'
        data-testid='spacing-form'
      >
        <Stack gap={1} className='spacing-example'>
          <h3 data-spacing-title>{t.accountDetails}</h3>
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
      <p>{t.adapting}</p>
    </>
  )
}
