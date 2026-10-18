import React, { useRef } from 'react'
import { GridBlueprint } from './BlueprintCanvas'
import { CodeBlock, Grid, GridItem, Table, Text } from '@surflane/ui'
import { Link } from './router'
export function LayoutGridGuide() {
  const gridRef = useRef<HTMLDivElement>(null)
  return (
    <section id='grid-system' aria-labelledby='grid-system-title'>
      <h2 id='grid-system-title'>Responsive grid system</h2>
      <p>
        Use Grid's 1–4 columns for lists of equal-size cards, and the 12 / 6 / 4
        column layout grid for areas of different widths, such as main content
        and a supporting panel. Guide lines are overlaid as pseudo-elements, so
        they never change the position or height of the UI. Keep visual order
        and DOM order the same, and limit reading content to the separate
        reading width.
      </p>
      <Table.Container label='Grid breakpoints' orientation='horizontal'>
        <Table.Root>
          <Table.Caption>Shared grid contract by viewport</Table.Caption>
          <Table.Head>
            <Table.Row>
              {[
                'Viewport',
                'Layout tracks',
                'Default gutter',
                'Catalog cards',
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
                'Above 1100px',
                '12',
                '24px / space-6',
                '3 columns (Foundations index: 2)',
              ],
              ['761–1100px', '6', '24px / space-6', '2 columns'],
              ['Up to 760px', '4', '16px / space-4', '1 column'],
            ].map(([viewport, tracks, gutter, cards]) => (
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
      <p>
        Containers fill the available width up to a maximum of 75rem for
        workspace, 96rem for wide and 52rem for reading. The catalog's own sheet
        is limited to 1100px. Gutters follow the default token, and dense
        combinations such as lists and filters set gap to space-4 explicitly.
      </p>
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
          <Text variant='label'>Primary content</Text>
          <Text color='secondary'>8 / 4 / 4 tracks</Text>
        </GridItem>
        <GridItem
          span={4}
          mediumSpan={2}
          smallSpan={4}
          className='foundation-grid-region'
          data-grid-region='secondary'
        >
          <Text variant='label'>Supporting details</Text>
          <Text color='secondary'>4 / 2 / 4 tracks</Text>
        </GridItem>
        <GridItem
          span={12}
          mediumSpan={6}
          smallSpan={4}
          className='foundation-grid-region'
          data-grid-region='full'
        >
          <Text variant='label'>Full-width results</Text>
          <Text color='secondary'>
            12 / 6 / 4 tracks,
            long-resource-identifiers-for-staging-deployments-also-wrap
          </Text>
        </GridItem>
      </Grid>
      <CodeBlock
        language='tsx'
        label='Responsive grid composition'
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
<Grid columns={3} gap={4}>
  {cards}
</Grid>

// Align card content with surrounding text. Match bleed to card padding.
<Grid columns={3} gap={4} bleed={4}>
  {items.map((item) => (
    <Card.Root key={item.id} padding={4}>
      ...
    </Card.Root>
  ))}
</Grid>`}
      />
      <p>
        In a card grid, the edge of the card surface and the line where text
        starts are different. If the card's inner padding is space-4, set{' '}
        <code>{'bleed={4}'}</code> on Grid so headings and body text align with
        surrounding content. Only the grid's left and right edges extend, by
        16px each; column gaps and card padding stay the same. The default bleed
        is 0 and does not propagate to nested grids. Reserve that space and room
        for focus indicators in the outer container, and don't use bleed at the
        window edge or in clipped areas. The overview and each index card use
        the same contract.
      </p>
      <p>
        Use GridItem as a direct child of columns="layout". A span you don't set
        inherits the value from the next larger size, capped at the current
        column count. Don't reorder content with hidden columns or CSS order.
        Check the minimum inner width of inputs, tables and code, and let tables
        and code scroll only in the direction they need with{' '}
        <Link href='/components/scroll-area'>ScrollArea</Link>.
      </p>
      <p>
        Tokens used:{' '}
        <Link href='/tokens?q=--layout-columns'>
          <code>--layout-columns</code>
        </Link>
        ,{' '}
        <Link href='/tokens?q=--layout-gutter'>
          <code>--layout-gutter</code>
        </Link>
        ,{' '}
        <Link href='/tokens?q=--layout-workspace'>
          <code>--layout-workspace</code>
        </Link>
        . See <Link href='/components'>All components</Link> for a real list
        that uses the same card grid.
      </p>
    </section>
  )
}
