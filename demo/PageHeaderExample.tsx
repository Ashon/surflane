import React, { useState } from 'react'
import {
  PageHeader,
  Breadcrumbs,
  Button,
  Checkbox,
  NativeSelect,
} from '@surflane/ui'
import { withBase } from './router'
export function PageHeaderExample() {
  const [profile, setProfile] = useState('workspace')
  const [long, setLong] = useState(false)
  const [details, setDetails] = useState(true)
  const [count, setCount] = useState(0)
  const title = long
    ? 'Environment and project deployment results / platform-api-abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz'
    : profile === 'docs'
      ? 'Getting started'
      : profile === 'inventory'
        ? 'Registered resources'
        : 'Deployment workspace'
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
          Heading role{' '}
          <NativeSelect
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          >
            <option value='workspace'>Application</option>
            <option value='inventory'>Page</option>
            <option value='docs'>Reading</option>
          </NativeSelect>
        </label>
        {(
          [
            ['Long title', long, setLong],
            ['Supporting content', details, setDetails],
          ] as const
        ).map(([label, checked, change]) => (
          <label key={label} className='pui-choice-label'>
            <Checkbox.Root checked={checked} onCheckedChange={change}>
              <Checkbox.Indicator />
            </Checkbox.Root>
            {label}
          </label>
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
              <Breadcrumbs.Root aria-label='Preview page breadcrumb'>
                <Breadcrumbs.List>
                  <Breadcrumbs.Item>
                    <a href={withBase('/patterns')}>Patterns</a>
                  </Breadcrumbs.Item>
                  <Breadcrumbs.Item>
                    <Breadcrumbs.Separator />
                    <Breadcrumbs.Current>Page header</Breadcrumbs.Current>
                  </Breadcrumbs.Item>
                </Breadcrumbs.List>
              </Breadcrumbs.Root>
            ) : undefined
          }
          description={
            details
              ? 'Describe the current location with a breadcrumb and title, and keep related actions close by. Long content wraps naturally.'
              : undefined
          }
          actionsLabel={details ? 'Preview page actions' : undefined}
          actions={
            details ? (
              <>
                <Button
                  variant='outline'
                  onClick={() => setCount((n) => n + 1)}
                >
                  Inspect preview
                </Button>
                <Button onClick={() => setCount((n) => n + 1)}>
                  Run preview
                </Button>
              </>
            ) : undefined
          }
        />
      </div>
      <p role='status'>
        {count
          ? `Local action preview: ${count}`
          : 'Actions update this local preview only.'}
      </p>
      <p>
        The breadcrumb is a named navigation that marks the current location.
        The header follows the{' '}
        <a href='https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/'>
          WAI breadcrumb guidance
        </a>{' '}
        and{' '}
        <a href='https://www.w3.org/WAI/tutorials/page-structure/headings/'>
          heading hierarchy
        </a>
        , and sets text size and heading level independently.
      </p>
    </>
  )
}
