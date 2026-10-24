// Size names, with no React: server and client components both read them.
export type ComponentSize = 'small' | 'default' | 'large'
/**
 * @deprecated The short spellings sm, md and lg render as small, default and large.
 * Write the full names; the aliases are removed in a later minor.
 */
export type ComponentSizeAlias = ComponentSize | 'sm' | 'md' | 'lg'
export function normalizeSize(
  size?: ComponentSizeAlias,
): ComponentSize | undefined {
  return size === 'sm'
    ? 'small'
    : size === 'md'
      ? 'default'
      : size === 'lg'
        ? 'large'
        : size
}
