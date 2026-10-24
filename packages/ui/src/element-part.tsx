// A styled element part that renders on the server as well as the client. Its size
// reaches the parts inside it through data-ui-size, which the size rules read; only
// an explicit size opens a small client boundary, so portalled popups inside it keep
// the size too.
import * as React from 'react'
import { cx } from './class-names.js'
import { normalizeSize, type ComponentSize } from './size.js'
import { SizeScope } from './sizing.js'

export function elementPart<
  Element extends HTMLElement,
  Props extends { className?: string },
>(tag: string, base: string) {
  return function ElementPart({
    className,
    size,
    ref,
    ...rest
  }: Omit<Props, 'size'> & { size?: ComponentSize; ref?: React.Ref<Element> }) {
    const scheme = normalizeSize(size)
    const element = React.createElement(tag, {
      ...rest,
      ref,
      className: cx(base, className),
      'data-ui-size': scheme,
    })
    return scheme ? <SizeScope size={scheme}>{element}</SizeScope> : element
  }
}
