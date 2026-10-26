'use client'
import * as React from 'react'
import { cx } from './parts.js'
import { useApplePlatform } from './platform.js'
import { useLabels } from './label-context.js'

/** Keys Kbd writes for the platform. Any other key shows as written, and a single
 * letter as its key cap prints it, in capitals. */
export type KbdNamedKey =
  | 'mod'
  | 'ctrl'
  | 'alt'
  | 'shift'
  | 'enter'
  | 'escape'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
export type KbdKey = KbdNamedKey | (string & {})
export type KbdLabels = {
  /** What a screen reader says for the keys drawn as symbols. Keyboards print the
   * modifiers' names in English everywhere, so those stay unless you change them. */
  command: string
  control: string
  option: string
  shift: string
  up: string
  down: string
  left: string
  right: string
}
export type KbdProps = Omit<
  React.ComponentPropsWithoutRef<'kbd'>,
  'children'
> & {
  /** One key, or the keys pressed together. 'mod' is the command modifier: ⌘ on
   * Apple platforms, Ctrl elsewhere. Modifiers take the platform's order. */
  keys: KbdKey | readonly KbdKey[]
  labels?: Partial<KbdLabels>
  /** The platform to write for. Kbd finds it in the browser; pass it when the
   * server knows it, such as from the User-Agent header, so the first paint is
   * already right. */
  platform?: 'apple' | 'other'
}
const defaultLabels: KbdLabels = {
  command: 'Command',
  control: 'Control',
  option: 'Option',
  shift: 'Shift',
  up: 'Up arrow',
  down: 'Down arrow',
  left: 'Left arrow',
  right: 'Right arrow',
}
type Cap = { glyph: string; name?: string }
// Apple writes ⌃⌥⇧⌘ before the key; other platforms Ctrl+Alt+Shift.
const appleOrder = ['ctrl', 'alt', 'shift', 'mod']
const otherOrder = ['mod', 'alt', 'shift']
/** The key caps for a chord on one platform, modifiers first in its order. */
function kbdCaps(
  keys: KbdKey | readonly KbdKey[],
  apple: boolean,
  labels: KbdLabels = defaultLabels,
): Cap[] {
  const list = (typeof keys === 'string' ? [keys] : keys).map((key) =>
    // Ctrl is the command modifier off Apple platforms: one key, written once.
    !apple && key === 'ctrl' ? 'mod' : key,
  )
  const order = apple ? appleOrder : otherOrder
  const modifiers = order.filter((key) => list.includes(key))
  const rest = list.filter((key) => !order.includes(key))
  const cap = (key: string): Cap => {
    switch (key) {
      case 'mod':
        return apple ? { glyph: '⌘', name: labels.command } : { glyph: 'Ctrl' }
      case 'ctrl':
        return { glyph: '⌃', name: labels.control }
      case 'alt':
        return apple ? { glyph: '⌥', name: labels.option } : { glyph: 'Alt' }
      case 'shift':
        return apple ? { glyph: '⇧', name: labels.shift } : { glyph: 'Shift' }
      case 'enter':
        return { glyph: 'Enter' }
      case 'escape':
        return { glyph: 'Esc' }
      case 'up':
        return { glyph: '↑', name: labels.up }
      case 'down':
        return { glyph: '↓', name: labels.down }
      case 'left':
        return { glyph: '←', name: labels.left }
      case 'right':
        return { glyph: '→', name: labels.right }
      default:
        return { glyph: /^[a-z]$/.test(key) ? key.toUpperCase() : key }
    }
  }
  return [...modifiers, ...rest].map(cap)
}
/** A key or a chord as this platform writes it: ⇧⌘P on Apple platforms, Ctrl+Shift+P
 * elsewhere. Symbols carry their names for screen readers. */
export const Kbd = function Kbd({
  keys,
  labels,
  platform,
  className,
  ref,
  ...props
}: KbdProps & { ref?: React.Ref<HTMLElement> }) {
  const detected = useApplePlatform()
  const apple = platform ? platform === 'apple' : detected
  const provided = useLabels<KbdLabels>('kbd')
  const caps = kbdCaps(keys, apple, {
    ...defaultLabels,
    ...provided,
    ...labels,
  })
  return (
    <kbd {...props} ref={ref} className={cx('surf-kbd', className)}>
      {caps.map(({ glyph, name }, index) => (
        <React.Fragment key={index}>
          {index > 0 && !apple && '+'}
          <kbd>
            {name ? (
              <>
                <span aria-hidden='true'>{glyph}</span>
                <span className='surf-feedback-sr'>{`${name} `}</span>
              </>
            ) : (
              glyph
            )}
          </kbd>
        </React.Fragment>
      ))}
    </kbd>
  )
}
