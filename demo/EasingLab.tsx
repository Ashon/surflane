import React, { useEffect, useRef, useState } from 'react'
import { Button, Field, NativeSelect, Slider, Table } from '@surflane/ui'
import { codeText } from './codeText'
import { useLocale } from './i18n'
import { text } from './i18n/pages/EasingLab'
function points(value: string): number[] | null {
  const match = value.match(/^cubic-bezier\(([^)]+)\)$/)
  return match ? match[1].split(',').map(Number) : null
}
// Solve x(u) = elapsed time before evaluating y(u); u itself is not time.
export function easedProgress(time: number, curve: number[] | null) {
  if (!curve || time <= 0 || time >= 1) return time
  const bezier = (u: number, a: number, b: number) =>
    3 * (1 - u) ** 2 * u * a + 3 * (1 - u) * u * u * b + u ** 3
  let low = 0,
    high = 1
  for (let i = 0; i < 30; i++) {
    const u = (low + high) / 2
    if (bezier(u, curve[0], curve[2]) < time) low = u
    else high = u
  }
  return bezier((low + high) / 2, curve[1], curve[3])
}
export function EasingLab() {
  const t = text[useLocale().locale]
  const roles: [string, string][] = [
    ['--surf-motion-ease', t.stateFeedback],
    ['--surf-motion-spatial-ease', t.dialogRise],
    ['--surf-toast-stack-ease', t.toastStack],
    ['--surf-ease-in', t.accelerationComparison],
    ['linear', t.linearComparison],
  ]
  const [role, setRole] = useState('--surf-motion-ease')
  const [duration, setDuration] = useState(200)
  const [easing, setEasing] = useState('linear')
  const [time, setTime] = useState(0)
  const [phase, setPhase] = useState<keyof typeof t.phaseLabels>('Ready')
  const [reduced, setReduced] = useState(false)
  const track = useRef<HTMLDivElement>(null)
  const marker = useRef<HTMLDivElement>(null)
  const animation = useRef<Animation | null>(null)
  const frame = useRef(0)
  const curve = points(easing)
  const progress = easedProgress(time / 100, curve)
  useEffect(() => {
    setEasing(
      role === 'linear'
        ? role
        : getComputedStyle(document.documentElement)
            .getPropertyValue(role)
            .trim(),
    )
  }, [role])
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const stage = track.current!,
      box = marker.current!
    function create() {
      cancelAnimationFrame(frame.current)
      animation.current?.cancel()
      const distance = Math.max(0, stage.clientWidth - box.offsetWidth)
      const next = box.animate(
        [
          { transform: 'translateX(0px)' },
          { transform: `translateX(${distance}px)` },
        ],
        { duration, easing, fill: 'both' },
      )
      next.pause()
      next.currentTime = 0
      animation.current = next
      setTime(0)
      setPhase('Ready')
    }
    create()
    const resize = new ResizeObserver(create)
    resize.observe(stage)
    return () => {
      resize.disconnect()
      cancelAnimationFrame(frame.current)
      animation.current?.cancel()
    }
  }, [duration, easing])
  useEffect(() => {
    if (reduced && animation.current?.playState === 'running') {
      cancelAnimationFrame(frame.current)
      animation.current.pause()
      animation.current.currentTime = duration
      setTime(100)
      setPhase('Completed without motion')
    }
  }, [reduced, duration])
  function seek(value: number) {
    cancelAnimationFrame(frame.current)
    if (animation.current) {
      animation.current.pause()
      animation.current.currentTime = (value / 100) * duration
    }
    setTime(value)
    setPhase(value === 0 ? 'Ready' : 'Paused at preview time')
  }
  function play() {
    const current = animation.current
    if (!current) return
    cancelAnimationFrame(frame.current)
    current.pause()
    current.currentTime = reduced ? duration : 0
    setTime(reduced ? 100 : 0)
    setPhase(reduced ? 'Completed without motion' : 'Playing')
    if (reduced) return
    current.play()
    function tick() {
      const elapsed = Math.min(
        100,
        (Number(current!.currentTime ?? 0) / duration) * 100,
      )
      setTime(elapsed)
      if (elapsed < 100) frame.current = requestAnimationFrame(tick)
      else setPhase('Completed')
    }
    frame.current = requestAnimationFrame(tick)
  }
  return (
    <>
      <p>{t.intro}</p>
      <div className='easing-controls'>
        <Field.Root>
          <Field.Label>{t.easingRole}</Field.Label>
          <NativeSelect
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            {roles.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </NativeSelect>
        </Field.Root>
        <Field.Root>
          <Field.Label>{t.previewDuration}</Field.Label>
          <NativeSelect
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
          >
            {[120, 200, 320, 420, 600].map((value) => (
              <option key={value} value={value}>
                {value}ms{value === 600 ? t.slowPreviewSuffix : ''}
              </option>
            ))}
          </NativeSelect>
        </Field.Root>
      </div>
      <p>
        <code data-easing-value>{easing}</code>,{' '}
        {reduced ? t.reducedMotionStatus : t.motionPreviewEnabled}
      </p>
      <div className='easing-visuals'>
        <svg
          viewBox='0 0 280 260'
          role='img'
          aria-labelledby='easing-graph-title easing-graph-description'
        >
          <title id='easing-graph-title'>{t.graphTitle}</title>
          <desc id='easing-graph-description'>{t.graphDescription}</desc>
          <path
            d='M40 20 V220 H240 M40 220 L240 20'
            fill='none'
            stroke='var(--surf-line)'
          />
          {curve && (
            <path
              d={`M40 220 L${40 + 200 * curve[0]} ${220 - 200 * curve[1]} M240 20 L${40 + 200 * curve[2]} ${220 - 200 * curve[3]}`}
              fill='none'
              stroke='var(--surf-ink-muted)'
              strokeDasharray='4 4'
            />
          )}
          <path
            d={
              curve
                ? `M40 220 C${40 + 200 * curve[0]} ${220 - 200 * curve[1]}, ${40 + 200 * curve[2]} ${220 - 200 * curve[3]}, 240 20`
                : 'M40 220 L240 20'
            }
            fill='none'
            stroke='var(--surf-brand-ink)'
            strokeWidth='3'
          />
          <circle
            cx={40 + 2 * time}
            cy={220 - 200 * progress}
            r='5'
            fill='var(--surf-ink)'
          />
          <text x='40' y='244'>
            0%
          </text>
          <text x='206' y='244'>
            {t.timeAxisLabel}
          </text>
          <text x='0' y='16'>
            100%
          </text>
        </svg>
        <div className='easing-playback'>
          <div ref={track} className='easing-track' aria-hidden='true'>
            <div ref={marker} className='easing-marker' />
          </div>
          <Slider.Root
            value={time}
            onValueChange={(value) =>
              seek(Array.isArray(value) ? value[0] : value)
            }
            min={0}
            max={100}
            step={1}
          >
            <Slider.Label>{t.previewTime}</Slider.Label>
            <Slider.Value>
              {(_, values) => `${Math.round(values[0])}%`}
            </Slider.Value>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb />
            </Slider.Control>
          </Slider.Root>
          <p data-easing-readout>
            {t.readout(time.toFixed(0), (progress * 100).toFixed(1))}
          </p>
          <div className='actions'>
            <Button onClick={play}>{t.playPreview}</Button>
            <Button variant='outline' onClick={() => seek(0)}>
              {t.resetPreview}
            </Button>
          </div>
          <p role='status' aria-label={t.playbackStatusLabel}>
            {t.phaseLabels[phase]}
          </p>
        </div>
      </div>
      <Table.Container bleed label={t.tableLabel} orientation='horizontal'>
        <Table.Root>
          <Table.Caption>{t.caption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>{t.elapsedTimeHeader}</Table.HeaderCell>
              <Table.HeaderCell>{t.movementProgressHeader}</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {[0, 0.25, 0.5, 0.75, 1].map((value) => (
              <Table.Row key={value}>
                <Table.Cell>{value * 100}%</Table.Cell>
                <Table.Cell>
                  {(easedProgress(value, curve) * 100).toFixed(1)}%
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <p>{codeText(t.curveRead)}</p>
      <p>{t.curveLimits}</p>
      <p>
        <a href='https://www.w3.org/TR/css-easing-1/'>{t.cssEasingLink}</a>
        {' / '}
        <a href='https://www.w3.org/TR/web-animations-1/'>
          {t.webAnimationsLink}
        </a>
      </p>
    </>
  )
}
