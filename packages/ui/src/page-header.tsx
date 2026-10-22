'use client'
import * as React from 'react'
import { cx } from './parts.js'
import { Heading, Text } from './typography.js'

export function PageHeader({
  as: Root = 'div',
  headingProps,
  actionsLabel,
  title,
  description,
  breadcrumb,
  actions,
  level = 1,
  size = 'title',
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'title'> & {
  as?: 'div' | 'header'
  headingProps?: Omit<
    React.HTMLAttributes<HTMLHeadingElement>,
    'children' | 'dangerouslySetInnerHTML'
  >
  actionsLabel?: string
  title: React.ReactNode
  description?: React.ReactNode
  breadcrumb?: React.ReactNode
  actions?: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'title' | 'page' | 'workspace' | 'document'
}) {
  return (
    <Root {...props} className={cx('pui-page-header', className)}>
      {breadcrumb != null && breadcrumb !== false && breadcrumb !== '' && (
        <div className='pui-page-header-breadcrumb'>{breadcrumb}</div>
      )}
      <div className='pui-page-header-content'>
        <div className='pui-page-header-copy'>
          <Heading {...headingProps} level={level} size={size}>
            {title}
          </Heading>
          {description != null &&
            description !== false &&
            description !== '' && (
              <Text color='secondary' className='pui-page-header-description'>
                {description}
              </Text>
            )}
        </div>
        {actions != null && actions !== false && actions !== '' && (
          <div
            className='pui-page-header-actions'
            role={actionsLabel ? 'group' : undefined}
            aria-label={actionsLabel}
          >
            {actions}
          </div>
        )}
      </div>
    </Root>
  )
}
