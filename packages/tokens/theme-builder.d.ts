export type NeutralInput = {
  /** One hue for every gray step. Omit it to keep each default step's own hue. */
  hue?: number
  /** Multiplies every gray step's chroma: 0 is pure gray, 1 the default tint. */
  chroma?: number
}
export type AccentInput = {
  hue: number
  /** Clamped to the sRGB gamut at the accent's fixed lightness. */
  chroma: number
}
export type ThemeInput = {
  neutral?: NeutralInput
  accent?: AccentInput
  /** Multiplies the radius tokens: 0 is square, 1 the default. */
  radius?: number
}
export type Theme = {
  dark: Record<string, string>
  light: Record<string, string>
  shared: Record<string, string>
}
export declare const neutralPresets: Readonly<
  Record<'slate' | 'neutral' | 'zinc' | 'stone', NeutralInput>
>
export declare const accentPresets: Readonly<
  Record<'cyan' | 'blue' | 'violet' | 'green' | 'amber' | 'rose', AccentInput>
>
export declare const radiusPresets: Readonly<
  Record<'none' | 'small' | 'default' | 'large', number>
>
/** Token values for a theme. A dimension left out keeps its defaults. */
export declare function createTheme(input?: ThemeInput): Theme
/** CSS that mirrors the contexts in tokens.css. Load it after the Surflane tokens. */
export declare function themeCss(theme: Theme, comment?: string): string
/** WCAG 2 contrast ratio between two opaque oklch() colors. */
export declare function contrastRatio(
  foreground: string,
  background: string,
): number
/** The largest chroma sRGB can show at this lightness and hue. */
export declare function maxChroma(lightness: number, hue: number): number
