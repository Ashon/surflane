import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { preloadSyntaxHighlighting } from '@surflane/ui/syntax-highlighting'
import { CatalogApp } from './App'
import { hydration } from './DeferredContent'
import { documentLocale, loadKorean } from './i18n'
import { preloadChunks } from './lazy'
import { pagePath } from './router'
const container = document.getElementById('root')!
// The build writes every page as HTML, and the app takes it over where it stands. The
// dev server and an unknown path (404.html) start empty and render from scratch, as
// does a server that answers an unknown path with another page's HTML.
async function start() {
  if (container.dataset.page !== pagePath()) container.replaceChildren()
  if (!container.firstElementChild) {
    createRoot(container).render(<CatalogApp />)
    return
  }
  // The page's chunks and its code's colors load first, so it hydrates in one pass:
  // no section is left waiting, where a change above it would drop its static HTML.
  // A chunk that fails to load fails again in its section, which shows how to recover.
  await Promise.all([
    preloadChunks(container.dataset.chunks?.split(' ') ?? []),
    preloadSyntaxHighlighting(container),
  ]).catch(() => {})
  hydration.pending = true
  hydrateRoot(container, <CatalogApp />, {
    onRecoverableError(error) {
      console.error('Catalog hydration:', error)
    },
  })
}
// Korean pages wait for the Korean chunk, so the first render is already in Korean.
if (documentLocale() === 'ko')
  loadKorean().then(start, (error) => {
    console.error(error)
    void start()
  })
else void start()
