import { CodeBlock, type CodeBlockProps } from '@surflane/ui'
import { useMessages } from './i18n'

/** The package CodeBlock with the page's language on its copy button. */
export function CatalogCodeBlock({ labels, ...props }: CodeBlockProps) {
  const messages = useMessages()
  return <CodeBlock {...props} labels={{ ...messages.codeBlock, ...labels }} />
}
