'use client'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './content.js'
import { Table } from './data.js'
import type { Components } from 'react-markdown'
import type { Root, Element, RootContent } from 'hast'
export type MarkdownProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> & {
  source: string
  label?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  codeWrap?: boolean
}
function text(node: RootContent | Root): string {
  return 'value' in node
    ? node.value
    : 'children' in node
      ? node.children.map((child) => text(child)).join('')
      : ''
}
function visit(node: Root | RootContent, callback: (element: Element) => void) {
  if (node.type === 'element') callback(node)
  if ('children' in node)
    node.children.forEach((child) => visit(child, callback))
}
/** CommonMark + GFM. HTML stays disabled, URLs use react-markdown's safe default.
 * Fetching, permissions, frontmatter, MDX and script execution are caller concerns. */
export const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(
  function Markdown(
    {
      source,
      label = 'Markdown content',
      headingLevel = 2,
      codeWrap = false,
      className,
      ...props
    },
    ref,
  ) {
    const prefix = `md-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
    const headings = React.useMemo(
      () => () => (tree: Root) => {
        const counts = new Map<string, number>()
        const anchors = new Map<string, string>()
        const previousIds = new Map<string, string>()
        visit(tree, (node) => {
          if (!/^h[1-6]$/.test(node.tagName)) return
          const slug =
            text(node)
              .normalize('NFKC')
              .toLowerCase()
              .replace(/[^\p{L}\p{N}\s_-]/gu, '')
              .trim()
              .replace(/\s+/g, '-') || 'section'
          const count = counts.get(slug) ?? 0
          counts.set(slug, count + 1)
          const key = count ? `${slug}-${count}` : slug
          const id = `${prefix}-${key}`
          if (typeof node.properties.id === 'string')
            previousIds.set(node.properties.id, id)
          node.properties.id = id
          anchors.set(key, id)
        })
        visit(tree, (node) => {
          if (
            node.tagName === 'li' &&
            String(node.properties.className ?? '').includes('task-list-item')
          ) {
            const taskLabel = text(node).trim() || 'Task list item'
            visit(node, (child) => {
              if (
                child.tagName === 'input' &&
                child.properties.type === 'checkbox'
              )
                child.properties.ariaLabel = taskLabel
            })
          }
          for (const property of ['ariaDescribedBy', 'ariaLabelledBy']) {
            const references = node.properties[property]
            if (Array.isArray(references))
              node.properties[property] = references.map(
                (value) => previousIds.get(String(value)) ?? value,
              )
            else if (typeof references === 'string')
              node.properties[property] = references
                .split(/\s+/)
                .map((value) => previousIds.get(value) ?? value)
                .join(' ')
          }
          if (
            node.tagName !== 'a' ||
            typeof node.properties.href !== 'string' ||
            !node.properties.href.startsWith('#')
          )
            return
          try {
            const target = anchors.get(
              decodeURIComponent(node.properties.href.slice(1)),
            )
            if (target) node.properties.href = `#${target}`
          } catch {
            /* A malformed fragment remains inert navigation text. */
          }
        })
      },
      [prefix],
    )
    const components = React.useMemo<Components>(() => {
      const heading =
        (level: number): Components['h1'] =>
        ({ node: _node, ...headingProps }) =>
          React.createElement(
            `h${Math.min(6, Math.max(1, headingLevel) + level - 1)}`,
            headingProps,
          )
      return {
        h1: heading(1),
        h2: heading(2),
        h3: heading(3),
        h4: heading(4),
        h5: heading(5),
        h6: heading(6),
        pre({ node, children }) {
          const child = React.Children.toArray(children)[0]
          if (
            !React.isValidElement<{
              children?: React.ReactNode
              className?: string
            }>(child)
          )
            return <pre>{children}</pre>
          const language =
            /(?:^|\s)language-([^\s]+)/.exec(
              child.props.className ?? '',
            )?.[1] ?? 'text'
          const code = String(child.props.children ?? '').replace(/\n$/, '')
          return (
            <CodeBlock
              code={code}
              language={language}
              wrap={codeWrap}
              label={`${label}: code at line ${node?.position?.start.line ?? 1}`}
            />
          )
        },
        code({ node: _node, ...codeProps }) {
          return <code {...codeProps} className='pui-markdown-inline-code' />
        },
        table({ node, children, ...tableProps }) {
          return (
            <Table.Container
              label={`${label}: table at line ${node?.position?.start.line ?? 1}`}
              orientation='horizontal'
            >
              <table {...tableProps} className='pui-table'>
                {children}
              </table>
            </Table.Container>
          )
        },
        th({ node: _node, ...cellProps }) {
          return (
            <th
              {...cellProps}
              scope='col'
              className='pui-table-cell pui-table-header'
            />
          )
        },
        td({ node: _node, ...cellProps }) {
          return <td {...cellProps} className='pui-table-cell' />
        },
        a({ node: _node, href, children, ...linkProps }) {
          return href ? (
            <a {...linkProps} href={href}>
              {children}
            </a>
          ) : (
            <span>{children}</span>
          )
        },
        img({ node: _node, src, alt, ...imageProps }) {
          return src ? (
            <img {...imageProps} src={src} alt={alt ?? ''} loading='lazy' />
          ) : (
            <span>{alt}</span>
          )
        },
      }
    }, [headingLevel, label, codeWrap])
    return (
      <div
        {...props}
        ref={ref}
        role='article'
        className={['pui-prose pui-markdown', className]
          .filter(Boolean)
          .join(' ')}
        aria-label={label}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[headings]}
          remarkRehypeOptions={{ clobberPrefix: `${prefix}-` }}
          skipHtml
          components={components}
        >
          {source}
        </ReactMarkdown>
      </div>
    )
  },
)
