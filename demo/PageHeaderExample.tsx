import React, { useState } from 'react'
import {
  PageHeader,
  Breadcrumbs,
  Button,
  Checkbox,
  NativeSelect,
  ChoiceLabel,
} from '@surflane/ui'
import { withBase } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/PageHeaderExample'
export function PageHeaderExample() {
  const t = text[useLocale().locale]
  const [profile, setProfile] = useState('workspace')
  const [long, setLong] = useState(false)
  const [details, setDetails] = useState(true)
  const [count, setCount] = useState(0)
  const title = long
    ? t.titleLong
    : profile === 'docs'
      ? t.titleDocs
      : profile === 'inventory'
        ? t.titleInventory
        : t.titleWorkspace
  const size =
    profile === 'docs'
      ? 'document'
      : profile === 'inventory'
        ? 'page'
        : 'workspace'
  return (
    <>
      <div className='page-header-settings actions'>
        <label>
          {t.headingRole}{' '}
          <NativeSelect
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          >
            <option value='workspace'>{t.optionApplication}</option>
            <option value='inventory'>{t.optionPage}</option>
            <option value='docs'>{t.optionReading}</option>
          </NativeSelect>
        </label>
        {(
          [
            [t.longTitleLabel, long, setLong],
            [t.supportingContentLabel, details, setDetails],
          ] as const
        ).map(([label, checked, change]) => (
          <ChoiceLabel
            key={label}
            control={
              <Checkbox.Root checked={checked} onCheckedChange={change}>
                <Checkbox.Indicator />
              </Checkbox.Root>
            }
          >
            {label}
          </ChoiceLabel>
        ))}
      </div>
      <div
        className='page-header-preview catalog-example-frame'
        data-kind='pattern'
      >
        <PageHeader
          level={3}
          size={size}
          title={title}
          breadcrumb={
            details ? (
              <Breadcrumbs.Root aria-label={t.breadcrumbLabel}>
                <Breadcrumbs.List>
                  <Breadcrumbs.Item>
                    <a href={withBase('/patterns')}>{t.patterns}</a>
                  </Breadcrumbs.Item>
                  <Breadcrumbs.Item>
                    <Breadcrumbs.Separator />
                    <Breadcrumbs.Current>{t.pageHeader}</Breadcrumbs.Current>
                  </Breadcrumbs.Item>
                </Breadcrumbs.List>
              </Breadcrumbs.Root>
            ) : undefined
          }
          description={details ? t.description : undefined}
          actionsLabel={details ? t.previewPageActions : undefined}
          actions={
            details ? (
              <>
                <Button
                  variant='outline'
                  onClick={() => setCount((n) => n + 1)}
                >
                  {t.inspectPreview}
                </Button>
                <Button onClick={() => setCount((n) => n + 1)}>
                  {t.runPreview}
                </Button>
              </>
            ) : undefined
          }
        />
      </div>
      <p role='status'>
        {count ? t.localActionPreview(count) : t.localPreviewNote}
      </p>
      <p>
        {t.breadcrumbIntro}{' '}
        <a href='https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/'>
          {t.waiBreadcrumbGuidance}
        </a>{' '}
        {t.and}{' '}
        <a href='https://www.w3.org/WAI/tutorials/page-structure/headings/'>
          {t.headingHierarchy}
        </a>
        {t.guidanceOutro}
      </p>
    </>
  )
}
