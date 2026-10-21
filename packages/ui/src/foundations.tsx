'use client'
import * as React from 'react'
export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20
const cx = (...values: (string | undefined)[]) =>
  values.filter(Boolean).join(' ')
const gapStyle = (
  gap: Space | undefined,
  style: React.CSSProperties | undefined,
) =>
  ({
    ...(gap === undefined ? {} : { '--layout-gap': `var(--space-${gap})` }),
    ...style,
  }) as React.CSSProperties
export const Container = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    width?: 'workspace' | 'reading' | 'wide' | 'full'
  }
>(function Container({ width = 'workspace', className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-container', className)}
      data-width={width}
    />
  )
})
export const Stack = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { gap?: Space }
>(function Stack({ gap, className, style, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-stack', className)}
      style={gapStyle(gap, style)}
    />
  )
})
export const Inline = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    gap?: Space
    justify?: 'start' | 'between' | 'end'
  }
>(function Inline({ gap, justify = 'start', className, style, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-inline', className)}
      data-justify={justify}
      style={gapStyle(gap, style)}
    />
  )
})
export const Grid = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    gap?: Space
    /** Extend inline edges by the matching child content inset (card padding or table cell inset). The parent
     * must reserve this space for the card surface and focus outline. */
    bleed?: Space
    columns?: 1 | 2 | 3 | 4 | 'layout'
  }
>(function Grid(
  { gap, bleed = 0, columns = 3, className, style, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-grid', className)}
      data-columns={columns}
      style={gapStyle(gap, {
        '--grid-inline-bleed': `var(--space-${bleed})`,
        ...style,
      } as React.CSSProperties)}
    />
  )
})
/** Spans are explicit at each viewport breakpoint; placement follows DOM order. */
export const GridItem = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    mediumSpan?: 1 | 2 | 3 | 4 | 5 | 6
    smallSpan?: 1 | 2 | 3 | 4
  }
>(function GridItem(
  { span, mediumSpan, smallSpan, className, style, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-grid-item', className)}
      style={
        {
          '--grid-item-span': span,
          '--grid-item-span-medium': mediumSpan,
          '--grid-item-span-small': smallSpan,
          ...style,
        } as React.CSSProperties
      }
    />
  )
})
export const Surface = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { tone?: 'canvas' | 'subtle'; padding?: Space }
>(function Surface(
  { tone = 'subtle', padding, className, style, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('pui-surface', className)}
      data-tone={tone}
      style={
        {
          ...(padding === undefined
            ? {}
            : { '--surface-padding': `var(--space-${padding})` }),
          ...style,
        } as React.CSSProperties
      }
    />
  )
})
export function Heading({
  level = 2,
  size = 'section',
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?:
    | 'display'
    | 'title'
    | 'page'
    | 'section'
    | 'subsection'
    | 'workspace'
    | 'document'
}) {
  const Tag = `h${level}` as 'h1'
  return (
    <Tag {...props} className={cx('pui-heading', className)} data-size={size} />
  )
}
export function Text({
  as: Tag = 'p',
  variant = 'body',
  color = 'primary',
  weight = 'regular',
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'div'
  variant?:
    'body' | 'reading' | 'table' | 'caption' | 'label' | 'mono' | 'metric'
  color?: 'primary' | 'secondary' | 'muted'
  weight?: 'regular' | 'medium'
}) {
  return (
    <Tag
      {...props}
      className={cx('pui-text', className)}
      data-variant={variant}
      data-color={color}
      data-weight={weight}
    />
  )
}
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
export const Prose = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(function Prose({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={cx('pui-prose', className)} />
})
