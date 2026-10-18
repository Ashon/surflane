import React, { useEffect, useState } from 'react'
import { Button, CodeBlock, Dialog, Input, Sheet, Table } from '@surflane/ui'
import { Link } from './router'
import { EasingLab } from './EasingLab'
const tokens = [
  ['--motion-feedback', 'Short semantic feedback across the product'],
  ['--duration-fast', 'Selection control color, expand icon feedback'],
  ['--toast-enter-duration', 'Toast entry fade and lift'],
  ['--toast-stack-duration', 'Toast stack repositioning'],
  ['--toast-stack-ease', 'Toast stack deceleration curve'],
  ['--motion-reveal', 'Accordion / Collapsible expansion'],
  ['--dialog-enter-duration', 'Dialog entry'],
  ['--dialog-enter-offset', 'Dialog entry travel distance'],
  ['--dialog-exit-duration', 'Dialog exit'],
  ['--duration-base', 'Sheet / Drawer movement'],
  ['--theme-transition-duration', 'Theme scene transition'],
  ['--theme-transition-ease', 'Theme transition acceleration'],
]
function useMotionEnvironment() {
  const [environment, setEnvironment] = useState({
    reduced: false,
    supported: false,
    theme: '',
    values: {} as Record<string, string>,
  })
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      const css = getComputedStyle(document.documentElement)
      setEnvironment({
        reduced: media.matches,
        supported: typeof document.startViewTransition === 'function',
        theme: document.documentElement.dataset.theme ?? 'default',
        values: Object.fromEntries(
          tokens.map(([token]) => [token, css.getPropertyValue(token).trim()]),
        ),
      })
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    media.addEventListener('change', update)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', update)
    }
  }, [])
  return environment
}
export function MotionFoundation({ toggleTheme }: { toggleTheme: () => void }) {
  const environment = useMotionEnvironment()
  const [draft, setDraft] = useState('Platform API release')
  return (
    <>
      <nav className='page-toc' aria-label='On this page'>
        {[
          'principles',
          'transitions',
          'easing',
          'theme',
          'panels',
          'reduction',
          'application',
        ].map((id) => (
          <a key={id} href={`#${id}`}>
            {id[0].toUpperCase() + id.slice(1)}
          </a>
        ))}
      </nav>
      <section id='principles'>
        <h2>Motion has a purpose</h2>
        <p>
          Use motion only to explain a change in position, a change in state, or
          how screens connect. Don't add decorative bounces or looping playback.
          Never make the next interaction wait for an animation to finish.
        </p>
        <ul>
          <li>
            Dialog: fades in while rising from 8px below, and exits immediately.
          </li>
          <li>
            Sheet / Drawer: an edge slide that ties the entry direction to where
            the panel closes. CSS transitions are off during a direct Drawer
            swipe.
          </li>
          <li>
            Theme: the whole screen changes as one scene, so backgrounds,
            borders, and icons don't trail behind at different times.
          </li>
        </ul>
        <Table.Container label='Motion design tokens' orientation='horizontal'>
          <Table.Root>
            <Table.Caption>
              Motion tokens resolved for the current theme
            </Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>Token</Table.HeaderCell>
                <Table.HeaderCell scope='col'>Role</Table.HeaderCell>
                <Table.HeaderCell scope='col'>Resolved value</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {tokens.map(([token, role]) => (
                <Table.Row key={token}>
                  <Table.HeaderCell scope='row'>
                    <Link href={`/tokens?q=${encodeURIComponent(token)}`}>
                      <code>{token}</code>
                    </Link>
                  </Table.HeaderCell>
                  <Table.Cell>{role}</Table.Cell>
                  <Table.Cell data-motion-token={token}>
                    {environment.values[token] ?? 'Reading…'}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>
          The table shows design token values. With reduced motion on,
          components drop their transitions, so these values don't match real
          playback time.
        </p>
      </section>
      <EasingLab />
      <section id='transitions'>
        <h2>Transition contracts</h2>
        <p>
          Entry, exit, and repeated interactions don't share one fixed duration.
          An entrance explains the new context. Closing never makes the user
          wait to take the next action. Sheet and Drawer are the exception:
          their spatial relationship matters, so they move in both directions.
        </p>
        <Table.Container
          label='Component transition policies'
          orientation='horizontal'
        >
          <Table.Root>
            <Table.Caption>
              Transition rules tied to the actual styles
            </Table.Caption>
            <Table.Head>
              <Table.Row>
                {['Component', 'Entry / update', 'Exit', 'Behavior'].map(
                  (label) => (
                    <Table.HeaderCell key={label} scope='col'>
                      {label}
                    </Table.HeaderCell>
                  ),
                )}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {[
                [
                  'Dialog / Alert dialog',
                  environment.values['--dialog-enter-duration'],
                  environment.values['--dialog-exit-duration'],
                  'opacity + lift, with immediate close and focus restoration',
                ],
                [
                  'Sheet / Drawer',
                  environment.values['--duration-base'],
                  environment.values['--duration-base'],
                  'edge movement that follows the pointer directly during a gesture',
                ],
                [
                  'Accordion',
                  environment.values['--motion-reveal'],
                  environment.values['--motion-reveal'],
                  "opens and closes swapped panels with height + opacity, clipped so they don't overlap",
                ],
                [
                  'Collapsible',
                  environment.values['--motion-reveal'],
                  '0ms',
                  'expands with content preserved, and closes immediately',
                ],
                [
                  'Toast',
                  environment.values['--toast-enter-duration'],
                  '0ms',
                  'relaxed fade + lift, with important results kept in the page content',
                ],
                [
                  'Toast stack',
                  environment.values['--toast-stack-duration'],
                  '0ms',
                  'repositioning time, with cards expanding on hover, focus, and touch',
                ],
                [
                  'Theme',
                  environment.values['--theme-transition-duration'],
                  'same scene',
                  'one-scene snapshot transition that prevents stacked per-component transitions',
                ],
              ].map(([component, entry, exit, behavior]) => (
                <Table.Row key={component}>
                  <Table.HeaderCell scope='row'>{component}</Table.HeaderCell>
                  <Table.Cell>{entry ?? 'Reading…'}</Table.Cell>
                  <Table.Cell>{exit ?? 'Reading…'}</Table.Cell>
                  <Table.Cell>{behavior}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <p>
          Focus rings appear immediately. A running transition never blocks
          interaction. During rapid opening, closing, and theme changes, don't
          let stale timers overwrite the new state. Don't tie completion
          announcements to CSS transitionend. See{' '}
          <Link href='/foundations/interaction'>Interaction / states</Link> for
          real task states and duplicate-run prevention.
        </p>
        <p>
          The Toast primitive manages{' '}
          <Link href='/components/toast'>swipe, duration, and pause</Link>, and
          the Drawer primitive manages gestures. Don't reimplement this behavior
          with separate timers in examples or products. With reduced motion,
          these transitions drop their movement and fades. Names, focus, state,
          and close paths remain.
        </p>
      </section>
      <section id='theme'>
        <h2>One scene, one clock</h2>
        <p>
          The shared <code>transitionTheme</code> applies the DOM theme
          attribute and framework state in the same update. Where supported, it
          fades the new screen in over the old one and briefly suppresses
          individual CSS transitions. Rapid repeated changes follow the last
          request.
        </p>
        <ul aria-label='Current motion environment'>
          <li>
            Resolved theme:{' '}
            <strong data-motion-theme>{environment.theme}</strong>
          </li>
          <li>
            Reduced motion:{' '}
            <strong data-motion-preference>
              {environment.reduced ? 'Reduce' : 'No preference'}
            </strong>
          </li>
          <li>
            View Transitions API:{' '}
            <strong data-motion-support>
              {environment.supported ? 'Available' : 'Unavailable'}
            </strong>
          </li>
        </ul>
        <div className='actions'>
          <Button variant='outline' onClick={toggleTheme}>
            Cycle preview theme
          </Button>
        </div>
        <p>
          The cycle order is Light → Dark → System → Light. System follows the
          operating system setting. Without the API, or with reduced motion on,
          the whole theme applies immediately and works the same.
        </p>
      </section>
      <section id='panels'>
        <h2>Compare real panels</h2>
        <p>
          The examples below are the real shared Dialog and Sheet. Compare
          opening, Escape, closing, and focus restoration. Try changing the
          theme while a panel is open. The input draft is local state in this
          guide.
        </p>
        <div className='actions'>
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant='outline' />}>
              Open motion dialog
            </Dialog.Trigger>
            <Dialog.Content closeLabel='Close motion dialog'>
              <Dialog.Header>
                <Dialog.Title>Dialog motion preview</Dialog.Title>
                <Dialog.Description>
                  Check the short entrance and immediate exit. Changing the
                  theme keeps the draft and focus.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <label>
                  Preview draft
                  <Input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                </label>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant='ghost' onClick={toggleTheme}>
                  Cycle theme in dialog
                </Button>
                <Dialog.Close render={<Button variant='outline' />}>
                  Done
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
          <Sheet.Root side='right'>
            <Sheet.Trigger render={<Button variant='outline' />}>
              Open motion sheet
            </Sheet.Trigger>
            <Sheet.Content closeLabel='Close motion sheet'>
              <Sheet.Header>
                <Sheet.Title>Sheet motion preview</Sheet.Title>
                <Sheet.Description>
                  Compare the edge entry and exit with reduced motion on and
                  off.
                </Sheet.Description>
              </Sheet.Header>
              <Sheet.Body>
                <p>
                  Details open and close from the side, keeping their spatial
                  relationship. Real task submission and completion are
                  announced independently of the animation.
                </p>
                <Link className='pui-link' href='/components/sheet'>
                  Sheet usage and API
                </Link>
              </Sheet.Body>
              <Sheet.Footer>
                <Button variant='ghost' onClick={toggleTheme}>
                  Cycle theme in sheet
                </Button>
                <Sheet.Close render={<Button variant='outline' />}>
                  Done
                </Sheet.Close>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet.Root>
        </div>
        <p>
          See the <Link href='/components/drawer'>Drawer gesture example</Link>{' '}
          and{' '}
          <Link href='/components/accordion'>
            height transitions for expanding sections
          </Link>{' '}
          on their component pages.
        </p>
      </section>
      <section id='reduction'>
        <h2>Respect motion preferences</h2>
        <p>
          The guide follows the operating system or browser setting{' '}
          <code>prefers-reduced-motion: reduce</code>. This page adds no toggle
          to override it. Changing the setting updates both the environment
          readout above and the actual component behavior.
        </p>
        <ul>
          <li>
            Movement and transitions are removed from Dialog and panels.
            Opening, closing, keyboard, and focus restoration still work.
          </li>
          <li>
            The theme applies without the snapshot animation. Async task status
            and completion announcements don't depend on motion.
          </li>
          <li>
            Products that add continuous motion, auto-scrolling, or blinking
            need their own stop control and accessibility review.
          </li>
        </ul>
        <p>
          <a href='https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html'>
            W3C C39 — prefers-reduced-motion
          </a>
          {' / '}
          <a href='https://base-ui.com/react/handbook/animation'>
            Base UI — animation lifecycle
          </a>
        </p>
      </section>
      <section id='application'>
        <h2>Theme integration</h2>
        <p>
          Commit the React state and the DOM theme update synchronously inside
          the same shared function. Call the wrapper once per user action. Don't
          add per-screen transition timers.
        </p>
        <CodeBlock
          language='tsx'
          label='React theme integration'
          code={`import { flushSync } from 'react-dom'
import { transitionTheme } from '@surflane/design-tokens/theme-transition'
import '@surflane/design-tokens/motion.css'

// Resolve system mode before committing the theme.
await transitionTheme(() => {
  document.documentElement.dataset.theme = resolvedTheme
  flushSync(() => setMode(nextMode))
})`}
        />
        <p>
          The product restores the initial theme, saves the selected mode, and
          subscribes to OS changes. With server rendering and hydration, check
          separately that the first screen renders the matching theme. Check
          transitions and reduced motion in the browsers you support.
        </p>
        <div className='token-reference-links'>
          <Link href='/tokens?q=--motion'>Motion tokens</Link>
          <Link href='/foundations/color'>Color and contrast</Link>
          <Link href='/patterns/interaction-lab'>Interaction lab</Link>
        </div>
      </section>
    </>
  )
}
