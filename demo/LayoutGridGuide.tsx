import React, { useRef } from 'react'
import { GridBlueprint } from './BlueprintCanvas'
import { Grid, GridItem, Table, Text } from '@surflane/ui'
import { CatalogCodeBlock as CodeBlock } from './CatalogCodeBlock'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/LayoutGridGuide'

/** The Layout page's grid section: breakpoints, a span grid, and composition. */
export function LayoutGridGuide() {
  const t = text[useLocale().locale]
  const gridRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <p>{t.intro}</p>
      <Table.Container
        bleed
        label={t.breakpointsLabel}
        orientation='horizontal'
      >
        <Table.Root>
          <Table.Caption>{t.caption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              {[t.viewport, t.layoutTracks, t.defaultGutter, t.equalCards].map(
                (label) => (
                  <Table.HeaderCell key={label} scope='col'>
                    {label}
                  </Table.HeaderCell>
                ),
              )}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {t.rows.map(([viewport, tracks, gutter, cards]) => (
              <Table.Row key={viewport}>
                <Table.HeaderCell scope='row'>{viewport}</Table.HeaderCell>
                <Table.Cell>{tracks}</Table.Cell>
                <Table.Cell>{gutter}</Table.Cell>
                <Table.Cell>{cards}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <Grid
        columns='layout'
        className='foundation-span-grid layout-guide-container'
        ref={gridRef}
        data-grid-guides='true'
        data-testid='span-grid'
      >
        <GridBlueprint hostRef={gridRef} />
        <GridItem
          span={8}
          mediumSpan={4}
          smallSpan={4}
          className='foundation-grid-region'
          data-grid-region='primary'
        >
          <Text variant='label'>{t.primaryContent}</Text>
          <Text color='secondary'>{t.primaryTracks}</Text>
        </GridItem>
        <GridItem
          span={4}
          mediumSpan={2}
          smallSpan={4}
          className='foundation-grid-region'
          data-grid-region='secondary'
        >
          <Text variant='label'>{t.supportingDetails}</Text>
          <Text color='secondary'>{t.secondaryTracks}</Text>
        </GridItem>
        <GridItem
          span={12}
          mediumSpan={6}
          smallSpan={4}
          className='foundation-grid-region'
          data-grid-region='full'
        >
          <Text variant='label'>{t.fullWidthResults}</Text>
          <Text color='secondary'>{t.fullTracks}</Text>
        </GridItem>
      </Grid>
      <CodeBlock
        language='tsx'
        label={t.codeLabel}
        code={`import { Container, Grid, GridItem, Card } from '@surflane/ui'

<Container width='workspace'>
  <Grid columns='layout'>
    <GridItem span={8} mediumSpan={4} smallSpan={4}>
      Main
    </GridItem>
    <GridItem span={4} mediumSpan={2} smallSpan={4}>
      Details
    </GridItem>
    <GridItem span={12} mediumSpan={6} smallSpan={4}>
      Results
    </GridItem>
  </Grid>
</Container>

// Equal cards: 3 columns, then 2, then 1.
// Match bleed to the card padding so card text aligns with the text around it.
<Grid columns={3} gap={4} bleed={4}>
  {items.map((item) => (
    <Card.Root key={item.id} padding={4}>
      ...
    </Card.Root>
  ))}
</Grid>`}
      />
      <p>{t.bleed}</p>
      <p>
        {t.spansStart}
        <Link href='/components/scroll-area'>{t.scrollArea}</Link>
        {t.spansEnd}
      </p>
    </>
  )
}
