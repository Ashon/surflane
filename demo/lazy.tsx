import React, { useState } from 'react'
// Each lazy import names its chunk, as Rollup names files: DetailPage-RZ2oRr1b.js,
// file-upload.en-C3p0aQ_x.js. The client and server builds name them alike, so a name
// crosses from one to the other.
function chunkName(load: () => unknown) {
  return load
    .toString()
    .match(/import\(["'](?:[^"']*\/)?([^/"']+)-[\w-]{8}\.js["']\)/)?.[1]
}
const chunks = new Map<string, (() => Promise<unknown>)[]>()
/** The chunks a prerendered page renders; scripts/prerender.mjs lists them in the page. */
export const renderedChunks = new Set<string>()
/** React.lazy that tells the prerender which chunk a page renders, and loads it ahead. */
export function lazy<T extends React.ComponentType<any>>(
  load: () => Promise<{ default: T }>,
) {
  let loaded: T | undefined
  const fetch = () =>
    load().then((module) => {
      loaded = module.default
      return module
    })
  const Lazy = React.lazy(fetch)
  const name = chunkName(load)
  if (name) chunks.set(name, [...(chunks.get(name) ?? []), fetch])
  return function Tracked(props: React.ComponentProps<T>) {
    // Specs import catalog modules outside Vite, where import.meta.env is undefined.
    if (import.meta.env?.SSR && name) renderedChunks.add(name)
    // A chunk loaded ahead renders in place, so its section hydrates with the page.
    const [Component] = useState<React.ComponentType<any>>(() => loaded ?? Lazy)
    return <Component {...props} />
  }
}
/**
 * A lazily imported module for a page to read while it renders, such as one page's
 * docs: like lazy(), the prerender lists its chunk and the client loads it ahead, so
 * the read resolves at once while the page hydrates.
 */
export function lazyModule<T>(load: () => Promise<T>) {
  let request: Promise<T> | undefined
  const fetch = () =>
    (request ??= load().then(
      (value) => {
        // React reads a promise marked fulfilled without suspending.
        Object.assign(request!, { status: 'fulfilled', value })
        return value
      },
      (error) => {
        // A failed chunk loads again the next time the page renders.
        request = undefined
        throw error
      },
    ))
  const name = chunkName(load)
  if (name) chunks.set(name, [...(chunks.get(name) ?? []), fetch])
  return {
    read() {
      if (import.meta.env?.SSR && name) renderedChunks.add(name)
      return React.use(fetch())
    },
    /** Starts loading the module; returns nothing once it has loaded. */
    preload() {
      const loaded = (request as { status?: string } | undefined)?.status
      return loaded === 'fulfilled' ? undefined : fetch()
    },
  }
}
/**
 * Loads the named chunks and the chunks they declare in turn, so a prerendered page
 * hydrates in one pass. A section still waiting for its code when a context above it
 * changes would lose its HTML to its fallback.
 */
export async function preloadChunks(names: string[]) {
  const loaded = new Set<string>()
  let next = names.filter((name) => chunks.has(name))
  // A chunk declares the lazy chunks inside it only once it has loaded.
  while (next.length) {
    next.forEach((name) => loaded.add(name))
    await Promise.all(
      next.flatMap((name) => chunks.get(name)!).map((fetch) => fetch()),
    )
    next = names.filter((name) => !loaded.has(name) && chunks.has(name))
  }
}
