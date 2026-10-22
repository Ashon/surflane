import React, { useState } from 'react'
import { Button, CodeBlock, Icon, iconNames, Select, Table } from '@surflane/ui'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/IconographyFoundation'
export function IconographyFoundation() {
  const t = text[useLocale().locale]
  const [count, setCount] = useState(0),
    [direction, setDirection] = useState('ltr')
  return (
    <>
      <nav className='page-toc' aria-label={t.onThisPage}>
        {t.nav.map(({ id, label }) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <section id='principles'>
        <h2>{t.principlesTitle}</h2>
        <p>{t.principlesIntro}</p>
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
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <Table.Row key={size}>
                  <Table.HeaderCell scope='row'>
                    <Link href={`/tokens?q=--icon-size-${size}`}>
                      <code>--icon-size-{size}</code>
                    </Link>
                  </Table.HeaderCell>
                  <Table.Cell>
                    {size === 'sm'
                      ? t.sizeSm
                      : size === 'md'
                        ? t.sizeMd
                        : t.sizeLg}
                  </Table.Cell>
                  <Table.Cell>
                    <Icon name='search' size={size} data-icon-specimen={size} />
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row>
                <Table.HeaderCell scope='row'>
                  <Link href='/tokens?q=--icon-stroke-width'>
                    <code>--icon-stroke-width</code>
                  </Link>
                </Table.HeaderCell>
                <Table.Cell>{t.strokeWidthUsage}</Table.Cell>
                <Table.Cell>{t.strokeCaps}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>{t.principlesClosing}</p>
      </section>
      <section id='library'>
        <h2>{t.libraryTitle}</h2>
        <p>{t.libraryIntro(iconNames.length)}</p>
        <ul className='icon-gallery' aria-label={t.galleryLabel}>
          {iconNames.map((name) => (
            <li key={name}>
              <Icon name={name} size='md' />
              <code>{name}</code>
            </li>
          ))}
        </ul>
      </section>
      <section id='semantics'>
        <h2>{t.semanticsTitle}</h2>
        <p>{t.semanticsIntro}</p>
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
        <p>
          {t.semanticsClosingStart}
          <Link href='/components/badge'>{t.statusBadgeLink}</Link>
          {t.semanticsClosingEnd}
        </p>
        <h3>{t.primitiveContractTitle}</h3>
        <p>
          <code>name</code>
          {t.primitiveNameRest} <code>size</code>
          {t.primitiveSizeRest} <code>decorative</code>
          {t.primitiveDecorativeRest}
          <code>decorative=false</code>
          {t.primitiveLabelRest}
          <code>label</code>
          {t.primitiveRefRest}
        </p>
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
      </section>
      <section id='direction'>
        <h2>{t.directionTitle}</h2>
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
      </section>
      <section id='application'>
        <h2>{t.applicationTitle}</h2>
        <ul>
          <li>{t.rule1}</li>
          <li>{t.rule2}</li>
          <li>{t.rule3}</li>
        </ul>
        <p>{t.applicationNote}</p>
        <p>
          <a href='https://design-system.w3.org/styles/svg-icons.html'>
            {t.w3cSvgIcons}
          </a>
          {' / '}
          <a href='https://www.w3.org/WAI/tutorials/images/functional/'>
            {t.waiFunctionalImages}
          </a>
          {' / '}
          <Link href='/foundations/color'>{t.colorContrastLink}</Link>
        </p>
        <p>{t.closingNote}</p>
      </section>
    </>
  )
}
