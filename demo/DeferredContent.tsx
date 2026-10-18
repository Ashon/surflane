import React, { Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Button } from '@surflane/ui'
import { Link, catalogScrollPosition } from './router'
type Scope = 'page' | 'preview'
function Ready({ scope }: { scope: Scope }) {
  const marker = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    if (
      scope !== 'page' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return
    const target = marker.current?.parentElement
    if (!target) return
    target.classList.add('catalog-content-fade')
    const finish = (event: AnimationEvent) => {
      if (event.target === target)
        target.classList.remove('catalog-content-fade')
    }
    target.addEventListener('animationend', finish)
    target.addEventListener('animationcancel', finish)
    return () => {
      target.classList.remove('catalog-content-fade')
      target.removeEventListener('animationend', finish)
      target.removeEventListener('animationcancel', finish)
    }
  }, [scope])
  useEffect(() => {
    // Native fragment navigation can run before a requested lazy section exists.
    if (document.querySelector('[data-catalog-loading]')) return
    if (!location.hash) {
      if (scope === 'page')
        document
          .querySelector<HTMLElement>('.catalog-document-scroll')
          ?.scrollTo(0, catalogScrollPosition())
      return
    }
    let id: string
    try {
      id = decodeURIComponent(location.hash.slice(1))
    } catch {
      return
    }
    document
      .getElementById(id)
      ?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [])
  return <span ref={marker} hidden data-catalog-ready={scope} />
}
class LoadBoundary extends React.Component<
  { scope: Scope; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed)
      return (
        <div
          className='catalog-load-error'
          role='alert'
          data-catalog-error={this.props.scope}
        >
          {this.props.scope === 'page' ? (
            <h2>This page could not be loaded</h2>
          ) : (
            <h3>This example could not be loaded</h3>
          )}
          <p>Reload the page or go to another page.</p>
          <div className='actions'>
            <Button variant='outline' onClick={() => window.location.reload()}>
              Reload page
            </Button>
            <Link href='/components'>Browse components</Link>
          </div>
        </div>
      )
    return this.props.children
  }
}
export function DeferredContent({
  children,
  scope,
}: {
  children: React.ReactNode
  scope: Scope
}) {
  return (
    <LoadBoundary scope={scope}>
      <Suspense
        fallback={
          <div
            className='catalog-loading'
            data-catalog-loading={scope}
            role='status'
            aria-label={
              scope === 'page' ? 'Loading content' : 'Loading preview'
            }
          >
            <span className='example-announcement'>
              {scope === 'page' ? 'Loading content' : 'Loading preview'}
            </span>
          </div>
        }
      >
        {children}
        <Ready scope={scope} />
      </Suspense>
    </LoadBoundary>
  )
}
