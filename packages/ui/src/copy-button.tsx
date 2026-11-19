'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { skin } from './parts.js'
import { Button } from './button.js'
import { Tooltip } from './tooltip.js'
import { useLabels } from './label-context.js'

export type CopyButtonLabels = {
  copy: string
  copied: string
  copyError: string
}
export type CopyButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  'children' | 'onClick' | 'onCopy' | 'value'
> & {
  /** What to copy: the text, or a function that returns it when pressed. */
  value: string | (() => string | Promise<string>)
  /** The button's text: the action, then the result. */
  labels?: Partial<CopyButtonLabels>
  /** Copies instead of the clipboard write, which falls back to a selected hidden
   * field where the page has no Clipboard API, such as plain http; throw to report
   * a failure. */
  onCopy?: (text: string) => void | Promise<void>
  /** Hears each outcome, such as to select the source after a failure. */
  onResult?: (result: 'copied' | 'failed') => void
  /** Shows the icon alone, in a square button, where a row has no room for the
   * text: the label stays the button's name and live result, and shows as a
   * tooltip. The icon and its color show the result. */
  labelHidden?: boolean
}
const copyIcons = { idle: 'copy', copied: 'check', failed: 'alert' } as const
// A hidden label keeps the button square at the same size scheme.
const iconSizes = {
  small: 'icon-small',
  default: 'icon',
  large: 'icon-large',
} as const
/** Copies with a selected, hidden text field, as pages without the Clipboard API,
 * such as plain http on a local network, still can. The field sits next to the
 * button, so a dialog that keeps focus inside it lets the field take focus, and
 * focus returns to the button after. */
function copyBySelection(text: string, anchor: HTMLElement | null) {
  if (typeof document === 'undefined') return false
  const field = document.createElement('textarea')
  field.value = text
  field.readOnly = true
  field.tabIndex = -1
  field.setAttribute('aria-hidden', 'true')
  Object.assign(field.style, {
    position: 'fixed',
    insetBlockStart: '0',
    insetInlineStart: '0',
    inlineSize: '1px',
    blockSize: '1px',
    opacity: '0',
    pointerEvents: 'none',
  })
  ;(anchor?.parentElement ?? document.body).append(field)
  field.focus({ preventScroll: true })
  field.select()
  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {}
  field.remove()
  anchor?.focus({ preventScroll: true })
  return copied
}
/** The Clipboard API where the page has it, else a selected hidden field; throws
 * only when neither copies. */
async function writeClipboard(text: string, anchor: HTMLElement | null) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText)
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {}
  if (!copyBySelection(text, anchor)) throw new Error('Copy unavailable')
}
// Feedback stays inside the button and returns to the action after this long.
const copyFeedbackDuration = 2000
/** Copies text and says what happened in its own label: the result replaces the
 * action in place, as a polite live region, then the action returns after 2s.
 * The button is as wide as its longest label, so nothing around it moves. */
export const CopyButton = function CopyButton({
  value,
  labels,
  onCopy,
  onResult,
  labelHidden = false,
  variant = 'outline',
  size = 'small',
  className,
  ref,
  ...props
}: CopyButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const text = useLabels<CopyButtonLabels>('copyButton')
  const copyLabel = labels?.copy ?? text.copy ?? 'Copy'
  const copiedLabel = labels?.copied ?? text.copied ?? 'Copied'
  const copyErrorLabel =
    labels?.copyError ?? text.copyError ?? 'Copy unavailable'
  const [state, setState] = React.useState<
    'idle' | 'busy' | 'copied' | 'failed'
  >('idle')
  // After the first copy, each change of label fades in; the first render does not.
  const [used, setUsed] = React.useState(false)
  const revision = React.useRef(0),
    mounted = React.useRef(false),
    timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      revision.current++
      clearTimeout(timer.current)
    }
  }, [])
  // New text clears a result, and a late answer for the old text is dropped.
  const source = typeof value === 'string' ? value : null
  React.useEffect(() => {
    revision.current++
    clearTimeout(timer.current)
    setState('idle')
  }, [source])
  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget
    const request = ++revision.current
    clearTimeout(timer.current)
    setUsed(true)
    setState('busy')
    let outcome: 'copied' | 'failed'
    try {
      const text = typeof value === 'string' ? value : await value()
      if (onCopy) await onCopy(text)
      else await writeClipboard(text, button)
      outcome = 'copied'
    } catch {
      outcome = 'failed'
    }
    if (!mounted.current || request !== revision.current) return
    setState(outcome)
    onResult?.(outcome)
    timer.current = setTimeout(() => {
      if (mounted.current && request === revision.current) setState('idle')
    }, copyFeedbackDuration)
  }
  const icon = state === 'copied' || state === 'failed' ? state : 'idle'
  const label =
    state === 'copied'
      ? copiedLabel
      : state === 'failed'
        ? copyErrorLabel
        : copyLabel
  const button = (
    <Button
      {...props}
      ref={ref}
      type='button'
      variant={variant}
      size={
        labelHidden && size in iconSizes
          ? iconSizes[size as keyof typeof iconSizes]
          : size
      }
      className={skin('surf-copy-button', className)}
      onClick={copy}
      // A pending copy blocks a second start but keeps focus on the button.
      disabled={state === 'busy'}
      focusableWhenDisabled
      aria-busy={state === 'busy' || undefined}
      data-copy-state={icon === 'idle' ? undefined : icon}
      data-copy-used={used || undefined}
    >
      <Icon key={icon} name={copyIcons[icon]} className='surf-copy-icon' />
      {labelHidden ? (
        <span className='surf-feedback-sr' aria-live='polite'>
          {label}
        </span>
      ) : (
        /* Every label holds the same cell, so the button is as wide as the longest;
           only the current one shows. It is the result: screen readers hear it
           change in place. */
        <span className='surf-copy-text'>
          <span aria-live='polite'>
            <span key={icon} className='surf-copy-label'>
              {label}
            </span>
          </span>
          {/* Drawn as generated content, so the room adds no text to the button. */}
          {[copyLabel, copiedLabel, copyErrorLabel].map((room, index) => (
            <span
              key={index}
              className='surf-copy-room'
              data-label={room}
              aria-hidden='true'
            />
          ))}
        </span>
      )}
    </Button>
  )
  return labelHidden ? (
    <Tooltip label={label} side='top'>
      {button}
    </Tooltip>
  ) : (
    button
  )
}
