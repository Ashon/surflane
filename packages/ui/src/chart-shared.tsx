'use client'
import * as React from 'react'
import type { DotProps } from 'recharts'

// What Chart and ScatterChart share: round axis steps, the palette, point markers
// and the wait for the tick font.
/** The round step at or above a raw step: 1, 2, 2.5 or 5 times a power of ten. */
export function roundStep(raw: number) {
  if (!(raw > 0)) return 0
  const power = 10 ** Math.floor(Math.log10(raw))
  return power * ([1, 2, 2.5, 5, 10].find((f) => f * power >= raw) ?? 10)
}
/** The smallest round step that spans low to high in at most five intervals, so the
 * top tick is the round value just above the highest one. */
export function axisStep(low: number, high: number) {
  let step = roundStep((high - low) / 5)
  while (step && Math.ceil(high / step) - Math.floor(low / step) > 5)
    step = roundStep(step * 1.01)
  return step
}
/** A series' color: the caller's, or the palette's for its place. */
export function seriesColor(
  index: number,
  palette: 'neutral' | 'categorical' | 'extended',
  color?: string,
) {
  if (color) return color
  if (palette === 'neutral')
    return `var(--surf-chart-series-${(index % 3) + 1})`
  // Twenty-four hold; the second dozen are the same twelve hues a step deeper, so a
  // thirteenth series is the first color's own family, deeper.
  const hues = palette === 'extended' ? 24 : 12
  return `var(--surf-chart-category-${(index % hues) + 1})`
}
/** Which dash, marker and fill pattern a place draws with.
 *
 * The palette repeats its twelve hues every twelve series, and twelve is a multiple
 * of both the six dashes and the three markers, so the thirteenth series would
 * otherwise repeat a color family, a dash and a shape together. Stepping one past
 * every dozen keeps two series a dozen apart different in at least one cue besides
 * their color, and leaves the first twelve exactly as they draw today. */
export function cueAt(index: number) {
  return index + Math.floor(index / 12)
}
export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)
/** True once the font of the tick labels has loaded. Recharts measures a label to keep
 * it inside the chart and caches that width; measured in the fallback font, the last
 * label overflows by a few pixels once the real font arrives. */
export function useFontReady(element: Element | null, text: string) {
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    if (!element) return
    if (!document.fonts) return setReady(true)
    let live = true
    const family = getComputedStyle(element).fontFamily
    // load() starts the download of the faces that draw this text and waits for them.
    void document.fonts
      .load(`12px ${family}`, text || ' ')
      .catch(() => [])
      .then(() => {
        if (live) setReady(true)
      })
    return () => {
      live = false
    }
  }, [element, text])
  return ready
}
export function Marker({
  cx,
  cy,
  color,
  index,
}: Pick<DotProps, 'cx' | 'cy'> & { color: string; index: number }) {
  if (
    typeof cx !== 'number' ||
    typeof cy !== 'number' ||
    !Number.isFinite(cx) ||
    !Number.isFinite(cy)
  )
    return null
  const props = { fill: 'var(--surf-canvas)', stroke: color, strokeWidth: 1.8 }
  return index % 3 === 0 ? (
    <circle cx={cx} cy={cy} r={3.5} {...props} />
  ) : index % 3 === 1 ? (
    <rect x={cx - 3.5} y={cy - 3.5} width={7} height={7} {...props} />
  ) : (
    <path d={`M${cx},${cy - 4.5}l4.5,8h-9Z`} {...props} />
  )
}
