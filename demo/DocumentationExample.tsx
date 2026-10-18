import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Checkbox,
  CodeBlock,
  Collapsible,
  InlineMessage,
  NativeSelect,
  PageHeader,
  Prose,
} from '@surflane/ui'
import { Link } from './router'
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
    copied: '예제 구성을 복사했습니다.',
    copyError: '복사하지 못했습니다. 코드를 선택해 직접 복사하세요.',
    updated: '예제 문서 / 2026년 10월 17일',
    long: '프로젝트 배포 / platform-api-abcdefghijklmnopqrstuvwxyz0123456789',
  },
  en: {
    title: 'Deploy your first service',
    description:
      'A guide example for choosing a service, reviewing configuration and checking the deployment.',
    contents: 'On this guide',
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
      'Reading width and line spacing stay consistent throughout the guide. Contents links move to the related heading; links to other documents retain standard browser navigation.',
    nextBody:
      'Continue with the form workflow for input and error handling, or review the accessibility foundation.',
    workflow: 'Explore the form workflow',
    accessibility: 'Read accessibility guidance',
    code: 'Sample configuration',
    copy: 'Copy sample configuration',
    copied: 'Sample configuration copied.',
    copyError: 'Copy unavailable. Select the code and copy it manually.',
    updated: 'Example guide / 17 October 2026',
    long: 'Platform API / project-abcdefghijklmnopqrstuvwxyz0123456789',
  },
}
export const documentationSampleCode =
  'const preview = {\n  environment: "sample-environment",\n  mode: "read-only",\n  identifier: "platform-api-abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789"\n};'
export function DocumentationExample() {
  const [locale, setLocale] = useState<'ko' | 'en'>('en'),
    [long, setLong] = useState(false),
    [wrap, setWrap] = useState(false),
    [contentsOpen, setContentsOpen] = useState(true),
    [active, setActive] = useState<Section>('prepare')
  const article = useRef<HTMLElement>(null)
  const text = copy[locale]
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
        <label>
          Document language
          <NativeSelect
            value={locale}
            onChange={(event) => setLocale(event.target.value as 'ko' | 'en')}
          >
            <option value='en'>English</option>
            <option value='ko'>Korean</option>
          </NativeSelect>
        </label>
        <label className='pui-choice-label'>
          <Checkbox.Root checked={long} onCheckedChange={setLong}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          Long document
        </label>
        <label className='pui-choice-label'>
          <Checkbox.Root checked={wrap} onCheckedChange={setWrap}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          Wrap sample code
        </label>
      </div>
      <div className='documentation-layout'>
        <aside className='documentation-toc' lang={locale}>
          <Collapsible.Root open={contentsOpen} onOpenChange={setContentsOpen}>
            <Collapsible.Trigger render={<Button variant='ghost' />}>
              {text.contents}
            </Collapsible.Trigger>
            <Collapsible.Panel>
              <nav aria-label={text.contents}>
                {sections.map((id) => (
                  <a
                    key={id}
                    href={`#guide-preview-${id}`}
                    aria-current={active === id ? 'location' : undefined}
                  >
                    {text[id]}
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
          aria-label={text.title}
        >
          <PageHeader
            title={text.title}
            description={text.description}
            level={3}
            size='document'
          />
          <p className='documentation-meta'>
            <time dateTime='2026-10-17'>{text.updated}</time>
          </p>
          <Prose>
            <section aria-labelledby='guide-preview-prepare'>
              <h4 id='guide-preview-prepare' tabIndex={-1}>
                {text.prepare}
              </h4>
              <p>{text.intro}</p>
              <ol>
                {text.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <InlineMessage.Root tone='neutral'>
                <InlineMessage.Content>
                  <InlineMessage.Title>{text.note}</InlineMessage.Title>
                  <InlineMessage.Description>
                    {text.noteBody}
                  </InlineMessage.Description>
                </InlineMessage.Content>
              </InlineMessage.Root>
              {long &&
                Array.from({ length: 3 }, (_, index) => (
                  <p key={index}>
                    {text.continuation} {text.long}
                  </p>
                ))}
            </section>
            <section aria-labelledby='guide-preview-configure'>
              <h4 id='guide-preview-configure' tabIndex={-1}>
                {text.configure}
              </h4>
              <p>{text.config}</p>
              <CodeBlock
                code={documentationSampleCode}
                label={text.code}
                language='typescript'
                wrap={wrap}
                copyLabel={text.copy}
                copiedLabel={text.copied}
                copyErrorLabel={text.copyError}
              />
              {long &&
                Array.from({ length: 3 }, (_, index) => (
                  <p key={index}>{text.continuation}</p>
                ))}
            </section>
            <section aria-labelledby='guide-preview-next'>
              <h4 id='guide-preview-next' tabIndex={-1}>
                {text.next}
              </h4>
              <p>{text.nextBody}</p>
              <ul>
                <li>
                  <Link className='pui-link' href='/patterns/form-workflow'>
                    {text.workflow}
                  </Link>
                </li>
                <li>
                  <Link className='pui-link' href='/foundations/accessibility'>
                    {text.accessibility}
                  </Link>
                </li>
              </ul>
            </section>
          </Prose>
        </article>
      </div>
    </div>
  )
}
