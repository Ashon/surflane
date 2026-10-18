import { BlueprintCanvas } from './BlueprintCanvas'
import React, { useCallback, useEffect, useState } from 'react'
type Measure = {
  key: string
  x: number
  y: number
  length: number
  axis: 'x' | 'y'
  value: string
}
/** Purely decorative, absolutely positioned dimensions measured from the real UI. */
export function SpacingMeasurements({
  hostRef,
  visible,
}: {
  hostRef: React.RefObject<HTMLDivElement | null>
  visible: boolean
}) {
  const [measures, setMeasures] = useState<Measure[]>([])
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const get = (selector: string) => host.querySelector<HTMLElement>(selector)
    const update = () => {
      const origin = host.getBoundingClientRect()
      const results: Measure[] = []
      const pairs = [
        ['title', '[data-spacing-title]', '[data-spacing-description]', 'y'],
        ['label', '[data-spacing-label]', '.pui-control', 'y'],
        ['actions', '.pui-control', '[data-spacing-actions]', 'y'],
        [
          'buttons',
          '[data-spacing-actions] > :first-child',
          '[data-spacing-actions] > :nth-child(2)',
          'x',
        ],
      ] as const
      for (const [key, from, to, axis] of pairs) {
        const first = get(from)?.getBoundingClientRect(),
          second = get(to)?.getBoundingClientRect()
        if (!first || !second) continue
        // A wrapped row has a vertical gap instead of a misleading horizontal measurement.
        const actualAxis =
          axis === 'x' && Math.abs(second.top - first.top) > 1 ? 'y' : axis
        const length = Math.max(
          0,
          actualAxis === 'x'
            ? second.left - first.right
            : second.top - first.bottom,
        )
        results.push({
          key,
          axis: actualAxis,
          length,
          value: `${Math.round(length)}px`,
          x: actualAxis === 'x' ? first.right - origin.left : origin.width - 8,
          y:
            actualAxis === 'x'
              ? first.top - origin.top + first.height / 2
              : first.bottom - origin.top,
        })
      }
      setMeasures((previous) =>
        JSON.stringify(previous) === JSON.stringify(results)
          ? previous
          : results,
      )
    }
    const resize = new ResizeObserver(update)
    resize.observe(host)
    host
      .querySelectorAll(
        '[data-spacing-title], [data-spacing-description], [data-spacing-label], .pui-control, [data-spacing-actions], button',
      )
      .forEach((element) => resize.observe(element))
    update()
    void document.fonts.ready.then(() => {
      if (host.isConnected) update()
    })
    return () => resize.disconnect()
  }, [hostRef])
  const draw = useCallback(
    (
      context: CanvasRenderingContext2D,
      _width: number,
      _height: number,
      dpr: number,
    ) => {
      const snap = (value: number) => (Math.floor(value * dpr) + 0.5) / dpr
      context.beginPath()
      for (const measure of measures) {
        const x = snap(measure.x),
          y = snap(measure.y)
        if (measure.axis === 'x') {
          const end = snap(measure.x + measure.length)
          context.moveTo(x, y)
          context.lineTo(end, y)
          for (const cap of [x, end]) {
            context.moveTo(cap, Math.floor((y - 4) * dpr) / dpr)
            context.lineTo(cap, Math.ceil((y + 4) * dpr) / dpr)
          }
        } else {
          const end = snap(measure.y + measure.length)
          context.moveTo(x, y)
          context.lineTo(x, end)
          for (const cap of [y, end]) {
            context.moveTo(Math.floor((x - 4) * dpr) / dpr, cap)
            context.lineTo(Math.ceil((x + 4) * dpr) / dpr, cap)
          }
        }
      }
      context.stroke()
    },
    [measures],
  )
  return visible ? (
    <div
      className='spacing-measurements'
      aria-hidden='true'
      data-testid='spacing-measurements'
    >
      <BlueprintCanvas
        hostRef={hostRef}
        draw={draw}
        className='spacing-blueprint'
      />
      {measures.map((measure) => (
        <span
          key={measure.key}
          className='spacing-dimension'
          data-axis={measure.axis}
          data-measure={measure.key}
          data-length={measure.length}
          style={{
            left: measure.x,
            top: measure.y,
            width: measure.axis === 'x' ? measure.length : 0,
            height: measure.axis === 'y' ? measure.length : 0,
          }}
        >
          <span className='spacing-dimension-label'>{measure.value}</span>
        </span>
      ))}
    </div>
  ) : null
}
