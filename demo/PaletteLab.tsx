import React, {
  memo,
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
} from 'react'
import {
  Button,
  CodeBlock,
  Icon,
  Select,
  StatusBadge,
  Table,
  Toggle,
  ToggleGroup,
  type SelectGroup,
} from '@surflane/ui'
import { useLocale } from './i18n'
import { HueWheel } from './HueWheel'
import { SliderField } from './SliderField'
import {
  contrast,
  lightnessFor,
  linearToHex,
  maxChroma,
  oklch,
  parseOklch,
  simulate,
  toCss,
  toGamut,
  toHex,
  wrapHue,
  type Oklch,
  type Vision,
} from './oklch'
import {
  buildCategories,
  buildRamps,
  closestPair,
  evaluate,
  harmonyHues,
  harmonyOffsets,
  rampSteps,
  visions,
  type Guideline,
  type Harmony,
  type Step,
  type Verdict,
} from './palette'
import { text } from './i18n/pages/PaletteLab'

type Copy = (typeof text)['en']
type Theme = 'light' | 'dark'
type Slot = 'foreground' | 'background'
type Tokens = Record<Theme, Record<string, Oklch | null>>

const barHeights = [62, 88, 46, 74, 96, 54, 80, 66]
const tokenGroups = {
  text: [
    '--surf-ink',
    '--surf-ink-body',
    '--surf-ink-muted',
    '--surf-brand-ink',
    '--surf-on-brand',
  ],
  surfaces: [
    '--surf-canvas',
    '--surf-chrome',
    '--surf-surface',
    '--surf-selected',
    '--surf-code-bg',
  ],
  accents: [
    '--surf-brand',
    '--surf-status-danger-fg',
    '--surf-status-success-fg',
    '--surf-status-caution-fg',
    '--surf-status-info-fg',
    '--surf-status-danger-bg',
    '--surf-badge-info-bg',
    '--surf-chart-category-1',
  ],
}
const allTokens = Object.values(tokenGroups).flat()
const fixed = (value: number, digits = 2) => value.toFixed(digits)
const useCopy = () => text[useLocale().locale]

/** Reads each token as a scoped theme region resolves it, whatever the page theme. */
function readTokens(theme: Theme) {
  const probe = document.createElement('span')
  probe.dataset.theme = theme
  probe.hidden = true
  document.body.append(probe)
  const style = getComputedStyle(probe)
  const values = Object.fromEntries(
    allTokens.map((token) => [
      token,
      parseOklch(style.getPropertyValue(token)),
    ]),
  ) as Record<string, Oklch | null>
  probe.remove()
  return values
}

function Result({ verdict }: { verdict: Verdict }) {
  const t = useCopy()
  const tone = { pass: 'success', review: 'caution', fail: 'danger' } as const
  return <StatusBadge tone={tone[verdict]}>{t[verdict]}</StatusBadge>
}

/** How a guideline words what it measured. */
function measured(t: Copy, guideline: Guideline) {
  switch (guideline.criterion) {
    case 'textLight':
    case 'textDark':
      return t.stepsOf(guideline.steps)
    case 'gamut':
      return t.keeps(guideline.step, Math.round(guideline.kept * 100))
    case 'area':
      return t.chromaValue(fixed(guideline.chroma, 3))
    case 'status':
      return guideline.verdict === 'pass'
        ? t.noneNear
        : t.nearestStatus(
            Math.round(guideline.hue),
            Math.round(guideline.distance),
            t[guideline.status],
          )
    case 'accent':
      return t.ratioValue(fixed(guideline.ratio))
    case 'distinct':
    case 'cvd':
      return t.distanceValue(
        fixed(guideline.value, 3),
        t.visions[guideline.vision],
      )
    case 'visible':
      return t.weakestValue(guideline.index + 1, fixed(guideline.ratio))
  }
}

// The sections below are memoized: each renders again only when its own inputs
// change, and they read deferred copies of the wheel's values, so a drag on the
// wheel never waits for them.

