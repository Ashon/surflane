import React, { useEffect, useRef, useState } from 'react'
import {
  Text,
  Field,
  Button,
  Checkbox,
  Collapsible,
  InlineMessage,
  NativeSelect,
  PageHeader,
  Prose,
  ChoiceLabel,
  Link as TextLink,
} from '@surflane/ui'
import { CatalogCodeBlock as CodeBlock } from './CatalogCodeBlock'
import { Link } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/DocumentationExample'
const sections = ['prepare', 'configure', 'next'] as const
type Section = (typeof sections)[number]
// The Korean copy is a deliberate locale sample for the language switcher.
const copy = {
  ko: {
    title: '첫 서비스 배포하기',
    description:
      '서비스를 선택하고 설정을 검토한 뒤 배포를 확인하는 문서 예제입니다.',
    contents: '이 문서의 목차',
    prepare: '시작하기 전에',
    configure: '미리보기 설정',
    next: '다음 단계',
    intro:
      '서비스의 이름과 환경을 확인합니다. 이 예제는 실제 서비스를 호출하거나 자원을 만들지 않습니다.',
    steps: [
      '서비스의 이름과 식별자를 확인합니다.',
      '현재 배포할 수 있는 환경을 선택합니다.',
      '배포 결과와 빌드 로그를 검토할 담당자를 정합니다.',
    ],
    note: '읽기 전용 예제',
    noteBody: '운영 변경 전에 제품의 권한과 실행 조건을 확인합니다.',
    config:
      '아래 구성은 복사하거나 줄바꿈해 볼 수 있습니다. 긴 식별자는 코드 영역 안에서 가로로 탐색할 수 있습니다.',
    continuation:
      '설명을 읽는 동안 본문의 폭과 행간은 일정하게 유지합니다. 목차의 항목을 선택하면 관련 제목으로 이동하고, 다른 문서로 가는 링크는 표준 링크로 동작합니다.',
    nextBody:
      '입력과 오류를 다루는 폼 흐름이나 접근성 기준을 이어서 확인합니다.',
    workflow: '폼 워크플로 살펴보기',
    accessibility: '접근성 기준 읽기',
    code: '미리보기 구성',
    copy: '예제 구성 복사',
    copied: '복사함',
    copyError: '복사할 수 없음',
    updated: '예제 문서 / 2026년 10월 17일',
    long: '프로젝트 배포 / platform-api-abcdefghijklmnopqrstuvwxyz0123456789',
  },
  en: {
    title: 'Deploy your first service',
    description:
      'Choose a service, review its configuration, and check the deployment.',
    contents: 'In this guide',
    prepare: 'Before you begin',
    configure: 'Preview configuration',
    next: 'Next steps',
    intro:
      'Check the service name and environment. This example makes no service requests and creates no resources.',
    steps: [
      'Confirm the service name and identifier.',
      'Choose an environment you can currently deploy to.',
      'Identify who will review the deployment and its build logs.',
    ],
    note: 'Read-only example',
    noteBody:
      'Check product permissions and execution conditions before operational changes.',
    config:
      'Copy the configuration or enable wrapping. Long identifiers scroll horizontally inside the code region.',
    continuation:
      'Reading width and line spacing stay consistent throughout the guide. Contents links move to their heading. Links to other documents keep standard browser navigation.',
    nextBody:
      'Continue with the form workflow for input and error handling, or review the accessibility foundation.',
    workflow: 'Explore the form workflow',
    accessibility: 'Read accessibility guidance',
    code: 'Sample configuration',
    copy: 'Copy sample configuration',
    copied: 'Copied',
    copyError: 'Copy unavailable',
    updated: 'Example guide / 17 October 2026',
    long: 'Platform API / project-abcdefghijklmnopqrstuvwxyz0123456789',
  },
}
export const documentationSampleCode = `const preview = {
  environment: 'sample-environment',
  mode: 'read-only',
  identifier:
    'platform-api-abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789',
}`
export function DocumentationExample() {
  const [locale, setLocale] = useState<'ko' | 'en'>('en'),
    [long, setLong] = useState(false),
    [wrap, setWrap] = useState(false),
    [contentsOpen, setContentsOpen] = useState(true),
    [active, setActive] = useState<Section>('prepare')
  const article = useRef<HTMLElement>(null)
  const copyText = copy[locale]
  const t = text[useLocale().locale]
  useEffect(() => {
    const viewport = article.current?.closest<HTMLElement>(
      '.catalog-document-scroll',
    )
    if (!viewport) return
    const update = () => {
      const threshold = viewport.getBoundingClientRect().top + 100
      let current: Section = 'prepare'
      for (const id of sections) {
        const heading = article.current?.querySelector<HTMLElement>(
          `#guide-preview-${id}`,
        )
        if (heading && heading.getBoundingClientRect().top <= threshold)
          current = id
      }
      setActive(current)
    }
    viewport.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const observer = new ResizeObserver(update)
    if (article.current) observer.observe(article.current)
    update()
    return () => {
      viewport.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
  }, [locale, long, wrap])
  return (
    <div className='documentation-example'>
      <div className='documentation-settings actions'>
        <Field.Root>
          <Field.Label>{t.documentLanguage}</Field.Label>
          <NativeSelect
            value={locale}
            onChange={(event) => setLocale(event.target.value as 'ko' | 'en')}
          >
            <option value='en'>{t.english}</option>
            <option value='ko'>{t.korean}</option>
          </NativeSelect>
        </Field.Root>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={long} onCheckedChange={setLong}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.longDocument}
        </ChoiceLabel>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={wrap} onCheckedChange={setWrap}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.wrapSampleCode}
        </ChoiceLabel>
      </div>
      <div className='documentation-layout'>
        <aside className='documentation-toc' lang={locale}>
          <Collapsible.Root open={contentsOpen} onOpenChange={setContentsOpen}>
            <Collapsible.Trigger render={<Button variant='ghost' />}>
              {copyText.contents}
            </Collapsible.Trigger>
            <Collapsible.Panel>
              <nav aria-label={copyText.contents}>
                {sections.map((id) => (
                  <a
                    key={id}
                    href={`#guide-preview-${id}`}
                    aria-current={active === id ? 'location' : undefined}
                  >
                    {copyText[id]}
                  </a>
                ))}
              </nav>
            </Collapsible.Panel>
          </Collapsible.Root>
        </aside>
        <article
          ref={article}
          className='documentation-article'
          lang={locale}
          aria-label={copyText.title}
        >
          <PageHeader
            title={copyText.title}
            description={copyText.description}
            level={3}
            variant='display'
          />
          <Text variant='caption' color='muted' className='documentation-meta'>
            <time dateTime='2026-10-17'>{copyText.updated}</time>
          </Text>
          <Prose>
            <section aria-labelledby='guide-preview-prepare'>
              <h4 id='guide-preview-prepare' tabIndex={-1}>
                {copyText.prepare}
              </h4>
              <p>{copyText.intro}</p>
              <ol>
                {copyText.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <InlineMessage.Root tone='neutral'>
                <InlineMessage.Content>
                  <InlineMessage.Title>{copyText.note}</InlineMessage.Title>
                  <InlineMessage.Description>
                    {copyText.noteBody}
                  </InlineMessage.Description>
                </InlineMessage.Content>
              </InlineMessage.Root>
              {long &&
                Array.from({ length: 3 }, (_, index) => (
                  <p key={index}>
                    {copyText.continuation} {copyText.long}
                  </p>
                ))}
            </section>
            <section aria-labelledby='guide-preview-configure'>
              <h4 id='guide-preview-configure' tabIndex={-1}>
                {copyText.configure}
              </h4>
              <p>{copyText.config}</p>
              <CodeBlock
                code={documentationSampleCode}
                label={copyText.code}
                language='typescript'
                wrap={wrap}
                labels={{
                  copy: copyText.copy,
                  copied: copyText.copied,
                  copyError: copyText.copyError,
                }}
              />
              {long &&
                Array.from({ length: 3 }, (_, index) => (
                  <p key={index}>{copyText.continuation}</p>
                ))}
            </section>
            <section aria-labelledby='guide-preview-next'>
              <h4 id='guide-preview-next' tabIndex={-1}>
                {copyText.next}
              </h4>
              <p>{copyText.nextBody}</p>
              <ul>
                <li>
                  <TextLink render={<Link href='/patterns/form-workflow' />}>
                    {copyText.workflow}
                  </TextLink>
                </li>
                <li>
                  <TextLink render={<Link href='/foundations/accessibility' />}>
                    {copyText.accessibility}
                  </TextLink>
                </li>
              </ul>
            </section>
          </Prose>
        </article>
      </div>
    </div>
  )
}
