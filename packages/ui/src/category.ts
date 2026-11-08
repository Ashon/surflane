// Kept out of the client modules, so a Server Component can call it too.

/** One of the twelve categorical colors, as the chart palette numbers them. */
export type AvatarCategory = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
/** The same category for the same name every time, such as a project's or a
 * person's, so an avatar keeps its color across screens and reloads. */
export function categoryFor(name: string): AvatarCategory {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.codePointAt(0)!) >>> 0
  return ((hash % 12) + 1) as AvatarCategory
}
