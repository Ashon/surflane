'use client'
import * as React from 'react'
import { flushSync } from 'react-dom'
import { transitionTheme } from '@surflane/design-tokens/theme-transition'
import { ShellContext, SidebarContext } from './app-shell-context.js'
import { AppShellLink } from './app-shell.js'
import { Button } from './button.js'
import { cx } from './class-names.js'
import { Icon } from './icon.js'
import { useLabels } from './label-context.js'
import { SegmentedControl } from './segmented-control.js'
import { Tooltip } from './tooltip.js'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeSwitchLabels = {
  /** Names the group of three. */
  label: string
  light: string
  dark: string
  system: string
  /** The one-button switch's name: the theme now and the one a press sets. */
  next: (current: string, next: string) => string
}
const themeLabels: ThemeSwitchLabels = {
  label: 'Theme',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  next: (current, next) => `Theme: ${current}. Switch to ${next}`,
}
const modes: readonly ThemeMode[] = ['light', 'dark', 'system']
const icons = { light: 'sun', dark: 'moon', system: 'monitor' } as const
const isMode = (value: unknown): value is ThemeMode =>
  modes.includes(value as ThemeMode)
const darkQuery = '(prefers-color-scheme: dark)'

/** The theme a mode shows: system resolved by the device. */
const resolve = (mode: ThemeMode): 'light' | 'dark' =>
  mode === 'system' ? (matchMedia(darkQuery).matches ? 'dark' : 'light') : mode
/** Sets the theme on an element: data-theme takes light or dark, system resolved by
 * the device, and data-theme-mode keeps the choice. */
function apply(target: HTMLElement, mode: ThemeMode) {
  target.dataset.themeMode = mode
  target.dataset.theme = resolve(mode)
}

export type UseThemeModeOptions = {
  value?: ThemeMode
  /** The mode before anything is remembered or set on the target. */
  defaultValue?: ThemeMode
  onValueChange?: (mode: ThemeMode) => void
  /** Hears the theme that applies, light or dark, with the mode, on mount and
   * whenever it changes: by this switch, another one on the target, your own code
   * or the device in system. Such as for <meta name="theme-color">. */
  onThemeChange?: (theme: 'light' | 'dark', mode: ThemeMode) => void
  /** The element the theme applies to, such as a preview; the page's root element by
   * default. */
  target?: React.RefObject<HTMLElement | null>
  /** The storage key that remembers the choice while the switch keeps its own
   * state; false keeps it for the session. With value, your state remembers it. */
  persist?: string | false
  labels?: Partial<ThemeSwitchLabels>
}
/** The theme mode a switch drives, for a control of your own: the mode, the one a
 * step sets, choose() and the labels. It applies the mode as data-theme with the
 * theme crossfade, remembers it, and follows the device in system. */
