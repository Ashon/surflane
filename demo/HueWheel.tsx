import React, { useEffect, useRef } from 'react'
import { inGamut, oklch, toGamut, wrapHue } from './oklch'
import { planeBuffer, prefetchPlanes, rimChroma } from './wheelRenderer'

export { rimChroma }
const size = 280

export type HueWheelLabels = {
  wheel: string
  base: string
  support: (index: number) => string
  value: (hue: number, chroma: string) => string
}

/**
 * The OKLCH hue–chroma plane at one lightness: the angle is the hue, from 0° at the
 * top and clockwise, and the distance from the center is the chroma. Colors sRGB
 * can't show at this lightness are drawn faded. Markers sit on it and move by
 * pointer or keyboard: the first is the base hue and chroma, the others turn around
 * it at their own angle and share its chroma.
 */
export function HueWheel({
  lightness,
  hue,
  chroma,
  offsets,
  labels,
  describedBy,
  onBase,
  onOffset,
}: {
  lightness: number
  hue: number
  chroma: number
  offsets: number[]
  labels: HueWheelLabels
  /** The id of the text that explains how to move the markers. */
  describedBy?: string
  onBase: (hue: number, chroma: number) => void
  onOffset: (index: number, offset: number) => void
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const plane = useRef<HTMLDivElement>(null)
  // The plane redraws at most once a frame, with the latest lightness; a back
  // buffer from the cache is blitted in one drawImage.
  const frame = useRef(0)
  useEffect(() => {
    cancelAnimationFrame(frame.current)
    let cancelPrefetch = () => {}
    frame.current = requestAnimationFrame(() => {
      const element = canvas.current
      const context = element?.getContext('2d')
      if (!element || !context) return
      const pixels = Math.round(
        size * Math.min(2, window.devicePixelRatio || 1),
      )
      if (element.width !== pixels) element.width = element.height = pixels
      const lightnessKey = Number(lightness.toFixed(3))
      context.clearRect(0, 0, pixels, pixels)
      context.drawImage(planeBuffer(lightnessKey, pixels), 0, 0)
      cancelPrefetch = prefetchPlanes(lightnessKey, pixels)
    })
    return () => {
      cancelAnimationFrame(frame.current)
      cancelPrefetch()
    }
  }, [lightness])

  const hues = offsets.map((offset) => wrapHue(hue + offset))
  const radius = (Math.min(chroma, rimChroma) / rimChroma) * (size / 2)
  const point = (h: number, r = radius) => {
    const radians = (h * Math.PI) / 180
    return [size / 2 + Math.sin(radians) * r, size / 2 - Math.cos(radians) * r]
  }
  // A drag measures the plane once, at its start, and applies the latest pointer
  // position once a frame.
  const rect = useRef<DOMRect | null>(null)
  const pending = useRef<{ x: number; y: number; index: number } | null>(null)
  const pointerFrame = useRef(0)
  useEffect(() => () => cancelAnimationFrame(pointerFrame.current), [])
  const at = (point: { clientX: number; clientY: number }) => {
    const box = rect.current ?? plane.current!.getBoundingClientRect()
    const dx = point.clientX - (box.left + box.width / 2),
      dy = point.clientY - (box.top + box.height / 2)
    return {
      hue: Math.round(wrapHue((Math.atan2(dx, -dy) * 180) / Math.PI)),
      chroma:
        Math.round(
          Math.min(1, Math.hypot(dx, dy) / (box.width / 2)) * rimChroma * 200,
        ) / 200,
    }
  }
  const apply = () => {
    pointerFrame.current = 0
    const latest = pending.current
    if (!latest) return
    pending.current = null
    const next = at({ clientX: latest.x, clientY: latest.y })
    if (latest.index === 0) onBase(next.hue, next.chroma)
    else onOffset(latest.index, Math.round(wrapHue(next.hue - hue)))
  }
  const drag = (index: number) => ({
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      rect.current = plane.current!.getBoundingClientRect()
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.focus()
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
      pending.current = { x: event.clientX, y: event.clientY, index }
      if (!pointerFrame.current)
        pointerFrame.current = requestAnimationFrame(apply)
    },
    onPointerUp: () => {
      cancelAnimationFrame(pointerFrame.current)
      apply()
      rect.current = null
    },
    onLostPointerCapture: () => {
      rect.current = null
    },
  })
  const keys = (index: number) => (event: React.KeyboardEvent) => {
    const turn =
      { ArrowRight: 1, ArrowLeft: -1, PageUp: 15, PageDown: -15 }[
        event.key as string
      ] ?? 0
    const lift = { ArrowUp: 0.005, ArrowDown: -0.005 }[event.key as string] ?? 0
    if (!turn && !lift) return
    event.preventDefault()
    const step = event.shiftKey ? turn * 15 : turn
    if (index === 0)
      onBase(
        wrapHue(hue + step),
        Math.min(rimChroma, Math.max(0, Number((chroma + lift).toFixed(3)))),
      )
    else if (turn) onOffset(index, wrapHue(offsets[index] + step))
  }

  // Angles between neighbors, in hue order, drawn as arcs inside the markers.
  const order = hues.map((h, index) => ({ h, index })).sort((a, b) => a.h - b.h)
  const gaps =
    order.length > 1
      ? order.map(({ h }, i) => {
          const next = order[(i + 1) % order.length].h
          return { from: h, span: wrapHue(next - h) || 360 }
        })
      : []
  const arc = (from: number, span: number, r: number) => {
    const [x1, y1] = point(from, r)
    const [x2, y2] = point(from + span, r)
    return `M ${x1} ${y1} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 1 ${x2} ${y2}`
  }
  // Arcs ride just outside the markers; reflex angles are left to the text below.
  const arcRadius = radius + 26
  return (
    <div
      ref={plane}
      className='hue-wheel'
      role='group'
      aria-label={labels.wheel}
      aria-describedby={describedBy}
      style={{ inlineSize: size, blockSize: size }}
      onPointerDown={(event) => {
        // A press on the plane moves the base there and keeps dragging it.
        rect.current = plane.current!.getBoundingClientRect()
        const next = at(event)
        onBase(next.hue, next.chroma)
        const base = plane.current?.querySelector<HTMLElement>(
          '[data-wheel-marker="0"]',
        )
        base?.setPointerCapture(event.pointerId)
        base?.focus()
      }}
    >
      <canvas ref={canvas} aria-hidden='true' />
      <svg
        className='hue-wheel-guides'
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden='true'
      >
        {hues.map((h, index) => {
          const [x, y] = point(h)
          return (
            <line
              key={index}
              x1={size / 2}
              y1={size / 2}
              x2={x}
              y2={y}
              data-base={index === 0 || undefined}
            />
          )
        })}
        {gaps
          .filter(({ span }) => span <= 180)
          .map(({ from, span }) => {
            const [x, y] = point(from + span / 2, arcRadius + 14)
            return (
              <g key={from}>
                <path d={arc(from, span, arcRadius)} />
                <text x={x} y={y}>
                  {Math.round(span)}°
                </text>
              </g>
            )
          })}
      </svg>
      {hues.map((h, index) => {
        const [x, y] = point(h)
        const color = toGamut(oklch(lightness, chroma, h))
        const label = index === 0 ? labels.base : labels.support(index + 1)
        return (
          <div
            key={index}
            className='hue-wheel-marker'
            data-wheel-marker={index}
            data-base={index === 0 || undefined}
            data-clamped={!inGamut(oklch(lightness, chroma, h)) || undefined}
            role='slider'
            tabIndex={0}
            aria-label={label}
            aria-describedby={describedBy}
            aria-valuemin={0}
            aria-valuemax={359}
            aria-valuenow={Math.round(h)}
            aria-valuetext={labels.value(Math.round(h), chroma.toFixed(3))}
            style={{
              // Physical: hue angles never mirror, in any writing direction.
              left: x,
              top: y,
              background: `oklch(${color.l} ${color.c} ${color.h})`,
            }}
            onKeyDown={keys(index)}
            {...drag(index)}
          />
        )
      })}
    </div>
  )
}
