import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { prepareBlueprintCanvas } from './BlueprintCanvas'

const targets = [
  'button',
  'input:not([type=hidden])',
  'textarea',
  'select',
  'a[href]',
  'h1',
  'h2',
  'h3',
  'h4',
  'p',
  'label',
  'pre',
  'table',
  'caption',
  'tr',
  'th',
  'td',
  'dl',
  'dl > div',
  'dt',
  'dd',
  'ul',
  'ol',
  'li',
  'fieldset',
  'legend',
  'output',
  'figure',
  'figcaption',
  'summary',
  '[data-blueprint-guide]',
  'section',
  'article',
  '[role="table"]',
  '[role="grid"]',
  '[role="row"]',
  '[role="columnheader"]',
  '[role="rowheader"]',
  '[role="gridcell"]',
  '[role="cell"]',
  '[role="dialog"]',
  '[role="listbox"]',
  '[role="combobox"]',
  '[role="option"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="button"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="switch"]',
  '.pui-card',
  '.catalog-page-header',
  '.sheet',
  '.grid',
  '.actions',
].join(',')
type Bounds = { left: number; top: number; right: number; bottom: number }
type Guide = { bounds: Bounds; clip: Bounds }
const intersect = (a: Bounds, b: Bounds): Bounds => ({
  left: Math.max(a.left, b.left),
  top: Math.max(a.top, b.top),
  right: Math.min(a.right, b.right),
  bottom: Math.min(a.bottom, b.bottom),
})
const concealed = '[hidden], [aria-hidden="true"], [inert]'
// A decorative preview (aria-hidden + inert, marked data-blueprint-decorative) still shows its
// construction lines; any other hidden or inert ancestor, such as content behind a modal, hides them.
const hiddenFromGuides = (element: Element) => {
  let ancestor = element.closest(concealed)
  while (ancestor?.matches('[data-blueprint-decorative]'))
    ancestor = ancestor.parentElement?.closest(concealed) ?? null
  return ancestor !== null
}
const radius = 220
const extension = 96
const crosshair = 12

