// Class and data attribute helpers, with no React: server components use them too.
import { normalizeSize, type ComponentSizeAlias } from './size.js'

/** Joins class names, skipping empty ones. */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
/** The data-size value: a deprecated short spelling (sm, md, lg, icon-sm, icon-xs,
 * icon-lg) renders as its full name, so both spellings meet the same CSS; other values
 * such as xs or icon pass through. */
export function sizeName<Size extends string>(size?: Size) {
  return size === 'sm' || size === 'md' || size === 'lg'
    ? normalizeSize(size as ComponentSizeAlias)
    : size === 'icon-sm' || size === 'icon-xs'
      ? 'icon-small'
      : size === 'icon-lg'
        ? 'icon-large'
        : size
}
