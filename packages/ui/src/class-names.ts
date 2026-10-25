// Class and data attribute helpers, with no React: server components use them too.
import { normalizeSize, type ComponentSize } from './size.js'

/** Joins class names, skipping empty ones. */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
