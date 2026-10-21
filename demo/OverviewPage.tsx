import React from 'react'
import { Grid, Icon } from '@surflane/ui'
import { Link } from './router'
import { useMessages } from './i18n'
export function Overview() {
  const messages = useMessages()
  const o = messages.overview
  return (
    <>
      <section id='overview-foundations'>
        <h2>{o.foundationsTitle}</h2>
        <p>{o.foundationsBody}</p>
        <Grid columns={3} gap={4} bleed={4} className='catalog-feature-links'>
          {[
            ['/foundations/layout', o.layoutLink, o.layoutSummary],
            ['/foundations/typography', o.typographyLink, o.typographySummary],
            ['/tokens', o.tokensLink, o.tokensSummary],
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
        <h2>{o.componentsTitle}</h2>
        <p>{o.componentsBody}</p>
        <div className='actions'>
          <Link
            className='pui-button'
            data-variant='outline'
            href='/components'
          >
            {o.browseComponents}
          </Link>
          <Link className='pui-button' data-variant='outline' href='/coverage'>
            {o.reviewCoverage}
          </Link>
        </div>
      </section>
      <section id='overview-direction'>
        <h2>{o.directionTitle}</h2>
        <p>{o.directionBody}</p>
        <dl className='design-principles'>
          <div>
            <dt>{o.principle1Title}</dt>
            <dd>{o.principle1Body}</dd>
          </div>
          <div>
            <dt>{o.principle2Title}</dt>
            <dd>{o.principle2Body}</dd>
          </div>
          <div>
            <dt>{o.principle3Title}</dt>
            <dd>{o.principle3Body}</dd>
          </div>
        </dl>
        <p>{o.directionNote}</p>
      </section>
    </>
  )
}