/** A decorative viewport paint layer. No DOM reparenting, listeners on controls, or hit targets. */
export function PointerBlueprint() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const forced = matchMedia('(forced-colors: active)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0,
      dirty = true,
      stopped = false
    let pointer: { x: number; y: number } | null = null
    let guides: Guide[] = []
    let opacity = 0,
      desired = 0,
      lastTime = 0
    let scope: ParentNode = document
    let resolution: MediaQueryList
    const observed = new Set<Element>()

    const measure = () => {
      const viewport: Bounds = {
        left: 0,
        top: 0,
        right: innerWidth,
        bottom: innerHeight,
      }
      const clips = new WeakMap<Element, Bounds>()
      const clipFor = (element: Element | null): Bounds => {
        if (!element || element === document.documentElement) return viewport
        const cached = clips.get(element)
        if (cached) return cached
        const parent = clipFor(element.parentElement)
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        const clip = { ...parent }
        if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) {
          clip.left = Math.max(clip.left, rect.left)
          clip.right = Math.min(clip.right, rect.right)
        }
        if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) {
          clip.top = Math.max(clip.top, rect.top)
          clip.bottom = Math.min(clip.bottom, rect.bottom)
        }
        clips.set(element, clip)
        return clip
      }
      guides = []
      const current = new Set<Element>()
      const elements = [...scope.querySelectorAll<HTMLElement>(targets)]
      if (scope instanceof HTMLElement && scope.matches(targets))
        elements.unshift(scope)
      for (const element of elements) {
        if (hiddenFromGuides(element)) continue
        current.add(element)
        if (!observed.has(element)) resize.observe(element)
        const bounds = element.getBoundingClientRect()
        if (bounds.width < 2 || bounds.height < 2) continue
        const clip = clipFor(element.parentElement)
        const visible = intersect(bounds, clip)
        if (visible.right <= visible.left || visible.bottom <= visible.top)
          continue
        guides.push({ bounds, clip })
      }
      for (const element of observed)
        if (!current.has(element)) resize.unobserve(element)
      observed.clear()
      current.forEach((element) => observed.add(element))
      dirty = false
    }
    const paint = (now: number) => {
      frame = 0
      if (stopped) return
      const elapsed = lastTime ? Math.min(64, now - lastTime) : 16
      lastTime = now
      opacity = reduced.matches
        ? desired
        : opacity +
          Math.sign(desired - opacity) *
            Math.min(Math.abs(desired - opacity), elapsed / 180)
      const prepared = prepareBlueprintCanvas(canvas, innerWidth, innerHeight)
      if (!prepared) return
      if (!pointer || forced.matches || opacity <= 0) return
      if (dirty) measure()
      const { context, dpr } = prepared
      const snap = (n: number) => (Math.floor(n * dpr) + 0.5) / dpr
      const ink = getComputedStyle(canvas).color
      const stroke = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        clip: Bounds,
      ) => {
        const length = Math.hypot(x2 - x1, y2 - y1)
        if (length < 1 / dpr) return
        // The opaque plateau includes the DOM edge plus its 12px crosshair.
        // Only the following 96px tail fades; no blur kernel softens the corner.
        const end = Math.min(0.5, extension / length)
        const gradient = context.createLinearGradient(x1, y1, x2, y2)
        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(end, ink)
        gradient.addColorStop(1 - end, ink)
        gradient.addColorStop(1, 'transparent')
        context.strokeStyle = gradient
        context.beginPath()
        // Keep the fade anchored to the complete line, even where the viewport
        // or a scroller clips its tail. Clipping must not restart the fade.
        const clipX = (value: number) =>
          snap(Math.max(clip.left, Math.min(clip.right, value)))
        const clipY = (value: number) =>
          snap(Math.max(clip.top, Math.min(clip.bottom, value)))
        context.moveTo(clipX(x1), clipY(y1))
        context.lineTo(clipX(x2), clipY(y2))
        context.stroke()
      }
      for (const { bounds, clip } of guides) {
        const visible = intersect(bounds, clip)
        const distance = Math.hypot(
          Math.max(visible.left - pointer.x, 0, pointer.x - visible.right),
          Math.max(visible.top - pointer.y, 0, pointer.y - visible.bottom),
        )
        if (distance > radius) continue
        const { left, top, right, bottom } = bounds
        for (const y of [top, bottom]) {
          if (y < clip.top || y > clip.bottom) continue
          stroke(
            snap(left - crosshair - extension),
            snap(y),
            snap(right + crosshair + extension),
            snap(y),
            clip,
          )
        }
        for (const x of [left, right]) {
          if (x < clip.left || x > clip.right) continue
          stroke(
            snap(x),
            snap(top - crosshair - extension),
            snap(x),
            snap(bottom + crosshair + extension),
            clip,
          )
        }
      }
      context.globalCompositeOperation = 'destination-in'
      const fade = context.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        radius,
      )
      fade.addColorStop(0, `rgba(0,0,0,${0.3 * opacity})`)
      fade.addColorStop(0.35, `rgba(0,0,0,${0.16 * opacity})`)
      fade.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = fade
      context.fillRect(0, 0, innerWidth, innerHeight)
      context.globalCompositeOperation = 'source-over'
      if (opacity !== desired) schedule()
    }
    const schedule = () => {
      if (!frame && !stopped) frame = requestAnimationFrame(paint)
    }
    const invalidate = () => {
      dirty = true
      if (pointer && desired) schedule()
    }
    const scroll = () => {
      dirty = true
      if (!pointer || (!desired && opacity <= 0) || stopped) return
      // Scroll steps already run in the browser's rendering update. Waiting for
      // another RAF here can leave the fixed overlay one frame behind the DOM.
      // Flush geometry and paint in this event; cancel any pending pointer frame
      // so it cannot replay stale work or advance the fade twice this frame.
      cancelAnimationFrame(frame)
      frame = 0
      paint(performance.now())
    }
    const hide = () => {
      desired = 0
      if (reduced.matches) opacity = 0
      schedule()
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || forced.matches) {
        hide()
        return
      }
      pointer = { x: event.clientX, y: event.clientY }
      const target = event.target instanceof Element ? event.target : null
      // A listbox inside Command must retain its surrounding dialog/input in
      // scope. Standalone portalled lists/menus still get their own local scope.
      const nextScope =
        target?.closest('[role="dialog"]') ??
        target?.closest(
          '[role="menu"], [role="listbox"], .pui-popover, .pui-toast',
        ) ??
        document
      if (scope !== nextScope) {
        scope = nextScope
        dirty = true
      }
      desired = 1
      schedule()
    }
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide()
    }
    const visibility = () => {
      if (document.hidden) hide()
    }
    const preference = () => {
      if (forced.matches) hide()
      else invalidate()
    }
    const watchResolution = () => {
      resolution?.removeEventListener('change', resolutionChanged)
      resolution = matchMedia(`(resolution: ${devicePixelRatio || 1}dppx)`)
      resolution.addEventListener('change', resolutionChanged)
    }
    function resolutionChanged() {
      watchResolution()
      invalidate()
    }
    const mutation = new MutationObserver((records) => {
      if (records.some((record) => record.target !== canvas)) invalidate()
    })
    mutation.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    })
    const theme = new MutationObserver(invalidate)
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    })
    const resize = new ResizeObserver(invalidate)
    resize.observe(document.body)
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerout', leave, { passive: true })
    document.addEventListener('pointerdown', eventDown, { passive: true })
    function eventDown(event: PointerEvent) {
      if (event.pointerType !== 'mouse') hide()
    }
    document.addEventListener('keydown', hide, true)
    document.addEventListener('scroll', scroll, {
      capture: true,
      passive: true,
    })
    document.addEventListener('transitionend', invalidate, true)
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('blur', hide)
    window.addEventListener('resize', invalidate)
    forced.addEventListener('change', preference)
    reduced.addEventListener('change', preference)
    document.fonts.addEventListener('loadingdone', invalidate)
    watchResolution()
    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      mutation.disconnect()
      theme.disconnect()
      resize.disconnect()
      resolution?.removeEventListener('change', resolutionChanged)
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerout', leave)
      document.removeEventListener('pointerdown', eventDown)
      document.removeEventListener('keydown', hide, true)
      document.removeEventListener('scroll', scroll, true)
      document.removeEventListener('transitionend', invalidate, true)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('blur', hide)
      window.removeEventListener('resize', invalidate)
      forced.removeEventListener('change', preference)
      reduced.removeEventListener('change', preference)
      document.fonts.removeEventListener('loadingdone', invalidate)
    }
  }, [])
  // Escape #root's isolated stacking context so body-portalled dialogs cannot
  // cover the paint layer. It remains aria-hidden and never intercepts input.
  return createPortal(
    <canvas ref={ref} className='pointer-blueprint' aria-hidden='true' />,
    document.body,
  )
}
