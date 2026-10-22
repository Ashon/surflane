import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  ChoiceLabel,
  Heading,
  Icon,
  Input,
  Popover,
  Stat,
  StatusBadge,
  Surface,
  Table,
  Toggle,
  ToggleGroup,
} from '@surflane/ui'
import { codeText } from './codeText'
import { FoundationPage, FoundationSection } from './FoundationPage'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/HierarchyFoundation'

type TierId = (typeof text.en.tiers)[number]['id']

/** A small drawing of each means, made of the tokens it names. */
function TierFigure({ id }: { id: TierId }) {
  if (id === 'plane')
    return (
      <div className='hierarchy-figure hierarchy-figure-plane'>
        <span>
          <span>
            <span />
          </span>
        </span>
      </div>
    )
  if (id === 'elevation')
    return (
      <div className='hierarchy-figure hierarchy-figure-elevation'>
        <span />
        <span />
      </div>
    )
  if (id === 'line')
    return (
      <div className='hierarchy-figure hierarchy-figure-line'>
        <span />
        <span />
      </div>
    )
  return (
    <div className='hierarchy-figure hierarchy-figure-point'>
      <span>Aa</span>
      <Icon name='check' size='md' />
      <span className='hierarchy-figure-dot' />
    </div>
  )
}

/** The same workspace at each step: only the tokens of the means not yet reached are
 * turned off, inside the preview. */
function BuildPreview() {
  const t = text[useLocale().locale]
  const [step, setStep] = useState('4')
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(true)
  const [shown, setShown] = useState([true, true, true])
  return (
    <div className='hierarchy-build-demo'>
      <ToggleGroup
        aria-label={t.stepsLabel}
        value={[step]}
        onValueChange={(next) => {
          if (next[0]) setStep(next[0])
        }}
      >
        {t.steps.map((label, index) => (
          <Toggle key={label} value={String(index + 1)}>
            {label}
          </Toggle>
        ))}
      </ToggleGroup>
      <div
        ref={setStage}
        className='hierarchy-build'
        data-step={step}
        role='group'
        aria-label={t.previewLabel}
      >
        <div className='hierarchy-build-sheet'>
          <div className='hierarchy-build-header'>
            <Heading level={3}>{t.deployments}</Heading>
            <StatusBadge tone='success'>{t.healthy}</StatusBadge>
            <Button className='hierarchy-build-primary'>
              <Icon name='plus' />
              {t.newDeployment}
            </Button>
          </div>
          <div className='hierarchy-build-toolbar'>
            <Input
              type='search'
              wrapperClassName='hierarchy-build-search'
              aria-label={t.search}
              placeholder={t.search}
            />
            <Popover.Root
              open={open}
              onOpenChange={(next, details) => {
                // Keep the open filter while other controls are used: it is the
                // overlapping layer this preview is about.
                if (
                  details.reason === 'trigger-press' ||
                  details.reason === 'escape-key'
                )
                  setOpen(next)
              }}
            >
              <Popover.Trigger render={<Button variant='outline' />}>
                <Icon name='sort' />
                {t.filter}
              </Popover.Trigger>
              <Popover.Portal container={stage}>
                <Popover.Content initialFocus={false} size='small' align='end'>
                  <Popover.Title render={<h4 />}>{t.filterTitle}</Popover.Title>
                  <div className='hierarchy-build-options'>
                    {t.filterOptions.map((option, index) => (
                      <ChoiceLabel
                        key={option}
                        control={
                          <Checkbox.Root
                            checked={shown[index]}
                            onCheckedChange={(checked) =>
                              setShown((current) =>
                                current.map((value, i) =>
                                  i === index ? checked : value,
                                ),
                              )
                            }
                          >
                            <Checkbox.Indicator />
                          </Checkbox.Root>
                        }
                      >
                        {option}
                      </ChoiceLabel>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
          <Surface
            surface='subtle'
            className='hierarchy-build-stats'
            aria-label={t.summaryLabel}
            role='group'
          >
            {t.stats.map((stat) => (
              <Stat.Root key={stat.label}>
                <Stat.Label>{stat.label}</Stat.Label>
                <Stat.Value>{stat.value}</Stat.Value>
                <Stat.Change
                  value={stat.change}
                  lowerIsBetter={stat.lowerIsBetter}
                />
                <Stat.Caption>{t.vsYesterday}</Stat.Caption>
              </Stat.Root>
            ))}
          </Surface>
          <Table.Container label={t.tableLabel} orientation='horizontal'>
            <Table.Root>
              <Table.Head>
                <Table.Row>
                  {t.columns.map((column) => (
                    <Table.HeaderCell key={column} scope='col'>
                      {column}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {t.runs.map((run, index) => (
                  <Table.Row key={run.service} selected={index === 0}>
                    <Table.HeaderCell scope='row'>
                      <code>{run.service}</code>
                    </Table.HeaderCell>
                    <Table.Cell>
                      <StatusBadge tone={run.tone}>{run.status}</StatusBadge>
                    </Table.Cell>
                    <Table.Cell>{run.duration}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.Container>
        </div>
      </div>
      <p role='status'>{t.stepStatus[Number(step) - 1]}</p>
    </div>
  )
}

/** Each rule, with its token names set as code. */
function Rules({ rules }: { rules: string[] }) {
  return (
    <ul>
      {rules.map((rule) => (
        <li key={rule}>{codeText(rule)}</li>
      ))}
    </ul>
  )
}

export function HierarchyFoundation() {
  const t = text[useLocale().locale]
  return (
    <FoundationPage
      principles={t.principles}
      sections={t.sections}
      related={[
        '/foundations/layers',
        '/foundations/color',
        '/foundations/typography',
        '/foundations/interaction',
      ]}
    >
      <FoundationSection id='order'>
        <p>{t.orderIntro}</p>
        <ol className='hierarchy-tiers'>
          {t.tiers.map((tier) => (
            <li key={tier.id} className='hierarchy-tier'>
              <TierFigure id={tier.id} />
              <h3>
                <span className='hierarchy-tier-step'>{tier.step}</span>
                {tier.name}
              </h3>
              <p>{tier.role}</p>
              <p className='hierarchy-tier-tokens'>
                {tier.tokens.map((token) => (
                  <Link
                    key={token}
                    href={`/tokens?q=${encodeURIComponent(token)}`}
                  >
                    <code>{token}</code>
                  </Link>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </FoundationSection>
      <FoundationSection id='build'>
        <p>{t.buildIntro}</p>
        <BuildPreview />
      </FoundationSection>
      <FoundationSection id='planes'>
        <Rules rules={t.planeRules} />
      </FoundationSection>
      <FoundationSection id='elevation'>
        <Rules rules={t.elevationRules} />
      </FoundationSection>
      <FoundationSection id='lines'>
        <Rules rules={t.lineRules} />
      </FoundationSection>
      <FoundationSection id='points'>
        <Rules rules={t.pointRules} />
      </FoundationSection>
    </FoundationPage>
  )
}
