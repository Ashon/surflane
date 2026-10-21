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
// edges: where the element shows; an edge outside it is not drawn.
// exclude: an inner scroll area whose own layer draws that part of the lines.
type Guide = { bounds: Bounds; edges: Bounds; exclude: Bounds | null }
type Point = { x: number; y: number }
// Guides paint on surfaces. The window surface is the fixed canvas over everything
// outside scroll areas. Each scroll area gets a layer inside its own content: its guides
// are kept relative to that layer, so they move with whatever moves the content, even
// a rubber-band bounce or overscroll stretch that no scroll event or script can see.
// A container never cuts a line: a layer is clipped by its area, so every scroll area
// around an element draws the part of the element's lines inside it, and the next
// area out, or the window, continues them past its edge.
type Surface = {
  area: HTMLElement | null
  host: HTMLElement | null
  canvas: HTMLCanvasElement
  origin: Point
  pointer: Guide[]
  ambient: Guide[]
  painted: boolean
}
const scrollArea = '.pui-scroll-viewport'
const unbounded: Bounds = {
  left: -Infinity,
  top: -Infinity,
  right: Infinity,
  bottom: Infinity,
}
const intersect = (a: Bounds, b: Bounds): Bounds => ({
  left: Math.max(a.left, b.left),
  top: Math.max(a.top, b.top),
  right: Math.min(a.right, b.right),
  bottom: Math.min(a.bottom, b.bottom),
})
const shifted = (b: Bounds, x: number, y: number): Bounds => ({
  left: b.left + x,
  top: b.top + y,
  right: b.right + x,
  bottom: b.bottom + y,
})
// The layers are this component's own nodes; their changes are not page changes.
const ours = (node: Node) =>
  node instanceof Element &&
  (node.matches('.pointer-blueprint') ||
    node.closest('.pointer-blueprint-scroll') !== null)
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
    let pointer: Point | null = null
    let pointerMeasured = false
    let opacity = 0,
      desired = 0,
      lastTime = 0
    let scope: ParentNode = document
    let resolution: MediaQueryList
    const observed = new Set<Element>()
    // Each light source is masked on its own scratch square, then composited.
    const scratch = document.createElement('canvas')
    const fixed: Surface = {
      area: null,
      host: null,
      canvas,
      origin: { x: 0, y: 0 },
      pointer: [],
      ambient: [],
      painted: false,
    }
    const layers = new Map<HTMLElement, Surface>()
    const layerFor = (area: HTMLElement) => {
      let surface = layers.get(area)
      if (surface?.host?.parentElement === area) return surface
      surface?.host?.remove()
      const host = document.createElement('div')
      host.className = 'pointer-blueprint-scroll'
      host.setAttribute('aria-hidden', 'true')
      const layerCanvas = document.createElement('canvas')
      layerCanvas.className = 'pointer-blueprint-layer'
      host.append(layerCanvas)
      // First in the area, ahead of its content: a zero-height block that never
      // takes space; the canvas inside is positioned over the visible part.
      area.prepend(host)
      surface = {
        area,
        host,
        canvas: layerCanvas,
        origin: { x: 0, y: 0 },
        pointer: [],
        ambient: [],
        painted: false,
      }
      layers.set(area, surface)
      return surface
    }
    const surfaces = () => [fixed, ...layers.values()]
    let area: HTMLElement | null = null,
      anchor: HTMLElement | null = null,
      areaVisible = false,
      ambientReady = false,
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
      // Clip chains run up to the window: they decide which edges are visible now.
      const toWindow = new WeakMap<Element, Bounds>()
      // A scroll area's visible box, where its own layer draws.
      const viewports = new Map<HTMLElement, Bounds>()
      const viewportOf = (scroller: HTMLElement) => {
        let box = viewports.get(scroller)
        if (!box) {
          const rect = scroller.getBoundingClientRect()
          const left = rect.left + scroller.clientLeft,
            top = rect.top + scroller.clientTop
          box = {
            left,
            top,
            right: left + scroller.clientWidth,
            bottom: top + scroller.clientHeight,
          }
          viewports.set(scroller, box)
        }
        return box
      }
      const outer = (element: Element) =>
        element.parentElement?.closest<HTMLElement>(scrollArea) ?? null
      const clipFor = (
        element: Element | null,
        stop: Element | null,
        cache: WeakMap<Element, Bounds>,
      ): Bounds => {
        if (!element || element === document.documentElement) return viewport
        if (element === stop) return unbounded
        const cached = cache.get(element)
        if (cached) return cached
        const parent = clipFor(element.parentElement, stop, cache)
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
        cache.set(element, clip)
        return clip
      }
      for (const surface of surfaces()) {
        surface.pointer = []
        surface.ambient = []
        if (surface.host) {
          const origin = surface.host.getBoundingClientRect()
          surface.origin = { x: origin.left, y: origin.top }
        }
      }
      const current = new Set<Element>()
      const collect = (root: ParentNode, key: 'pointer' | 'ambient') => {
        const elements = [...root.querySelectorAll<HTMLElement>(targets)]
        if (root instanceof HTMLElement && root.matches(targets))
          elements.unshift(root)
        for (const element of elements) {
          if (hiddenFromGuides(element)) continue
          current.add(element)
          if (!observed.has(element)) resize.observe(element)
          const bounds = element.getBoundingClientRect()
          if (bounds.width < 2 || bounds.height < 2) continue
          const edges = clipFor(element.parentElement, null, toWindow)
          const visible = intersect(bounds, edges)
          if (visible.right <= visible.left || visible.bottom <= visible.top)
            continue
          // Innermost area first; each area leaves the part inside the previous one
          // to that area's layer.
          let inner: Bounds | null = null
          for (
            let scroller = outer(element);
            scroller;
            scroller = outer(scroller)
          ) {
            const surface = layerFor(scroller)
            if (surface.host!.isConnected) {
              if (!surface.pointer.length && !surface.ambient.length) {
                const origin = surface.host!.getBoundingClientRect()
                surface.origin = { x: origin.left, y: origin.top }
              }
              const { x, y } = surface.origin
              surface[key].push({
                bounds: shifted(bounds, -x, -y),
                edges: shifted(edges, -x, -y),
                exclude: inner && shifted(inner, -x, -y),
              })
            }
            inner = viewportOf(scroller)
          }
          fixed[key].push({ bounds, edges, exclude: inner })
        }
      }
      pointerMeasured = pointerActive()
      if (pointerMeasured) collect(scope, 'pointer')
      // A document-wide pointer scope already measured everything the probes need.
      if (area && pointerMeasured && scope === document)
        for (const surface of surfaces()) surface.ambient = surface.pointer
      else if (area) collect(area, 'ambient')
      // Areas that left the page, or hold no guides, give their layer back.
      for (const [element, surface] of layers)
        if (
          !element.isConnected ||
          (!surface.pointer.length && !surface.ambient.length)
        ) {
          surface.host?.remove()
          layers.delete(element)
        }
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
      shift: Point,
      point: Point,
      reach: number,
      strength: number,
    ) => {
      const snap = (n: number) => (Math.floor(n * dpr) + 0.5) / dpr
      // Nothing outside the spotlight's square survives the mask, so neither
      // the strokes nor the mask touch the rest of the canvas. The square sits
      // on whole device pixels: a partly covered edge pixel would escape the mask.
      const square = {
        left: (Math.floor((point.x - reach) * dpr) - 1) / dpr,
        top: (Math.floor((point.y - reach) * dpr) - 1) / dpr,
        size: (Math.ceil(reach * 2 * dpr) + 2) / dpr,
      }
      context.save()
      context.beginPath()
      context.rect(square.left, square.top, square.size, square.size)
      context.clip()
      const stroke = (x1: number, y1: number, x2: number, y2: number) => {
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
        // The fade belongs to the complete line; the canvas and the cut-out of an
        // inner area hide parts of it without restarting the fade.
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
      }
      for (const guide of list) {
        const bounds = shifted(guide.bounds, shift.x, shift.y),
          edges = shifted(guide.edges, shift.x, shift.y)
        const visible = intersect(bounds, edges)
        const distance = Math.hypot(
          Math.max(visible.left - point.x, 0, point.x - visible.right),
          Math.max(visible.top - point.y, 0, point.y - visible.bottom),
        )
        if (distance > reach) continue
        if (guide.exclude) {
          const cut = shifted(guide.exclude, shift.x, shift.y)
          context.save()
          context.beginPath()
          context.rect(square.left, square.top, square.size, square.size)
          context.rect(
            cut.left,
            cut.top,
            cut.right - cut.left,
            cut.bottom - cut.top,
          )
          context.clip('evenodd')
        }
        const { left, top, right, bottom } = bounds
        for (const y of [top, bottom]) {
          if (y < edges.top || y > edges.bottom) continue
          stroke(
            snap(left - crosshair - extension),
            snap(y),
            snap(right + crosshair + extension),
            snap(y),
          )
        }
        for (const x of [left, right]) {
          if (x < edges.left || x > edges.right) continue
          stroke(
            snap(x),
            snap(top - crosshair - extension),
            snap(x),
            snap(bottom + crosshair + extension),
          )
        }
        if (guide.exclude) context.restore()
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
      context.fillRect(square.left, square.top, square.size, square.size)
      context.restore()
    }
    // Composites one spotlight through a scratch canvas the size of its square.
    const layered = (
      context: CanvasRenderingContext2D,
      dpr: number,
      point: Point,
      reach: number,
      draw: (target: CanvasRenderingContext2D) => void,
    ) => {
      const left = Math.floor((point.x - reach) * dpr) - 1,
        top = Math.floor((point.y - reach) * dpr) - 1,
        size = Math.ceil(reach * 2 * dpr) + 3
      if (scratch.width < size) scratch.width = size
      if (scratch.height < size) scratch.height = size
      const target = scratch.getContext('2d')
      if (!target) return
      target.setTransform(1, 0, 0, 1, 0, 0)
      target.clearRect(0, 0, size, size)
      // A whole-device-pixel offset keeps every snapped stroke on the same grid.
      target.setTransform(dpr, 0, 0, dpr, -left, -top)
      target.lineWidth = 1 / dpr
      target.lineCap = 'butt'
      draw(target)
      context.save()
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.drawImage(scratch, 0, 0, size, size, left, top, size, size)
      context.restore()
    }
    // Puts a layer's canvas over the visible part of its scroll area, on whole device
    // pixels and never past it, so the layer never extends what the area can scroll.
    const placeLayer = (surface: Surface) => {
      const { area, host, canvas: target } = surface
      if (!area || !host || !host.isConnected) return null
      const dpr = window.devicePixelRatio || 1
      const box = area.getBoundingClientRect()
      const left = Math.ceil((box.left + area.clientLeft) * dpr),
        top = Math.ceil((box.top + area.clientTop) * dpr),
        right = Math.floor(
          (box.left + area.clientLeft + area.clientWidth) * dpr,
        ),
        bottom = Math.floor(
          (box.top + area.clientTop + area.clientHeight) * dpr,
        )
      const width = Math.max(1, right - left),
        height = Math.max(1, bottom - top)
      const origin = host.getBoundingClientRect()
      const transform = `translate(${left / dpr - origin.left}px, ${top / dpr - origin.top}px)`
      if (target.style.transform !== transform)
        target.style.transform = transform
      const inline = `${width / dpr}px`,
        block = `${height / dpr}px`
      if (target.style.inlineSize !== inline) target.style.inlineSize = inline
      if (target.style.blockSize !== block) target.style.blockSize = block
      if (target.width !== width) target.width = width
      if (target.height !== height) target.height = height
      const context = target.getContext('2d')
      if (!context) return null
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, width, height)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.lineWidth = 1 / dpr
      context.lineCap = 'butt'
      return {
        context,
        dpr,
        frame: {
          left: left / dpr,
          top: top / dpr,
          right: right / dpr,
          bottom: bottom / dpr,
        },
        // Layer coordinates to canvas coordinates.
        shift: { x: origin.left - left / dpr, y: origin.top - top / dpr },
      }
    }
    const probePoints = (now: number) => {
      const screen = { left: 0, top: 0, right: innerWidth, bottom: innerHeight }
      // The roaming probe covers the part of the area on screen, not its scrolled length.
      const roam = intersect(area!.getBoundingClientRect(), screen)
      // Keep the roaming spotlight off blurred chrome such as the top rail: any
      // change over a backdrop-filter makes the browser redo the blur every frame.
      // The rail's own anchored probe is small and stays cheap.
      const avoid = document.querySelector<HTMLElement>(
        '[data-blueprint-ambient-avoid]',
      )
      const avoidBottom = avoid?.getClientRects().length
        ? avoid.getBoundingClientRect().bottom -
          (parseFloat(getComputedStyle(avoid, '::before').bottom) || 0)
        : -Infinity
      const seconds = now / 1000
      return probes.map(({ periods: [tx, ty], phases: [px, py], ...probe }) => {
        let left = roam.left,
          top = Math.max(roam.top, avoidBottom + probe.reach - ambientInset),
          width = Math.max(0, roam.right - roam.left),
          height = Math.max(0, roam.bottom - top),
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
      if ((pointerOn || ambientOn) && dirty) measure()
      const sources: ['pointer' | 'ambient', Point, number, number][] =
        ambientOn
          ? probePoints(now).map(({ reach, strength, ...point }) => [
              'ambient',
              point,
              reach,
              ambientStrength * strength * easeOut(ambientOpacity),
            ])
          : []
      if (pointerOn) sources.push(['pointer', pointer!, radius, opacity])
      for (const surface of surfaces()) {
        const active = sources.some(([key]) => surface[key].length > 0)
        if (surface !== fixed && !active && !surface.painted) continue
        const placed =
          surface === fixed
            ? {
                ...prepared,
                frame: {
                  left: 0,
                  top: 0,
                  right: innerWidth,
                  bottom: innerHeight,
                },
                shift: { x: 0, y: 0 },
              }
            : placeLayer(surface)
        surface.painted = false
        if (!placed || !active) continue
        const { context, dpr, frame: bounds, shift } = placed
        const ink = getComputedStyle(surface.canvas).color
        const near = sources.filter(
          ([key, point, reach]) =>
            surface[key].length > 0 &&
            point.x + reach > bounds.left &&
            point.x - reach < bounds.right &&
            point.y + reach > bounds.top &&
            point.y - reach < bounds.bottom,
        )
        for (const [key, point, reach, strength] of near) {
          const local = { x: point.x - bounds.left, y: point.y - bounds.top }
          const draw = (target: CanvasRenderingContext2D) =>
            spotlight(
              target,
              dpr,
              ink,
              surface[key],
              shift,
              local,
              reach,
              strength,
            )
          if (near.length === 1) draw(context)
          else layered(context, dpr, local, reach, draw)
          surface.painted = true
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
      if (
        records.some(
          (record) =>
            !ours(record.target) &&
            !(
              record.type === 'childList' &&
              [...record.addedNodes, ...record.removedNodes].every(ours)
            ),
        )
      )
        invalidate()
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
      for (const surface of layers.values()) surface.host?.remove()
      layers.clear()
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
