import React from 'react'
import {
  Avatar,
  Card,
  DescriptionList,
  Grid,
  Inline,
  Meter,
  Sheet,
  SizeProvider,
  Spinner,
  Stack,
  Stat,
  StatusBadge,
  Table,
  Text,
  Timeline,
  categoryFor,
} from '@surflane/ui'
import { CatalogCodeBlock as CodeBlock } from './CatalogCodeBlock'
import { useLocale } from './i18n'
import { text } from './i18n/pages/CollectionGuide'

type Copy = (typeof text)['en']
type Session = Copy['sessions'][number]

const initials = (name: string) =>
  name
    .split(/[-\s]/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')

/** How full a session's context window is: past 60% it turns caution, past 85% danger. */
function ContextMeter({ session, t }: { session: Session; t: Copy }) {
  return (
    <Meter.Root
      value={session.context}
      low={60}
      high={85}
      optimum={0}
      aria-valuetext={t.contextText(session.context)}
    >
      <Meter.Label>{t.context}</Meter.Label>
      <Meter.Value />
      <Meter.Track>
        <Meter.Indicator />
      </Meter.Track>
    </Meter.Root>
  )
}
function SessionCounts({ session, t }: { session: Session; t: Copy }) {
  return (
    <Stat.Group label={t.countsLabel} labelHidden size='small'>
      {(
        [
          [t.turns, session.turns],
          [t.tools, session.tools],
          [t.tokens, session.tokens],
          [t.elapsed, session.elapsed],
        ] as const
      ).map(([label, value]) => (
        <Stat.Root key={label}>
          <Stat.Label>{label}</Stat.Label>
          <Stat.Value>{value === '' ? t.noValue : value}</Stat.Value>
        </Stat.Root>
      ))}
    </Stat.Group>
  )
}
/** The whole session, beside the collection: its counts, its context, its turns. */
function SessionSheet({ session, t }: { session: Session; t: Copy }) {
  return (
    <Sheet.Content closeLabel={t.closeSheet(session.name)}>
      <Sheet.Header>
        <Sheet.Title>{session.name}</Sheet.Title>
        <Sheet.Description>{session.message}</Sheet.Description>
      </Sheet.Header>
      <Sheet.Body>
        <Stack gap={6}>
          <Inline gap={3}>
            <StatusBadge tone={session.tone}>{session.state}</StatusBadge>
          </Inline>
          <SessionCounts session={session} t={t} />
          <ContextMeter session={session} t={t} />
          <Stack gap={3}>
            <Text as='p' variant='label'>
              {t.recentTurns}
            </Text>
            <Timeline.Root aria-label={t.recentTurns}>
              {session.turnsLog.map((turn, index) => (
                <Timeline.Item
                  key={turn.title}
                  tone={turn.tone}
                  current={index === 0 && turn.tone === 'progress'}
                  icon={
                    turn.tone === 'progress' ? (
                      <Spinner decorative size='small' />
                    ) : undefined
                  }
                >
                  <Timeline.Title>{turn.title}</Timeline.Title>
                  <Timeline.Time dateTime={turn.dateTime}>
                    {turn.time}
                  </Timeline.Time>
                  <Timeline.Status>{turn.status}</Timeline.Status>
                  {turn.reply && <Text>{turn.reply}</Text>}
                  <Text variant='caption' color='secondary'>
                    {turn.tools}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline.Root>
          </Stack>
          <DescriptionList.Root aria-label={t.details}>
            <DescriptionList.Item>
              <DescriptionList.Term>{t.agent}</DescriptionList.Term>
              <DescriptionList.Value>{session.agent}</DescriptionList.Value>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>{t.started}</DescriptionList.Term>
              <DescriptionList.Value>{session.started}</DescriptionList.Value>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>{t.directory}</DescriptionList.Term>
              <DescriptionList.Value truncate copy>
                {session.directory}
              </DescriptionList.Value>
            </DescriptionList.Item>
          </DescriptionList.Root>
        </Stack>
      </Sheet.Body>
    </Sheet.Content>
  )
}
function SessionCard({ session, t }: { session: Session; t: Copy }) {
  return (
    <Sheet.Root>
      <Card.Root data-testid='collection-card'>
        <Card.Header>
          <Inline justify='between'>
            <Inline gap={3}>
              <Avatar.Root
                category={categoryFor(session.name)}
                aria-hidden='true'
              >
                <Avatar.Fallback>{initials(session.name)}</Avatar.Fallback>
                {session.live && <Avatar.Status tone={session.tone} live />}
              </Avatar.Root>
              <div>
                <Card.Title>
                  <Sheet.Trigger render={<Card.Action />}>
                    {session.name}
                  </Sheet.Trigger>
                </Card.Title>
                <Text variant='caption' color='secondary'>
                  {session.agent}
                </Text>
              </div>
            </Inline>
            <StatusBadge tone={session.tone}>{session.state}</StatusBadge>
          </Inline>
        </Card.Header>
        <Card.Body>
          <Text lines={2}>{session.message}</Text>
        </Card.Body>
        <Card.Footer>
          <ContextMeter session={session} t={t} />
          <SessionCounts session={session} t={t} />
        </Card.Footer>
      </Card.Root>
      <SessionSheet session={session} t={t} />
    </Sheet.Root>
  )
}
/** The Layout page's collection section: the rules, then agent sessions built by them. */
export function CollectionGuide() {
  const t = text[useLocale().locale]
  return (
    <>
      <p>{t.intro}</p>
      <Table.Container bleed label={t.rulesLabel} orientation='horizontal'>
        <Table.Root>
          <Table.Caption>{t.rulesCaption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope='col'>{t.partHeader}</Table.HeaderCell>
              <Table.HeaderCell scope='col'>{t.ruleHeader}</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {t.rules.map(([part, rule]) => (
              <Table.Row key={part}>
                <Table.HeaderCell scope='row'>{part}</Table.HeaderCell>
                <Table.Cell>{rule}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <SizeProvider density='compact'>
        <div className='foundation-collection' data-testid='collection-example'>
          <Grid columns='auto' min='card'>
            {t.sessions.map((session) => (
              <SessionCard key={session.name} session={session} t={t} />
            ))}
          </Grid>
        </div>
      </SizeProvider>
      <CodeBlock
        language='tsx'
        label={t.exampleLabel}
        code={`import {
  Avatar,
  Card,
  Grid,
  Inline,
  Meter,
  Sheet,
  SizeProvider,
  Stat,
  StatusBadge,
  Text,
  categoryFor,
} from '@surflane/ui'

<SizeProvider density='compact'>
  <Grid columns='auto' min='card'>
    {sessions.map((session) => (
      <Sheet.Root key={session.id}>
        <Card.Root>
          <Card.Header>
            <Inline justify='between'>
              <Inline gap={3}>
                <Avatar.Root
                  category={categoryFor(session.name)}
                  aria-hidden='true'
                >
                  <Avatar.Fallback>{session.initials}</Avatar.Fallback>
                  {session.working && <Avatar.Status tone='progress' live />}
                </Avatar.Root>
                <div>
                  <Card.Title>
                    <Sheet.Trigger render={<Card.Action />}>
                      {session.name}
                    </Sheet.Trigger>
                  </Card.Title>
                  <Text variant='caption' color='secondary'>
                    {session.agent}
                  </Text>
                </div>
              </Inline>
              <StatusBadge tone={session.tone}>{session.state}</StatusBadge>
            </Inline>
          </Card.Header>
          <Card.Body>
            <Text lines={2}>{session.lastMessage}</Text>
          </Card.Body>
          <Card.Footer>
            <Meter.Root value={session.context} low={60} high={85} optimum={0}>
              <Meter.Label>Context</Meter.Label>
              <Meter.Value />
              <Meter.Track>
                <Meter.Indicator />
              </Meter.Track>
            </Meter.Root>
            <Stat.Group label='Session counts' labelHidden size='small'>
              <Stat.Root>
                <Stat.Label>Turns</Stat.Label>
                <Stat.Value>{session.turns}</Stat.Value>
              </Stat.Root>
              {/* Tools, Tokens, Time: a value not yet known shows a dash. */}
            </Stat.Group>
          </Card.Footer>
        </Card.Root>
        <Sheet.Content>
          {/* The whole session: counts, context, turns. */}
        </Sheet.Content>
      </Sheet.Root>
    ))}
  </Grid>
</SizeProvider>`}
      />
    </>
  )
}
