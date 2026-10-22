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
  ChoiceLabel,
} from '@surflane/ui'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ContentFoundation'

type Locale = 'ko-KR' | 'en-US'
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
      'Relative time uses a fixed preview reference. The absolute time is shown too.',
  },
}
// Bilingual sample sentences for the writing table, kept as-is in both locales.
const copySamples: string[][] = [
  ['Start deployment', '배포 시작'],
  ['Deployment in progress', '배포 진행 중'],
  [
    'No runs match these filters. Clear filters to see all runs.',
    '조건에 맞는 실행이 없습니다. 필터를 초기화해 전체 실행을 확인하세요.',
  ],
  [
    'You cannot deploy to this environment. Ask a project administrator for access.',
    '이 환경에 배포할 권한이 없습니다. 프로젝트 관리자에게 권한을 요청하세요.',
  ],
  [
    '2 checks failed. Review the results before retrying.',
    '검사 2개가 실패했습니다. 결과를 확인한 뒤 다시 시도하세요.',
  ],
]
export function ContentFoundation() {
  const t = text[useLocale().locale]
  const instants = [
    ['2026-03-08T06:30:00Z', t.instantBeforeSpringDst],
    ['2026-03-08T07:30:00Z', t.instantAfterSpringDst],
    ['2026-11-01T05:30:00Z', t.instantFirstAutumn],
    ['2026-11-01T06:30:00Z', t.instantSecondAutumn],
  ]
  const copyExamples = t.copyExamples.map(({ context, review }, index) => [
    context,
    copySamples[index][0],
    copySamples[index][1],
    review,
  ])
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
      <nav className='page-toc' aria-label={t.tocOnThisPage}>
        {[
          ['principles', t.tocPrinciples],
          ['formatting', t.tocFormatting],
          ['language-direction', t.tocLanguageDirection],
          ['writing', t.tocWriting],
          ['application', t.tocApplication],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <section id='principles'>
        <h2>{t.principlesHeading}</h2>
        <p>{t.principlesIntro}</p>
        <p>
          {t.principlesProductBefore}
          <code>lang</code>
          {t.principlesProductAfter}
        </p>
      </section>
      <section id='formatting'>
        <h2>{t.formattingHeading}</h2>
        <p>{t.formattingIntro}</p>
        <Grid columns={2} gap={4} className='content-preview-settings'>
          <Field.Root>
            <Field.Label>{t.formattingLocaleLabel}</Field.Label>
            <NativeSelect
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
            >
              <option value='en-US'>English / United States</option>
              <option value='ko-KR'>Korean / South Korea</option>
            </NativeSelect>
          </Field.Root>
          <Field.Root>
            <Field.Label>{t.displayTimeZoneLabel}</Field.Label>
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
            <Field.Label>{t.sourceInstantLabel}</Field.Label>
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
            <Field.Label>{t.runCountLabel}</Field.Label>
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
          aria-label={t.localizedFormatPreview}
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
          {t.sourceNoteBefore}
          <code data-source-instant>{instant}</code>
          {t.sourceNoteAfter}
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

// formatNumber, formatCurrency and formatPercent from @surflane/ui keep zero
// and write a missing value as you name it.
const countLabel = formatNumber(count, {
  locale,
  missing: messages.notAvailable,
})`}
        />
        <p>{t.displayContractNote}</p>
      </section>
      <section id='language-direction'>
        <h2>{t.languageDirectionHeading}</h2>
        <p>
          <code>lang</code>
          {t.languageDirectionLangAfter}
          <code>dir</code>
          {t.languageDirectionDirAfter}
          <code>dir="auto"</code>
          {t.languageDirectionAutoAfter}
          <code>bdi dir="ltr"</code>
          {t.languageDirectionBdiAfter}
        </p>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={rtl} onCheckedChange={setRtl}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.rtlPreview}
        </ChoiceLabel>
        <Field.Root className='content-name-field'>
          <Field.Label>{t.resourceNameLabel}</Field.Label>
          <Field.Description>{t.resourceNameDescription}</Field.Description>
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
            aria-label={t.mixedDirectionPreview}
          >
            <p>
              {t.previewProject}{' '}
              <bdi dir='auto' data-resource-name>
                {resourceName || t.untitledPreview}
              </bdi>
            </p>
            <p>
              {t.previewResourceId}{' '}
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
        <p>{t.truncationNote}</p>
      </section>
      <section id='writing'>
        <h2>{t.writingHeading}</h2>
        <Table.Container
          bleed
          label={t.writingTableLabel}
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>{t.writingTableCaption}</Table.Caption>
            <Table.Head>
              <Table.Row>
                {t.writingColumns.map((label) => (
                  <Table.HeaderCell key={label} scope='col'>
                    {label}
                  </Table.HeaderCell>
                ))}
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
        <p>{t.writingErrorNote}</p>
      </section>
      <section id='application'>
        <h2>{t.applicationHeading}</h2>
        <ul>
          {t.implementationRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <p>
          {t.seeAlsoIntro}{' '}
          <Link href='/foundations/typography'>{t.seeAlsoTypography}</Link>,{' '}
          <Link href='/foundations/accessibility'>
            {t.seeAlsoAccessibility}
          </Link>
          , <Link href='/components/number-field'>{t.seeAlsoNumberField}</Link>,{' '}
          {t.seeAlsoAnd} <Link href='/components/toast'>{t.seeAlsoToast}</Link>
          {t.seeAlsoOutro}
        </p>
        <p>
          {t.referencesLabel}{' '}
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
