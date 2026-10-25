// Resolves a token's color the way the browser does, from the generated token catalog:
// var() aliases, color-mix(in srgb | oklch, …) and oklch(from … l c h) with an optional
// min(l, n) or min(c, n). The color foundation measures the same pairs in a browser; this runs without one.
import { readFileSync } from 'node:fs'
import { converter, parse, wcagContrast } from 'culori'

const catalog = JSON.parse(
  readFileSync(
    new URL('../../packages/tokens/catalog.json', import.meta.url),
    'utf8',
  ),
)
const byName = new Map(catalog.tokens.map((token) => [token.name, token]))
const toRgb = converter('rgb')
const toOklch = converter('oklch')

/** The value a token holds in a theme, before any alias is followed. */
export function rawValue(name, theme) {
  const token = byName.get(name)
  if (!token) throw new Error(`Unknown token ${name}`)
  const light = token.variants.find(
    (variant) => variant.context === ':root[data-theme="light"]',
  )
  const dark = token.variants.find((variant) => variant.context === ':root')
  const variant = theme === 'light' ? (light ?? dark) : dark
  if (!variant) throw new Error(`${name} has no ${theme} value`)
  return variant.value
}

// The expression that starts at `start`, up to its matching parenthesis.
function balanced(text, start) {
  let depth = 0
  for (let i = start; i < text.length; i++) {
    if (text[i] === '(') depth++
    else if (text[i] === ')' && --depth === 0) return text.slice(start, i + 1)
  }
  throw new Error(`Unbalanced: ${text}`)
}
function topLevelArgs(inner) {
  const parts = []
  let depth = 0,
    from = 0
  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === '(') depth++
    else if (inner[i] === ')') depth--
    else if (inner[i] === ',' && depth === 0) {
      parts.push(inner.slice(from, i).trim())
      from = i + 1
    }
  }
  parts.push(inner.slice(from).trim())
  return parts
}

/** A token or CSS color expression as an OKLCH color in the given theme. */
export function resolve(expression, theme) {
  const value = expression.trim()
  if (value.startsWith('--')) return resolve(rawValue(value, theme), theme)
  const alias = /^var\((--[\w-]+)\)$/.exec(value)
  if (alias) return resolve(rawValue(alias[1], theme), theme)
  if (value.startsWith('oklch(from ')) {
    const inner = value.slice('oklch(from '.length, -1)
    const open = inner.indexOf('(')
    const source = inner.slice(0, open) + balanced(inner, open)
    const [l, c, h] = inner
      .slice(source.length)
      .trim()
      .split(/\s+(?![^(]*\))/)
    const color = { ...resolve(source, theme) }
    const channel = (expression, current) => {
      if (/^[lch]$/.test(expression)) return current
      const clamp = /^min\([lch],\s*([\d.]+)\)$/.exec(expression)
      if (clamp) return Math.min(current, Number(clamp[1]))
      if (/^[\d.]+$/.test(expression)) return Number(expression)
      throw new Error(`Unsupported relative color: ${value}`)
    }
    color.l = channel(l, color.l)
    color.c = channel(c, color.c ?? 0)
    color.h = channel(h, color.h ?? 0)
    return color
  }
  if (value.startsWith('color-mix(')) {
    const [space, first, second] = topLevelArgs(value.slice(10, -1))
    if (space !== 'in srgb' && space !== 'in oklch')
      throw new Error(`Unsupported mix: ${value}`)
    const weighted = (part) => {
      const match = /^(.*?)\s+([\d.]+)%$/.exec(part)
      return match ? [match[1], Number(match[2]) / 100] : [part, null]
    }
    const [a, pa] = weighted(first),
      [b, pb] = weighted(second)
    const wa = pa ?? 1 - (pb ?? 0.5),
      wb = 1 - wa
    if (space === 'in oklch') {
      // Hue takes the shorter arc; a gray takes the other color's hue, as CSS does.
      const ca = toOklch(resolve(a, theme)),
        cb = toOklch(resolve(b, theme))
      const ha = ca.c > 0.0001 ? ca.h : cb.h,
        hb = cb.c > 0.0001 ? cb.h : ca.h
      const turn = ((((hb - ha) % 360) + 540) % 360) - 180
      return {
        mode: 'oklch',
        l: ca.l * wa + cb.l * wb,
        c: ca.c * wa + cb.c * wb,
        h: (ha + turn * wb + 360) % 360,
      }
    }
    const ca = toRgb(resolve(a, theme)),
      cb = toRgb(resolve(b, theme))
    return toOklch({
      mode: 'rgb',
      r: ca.r * wa + cb.r * wb,
      g: ca.g * wa + cb.g * wb,
      b: ca.b * wa + cb.b * wb,
    })
  }
  const color = parse(value)
  if (!color) throw new Error(`Not a color: ${value}`)
  return toOklch(color)
}

/** WCAG contrast between two tokens (or expressions) in a theme. */
export const contrast = (foreground, background, theme) =>
  wcagContrast(resolve(foreground, theme), resolve(background, theme))
