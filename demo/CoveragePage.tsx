import React, { useState } from 'react'
import { Table, Select } from '@surflane/ui'
import { catalog, stageLabels, itemHref, referenceSources } from './catalog'
import { StageLabel } from './StageLabel'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/CoveragePage'
export function CoveragePage() {
  const t = text[useLocale().locale]
  const [kind, setKind] = useState('all'),
    [phase, setPhase] = useState('all')
  const shown = catalog.filter(
    (i) =>
      (kind === 'all' || kind === i.kind) &&
      (phase === 'all' || phase === String(i.phase)),
  )
  return (
    <>
      <section id='coverage-scope'>
        <h2>{t.scopeAndReadiness}</h2>
        <p>{t.scopeIntro}</p>
        <dl className='coverage-summary'>
          {Object.entries(stageLabels).map(([stage, label]) => (
            <div key={stage}>
              <dt>{label}</dt>
              <dd>{catalog.filter((i) => i.stage === stage).length}</dd>
            </div>
          ))}
        </dl>
        <p>
          <strong>{t.available}</strong>
          {t.availableDesc}
          <strong>{t.primitiveOnly}</strong>
          {t.primitiveDesc}
          <strong>{t.planned}</strong>
          {t.plannedDesc}
        </p>
      </section>
      <section id='coverage-waves'>
        <h2>{t.deliveryWaves}</h2>
        <ol className='delivery-waves' role='list'>
          <li>
            <strong>{t.wave0Title}</strong>
            <p>{t.wave0Desc}</p>
          </li>
          <li>
            <strong>{t.wave1Title}</strong>
            <p>{t.wave1Desc}</p>
          </li>
          <li>
            <strong>{t.wave2Title}</strong>
            <p>{t.wave2Desc}</p>
          </li>
          <li>
            <strong>{t.wave3Title}</strong>
            <p>{t.wave3Desc}</p>
          </li>
        </ol>
      </section>
      <section id='coverage-inventory'>
        <h2>{t.coverageInventory}</h2>
        <div className='catalog-filters'>
          <label>
            {t.layer}
            <Select
              aria-label={t.layerAriaLabel}
              value={kind}
              onValueChange={setKind}
              options={[
                { value: 'all', label: t.allLayers },
                ...['foundation', 'component', 'pattern'].map((value) => ({
                  value,
                  label: value,
                })),
              ]}
            />
          </label>
          <label>
            {t.wave}
            <Select
              aria-label={t.waveAriaLabel}
              value={phase}
              onValueChange={setPhase}
              options={[
                { value: 'all', label: t.allWaves },
                ...[0, 1, 2, 3].map((n) => ({
                  value: String(n),
                  label: t.waveOption(n),
                })),
              ]}
            />
          </label>
        </div>
        <Table.Container
          bleed
          className='catalog-table-wrap'
          label={t.tableLabel}
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>{t.caption(shown.length)}</Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.itemHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>
                  {t.layerCategoryHeader}
                </Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.basisHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.waveHeader}</Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.stageHeader}</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {shown.map((i) => (
                <Table.Row key={i.kind + i.id}>
                  <Table.HeaderCell scope='row'>
                    <Link href={itemHref(i)}>{i.name}</Link>
                  </Table.HeaderCell>
                  <Table.Cell>
                    {i.kind} / {i.group}
                  </Table.Cell>
                  <Table.Cell>{i.basis}</Table.Cell>
                  <Table.Cell>{i.phase}</Table.Cell>
                  <Table.Cell>
                    <StageLabel item={i} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
      </section>
      <section id='coverage-ready'>
        <h2>{t.definitionOfReady}</h2>
        <ul>
          <li>{t.readyItem1}</li>
          <li>{t.readyItem2}</li>
          <li>{t.readyItem3}</li>
          <li>{t.readyItem4}</li>
          <li>{t.readyItem5}</li>
        </ul>
      </section>
      <section id='coverage-research'>
        <h2>{t.researchBoundaries}</h2>
        <p>{t.researchIntro}</p>
        <ul>
          {referenceSources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target='_blank' rel='noreferrer'>
                {s.name}
              </a>
            </li>
          ))}
        </ul>
        <p>{t.researchNote}</p>
      </section>
    </>
  )
}
