'use client'
import * as React from 'react'

/** Base UI 1.9 exposes WebKit's focus guards as buttons for VoiceOver.
 * Give those boundaries a name without hiding or changing their focus behavior.
 * Scope observation to this portal and disconnect it on React ref cleanup.
 */
export function useDialogFocusBoundary(label: string) {
  return React.useCallback(
    (portal: HTMLDivElement | null) => {
      if (!portal) return
      const owned = new Set<HTMLElement>()
      const nameBoundaries = () => {
        for (const guard of portal.querySelectorAll<HTMLElement>(
          ':scope > [data-base-ui-focus-guard][role="button"]',
        )) {
          if (!guard.hasAttribute('aria-label')) {
            guard.setAttribute('aria-label', label)
            owned.add(guard)
          }
        }
      }
      nameBoundaries()
      const observer = new MutationObserver(nameBoundaries)
      observer.observe(portal, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['role'],
      })
      return () => {
        observer.disconnect()
        for (const guard of owned)
          if (guard.getAttribute('aria-label') === label)
            guard.removeAttribute('aria-label')
      }
    },
    [label],
  )
}
