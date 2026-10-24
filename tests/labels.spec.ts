import { test, expect } from '@playwright/test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CodeBlock, FileUpload } from '../packages/ui/dist/index.js'
import { Markdown } from '../packages/ui/dist/markdown.js'
import { Chart } from '../packages/ui/dist/chart.js'
import { waitForCatalogReady } from './catalog-ready'

// Every string a component shows or names can be replaced through its props, so an
// app can render it in its own language.
const html = (element: React.ReactElement) => renderToStaticMarkup(element)

test('CodeBlock and Markdown take their copy text and part names from labels', () => {
  expect(
    html(
      React.createElement(CodeBlock, {
        code: 'npm test',
        labels: { copy: '코드 복사' },
      }),
    ),
  ).toContain('코드 복사')
  const markdown = html(
    React.createElement(Markdown, {
      // A task item with no text takes the task label.
      source:
        '```ts\nconst a = 1\n```\n\n| a |\n| - |\n| 1 |\n\n- [ ] \u00a0\n',
      label: '문서',
      labels: {
        code: (label: string, line: number) => `${label}: ${line}행의 코드`,
        table: (label: string, line: number) => `${label}: ${line}행의 표`,
        task: '할 일 항목',
        copy: '복사',
      },
    }),
  )
  expect(markdown).toContain('문서: 1행의 코드')
  expect(markdown).toContain('문서: 5행의 표')
  expect(markdown).toContain('aria-label="할 일 항목"')
  expect(markdown).toContain('>복사<')
})

test('Chart names its legend and FileUpload its sizes and file actions from labels', () => {
  const chart = html(
    React.createElement(Chart, {
      title: '배포',
      description: '하루 배포 수',
      xLabel: '날짜',
      yLabel: '배포',
      unit: '회',
      data: [{ id: 'mon', label: '월', values: { a: 1 } }],
      series: [{ key: 'a', label: '운영' }],
      labels: {
        legend: (title: string) => `${title} 계열`,
        series: (label: string) => `${label} 계열 보기`,
      },
    }),
  )
  expect(chart).toContain('aria-label="배포 계열"')
  expect(chart).toContain('aria-label="운영 계열 보기"')
  const upload = html(
    React.createElement(FileUpload, {
      label: '첨부',
      defaultFiles: [new File(['x'.repeat(2048)], 'report.pdf')],
      transport: async () => {},
      labels: {
        size: (bytes: number) => `${bytes / 1024}킬로바이트`,
        fileAction: (action: string, file: File) => `${file.name} ${action}`,
        upload: '업로드',
        remove: '삭제',
      },
    }),
  )
  expect(upload).toContain('2킬로바이트')
  expect(upload).toContain('aria-label="report.pdf 업로드"')
  expect(upload).toContain('aria-label="report.pdf 삭제"')
})

test('the Korean Tree names its folder toggles in Korean', async ({ page }) => {
  await page.goto('/ko/components/tree')
  await waitForCatalogReady(page)
  await expect(
    page.locator('.surf-tree-toggle[aria-label$="펼치기"]').first(),
  ).toBeAttached()
  await expect(
    page.locator('.surf-tree-toggle[aria-label^="Expand"]'),
  ).toHaveCount(0)
})
