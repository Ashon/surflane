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
// Ambient probes: two slow points on Lissajous paths across the visible part of a
// [data-blueprint-ambient] area (the whole catalog) light its real construction lines. They use the pointer's strength: one-device-
// pixel lines at a quarter of it were invisible on high-density displays.
const ambientStrength = 1
const ambientInset = 48
const ambientPeakSpeed = 18 // px/s
const ambientDelay = 1200
const ambientFadeIn = 600
const ambientFadeOut = 180
const ambientFrame = 1000 / 30
// One probe roams the area; the other circles a [data-blueprint-ambient-anchor], such as
// the brand mark, at a smaller reach and a softer strength.
const probes = [
  { periods: [19, 23], phases: [0, Math.PI / 3], reach: 160, strength: 1 },
  {
    periods: [23, 19],
    phases: [Math.PI, (4 * Math.PI) / 3],
    reach: 120,
    strength: 0.7,
    anchored: true,
  },
]
// How far the anchored probe's orbit reaches past the anchor's box.
const anchorOrbit = 16
// Approximates the --ease-out curve for the fade-in.
const easeOut = (progress: number) => 1 - (1 - progress) ** 3

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
    let guides: Guide[] = [],
      pointerMeasured = false
    let opacity = 0,
      desired = 0,
      lastTime = 0
    let scope: ParentNode = document
    let resolution: MediaQueryList
    const observed = new Set<Element>()
    // Each light source is masked on its own layer, then composited.
    const layer = document.createElement('canvas')
    let area: HTMLElement | null = null,
      anchor: HTMLElement | null = null,
      areaVisible = false,
      ambientReady = false,
      ambientGuides: Guide[] = [],
      ambientOpacity = 0,
      ambientFrameId = 0,
      lastAmbientPaint = 0,
      idle = 0
    const pointerActive = () => pointer !== null && (desired > 0 || opacity > 0)
    const ambientAllowed = (now: number) =>
      area !== null &&
      ambientReady &&
      areaVisible &&
      !document.hidden &&
      !reduced.matches &&
      !forced.matches &&
      area.dataset.blueprintAmbient === 'running' &&
      !hiddenFromGuides(area)
    const intersection = new IntersectionObserver((entries) => {
      areaVisible = entries.some((entry) => entry.isIntersecting)
      schedule()
    })
    const updateArea = () => {
      anchor = document.querySelector<HTMLElement>(
        '[data-blueprint-ambient-anchor]',
      )
      const next = document.querySelector<HTMLElement>(
        '[data-blueprint-ambient]',
      )
      if (next === area) return
      intersection.disconnect()
      area = next
      areaVisible = false
      if (area) intersection.observe(area)
    }

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
      const current = new Set<Element>()
      const collect = (root: ParentNode) => {
        const found: Guide[] = []
        const elements = [...root.querySelectorAll<HTMLElement>(targets)]
        if (root instanceof HTMLElement && root.matches(targets))
          elements.unshift(root)
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
          found.push({ bounds, clip })
        }
        return found
      }
      pointerMeasured = pointerActive()
      guides = pointerMeasured ? collect(scope) : []
      // A document-wide pointer scope already measured everything the probes need.
      ambientGuides = !area
        ? []
        : pointerMeasured && scope === document
          ? guides
          : collect(area)
      for (const element of observed)
        if (!current.has(element)) resize.unobserve(element)
      observed.clear()
      current.forEach((element) => observed.add(element))
      dirty = false
    }
    // Strokes every guide within reach of a point, then keeps only a radial
    // spotlight around it. `strength` scales the spotlight's alpha.
    const spotlight = (
      context: CanvasRenderingContext2D,
      dpr: number,
      ink: string,
      list: Guide[],
      point: { x: number; y: number },
      reach: number,
      strength: number,
    ) => {
      const snap = (n: number) => (Math.floor(n * dpr) + 0.5) / dpr
      // Nothing outside the spotlight's square survives the mask, so neither
      // the strokes nor the mask touch the rest of the canvas. The square sits
      // on whole device pixels: a partly covered edge pixel would escape the mask.
      const left = (Math.floor((point.x - reach) * dpr) - 1) / dpr,
        top = (Math.floor((point.y - reach) * dpr) - 1) / dpr,
        size = (Math.ceil(reach * 2 * dpr) + 2) / dpr
      context.save()
      context.beginPath()
      context.rect(left, top, size, size)
      context.clip()
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
      for (const { bounds, clip } of list) {
        const visible = intersect(bounds, clip)
        const distance = Math.hypot(
          Math.max(visible.left - point.x, 0, point.x - visible.right),
          Math.max(visible.top - point.y, 0, point.y - visible.bottom),
        )
        if (distance > reach) continue
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
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        reach,
      )
      fade.addColorStop(0, `rgba(0,0,0,${0.3 * strength})`)
      fade.addColorStop(0.35, `rgba(0,0,0,${0.16 * strength})`)
      fade.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = fade
      context.fillRect(left, top, size, size)
      context.restore()
    }
    // Composites one spotlight through the layer, copying only its square.
    const layered = (
      context: CanvasRenderingContext2D,
      dpr: number,
      point: { x: number; y: number },
      reach: number,
      draw: (target: CanvasRenderingContext2D) => void,
    ) => {
      if (layer.width !== canvas.width) layer.width = canvas.width
      if (layer.height !== canvas.height) layer.height = canvas.height
      const target = layer.getContext('2d')
      if (!target) return
      const left = Math.max(0, Math.floor((point.x - reach) * dpr) - 1),
        top = Math.max(0, Math.floor((point.y - reach) * dpr) - 1),
        right = Math.min(layer.width, Math.ceil((point.x + reach) * dpr) + 2),
        bottom = Math.min(layer.height, Math.ceil((point.y + reach) * dpr) + 2)
      if (right <= left || bottom <= top) return
      target.setTransform(1, 0, 0, 1, 0, 0)
      target.clearRect(left, top, right - left, bottom - top)
      target.setTransform(dpr, 0, 0, dpr, 0, 0)
      target.lineWidth = 1 / dpr
      target.lineCap = 'butt'
      draw(target)
      context.setTransform(1, 0, 0, 1, 0, 0)
      const width = right - left,
        height = bottom - top
      context.drawImage(
        layer,
        left,
        top,
        width,
        height,
        left,
        top,
        width,
        height,
      )
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const probePoints = (now: number) => {
      const screen = { left: 0, top: 0, right: innerWidth, bottom: innerHeight }
      // The roaming probe covers the part of the area on screen, not its scrolled length.
      const roam = intersect(area!.getBoundingClientRect(), screen)
      const seconds = now / 1000
      return probes.map(({ periods: [tx, ty], phases: [px, py], ...probe }) => {
        let left = roam.left,
          top = roam.top,
          width = Math.max(0, roam.right - roam.left),
          height = Math.max(0, roam.bottom - roam.top),
          inset = ambientInset
        if (probe.anchored && anchor?.getClientRects().length) {
          const box = anchor.getBoundingClientRect()
          left = box.left - anchorOrbit
          top = box.top - anchorOrbit
          width = box.width + anchorOrbit * 2
          height = box.height + anchorOrbit * 2
          inset = 0
        }
        const ax = Math.max(0, width / 2 - inset),
          ay = Math.max(0, height / 2 - inset)
        // Both periods stretch together: the 19:23 ratio never visibly
        // repeats, and the probe never moves faster than 18px/s.
        const scale = Math.max(
          1,
          (2 * Math.PI * Math.hypot(ax / tx, ay / ty)) / ambientPeakSpeed,
        )
        return {
          x:
            left +
            width / 2 +
            ax * Math.sin((2 * Math.PI * seconds) / (tx * scale) + px),
          y:
            top +
            height / 2 +
            ay * Math.sin((2 * Math.PI * seconds) / (ty * scale) + py),
          reach: probe.reach,
          strength: probe.strength,
        }
      })
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
      const ambientDesired = ambientAllowed(now) ? 1 : 0
      ambientOpacity = reduced.matches
        ? 0
        : ambientOpacity +
          Math.sign(ambientDesired - ambientOpacity) *
            Math.min(
              Math.abs(ambientDesired - ambientOpacity),
              elapsed /
                (ambientDesired > ambientOpacity
                  ? ambientFadeIn
                  : ambientFadeOut),
            )
      const prepared = prepareBlueprintCanvas(canvas, innerWidth, innerHeight)
      if (!prepared) return
      const pointerOn = pointer !== null && !forced.matches && opacity > 0
      const ambientOn = area !== null && ambientOpacity > 0
      if (pointerOn || ambientOn) {
        if (dirty) measure()
        const { context, dpr } = prepared
        const ink = getComputedStyle(canvas).color
        const sources: [Guide[], { x: number; y: number }, number, number][] =
          ambientOn
            ? probePoints(now).map(({ reach, strength, ...point }) => [
                ambientGuides,
                point,
                reach,
                ambientStrength * strength * easeOut(ambientOpacity),
              ])
            : []
        if (pointerOn) sources.push([guides, pointer!, radius, opacity])
        for (const [list, point, reach, strength] of sources) {
          if (sources.length === 1)
            spotlight(context, dpr, ink, list, point, reach, strength)
          else
            layered(context, dpr, point, reach, (target) =>
              spotlight(target, dpr, ink, list, point, reach, strength),
            )
        }
      }
      if (ambientOn) lastAmbientPaint = now
      if (pointerOn && opacity !== desired) schedule()
      if ((ambientOn || ambientDesired) && !ambientFrameId)
        ambientFrameId = requestAnimationFrame(ambientTick)
    }
    // The probes keep moving at no more than 30 frames a second, on any refresh rate.
    const ambientTick = (now: number) => {
      ambientFrameId = 0
      if (stopped) return
      if (now - lastAmbientPaint < ambientFrame - 4) {
        ambientFrameId = requestAnimationFrame(ambientTick)
        return
      }
      cancelAnimationFrame(frame)
      frame = 0
      paint(now)
    }
    const schedule = () => {
      if (!frame && !stopped) frame = requestAnimationFrame(paint)
    }
    const invalidate = () => {
      updateArea()
      dirty = true
      if (
        (pointer && desired) ||
        ambientOpacity > 0 ||
        ambientAllowed(performance.now())
      )
        schedule()
    }
    const scroll = () => {
      dirty = true
      if (!(pointerActive() || ambientOpacity > 0) || stopped) return
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
      if (!pointerMeasured) dirty = true
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
      else schedule()
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
    updateArea()
    // The probes start once the first screen has settled.
    const start = window.setTimeout(() => {
      const ready = () => {
        ambientReady = true
        schedule()
      }
      if ('requestIdleCallback' in window)
        idle = requestIdleCallback(ready, { timeout: 1000 })
      else ready()
    }, ambientDelay)
    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      window.clearTimeout(start)
      cancelAnimationFrame(ambientFrameId)
      if (idle) cancelIdleCallback(idle)
      intersection.disconnect()
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
