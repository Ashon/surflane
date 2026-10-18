import React from 'react'
import { Grid, Icon } from '@surflane/ui'
import { Link } from './router'
export function Overview() {
  return (
    <>
      <section id='overview-foundations'>
        <h2>Start with foundations</h2>
        <p>
          Review the shared tokens, typography and layout first, then read each
          component page for its behavior and usage guidance.
        </p>
        <Grid columns={3} gap={4} bleed={4} className='catalog-feature-links'>
          {[
            ['/foundations/layout', 'Layout', 'Width, spacing, grid'],
            ['/foundations/typography', 'Typography', 'Hangul, Latin, code'],
            ['/tokens', 'Tokens', 'Values, aliases, themes'],
          ].map(([href, name, summary]) => (
            <Link key={href} href={href}>
              <strong>{name}</strong>
              <span>{summary}</span>
              <Icon
                name='chevron-forward'
                className='catalog-feature-arrow'
                decorative
              />
            </Link>
          ))}
        </Grid>
      </section>
      <section id='overview-components'>
        <h2>Components have their own pages</h2>
        <p>
          Each page covers examples, usage guidance, keyboard behavior, the key
          API and tokens. Unimplemented items are marked Planned, and unstyled
          re-exports are marked Primitive only.
        </p>
        <div className='actions'>
          <Link
            className='pui-button'
            data-variant='outline'
            href='/components'
          >
            Browse components
          </Link>
          <Link className='pui-button' data-variant='outline' href='/coverage'>
            Review coverage
          </Link>
        </div>
      </section>
      <section id='overview-direction'>
        <h2>Design direction</h2>
        <p>
          Surflane builds the UI that platform development needs from consistent
          tokens, components and patterns. It covers visual choices and
          implementation rules together, and evolves through real use and
          testing.
        </p>
        <dl className='design-principles'>
          <div>
            <dt>Surfaces first</dt>
            <dd>
              Build hierarchy with surfaces and whitespace; use lines only where
              a boundary is needed.
            </dd>
          </div>
          <div>
            <dt>Clear interaction</dt>
            <dd>
              Make state changes, focus, and keyboard and touch feedback clear.
            </dd>
          </div>
          <div>
            <dt>Composable foundations</dt>
            <dd>
              Connect shared standards for color, typography, spacing and size
              through composable APIs.
            </dd>
          </div>
        </dl>
        <p>
          This direction is not a fixed, finished plan. New design decisions are
          added, reflected in the foundations and behavior examples, and the
          standards are refined over time.
        </p>
      </section>
    </>
  )
}
