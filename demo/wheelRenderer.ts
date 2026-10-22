// Draws the OKLCH hue–chroma plane for HueWheel. Per-pixel geometry is computed once
// per canvas size; a lightness only changes the cube-and-matrix step and 720-entry
// tables of the gamut edge, interpolated between buckets. Planes are drawn into back buffers, cached by
// lightness, and blitted to the visible canvas in one drawImage.
import { maxChroma, oklch, toLinear } from './oklch'

/** Chroma at the rim of the wheel; sRGB never reaches past it. */
export const rimChroma = 0.32
const buckets = 720
/** Alpha of the faded area outside sRGB, out of 255. */
const fadedAlpha = 56
const cacheSize = 12

type Geometry = {
  /** Indices of pixels inside the disc, so the loop skips the corners. */
  inside: Uint32Array
  /** The a/b part of each pixel's LMS terms; adding the lightness completes them. */
  long: Float32Array
  medium: Float32Array
  short: Float32Array
  /** Distance from the center, in canvas pixels. */
  radius: Float32Array
  /** Hue as a fractional bucket, 0 to buckets, for interpolating edge tables. */
  position: Float32Array
  /** Coverage of the disc's edge, 0 to 1, for an antialiased rim. */
  coverage: Float32Array
}
const geometries = new Map<number, Geometry>()
function geometry(size: number): Geometry {
  const cached = geometries.get(size)
  if (cached) return cached
  const center = size / 2
  const inside: number[] = []
  const long = new Float32Array(size * size)
  const medium = new Float32Array(size * size)
  const short = new Float32Array(size * size)
  const radius = new Float32Array(size * size)
  const position = new Float32Array(size * size)
  const coverage = new Float32Array(size * size)
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - center,
        dy = y + 0.5 - center
      const distance = Math.hypot(dx, dy)
      const edge = center - distance + 0.5
      if (edge <= 0) continue
      const index = y * size + x
      inside.push(index)
      const hue = Math.atan2(dx, -dy)
      const c = Math.min(1, distance / center) * rimChroma
      const a = c * Math.cos(hue),
        b = c * Math.sin(hue)
      long[index] = 0.3963377774 * a + 0.2158037573 * b
      medium[index] = -0.1055613458 * a - 0.0638541728 * b
      short[index] = -0.0894841775 * a - 1.291485548 * b
      radius[index] = distance
      position[index] = ((((hue * 180) / Math.PI + 360) % 360) / 360) * buckets
      coverage[index] = Math.min(1, edge)
    }
  const result = {
    inside: Uint32Array.from(inside),
    long,
    medium,
    short,
    radius,
    position,
    coverage,
  }
  geometries.set(size, result)
  return result
}

// Linear light to 8-bit sRGB through a table, in place of a pow per channel.
const lutSize = 4096
const lut = new Uint8Array(lutSize + 1)
for (let i = 0; i <= lutSize; i++) {
  const v = i / lutSize
  lut[i] = Math.round(
    255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055),
  )
}
const encode = (v: number) =>
  v <= 0 ? 0 : v >= 1 ? 255 : lut[(v * lutSize + 0.5) | 0]
const littleEndian = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1
const pack = (r: number, g: number, b: number, a: number) =>
  littleEndian
    ? ((a << 24) | (b << 16) | (g << 8) | r) >>> 0
    : ((r << 24) | (g << 16) | (b << 8) | a) >>> 0

/**
 * The plane at one lightness as pixels. At this lightness the sRGB region is convex
 * around the gray axis, so its edge is a radius per hue, r(φ). Each pixel's signed
 * distance to that edge, (r(φ) − ρ) / √(1 + (r′/r)²), sets a one-pixel alpha ramp
 * between the opaque region and the faded rest, whichever way the edge runs.
 */
