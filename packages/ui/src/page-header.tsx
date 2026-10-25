import * as React from 'react'
import { cx } from './class-names.js'
import { Heading, Text, type HeadingVariant } from './typography.js'

export function PageHeader({
  as: Root = 'div',
  headingProps,
  actionsLabel,
  title,
  description,
  breadcrumb,
  actions,
  level = 1,
  variant,
  size,
  lead = false,
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
  /** The title's type role, as Heading's variant is. */
  variant?: HeadingVariant
  /** @deprecated The earlier name for `variant`. `workspace` and `document` are
   * earlier names for `display`. */
  size?: HeadingVariant | 'workspace' | 'document'
  /** Sets the description as the page's lead: the reading role at the reading
   * measure, for a document that opens with it. */
  lead?: boolean
}) {
  return (
    <Root {...props} className={cx('surf-page-header', className)}>
      {breadcrumb != null && breadcrumb !== false && breadcrumb !== '' && (
        <div className='surf-page-header-breadcrumb'>{breadcrumb}</div>
      )}
      <div className='surf-page-header-content'>
        <div className='surf-page-header-copy'>
          <Heading
            {...headingProps}
            level={level}
            size={variant ?? size ?? 'title'}
          >
            {title}
          </Heading>
          {description != null &&
            description !== false &&
            description !== '' && (
              <Text
                color='secondary'
                variant={lead ? 'reading' : 'body'}
                data-lead={lead || undefined}
                className='surf-page-header-description'
              >
                {description}
              </Text>
            )}
        </div>
        {actions != null && actions !== false && actions !== '' && (
          <div
            className='surf-page-header-actions'
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
