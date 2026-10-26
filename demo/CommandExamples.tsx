import React, { useState } from 'react'
import {
  Toggle,
  ToggleGroup,
  Toolbar,
  Menubar,
  Menu,
  Button,
  DirectionProvider,
  Icon,
  SegmentedControl,
} from '@surflane/ui'
import { Flag } from './Flag'
import { useLocale } from './i18n'
import { text } from './i18n/pages/CommandExamples'
export { commandExampleIds } from './exampleGroups'
function Glyph({ kind }: { kind: 'pin' | 'refresh' | 'list' | 'grid' }) {
  return <Icon name={kind} />
}
export function CommandExample({ id }: { id: string }) {
  const t = text[useLocale().locale]
  const [disabled, setDisabled] = useState(false),
    [vertical, setVertical] = useState(false),
    [rtl, setRtl] = useState(false),
    [cancel, setCancel] = useState(false),
    [pinned, setPinned] = useState(false),
    [timings, setTimings] = useState(true)
  const [source, setSource] = useState<string[]>(['live']),
    [visible, setVisible] = useState<string[]>(['requests', 'errors']),
    [passed, setPassed] = useState(true),
    [density, setDensity] = useState('comfortable')
  const [period, setPeriod] = useState('1m'),
    [side, setSide] = useState('buy'),
    [mood, setMood] = useState<string | null>(null)
  const [message, setMessage] = useState(t.noCommandExecuted)
  const flags = (
    <div className='actions'>
      <Flag checked={disabled} onChange={setDisabled}>
        {t.disableCommands}
      </Flag>
      {id !== 'toggle' && (
        <>
          {id !== 'segmented-control' && (
            <Flag checked={vertical} onChange={setVertical}>
              {t.verticalLayout}
            </Flag>
          )}
          <Flag checked={rtl} onChange={setRtl}>
            {t.rightToLeft}
          </Flag>
        </>
      )}
    </div>
  )
  let example: React.ReactNode
  if (id === 'toggle')
    example = (
      <>
        <div className='actions'>
          <Toggle
            disabled={disabled}
            onPressedChange={(pressed, event) => {
              if (cancel) {
                event.cancel()
                return
              }
              setMessage(pressed ? t.logsPinned : t.logsUnpinned)
            }}
          >
            <Glyph kind='pin' />
            {t.pinLogs}
          </Toggle>
          <Toggle
            pressed={timings}
            disabled={disabled}
            onPressedChange={(next, event) => {
              if (cancel) event.cancel()
              else setTimings(next)
            }}
          >
            {t.showTimings}
          </Toggle>
          <Toggle disabled>{t.unavailableMode}</Toggle>
        </div>
        <Button variant='outline' onClick={() => setCancel((v) => !v)}>
          {cancel ? t.allowChanges : t.cancelChanges}
        </Button>
        <p>{timings ? t.controlledTimingsShown : t.controlledTimingsHidden}</p>
      </>
    )
  else if (id === 'segmented-control')
    example = (
      <>
        {/* One period is always chosen. */}
        <SegmentedControl.Root
          aria-label={t.period}
          value={period}
          onValueChange={setPeriod}
          disabled={disabled}
        >
          {t.periods.map(([value, label]) => (
            <SegmentedControl.Item key={value} value={value}>
              {label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
        {/* fill shares a sheet's width between the two sides. */}
        <div className='segmented-preview-fill'>
          <SegmentedControl.Root
            aria-label={t.tradeSide}
            value={side}
            onValueChange={setSide}
            width='fill'
            disabled={disabled}
          >
            <SegmentedControl.Item value='buy'>{t.buy}</SegmentedControl.Item>
            <SegmentedControl.Item value='sell'>{t.sell}</SegmentedControl.Item>
          </SegmentedControl.Root>
        </div>
        {/* A filter: pressing the chosen one again shows everything. */}
        <SegmentedControl.Root
          aria-label={t.sentiment}
          required={false}
          value={mood}
          onValueChange={setMood}
          disabled={disabled}
        >
          {t.moods.map(([value, label]) => (
            <SegmentedControl.Item key={value} value={value}>
              {label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
        <p>{t.segmentedLine(period, side, mood ?? t.all)}</p>
      </>
    )
  else if (id === 'toggle-group')
    example = (
      <>
        <ToggleGroup
          aria-label={t.logSource}
          orientation={vertical ? 'vertical' : 'horizontal'}
          value={source}
          disabled={disabled}
          onValueChange={(next, event) => {
            if (cancel) event.cancel()
            else setSource(next)
          }}
        >
          <Toggle value='live'>{t.live}</Toggle>
          <Toggle value='simulation'>{t.simulation}</Toggle>
          <Toggle value='unavailable' disabled>
            {t.unavailable}
          </Toggle>
        </ToggleGroup>
        <ToggleGroup
          aria-label={t.visibleLogDetails}
          orientation={vertical ? 'vertical' : 'horizontal'}
          value={visible}
          multiple
          disabled={disabled}
          onValueChange={setVisible}
        >
          <Toggle value='requests'>{t.requests}</Toggle>
          <Toggle value='errors'>{t.errors}</Toggle>
          <Toggle value='timings'>{t.timings}</Toggle>
        </ToggleGroup>
        <Button variant='outline' onClick={() => setCancel((v) => !v)}>
          {cancel ? t.allowSourceChanges : t.cancelSourceChanges}
        </Button>
        <p>
          {t.sourceLine(
            source.join(', ') || t.none,
            visible.join(', ') || t.none,
          )}
        </p>
      </>
    )
  else if (id === 'toolbar')
    example = (
      <>
        <Toolbar.Root
          aria-label={t.runTools}
          orientation={vertical ? 'vertical' : 'horizontal'}
          disabled={disabled}
        >
          <Toolbar.Group>
            <Toolbar.Button onClick={() => setMessage(t.runListRefreshed)}>
              <Glyph kind='refresh' />
              {t.refresh}
            </Toolbar.Button>
            <Toolbar.Button
              render={<Toggle pressed={pinned} onPressedChange={setPinned} />}
            >
              <Glyph kind='pin' />
              {t.pinResults}
            </Toolbar.Button>
            <Toolbar.Button
              disabled
              onClick={() => setMessage(t.unavailableDeleteExecuted)}
            >
              {t.deleteRuns}
            </Toolbar.Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Input
            aria-label={t.filterServices}
            placeholder={t.searchServices}
            onChange={(e) => setMessage(t.toolFilter(e.target.value))}
          />
          <Menu.Root>
            <Toolbar.Button render={<Menu.Trigger />}>
              {t.moreActions}
            </Toolbar.Button>
            <Menu.Portal>
              <Menu.Content align='start'>
                <Menu.Item onClick={() => setMessage(t.logExportPreviewed)}>
                  {t.exportLogs}
                </Menu.Item>
                <Menu.Item disabled>{t.deleteEnvironment}</Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
          <Toolbar.Link href='#toolbar-help'>{t.toolbarHelp}</Toolbar.Link>
        </Toolbar.Root>
        <p>{t.pinnedResultsLine(pinned)}</p>
        <p id='toolbar-help'>{t.toolbarHelpNote}</p>
      </>
    )
  else
    example = (
      <>
        <Menubar
          key={vertical ? 'vertical' : 'horizontal'}
          aria-label={t.deploymentCommands}
          modal={false}
          orientation={vertical ? 'vertical' : 'horizontal'}
          disabled={disabled}
        >
          <Menu.Root>
            <Menu.Trigger>{t.run}</Menu.Trigger>
            <Menu.Portal>
              <Menu.Content align='start'>
                <Menu.Item
                  onClick={() => setMessage(t.newDeploymentPreviewPrepared)}
                >
                  {t.newPreview}
                </Menu.Item>
                <Menu.Item onClick={() => setMessage(t.logExportPreviewed)}>
                  {t.exportLogs}
                </Menu.Item>
                <Menu.Item disabled>{t.deleteRuns}</Menu.Item>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>{t.moreTools}</Menu.SubmenuTrigger>
                  <Menu.Portal>
                    <Menu.Content align='start'>
                      <Menu.Item
                        onClick={() => setMessage(t.packageValidationPreviewed)}
                      >
                        {t.validatePackage}
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger>{t.view}</Menu.Trigger>
            <Menu.Portal>
              <Menu.Content align='start'>
                <Menu.CheckboxItem checked={passed} onCheckedChange={setPassed}>
                  <Menu.CheckboxItemIndicator />
                  {t.showPassedChecks}
                </Menu.CheckboxItem>
                <Menu.Separator />
                <Menu.RadioGroup value={density} onValueChange={setDensity}>
                  <Menu.GroupLabel>{t.detailLevel}</Menu.GroupLabel>
                  <Menu.RadioItem value='compact'>
                    <Menu.RadioItemIndicator />
                    {t.compact}
                  </Menu.RadioItem>
                  <Menu.RadioItem value='comfortable'>
                    <Menu.RadioItemIndicator />
                    {t.comfortable}
                  </Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger>{t.help}</Menu.Trigger>
            <Menu.Portal>
              <Menu.Content align='start'>
                <Menu.LinkItem href='#command-help'>
                  {t.commandHelp}
                </Menu.LinkItem>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
        </Menubar>
        <p>{t.passedChecksLine(passed, density)}</p>
        <p id='command-help'>{t.commandHelpNote}</p>
      </>
    )
  return (
    <DirectionProvider direction={rtl ? 'rtl' : 'ltr'}>
      <div className='example-stack' dir={rtl ? 'rtl' : 'ltr'}>
        {flags}
        {example}
        <p role='status'>{message}</p>
      </div>
    </DirectionProvider>
  )
}
