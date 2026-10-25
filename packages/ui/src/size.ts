// Size names, with no React: server and client components both read them.
export type ComponentSize = 'small' | 'default' | 'large'
/** How tightly a screen packs its blocks: compact tightens gaps, insets and touch growth. */
export type ComponentDensity = 'default' | 'compact'
/** @deprecated The short spellings sm, md and lg were removed in 0.13, so this is
 * ComponentSize under its former name. Write ComponentSize; this name is removed in a
 * later minor. */
export type ComponentSizeAlias = ComponentSize
/** A component's size: the one place components read it, kept for server components. */
export function normalizeSize(size?: ComponentSize): ComponentSize | undefined {
  return size
}