export function renderPlane(lightness: number, size: number): ImageData {
  const { inside, long, medium, short, radius, position, coverage } =
    geometry(size)
  const center = size / 2
  // Per bucket: the edge radius, its slope factor and its most chromatic color.
  const edgeRadius = new Float32Array(buckets)
  const edgeRed = new Float32Array(buckets)
  const edgeGreen = new Float32Array(buckets)
  const edgeBlue = new Float32Array(buckets)
  for (let k = 0; k < buckets; k++) {
    const hue = (k * 360) / buckets
    const chroma = maxChroma(lightness, hue)
    edgeRadius[k] = (chroma / rimChroma) * center
    const [r, g, b] = toLinear(oklch(lightness, chroma, hue))
    edgeRed[k] = r
    edgeGreen[k] = g
    edgeBlue[k] = b
  }
  const slope = new Float32Array(buckets)
  const step = (2 * Math.PI) / buckets
  for (let k = 0; k < buckets; k++) {
    const change =
      (edgeRadius[(k + 1) % buckets] -
        edgeRadius[(k - 1 + buckets) % buckets]) /
      (2 * step)
    const ratio = change / Math.max(edgeRadius[k], 1e-3)
    slope[k] = 1 / Math.sqrt(1 + ratio * ratio)
  }
  const image = new ImageData(size, size)
  const pixels = new Uint32Array(image.data.buffer)
  const lerp = (table: Float32Array, k: number, next: number, t: number) =>
    table[k] + (table[next] - table[k]) * t
  for (let i = 0; i < inside.length; i++) {
    const index = inside[i]
    const at = position[index]
    const k = at | 0
    const next = k + 1 === buckets ? 0 : k + 1
    const t = at - k
    const distance =
      (lerp(edgeRadius, k, next, t) - radius[index]) * lerp(slope, k, next, t)
    const within = distance >= 0.5 ? 1 : distance <= -0.5 ? 0 : distance + 0.5
    let r: number, g: number, b: number
    if (distance >= 0) {
      const l = (lightness + long[index]) ** 3
      const m = (lightness + medium[index]) ** 3
      const s = (lightness + short[index]) ** 3
      r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
      g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
      b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
    } else {
      // Outside sRGB a pixel takes its hue's most chromatic in-gamut color, faded.
      r = lerp(edgeRed, k, next, t)
      g = lerp(edgeGreen, k, next, t)
      b = lerp(edgeBlue, k, next, t)
    }
    const alpha = (fadedAlpha + (255 - fadedAlpha) * within) * coverage[index]
    pixels[index] = pack(encode(r), encode(g), encode(b), Math.round(alpha))
  }
  return image
}

type Buffer = OffscreenCanvas | HTMLCanvasElement
const createBuffer = (size: number): Buffer => {
  if (typeof OffscreenCanvas !== 'undefined')
    return new OffscreenCanvas(size, size)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  return canvas
}
/** Back buffers by size and lightness, least recently used first. */
const buffers = new Map<string, Buffer>()
const key = (lightness: number, size: number) =>
  `${size}:${lightness.toFixed(3)}`
/** The plane at this lightness in a back buffer, drawn now unless cached. */
export function planeBuffer(lightness: number, size: number): Buffer {
  const id = key(lightness, size)
  const cached = buffers.get(id)
  if (cached) {
    buffers.delete(id)
    buffers.set(id, cached)
    return cached
  }
  const buffer = createBuffer(size)
  const context = buffer.getContext('2d') as
    OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
  context.putImageData(renderPlane(lightness, size), 0, 0)
  buffers.set(id, buffer)
  if (buffers.size > cacheSize)
    buffers.delete(buffers.keys().next().value as string)
  return buffer
}
const hasPlane = (lightness: number, size: number) =>
  buffers.has(key(lightness, size))

const idle = (work: () => void) =>
  typeof requestIdleCallback === 'function'
    ? requestIdleCallback(work, { timeout: 500 })
    : setTimeout(work, 50)
const cancelIdle = (handle: number) =>
  typeof cancelIdleCallback === 'function'
    ? cancelIdleCallback(handle)
    : clearTimeout(handle)
/**
 * Draws the planes next to this lightness while the browser is idle, one per idle
 * period, so a slider's next steps blit from the cache. Returns a cancel function.
 */
export function prefetchPlanes(
  lightness: number,
  size: number,
  step = 0.01,
): () => void {
  const queue = [1, -1, 2, -2]
    .map((n) => Number((lightness + n * step).toFixed(3)))
    .filter((l) => l > 0 && l < 1 && !hasPlane(l, size))
  let handle = 0
  const next = () => {
    const l = queue.shift()
    if (l === undefined) return
    planeBuffer(l, size)
    handle = idle(next) as number
  }
  handle = idle(next) as number
  return () => cancelIdle(handle)
}
