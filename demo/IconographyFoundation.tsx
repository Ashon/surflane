import React, { useState } from 'react'
import { Button, Icon, iconNames, Select, Table } from '@surflane/ui'
import { CatalogCodeBlock as CodeBlock } from './CatalogCodeBlock'
import { FoundationPage, FoundationSection } from './FoundationPage'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/IconographyFoundation'
export function IconographyFoundation() {
  const t = text[useLocale().locale]
  const [count, setCount] = useState(0),
    [direction, setDirection] = useState('ltr')
  return (
    <FoundationPage
      principles={t.principles}
      sections={t.sections}
      related={[
        '/foundations/color',
        '/foundations/accessibility',
        '/components/button',
        '/components/badge',
      ]}
    >
      <FoundationSection id='sizes'>
        <p>{t.sizesIntro}</p>
        <Table.Container bleed label={t.tableLabel} orientation='horizontal'>
          <Table.Root>
            <Table.Caption>{t.caption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.tokenHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.usageHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>
                  {t.exampleHeader}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {(['small', 'default', 'large'] as const).map((size) => (
                <Table.Row key={size}>
                  <Table.HeaderCell scope='row'>
                    <Link href={`/tokens?q=--surf-size-icon-${size}`}>
                      <code>--surf-size-icon-{size}</code>
                    </Link>
                  </Table.HeaderCell>
                  <Table.Cell>
                    {size === 'small'
                      ? t.sizeSmall
                      : size === 'default'
                        ? t.sizeDefault
                        : t.sizeLarge}
                  </Table.Cell>
                  <Table.Cell>
                    <Icon name='search' size={size} data-icon-specimen={size} />
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row>
                <Table.HeaderCell scope='row'>
                  <Link href='/tokens?q=--surf-icon-stroke-width'>
                    <code>--surf-icon-stroke-width</code>
                  </Link>
                </Table.HeaderCell>
                <Table.Cell>{t.strokeWidthUsage}</Table.Cell>
                <Table.Cell>{t.strokeCaps}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Table.Container>
      </FoundationSection>
      <FoundationSection id='vocabulary'>
        <p>{t.libraryIntro(iconNames.length)}</p>
        <ul className='icon-gallery' aria-label={t.galleryLabel}>
          {iconNames.map((name) => (
            <li key={name}>
              <Icon name={name} size='large' />
              <code>{name}</code>
            </li>
          ))}
        </ul>
      </FoundationSection>
      <FoundationSection id='names'>
        <p>{t.namesIntro}</p>
        <div className='actions'>
          <Button variant='outline' onClick={() => setCount((n) => n + 1)}>
            <Icon name='plus' />
            {t.incrementPreview}
          </Button>
          <Button
            variant='outline'
            size='icon'
            aria-label={t.resetPreview}
            onClick={() => setCount(0)}
          >
            <Icon name='close' />
          </Button>
        </div>
        <p role='status'>{t.localCount(count)}</p>
        <p className='icon-inline-example'>
          <Icon
            name='info'
            decorative={false}
            label={t.supplementaryInfoLabel}
          />
          {t.standaloneIconNote}
        </p>
        <p>{t.namesNote}</p>
        <CodeBlock
          language='tsx'
          label={t.codeLabel}
          code={`import { Icon, Button } from '@surflane/ui'

<Button>
  <Icon name='plus' />
  Add environment
</Button>
<Button size='icon' aria-label='Close details'>
  <Icon name='close' />
</Button>
<Icon name='info' decorative={false} label='Additional information' />`}
        />
        <p>
          <a href='https://design-system.w3.org/styles/svg-icons.html'>
            {t.w3cSvgIcons}
          </a>
          {' / '}
          <a href='https://www.w3.org/WAI/tutorials/images/functional/'>
            {t.waiFunctionalImages}
          </a>
        </p>
      </FoundationSection>
      <FoundationSection id='direction'>
        <p>{t.directionIntro}</p>
        <label>
          {t.previewDirectionLabel}
          <Select
            aria-label={t.previewDirectionLabel}
            value={direction}
            onValueChange={(value) => setDirection(value ?? 'ltr')}
            options={[
              { value: 'ltr', label: t.ltrOption },
              { value: 'rtl', label: t.rtlOption },
            ]}
          />
        </label>
        <div
          className='actions icon-direction-preview'
          dir={direction}
          data-icon-direction={direction}
        >
          <span>
            <Icon name='arrow-back' />
            {t.back}
          </span>
          <span>
            {t.next}
            <Icon name='chevron-forward' />
          </span>
          <span>
            <Icon name='external-link' />
            {t.externalLink}
          </span>
        </div>
        <p>{t.directionPreviewNote}</p>
      </FoundationSection>
    </FoundationPage>
  )
}
