import React from 'react'
import { prerender } from 'react-dom/static'
import { CatalogApp, HeadContext, revealCurrentLinks } from './App'
import { pageRoutes } from './catalog'
import { loadKorean } from './i18n'
import { renderedChunks } from './lazy'
import { localePath, setServerPath, type Locale } from './router'
export { pageRoutes as routes }
export const locales: Locale[] = ['en', 'ko']
export { localePath }
/** Runs as the static page parses, before its first paint. */
export const revealScript = `(${revealCurrentLinks.toString()})()`
/** One page as HTML, with everything lazy in it loaded. */
export async function renderPage(route: string, locale: Locale) {
  if (locale === 'ko') await loadKorean()
  setServerPath(localePath(locale, route))
  const head: { title?: string; description?: string } = {}
  renderedChunks.clear()
  const errors: unknown[] = []
  const { prelude } = await prerender(
    <HeadContext.Provider value={head}>
      <CatalogApp />
    </HeadContext.Provider>,
    {
      onError: (error) => void errors.push(error),
      // Every section stays in place: React would otherwise write a large one after
      // its loading fallback and swap it in with a script, a frame later.
      progressiveChunkSize: Number.POSITIVE_INFINITY,
    },
  )
  const html = await new Response(prelude as ReadableStream).text()
  if (errors.length) throw errors[0]
  return { html, head, chunks: [...renderedChunks] }
}
