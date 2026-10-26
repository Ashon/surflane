import * as React from 'react'

/** Whether this is an Apple platform, where ⌘ is the command modifier; Ctrl is,
 * everywhere else. iPadOS reports itself as a Mac, which is right here too. */
export const applePlatform = () => {
  if (typeof navigator === 'undefined') return false
  const agent = navigator as Navigator & {
    userAgentData?: { platform?: string }
  }
  return /Mac|iPhone|iPad|iPod|iOS/i.test(
    agent.userAgentData?.platform || agent.platform,
  )
}
const subscribe = () => () => {}
/** The same answer for rendering. The server cannot know the reader's platform, so
 * it and the hydrating pass write the Ctrl form, and an Apple page turns to ⌘ right
 * after: the markup always matches. */
export const useApplePlatform = () =>
  React.useSyncExternalStore(subscribe, applePlatform, () => false)
/** Whether a key event holds this platform's command modifier. */
export const commandKey = (event: KeyboardEvent) =>
  applePlatform() ? event.metaKey : event.ctrlKey
