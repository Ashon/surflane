import React, { useState } from 'react'
import {
  Checkbox,
  CodeBlock,
  DirectionProvider,
  Field,
  Grid,
  Input,
  NativeSelect,
  Table,
} from '@surflane/ui'
import { Link } from './router'

type Locale = 'ko-KR' | 'en-US'
const instants = [
  ['2026-03-08T06:30:00Z', 'Before spring DST change'],
  ['2026-03-08T07:30:00Z', 'After spring DST change'],
  ['2026-11-01T05:30:00Z', 'First autumn 01:30'],
  ['2026-11-01T06:30:00Z', 'Second autumn 01:30'],
]
const messages = {
  // Korean-locale sample messages, kept in Korean to show full-sentence localization.
  'ko-KR': {
    count: (value: string) => `기록된 실행 ${value}개`,
    labels: [
      '실행 수',
      '예상 비용 (USD)',
      '사용률',
      '발생 시각',
      '시간대',
      '최근 변경',
      '실제 0',
      '아직 없는 값',
    ],
    unavailable: '아직 제공되지 않음',
    reference: '상대 시간은 고정된 예제 기준이며 발생 시각을 함께 제공합니다.',
  },
  'en-US': {
    count: (value: string, category: Intl.LDMLPluralRule) =>
      category === 'one' ? `${value} recorded run` : `${value} recorded runs`,
    labels: [
      'Recorded runs',
      'Estimated cost (USD)',
      'Utilization',
      'Occurred at',
      'Time zone',
      'Last change',
      'Actual zero',
      'Missing value',
    ],
    unavailable: 'Not available yet',
    reference:
      'Relative time uses a fixed preview reference; the absolute time is retained.',
  },
}
const copyExamples = [
  [
    'Action',
    'Start deployment',
    '배포 시작',
    'Name the object and the action specifically.',
  ],
  [
    'Progress',
    'Deployment in progress',
    '배포 진행 중',
    "Don't describe work in progress as complete.",
  ],
  [
    'Empty result',
    'No runs match these filters. Clear filters to see all runs.',
    '조건에 맞는 실행이 없습니다. 필터를 초기화해 전체 실행을 확인하세요.',
    'Distinguish having no data from having no matching results.',
  ],
  [
    'Permission',
    'You cannot deploy to this environment. Ask a project administrator for access.',
    '이 환경에 배포할 권한이 없습니다. 프로젝트 관리자에게 권한을 요청하세요.',
    'Explain the cause and a recovery path the user can actually take.',
  ],
  [
    'Partial failure',
    '2 checks failed. Review the results before retrying.',
    '검사 2개가 실패했습니다. 결과를 확인한 뒤 다시 시도하세요.',
    "State the scope and the next step so it isn't mistaken for full success.",
  ],
]
export function ContentFoundation() {
  const [locale, setLocale] = useState<Locale>('en-US')
  const [timeZone, setTimeZone] = useState('Asia/Seoul')
  const [instant, setInstant] = useState(instants[0][0])
  const [count, setCount] = useState(1)
  const [rtl, setRtl] = useState(false)
  const [resourceName, setResourceName] = useState(
    '프로젝트 / مشروع / platform-api-production-release-archive',
  )
  const number = new Intl.NumberFormat(locale)
  const copy = messages[locale]
  const runCount = copy.count(
    number.format(count),
    new Intl.PluralRules(locale).select(count),
  )
  const occurredAt = new Date(instant)
  const date = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'shortOffset',
  })
  const displayValues = [
    runCount,
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
    }).format(1234.5),
    new Intl.NumberFormat(locale, {
      style: 'percent',
      maximumFractionDigits: 1,
    }).format(0.875),
    <time
      key='time'
      data-content-value='instant'
      dateTime={occurredAt.toISOString()}
    >
      {date.format(occurredAt)}
    </time>,
    <bdi key='zone' dir='ltr'>
      {timeZone}
    </bdi>,
    new Intl.RelativeTimeFormat(locale, { numeric: 'always' }).format(
      -5,
      'minute',
    ),
    number.format(0),
    copy.unavailable,
  ]
  return (
    <>
      <nav className='page-toc' aria-label='On this page'>
        {[
          'principles',
          'formatting',
          'language-direction',
          'writing',
          'application',
        ].map((id) => (
          <a key={id} href={`#${id}`}>
            {id
              .split('-')
              .map((word) => word[0].toUpperCase() + word.slice(1))
              .join(' ')}
          </a>
        ))}
      </nav>
      <section id='principles'>
        <h2>Meaning before formatting</h2>
        <p>
          Use the same term for the same action, state, and object across every
          screen. Lead with the outcome the user needs and the next step, and
          keep internal error codes, stack traces, and implementation terms in
          reviewable details. Manage whole sentences as translation units; never
          build word order or plurals by joining word fragments.
        </p>
        <p>
          The product decides the document's base <code>lang</code>, the user's
          language and time zone settings, and the actual message translations.
          Pass translated labels, errors, and close button names to shared
          components. Changing the browser language does not translate product
          copy automatically.
        </p>
      </section>
      <section id='formatting'>
        <h2>One value, explicit locale and time zone</h2>
        <p>
          The locale determines number and date formats; the time zone
          determines the local time of the same instant. The settings below
          apply only to this example. Currency is fixed to USD and is not
          converted when the locale changes. Compare the skipped and repeated
          times around DST changes with the UTC source and offset.
        </p>
        <Grid columns={2} gap={4} className='content-preview-settings'>
          <Field.Root>
            <Field.Label>Formatting locale</Field.Label>
            <NativeSelect
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
            >
              <option value='en-US'>English / United States</option>
              <option value='ko-KR'>Korean / South Korea</option>
            </NativeSelect>
          </Field.Root>
          <Field.Root>
            <Field.Label>Display time zone</Field.Label>
            <NativeSelect
              value={timeZone}
              onChange={(event) => setTimeZone(event.target.value)}
            >
              <option value='Asia/Seoul'>Asia/Seoul</option>
              <option value='America/New_York'>America/New_York</option>
              <option value='UTC'>UTC</option>
            </NativeSelect>
          </Field.Root>
          <Field.Root>
            <Field.Label>Source instant (UTC)</Field.Label>
            <NativeSelect
              value={instant}
              onChange={(event) => setInstant(event.target.value)}
            >
              {instants.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </Field.Root>
          <Field.Root>
            <Field.Label>Recorded run count</Field.Label>
            <NativeSelect
              value={String(count)}
              onChange={(event) => setCount(Number(event.target.value))}
            >
              {[0, 1, 12].map((value) => (
                <option key={value} value={String(value)}>
                  {value}
                </option>
              ))}
            </NativeSelect>
          </Field.Root>
        </Grid>
        <div
          className='content-format-preview'
          lang={locale}
          aria-label='Localized format preview'
          role='group'
        >
          <dl className='content-value-list'>
            {copy.labels.map((label, index) => (
              <div key={index}>
                <dt>{label}</dt>
                <dd data-content-value={index}>{displayValues[index]}</dd>
              </div>
            ))}
          </dl>
          <p>{copy.reference}</p>
        </div>
        <p>
          Source: <code data-source-instant>{instant}</code>. The relative time
          is a local example that does not follow the current time. A real
          service must manage the refresh interval, reference time, and
          server–client clock difference separately.
        </p>
        <CodeBlock
          language='tsx'
          code={`const locale = userPreferences.locale
const timeZone = userPreferences.timeZone
// value is an instant with a known offset; never parse an ambiguous local string.
const occurredAt = new Date('2026-03-08T07:30:00Z')
const display = new Intl.DateTimeFormat(locale, {
  timeZone,
  dateStyle: 'medium',
  timeStyle: 'long',
}).format(occurredAt)

<time dateTime={occurredAt.toISOString()}>{display}</time>

// Keep zero; distinguish absent values from invalid values upstream.
const countLabel =
  count == null
    ? messages.notAvailable
    : new Intl.NumberFormat(locale).format(count)`}
        />
        <p>
          This code is an example of a display contract. Validate invalid dates,
          NaN, infinity, and unsupported locales or time zones at the data
          boundary and handle them as errors. Don't substitute zero or the
          current time for an empty value. Date-only values, scheduled local
          times, durations, and UTC instants are different domain values; never
          parse a display string back.
        </p>
      </section>
      <section id='language-direction'>
        <h2>Language and direction are separate</h2>
        <p>
          <code>lang</code> sets the language and <code>dir</code> sets the base
          reading direction. The RTL example is for checking layout; it does not
          mean an Arabic translation is provided. Isolate user-entered names
          with <code>dir="auto"</code> and stable Latin-script identifiers with{' '}
          <code>bdi dir="ltr"</code>.
        </p>
        <label className='pui-choice-label'>
          <Checkbox.Root checked={rtl} onCheckedChange={setRtl}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          RTL preview
        </label>
        <Field.Root className='content-name-field'>
          <Field.Label>Resource name preview</Field.Label>
          <Field.Description>
            Try a long name, Korean or Arabic text, or text that looks like
            HTML. Input is shown only as text and is never submitted.
          </Field.Description>
          <Input
            dir='auto'
            value={resourceName}
            onChange={(event) => setResourceName(event.target.value)}
          />
        </Field.Root>
        <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
          <div
            className='content-direction-preview'
            dir={rtl ? 'rtl' : 'ltr'}
            lang='en'
            role='group'
            aria-label='Mixed direction preview'
          >
            <p>
              Project:{' '}
              <bdi dir='auto' data-resource-name>
                {resourceName || 'Untitled preview'}
              </bdi>
            </p>
            <p>
              Resource ID:{' '}
              <bdi dir='ltr' className='content-identifier'>
                demo-e2e-42/platform-api-production
              </bdi>
            </p>
            <p>
              <span lang='ar' dir='rtl'>
                المشروع
              </span>
              : <bdi dir='ltr'>demo-e2e-42</bdi>
            </p>
          </div>
        </DirectionProvider>
        <p>
          Prefer wrapping and logical (start/end) spacing. Don't hide names,
          amounts, or key identifiers in errors and confirmations behind an
          ellipsis or a hover-only tooltip. When a table needs to truncate, keep
          the full text available by keyboard and touch.
        </p>
      </section>
      <section id='writing'>
        <h2>Write the outcome and a useful next step</h2>
        <Table.Container
          label='Interface writing examples'
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>
              Complete sentences with the same meaning in English and Korean
            </Table.Caption>
            <Table.Head>
              <Table.Row>
                {['Context', 'English', 'Korean sample', 'Review'].map(
                  (label) => (
                    <Table.HeaderCell key={label} scope='col'>
                      {label}
                    </Table.HeaderCell>
                  ),
                )}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {copyExamples.map(([context, en, ko, review]) => (
                <Table.Row key={context}>
                  <Table.HeaderCell scope='row'>{context}</Table.HeaderCell>
                  <Table.Cell lang='en'>{en}</Table.Cell>
                  <Table.Cell lang='ko'>{ko}</Table.Cell>
                  <Table.Cell>{review}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>
          A recoverable error connects the cause, the fix, and the preserved
          input. Keep Field.Error, InlineMessage, and result records
          persistently visible; never rely on a Toast alone to report a failure
          or a recovery path. Report success only when the work has actually
          completed.
        </p>
      </section>
      <section id='application'>
        <h2>Content implementation rules</h2>
        <ul>
          <li>
            Preserve user-entered names and identifiers exactly as entered. Show
            occurrence times with the selected time zone and offset.
          </li>
          <li>
            Keep identifiers, quantities, and units distinct. Zero and an
            unknown quantity are different states.
          </li>
          <li>
            Preserve the content language and proper names; localize date
            formats and link purpose.
          </li>
          <li>
            Pass the same locale and time zone to SSR and the client to avoid a
            mismatched first render.
          </li>
        </ul>
        <p>
          Review this together with the shared component guidance on{' '}
          <Link href='/foundations/typography'>typography</Link>,{' '}
          <Link href='/foundations/accessibility'>
            label, error, and focus contracts
          </Link>
          , <Link href='/components/number-field'>Number Field locale</Link>,
          and <Link href='/components/toast'>persistent recovery paths</Link>.
          This page does not mean the whole product is translated, external
          services are connected, or production rollout is complete.
        </p>
        <p>
          References:{' '}
          <a href='https://402.ecma-international.org/'>
            ECMA-402: Intl formatting
          </a>
          ,{' '}
          <a href='https://www.w3.org/International/questions/qa-html-language-declarations'>
            W3C: language declarations
          </a>
          ,{' '}
          <a href='https://www.w3.org/International/questions/qa-html-dir'>
            W3C: text direction
          </a>
          .
        </p>
      </section>
    </>
  )
}