const GuidelineTable = memo(function GuidelineTable({
  guidelines,
}: {
  guidelines: Guideline[]
}) {
  const t = useCopy()
  const passed = guidelines.filter(({ verdict }) => verdict === 'pass').length
  return (
    <section className='palette-section' aria-labelledby='palette-guideline'>
      <h3 id='palette-guideline'>{t.guidelineHeading}</h3>
      <p>{t.guidelineIntro}</p>
      <Table.Container label={t.guidelineLabel} orientation='horizontal'>
        <Table.Root density='compact' className='color-table'>
          <Table.Head>
            <Table.Row>
              {t.guidelineColumns.map((label) => (
                <Table.HeaderCell key={label} scope='col'>
                  {label}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {guidelines.map((guideline) => {
              const [name, rule] = t.criteria[guideline.criterion]
              return (
                <Table.Row
                  key={guideline.criterion}
                  data-palette-criterion={guideline.criterion}
                >
                  <Table.HeaderCell scope='row'>{name}</Table.HeaderCell>
                  <Table.Cell>{rule}</Table.Cell>
                  <Table.Cell>{measured(t, guideline)}</Table.Cell>
                  <Table.Cell data-palette-verdict={guideline.verdict}>
                    <Result verdict={guideline.verdict} />
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <p role='status'>{t.guidelineSummary(passed, guidelines.length)}</p>
    </section>
  )
})

const RampTable = memo(function RampTable({
  ramps,
  hues,
  ink,
  slot,
  onSlot,
  onPick,
}: {
  ramps: Step[][]
  hues: number[]
  ink: Oklch
  slot: Slot
  onSlot: (slot: Slot) => void
  onPick: (color: Oklch) => void
}) {
  const t = useCopy()
  const white = oklch(1, 0, 0)
  return (
    <section className='palette-section' aria-labelledby='palette-ramps'>
      <h3 id='palette-ramps'>{t.rampsHeading}</h3>
      <p>{t.rampsIntro}</p>
      <div className='palette-field palette-pick'>
        <span id='palette-slot'>{t.pickInto}</span>
        <ToggleGroup
          aria-labelledby='palette-slot'
          value={[slot]}
          onValueChange={(next) => next[0] && onSlot(next[0] as Slot)}
        >
          <Toggle value='foreground'>{t.foreground}</Toggle>
          <Toggle value='background'>{t.background}</Toggle>
        </ToggleGroup>
      </div>
      <Table.Container label={t.rampsLabel} orientation='horizontal'>
        <Table.Root density='compact' className='color-table palette-ramps'>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell scope='col'>{t.hueColumn}</Table.HeaderCell>
              {rampSteps.map(([name]) => (
                <Table.HeaderCell key={name} scope='col' align='center'>
                  {name}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {ramps.map((ramp, index) => (
              <Table.Row key={index}>
                <Table.HeaderCell scope='row'>
                  {Math.round(hues[index])}°
                </Table.HeaderCell>
                {ramp.map(({ name, color, clamped }) => (
                  <Table.Cell key={name} align='center'>
                    <Button
                      variant='ghost'
                      size='small'
                      className='palette-swatch'
                      data-clamped={clamped || undefined}
                      style={{
                        // The fill only: Button's hover and press layers stay.
                        backgroundColor: toHex(color),
                        color:
                          contrast(white, color) >= contrast(ink, color)
                            ? toHex(white)
                            : toHex(ink),
                      }}
                      aria-label={t.swatchLabel(
                        Math.round(color.h),
                        name,
                        toCss(color),
                        clamped,
                      )}
                      onClick={() => onPick(color)}
                    >
                      Aa
                    </Button>
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <p>{t.clampedLegend}</p>
    </section>
  )
})

const CategorySet = memo(function CategorySet({
  categories,
  theme,
  count,
  lightness,
  spread,
  vision,
  onCount,
  onLightness,
  onSpread,
  onVision,
}: {
  categories: Oklch[]
  theme: Theme
  count: number
  lightness: number
  spread: number
  vision: Vision
  onCount: (count: number) => void
  onLightness: (lightness: number) => void
  onSpread: (spread: number) => void
  onVision: (vision: Vision) => void
}) {
  const t = useCopy()
  const closest = useMemo(
    () => closestPair(categories, [vision]),
    [categories, vision],
  )
  return (
    <section className='palette-section' aria-labelledby='palette-categories'>
      <h3 id='palette-categories'>{t.categoriesHeading}</h3>
      <p>{t.categoriesIntro}</p>
      <div className='palette-controls'>
        <SliderField
          label={t.count}
          value={count}
          min={3}
          max={8}
          step={1}
          format={(value) => String(value)}
          onChange={onCount}
        />
        <SliderField
          label={t.lightness}
          value={lightness}
          min={0.4}
          max={0.9}
          step={0.01}
          format={(value) => fixed(value)}
          onChange={onLightness}
        />
        <SliderField
          label={t.spread}
          value={spread}
          min={0}
          max={0.08}
          step={0.01}
          format={(value) => `±${fixed(value)}`}
          onChange={onSpread}
        />
        <label className='palette-field'>
          {t.vision}
          <Select
            value={vision}
            onValueChange={(value) => onVision(value as Vision)}
            options={visions.map((name) => ({
              value: name,
              label: t.visions[name],
            }))}
          />
        </label>
      </div>
      <div
        className='palette-category-preview'
        data-theme={theme}
        role='img'
        aria-label={t.categoriesPreview(t.visions[vision])}
      >
        {categories.map((color, index) => (
          <span key={index} className='palette-category'>
            <span
              style={{
                blockSize: `${barHeights[index % barHeights.length]}%`,
                background: linearToHex(simulate(color, vision)),
              }}
            />
            <span>{index + 1}</span>
          </span>
        ))}
      </div>
      <p>
        {t.closestPair}: {t.pairText(closest.i + 1, closest.j + 1)},{' '}
        {t.distanceValue(fixed(closest.value, 3), t.visions[vision])}
      </p>
      <p>
        {t.distanceNote} {t.grayscaleNote}
      </p>
    </section>
  )
})

const ContrastChecker = memo(function ContrastChecker({
  tokens,
  theme,
  sources,
  custom,
  picked,
  onSources,
  onCustom,
}: {
  tokens: Tokens
  theme: Theme
  sources: Record<Slot, string>
  custom: Record<Slot, Oklch>
  picked: Record<Slot, Oklch | null>
  onSources: React.Dispatch<React.SetStateAction<Record<Slot, string>>>
  onCustom: React.Dispatch<React.SetStateAction<Record<Slot, Oklch>>>
}) {
  const t = useCopy()
  // Each slot resolves from a token, a picked swatch or its sliders.
  const resolve = (which: Slot): Oklch =>
    sources[which] === 'adjusted'
      ? custom[which]
      : sources[which] === 'picked'
        ? (picked[which] ?? custom[which])
        : (tokens[theme][sources[which]] ?? custom[which])
  const fg = toGamut(resolve('foreground'))
  const bg = toGamut(resolve('background'))
  const ratio = contrast(fg, bg)
  const adjust = (which: Slot, next: Oklch) => {
    onCustom((current) => ({ ...current, [which]: next }))
    onSources((current) => ({ ...current, [which]: 'adjusted' }))
  }
  const options = (which: Slot): SelectGroup[] => [
    ...(['text', 'surfaces', 'accents'] as const).map((group) => ({
      label: t.sourceGroups[group],
      options: tokenGroups[group].map((token) => ({
        value: token,
        label: <code>{token}</code>,
        disabled: !tokens[theme][token],
      })),
    })),
    {
      label: t.adjusted,
      options: [
        { value: 'picked', label: t.picked, disabled: !picked[which] },
        { value: 'adjusted', label: t.adjusted },
      ],
    },
  ]
  return (
    <section className='palette-section' aria-labelledby='palette-checker'>
      <h3 id='palette-checker'>{t.checkerHeading}</h3>
      <p>{t.checkerIntro}</p>
      <div className='palette-checker'>
        {(['foreground', 'background'] as const).map((which) => {
          const color = which === 'foreground' ? fg : bg
          const raw = resolve(which)
          return (
            <div
              key={which}
              className='palette-slot'
              role='group'
              aria-label={t[which]}
            >
              <div className='palette-slot-head'>
                <span
                  className='palette-slot-chip'
                  aria-hidden='true'
                  style={{ background: toCss(color) }}
                />
                <strong>{t[which]}</strong>
                <code>{toCss(color)}</code>
              </div>
              <label className='palette-field'>
                {t.source}
                <Select
                  value={sources[which]}
                  onValueChange={(value) =>
                    onSources((current) => ({ ...current, [which]: value }))
                  }
                  options={options(which)}
                />
              </label>
              <SliderField
                label={t.lightness}
                value={Number(fixed(color.l, 3))}
                min={0}
                max={1}
                step={0.005}
                format={(value) => fixed(value, 3)}
                onChange={(l) => adjust(which, { ...raw, l })}
              />
              <SliderField
                label={t.chroma}
                value={Number(fixed(color.c, 3))}
                min={0}
                max={0.3}
                step={0.005}
                format={(value) =>
                  `${fixed(value, 3)} / ${fixed(maxChroma(color.l, color.h), 3)}`
                }
                onChange={(c) => adjust(which, { ...raw, c })}
              />
              <SliderField
                label={t.hue}
                value={Math.round(color.h)}
                min={0}
                max={359}
                step={1}
                format={(value) => `${value}°`}
                onChange={(h) => adjust(which, { ...raw, h })}
              />
            </div>
          )
        })}
      </div>
      <div
        className='palette-preview'
        role='group'
        aria-label={t.previewLabel}
        style={{ background: toCss(bg), color: toCss(fg) }}
      >
        <p className='palette-ratio'>
          <span>{t.contrast}</span>
          <strong data-palette-ratio>{fixed(ratio)}:1</strong>
          <span>{t.lightnessGap(fixed(Math.abs(fg.l - bg.l)))}</span>
        </p>
        <p className='palette-sample-large'>{t.sampleLarge}</p>
        <p>{t.sampleBody}</p>
        <p className='palette-sample-mark'>
          <Icon name='check' size='large' />
          <span style={{ borderColor: toCss(fg) }} />
          {t.sampleIcon}
        </p>
      </div>
      <div className='palette-tables'>
        <Table.Container label={t.checksLabel} orientation='horizontal'>
          <Table.Root density='compact' className='color-table'>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col'>{t.use}</Table.HeaderCell>
                <Table.HeaderCell scope='col' numeric>
                  {t.minimum}
                </Table.HeaderCell>
                <Table.HeaderCell scope='col'>{t.result}</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {t.checks.map(([use, minimum]) => (
                <Table.Row key={use}>
                  <Table.HeaderCell scope='row'>{use}</Table.HeaderCell>
                  <Table.Cell numeric>{minimum}:1</Table.Cell>
                  <Table.Cell>
                    <StatusBadge tone={ratio >= minimum ? 'success' : 'danger'}>
                      {ratio >= minimum ? t.passes : t.fails}
                    </StatusBadge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <Table.Container label={t.suggestionsLabel} orientation='horizontal'>
          <Table.Root density='compact' className='color-table'>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell scope='col' numeric>
                  {t.target}
                </Table.HeaderCell>
                {/* The suggestion takes the spare width, so the targets sit by it. */}
                <Table.HeaderCell scope='col' style={{ inlineSize: '100%' }}>
                  {t.nearest}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {[3, 4.5, 7].map((target) => {
                const passes = ratio >= target
                const l = passes ? fg.l : lightnessFor(fg, bg, target)
                const next = l === null ? null : toGamut({ ...fg, l })
                return (
                  <Table.Row key={target}>
                    <Table.HeaderCell scope='row' numeric>
                      {target}:1
                    </Table.HeaderCell>
                    <Table.Cell>
                      {passes ? (
                        t.alreadyPasses
                      ) : next ? (
                        <span className='color-pair'>
                          <span
                            className='palette-slot-chip'
                            aria-hidden='true'
                            style={{ background: toCss(next) }}
                          />
                          <code>{toCss(next)}</code>
                          <Button
                            size='small'
                            variant='outline'
                            aria-label={t.applyLabel(target)}
                            onClick={() => adjust('foreground', next)}
                          >
                            {t.apply}
                          </Button>
                        </span>
                      ) : (
                        t.unreachable
                      )}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Root>
        </Table.Container>
      </div>
    </section>
  )
})

const PaletteExport = memo(function PaletteExport({ css }: { css: string }) {
  const t = useCopy()
  return (
    <section className='palette-section' aria-labelledby='palette-export'>
      <h3 id='palette-export'>{t.exportHeading}</h3>
      <CodeBlock language='css' label={t.exportLabel} code={css} />
    </section>
  )
})

export function PaletteLab() {
  const t = useCopy()
  const tokens = useMemo<Tokens>(
    () => ({ light: readTokens('light'), dark: readTokens('dark') }),
    [],
  )
  const [hue, setHue] = useState(210)
  const [chroma, setChroma] = useState(0.12)
  const [harmony, setHarmony] = useState<Harmony | 'custom'>('analogous')
  const [offsets, setOffsets] = useState(harmonyOffsets.analogous)
  const [wheelLightness, setWheelLightness] = useState(0.7)
  const [theme, setTheme] = useState<Theme>('light')
  const [count, setCount] = useState(6)
  const [bandLightness, setBandLightness] = useState(0.52)
  const [spread, setSpread] = useState(0.03)
  const [vision, setVision] = useState<Vision>('typical')
  const [slot, setSlot] = useState<Slot>('foreground')
  const [sources, setSources] = useState<Record<Slot, string>>({
    foreground: '--surf-ink-muted',
    background: '--surf-canvas',
  })
  const [custom, setCustom] = useState<Record<Slot, Oklch>>({
    foreground: oklch(0.38, 0.017, 248),
    background: oklch(1, 0, 0),
  })
  const [picked, setPicked] = useState<Record<Slot, Oklch | null>>({
    foreground: null,
    background: null,
  })

  const surfaces = useMemo(
    () => ({
      canvas: tokens[theme]['--surf-canvas'] ?? oklch(1, 0, 0),
      white: tokens.light['--surf-canvas'] ?? oklch(1, 0, 0),
      darkCanvas: tokens.dark['--surf-canvas'] ?? oklch(0.279, 0.013, 253),
      ink: tokens.light['--surf-ink'] ?? oklch(0.237, 0.01, 248),
    }),
    [tokens, theme],
  )
  const hues = harmonyHues(hue, offsets)

  // The wheel and its inputs follow every move; the sections read deferred copies.
  const deferredHue = useDeferredValue(hue)
  const deferredChroma = useDeferredValue(chroma)
  const deferredOffsets = useDeferredValue(offsets)
  const sectionHues = useMemo(
    () => harmonyHues(deferredHue, deferredOffsets),
    [deferredHue, deferredOffsets],
  )
  const ramps = useMemo(
    () => buildRamps(sectionHues, deferredChroma),
    [sectionHues, deferredChroma],
  )
  const categories = useMemo(
    () =>
      buildCategories({
        count,
        lightness: bandLightness,
        spread,
        chroma: deferredChroma,
        hue: deferredHue,
      }),
    [count, bandLightness, spread, deferredChroma, deferredHue],
  )
  const guidelines = useMemo(
    () =>
      evaluate({
        ramps,
        hues: sectionHues,
        hue: deferredHue,
        chroma: deferredChroma,
        categories,
        ...surfaces,
      }),
    [ramps, sectionHues, deferredHue, deferredChroma, categories, surfaces],
  )
  const css = useMemo(
    () =>
      [
        `/* ${harmony === 'custom' ? t.custom : t.harmonies[harmony]}, H ${deferredHue}, C ${fixed(deferredChroma, 3)} */`,
        ':root {',
        ...ramps.flatMap((ramp, index) =>
          ramp.map(
            ({ name, color }) =>
              `  --palette-${index + 1}-${name}: ${toCss(color)};`,
          ),
        ),
        ...categories.map(
          (color, index) =>
            `  --palette-category-${index + 1}: ${toCss(color)};`,
        ),
        '}',
      ].join('\n'),
    [t, harmony, deferredHue, deferredChroma, ramps, categories],
  )
  const pick = useCallback(
    (color: Oklch) => {
      setPicked((current) => ({ ...current, [slot]: color }))
      setSources((current) => ({ ...current, [slot]: 'picked' }))
    },
    [slot],
  )

  const sorted = [...hues].sort((a, b) => a - b)
  const gaps = sorted
    .map((h, index) => {
      const next = sorted[(index + 1) % sorted.length]
      return `${Math.round(wrapHue(next - h)) || 360}°`
    })
    .join(', ')
  return (
    <div className='palette-lab'>
      {/* The help leads the inputs, so the wheel and its sliders stay together on a
          phone. */}
      <div className='palette-inputs-block'>
        <p id='palette-wheel-help' className='palette-wheel-help'>
          {t.wheelHelp}
        </p>
        <div
          className='palette-inputs'
          role='group'
          aria-label={t.controlsLabel}
        >
          <div className='palette-wheel-panel'>
            <HueWheel
              lightness={wheelLightness}
              hue={hue}
              chroma={chroma}
              offsets={offsets}
              describedBy='palette-wheel-help'
              labels={{
                wheel: t.wheelLabel,
                base: t.baseMarker,
                support: t.supportMarker,
                value: t.markerValue,
              }}
              onBase={(nextHue, nextChroma) => {
                setHue(nextHue)
                setChroma(nextChroma)
              }}
              onOffset={(index, offset) => {
                setOffsets((current) =>
                  current.map((value, i) => (i === index ? offset : value)),
                )
                setHarmony('custom')
              }}
            />
            <p>{t.hues(hues.map((h) => `${Math.round(h)}°`).join(', '))}</p>
            {hues.length > 1 && <p>{t.gaps(gaps)}</p>}
          </div>
          <div className='palette-controls'>
            <SliderField
              label={t.chroma}
              value={chroma}
              min={0}
              max={0.3}
              step={0.005}
              format={(value) => fixed(value, 3)}
              onChange={setChroma}
            />
            <SliderField
              label={t.wheelLightness}
              value={wheelLightness}
              min={0.3}
              max={0.95}
              step={0.01}
              format={(value) => fixed(value)}
              onChange={setWheelLightness}
            />
            <label className='palette-field'>
              {t.harmony}
              <Select
                value={harmony}
                onValueChange={(value) => {
                  if (value === 'custom') return
                  setHarmony(value as Harmony)
                  setOffsets(harmonyOffsets[value as Harmony])
                }}
                options={[
                  ...(Object.keys(harmonyOffsets) as Harmony[]).map((name) => ({
                    value: name,
                    label: t.harmonies[name],
                  })),
                  {
                    value: 'custom',
                    label: t.custom,
                    disabled: harmony !== 'custom',
                  },
                ]}
              />
            </label>
            <div className='palette-field'>
              <span id='palette-theme'>{t.evaluateIn}</span>
              <ToggleGroup
                aria-labelledby='palette-theme'
                value={[theme]}
                onValueChange={(next) => {
                  const value = next[0] as Theme | undefined
                  if (!value) return
                  setTheme(value)
                  // Categories rise on dark: start each theme from its own band.
                  setBandLightness(value === 'light' ? 0.52 : 0.78)
                }}
              >
                <Toggle value='light'>{t.light}</Toggle>
                <Toggle value='dark'>{t.dark}</Toggle>
              </ToggleGroup>
            </div>
            <Button
              variant='outline'
              className='palette-action'
              onClick={() => {
                const brand = tokens.light['--surf-brand']
                if (!brand) return
                setHue(Math.round(brand.h))
                setChroma(Number(fixed(brand.c, 3)))
                setWheelLightness(Number(fixed(brand.l)))
              }}
            >
              {t.useBrand}
            </Button>
          </div>
        </div>
      </div>
      <GuidelineTable guidelines={guidelines} />
      <RampTable
        ramps={ramps}
        hues={sectionHues}
        ink={surfaces.ink}
        slot={slot}
        onSlot={setSlot}
        onPick={pick}
      />
      <CategorySet
        categories={categories}
        theme={theme}
        count={count}
        lightness={bandLightness}
        spread={spread}
        vision={vision}
        onCount={setCount}
        onLightness={setBandLightness}
        onSpread={setSpread}
        onVision={setVision}
      />
      <ContrastChecker
        tokens={tokens}
        theme={theme}
        sources={sources}
        custom={custom}
        picked={picked}
        onSources={setSources}
        onCustom={setCustom}
      />
      <PaletteExport css={css} />
    </div>
  )
}