export function useThemeMode({
  value,
  defaultValue = 'system',
  onValueChange,
  onThemeChange,
  target,
  persist = 'surflane-theme',
  labels,
}: UseThemeModeOptions = {}) {
  const provided = useLabels<ThemeSwitchLabels>('themeSwitch')
  const text: ThemeSwitchLabels = { ...themeLabels, ...provided, ...labels }
  const [own, setOwn] = React.useState<ThemeMode>(defaultValue)
  const mode = value ?? own
  const element = () => target?.current ?? document.documentElement
  // The remembered choice, or the one the target was served with, wins over the
  // default. The page's root syncs before paint; a target's ref attaches after its
  // descendants' layout effects, so a target syncs once it is there.
  const synced = React.useRef(false)
  const sync = () => {
    const node = target ? target.current : document.documentElement
    if (synced.current || value !== undefined || !node) return
    synced.current = true
    let saved: unknown
    try {
      saved = persist ? localStorage.getItem(persist) : undefined
    } catch {
      // Storage can be blocked; the target's own attribute still counts.
    }
    const found = isMode(saved) ? saved : node.dataset.themeMode
    if (isMode(found)) {
      setOwn(found)
      apply(node, found)
    }
  }
  // Only on mount: later changes come from choose().
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useLayoutEffect(sync, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(sync, [])
  // A controlled mode applies as it changes: at once on mount, then crossfading.
  const applied = React.useRef<ThemeMode | undefined>(undefined)
  React.useEffect(() => {
    if (value === undefined) return
    const first = applied.current === undefined
    applied.current = value
    if (first) apply(element(), value)
    else void transitionTheme(() => apply(element(), value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  // System follows the device as it changes.
  React.useEffect(() => {
    if (mode !== 'system') return
    const query = matchMedia(darkQuery)
    const follow = () => void transitionTheme(() => apply(element(), 'system'))
    query.addEventListener('change', follow)
    return () => query.removeEventListener('change', follow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])
  // The target is the record: another switch on it, the app's own code or the
  // device may change it, so every switch reads it back and the app hears the theme
  // that applies.
  const hear = React.useRef(onThemeChange)
  hear.current = onThemeChange
  const latest = React.useRef(mode)
  latest.current = mode
  React.useEffect(() => {
    const node = element()
    const report = () => {
      const found = node.dataset.themeMode
      const current = isMode(found) ? found : latest.current
      if (value === undefined && isMode(found)) setOwn(found)
      const shown = node.dataset.theme
      hear.current?.(
        shown === 'light' || shown === 'dark' ? shown : resolve(current),
        current,
      )
    }
    report()
    const observer = new MutationObserver(report)
    observer.observe(node, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-theme-mode'],
    })
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, value])
  const choose = (next: ThemeMode) => {
    if (next === mode) return
    if (value === undefined) {
      try {
        if (persist) localStorage.setItem(persist, next)
      } catch {
        // Storage can be blocked; the choice still holds for the session.
      }
      // The switch's own label changes in the same frame as the page, so the
      // crossfade carries both.
      void transitionTheme(() => {
        flushSync(() => setOwn(next))
        apply(element(), next)
      })
    }
    onValueChange?.(next)
  }
  const next = modes[(modes.indexOf(mode) + 1) % modes.length]
  return {
    mode,
    next,
    choose,
    icon: icons[mode],
    /** The step's name: the theme now and the one a press sets. */
    stepLabel: text.next(text[mode], text[next]),
    text,
  }
}

export type ThemeSwitchProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children' | 'defaultValue' | 'onChange'
> &
  UseThemeModeOptions & {
    /** cycle is one icon button that steps light, dark and system; group shows the
     * three side by side, with their names where they fit. */
    variant?: 'cycle' | 'group'
  }
/** Chooses light, dark or the device's setting, applies it as data-theme with the
 * theme crossfade and remembers it. System follows the device as it changes. In an
 * AppShell sidebar it is a row like the links, its name a tooltip on the rail; a
 * group there shows the three while the sidebar is expanded. */
export const ThemeSwitch = function ThemeSwitch({
  value,
  defaultValue,
  onValueChange,
  onThemeChange,
  variant = 'cycle',
  target,
  persist,
  labels,
  className,
  ref,
  ...props
}: ThemeSwitchProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { mode, next, choose, stepLabel, text } = useThemeMode({
    value,
    defaultValue,
    onValueChange,
    onThemeChange,
    target,
    persist,
    labels,
  })
  const shell = React.useContext(ShellContext)
  const inSidebar = React.useContext(SidebarContext)
  if (inSidebar && (variant === 'cycle' || shell?.collapsed))
    return (
      <AppShellLink
        render={<button type='button' onClick={() => choose(next)} />}
        icon={<Icon name={icons[mode]} />}
        label={`${text.label}: ${text[mode]}`}
        aria-label={stepLabel}
      />
    )

  if (variant === 'cycle') {
    const name = stepLabel
    return (
      <div
        {...props}
        ref={ref}
        className={cx('surf-theme-switch', className)}
        data-variant='cycle'
      >
        <Tooltip label={name}>
          <Button
            variant='ghost'
            size='icon'
            aria-label={name}
            onClick={() => choose(next)}
          >
            <Icon name={icons[mode]} />
          </Button>
        </Tooltip>
      </div>
    )
  }
  return (
    <div
      {...props}
      ref={ref}
      className={cx('surf-theme-switch', className)}
      data-variant='group'
    >
      <SegmentedControl.Root
        aria-label={text.label}
        width='fill'
        value={mode}
        onValueChange={(next) => isMode(next) && choose(next)}
      >
        {modes.map((item) => (
          <SegmentedControl.Item key={item} value={item}>
            <Icon name={icons[item]} />
            <span className='surf-theme-switch-name'>{text[item]}</span>
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
    </div>
  )
}
