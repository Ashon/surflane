'use client'
import * as React from 'react'
import { cx } from './parts.js'
import { useComponentSize, type ComponentSize } from './sizing.js'
import { CopyButton } from './copy-button.js'

export type DescriptionListLabels = {
  /** What a value with nothing in it reads. */
  empty: string
  /** The copy action's text, then its results. */
  copy: string
  copied: string
  copyError: string
}
const defaultLabels: DescriptionListLabels = {
  empty: 'Not set',
  copy: 'Copy',
  copied: 'Copied',
  copyError: 'Copy unavailable',
}
const LabelsContext = /* @__PURE__ */ React.createContext(defaultLabels)
const TermContext = /* @__PURE__ */ React.createContext<{
  id: string
  setId: (id: string) => void
} | null>(null)

export type DescriptionListRootProps = React.ComponentPropsWithoutRef<'dl'> & {
  /** inline sets each value beside its term, moving it under the term where the row
   * is too narrow; stacked sets every value under its term. */
  layout?: 'inline' | 'stacked'
  /** Two columns of items where both fit, one where they do not. */
  columns?: 1 | 2
  size?: ComponentSize
  /** compact uses the small row. A list follows a SizeProvider density; default
   * keeps it roomy inside a compact one. */
  density?: 'default' | 'compact'
  labels?: Partial<DescriptionListLabels>
}
/** Terms and their values, such as a resource's properties: a native dl. */
const Root = function DescriptionListRoot({
  layout = 'inline',
  columns = 1,
  size,
  density,
  labels,
  className,
  ref,
  ...props
}: DescriptionListRootProps & { ref?: React.Ref<HTMLDListElement> }) {
  const scheme = useComponentSize(size)
  const merged = React.useMemo(
    () => ({ ...defaultLabels, ...labels }),
    [labels?.empty, labels?.copy, labels?.copied, labels?.copyError],
  )
  return (
    <LabelsContext.Provider value={merged}>
      <dl
        {...props}
        ref={ref}
        className={cx('surf-description-list', className)}
        data-layout={layout}
        data-columns={columns}
        data-density={density}
        data-ui-size={scheme}
      />
    </LabelsContext.Provider>
  )
}
/** One term and its value. */
const Item = function DescriptionListItem({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}) {
  const generated = React.useId()
  const [id, setId] = React.useState(generated)
  const term = React.useMemo(() => ({ id, setId }), [id])
  return (
    <TermContext.Provider value={term}>
      <div
        {...props}
        ref={ref}
        className={cx('surf-description-list-item', className)}
      />
    </TermContext.Provider>
  )
}
const Term = function DescriptionListTerm({
  id,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'dt'> & { ref?: React.Ref<HTMLElement> }) {
  const term = React.useContext(TermContext)
  // The copy action names its term, so it needs the id the term really has.
  React.useLayoutEffect(() => {
    if (id) term?.setId(id)
  }, [id, term?.setId])
  return (
    <dt
      {...props}
      ref={ref}
      id={id ?? term?.id}
      className={cx('surf-description-list-term', className)}
    />
  )
}
export type DescriptionListValueProps = React.ComponentPropsWithoutRef<'dd'> & {
  /** One line, cut with an ellipsis. The whole value stays in the text, and a text
   * value shows in full as the title; give title for any other. */
  truncate?: boolean
  /** A copy action after the value: true copies the value's text, a string copies
   * that string. The action names its term for screen readers. */
  copy?: boolean | string
}
const Value = function DescriptionListValue({
  truncate = false,
  copy,
  title,
  className,
  children,
  ref,
  ...props
}: DescriptionListValueProps & { ref?: React.Ref<HTMLElement> }) {
  const labels = React.useContext(LabelsContext)
  const term = React.useContext(TermContext)
  const text = React.useRef<HTMLSpanElement>(null)
  const empty =
    children === undefined ||
    children === null ||
    children === false ||
    children === ''
  const content = empty ? labels.empty : children
  const full =
    title ??
    (truncate && (typeof content === 'string' || typeof content === 'number')
      ? String(content)
      : undefined)
  const copyable = copy !== undefined && copy !== false && !empty
  return (
    <dd
      {...props}
      ref={ref}
      title={copyable ? undefined : full}
      className={cx('surf-description-list-value', className)}
      data-truncate={truncate || undefined}
      data-empty={empty || undefined}
      data-copy={copyable || undefined}
    >
      {copyable ? (
        <>
          <span ref={text} className='surf-description-list-text' title={full}>
            {content}
          </span>
          <CopyButton
            labelHidden
            variant='ghost'
            size='small'
            value={
              typeof copy === 'string'
                ? copy
                : () => text.current?.textContent ?? ''
            }
            labels={labels}
            aria-describedby={term?.id}
          />
        </>
      ) : (
        content
      )}
    </dd>
  )
}

export const DescriptionList = { Root, Item, Term, Value }
// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Root: DescriptionListRoot,
  Item: DescriptionListItem,
  Term: DescriptionListTerm,
  Value: DescriptionListValue,
} = DescriptionList
