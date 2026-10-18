import React, { useRef, useState } from 'react'
import {
  Button,
  Checkbox,
  DateLocaleProvider,
  DatePicker,
  DateRangePicker,
  InlineMessage,
  NativeSelect,
  TimeField,
} from '@surflane/ui'
import {
  getDayOfWeek,
  parseDate,
  parseDateTime,
  parseZonedDateTime,
  Time,
  toZoned,
  toTimeZone,
  type CalendarDate,
  type CalendarDateTime,
  type ZonedDateTime,
} from '@internationalized/date'

const initialDate = () => parseDate('2026-10-20')
const initialRange = () => ({
  start: parseDate('2026-10-20'),
  end: parseDate('2026-10-23'),
})
const initialZoned = () => parseZonedDateTime('2026-10-20T09:00[Asia/Seoul]')
export function DatePickerExample() {
  const [locale, setLocale] = useState('en-US')
  const [disabled, setDisabled] = useState(false),
    [readOnly, setReadOnly] = useState(false),
    [weekends, setWeekends] = useState(false)
  const [date, setDate] = useState<CalendarDate | null>(initialDate)
  const [range, setRange] = useState<{
    start: CalendarDate
    end: CalendarDate
  } | null>(initialRange)
  const [zoned, setZoned] = useState<ZonedDateTime | null>(initialZoned)
  const [result, setResult] = useState('No local form submitted.')
  const [zone, setZone] = useState('America/New_York')
  const [wall, setWall] = useState<CalendarDateTime | null>(() =>
    parseDateTime('2026-11-01T01:30'),
  )
  const [policy, setPolicy] = useState<'reject' | 'earlier' | 'later'>('reject')
  const [resolved, setResolved] = useState<ZonedDateTime | null>(null),
    [zoneError, setZoneError] = useState('')
  const fieldRef = useRef<HTMLDivElement>(null)
  const minimum = parseDate('2026-10-01'),
    maximum = parseDate('2026-12-31')
  return (
    <div className='date-picker-example'>
      <div className='foundation-controls'>
        <label>
          Locale
          <NativeSelect
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            <option value='en-US'>English / United States</option>
            <option value='ko-KR'>Korean / South Korea</option>
            <option value='ar-EG-u-ca-gregory'>العربية / Gregorian</option>
          </NativeSelect>
        </label>
        <label className='pui-choice-label'>
          <Checkbox.Root checked={disabled} onCheckedChange={setDisabled}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          <span>Disable date controls</span>
        </label>
        <label className='pui-choice-label'>
          <Checkbox.Root checked={readOnly} onCheckedChange={setReadOnly}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          <span>Read only</span>
        </label>
        <label className='pui-choice-label'>
          <Checkbox.Root checked={weekends} onCheckedChange={setWeekends}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          <span>Unavailable weekends</span>
        </label>
      </div>
      <DateLocaleProvider locale={locale}>
        <div lang={locale} dir={locale.startsWith('ar') ? 'rtl' : 'ltr'}>
          <form
            className='pui-form'
            aria-label='Date and time preview'
            onSubmit={(event) => {
              event.preventDefault()
              setResult(
                JSON.stringify(
                  Object.fromEntries(new FormData(event.currentTarget)),
                ) + ` | zoned instant: ${zoned?.toAbsoluteString() ?? 'none'}`,
              )
            }}
            onReset={() => {
              setDate(initialDate())
              setRange(initialRange())
              setZoned(initialZoned())
              setResult(
                'Form reset. This example restores the controlled values.',
              )
            }}
          >
            <DatePicker
              ref={fieldRef}
              label='Run date'
              name='runDate'
              value={date}
              onChange={setDate}
              minValue={minimum}
              maxValue={maximum}
              isRequired
              isDisabled={disabled}
              isReadOnly={readOnly}
              isDateUnavailable={
                weekends
                  ? (value) => [0, 6].includes(getDayOfWeek(value, 'en-US'))
                  : undefined
              }
              description='October–December 2026. Enter segments or open the calendar.'
              errorMessage='Choose an available date between October 1 and December 31, 2026.'
            />
            <DateRangePicker
              label='Release window'
              startName='rangeStart'
              endName='rangeEnd'
              value={range}
              onChange={setRange}
              minValue={minimum}
              maxValue={maximum}
              isRequired
              isDisabled={disabled}
              isReadOnly={readOnly}
              isDateUnavailable={
                weekends
                  ? (value) => [0, 6].includes(getDayOfWeek(value, 'en-US'))
                  : undefined
              }
              description='Start and end are inclusive. Unavailable days cannot be crossed.'
              errorMessage='Choose an ordered, available date range within October–December 2026.'
            />
            <TimeField
              label='Start time'
              name='startTime'
              defaultValue={new Time(9, 30)}
              minValue={new Time(9)}
              maxValue={new Time(18)}
              hourCycle={24}
              isRequired
              isDisabled={disabled}
              isReadOnly={readOnly}
              description='09:00–18:00. Wall-clock time, with no assumed date or time zone.'
              errorMessage='Enter a time from 09:00 through 18:00.'
            />
            <DatePicker
              label='Zoned execution'
              name='execution'
              value={zoned}
              onChange={setZoned}
              granularity='minute'
              hourCycle={24}
              isDisabled={disabled}
              isReadOnly={readOnly}
              description='The time-zone abbreviation stays visible. Changing the display zone keeps the instant.'
            />
            <div className='actions'>
              <Button type='submit' disabled={disabled || readOnly}>
                Submit local dates
              </Button>
              <Button type='reset' variant='outline'>
                Reset local dates
              </Button>
              <Button
                variant='ghost'
                disabled={disabled || readOnly}
                onClick={() => setDate(null)}
              >
                Clear run date
              </Button>
              <Button
                variant='ghost'
                onClick={() =>
                  setZoned((value) =>
                    value
                      ? toTimeZone(
                          value,
                          value.timeZone === 'Asia/Seoul'
                            ? 'America/New_York'
                            : 'Asia/Seoul',
                        )
                      : null,
                  )
                }
              >
                Change display zone
              </Button>
            </div>
            <p role='status' aria-label='Date form result'>
              {result}
            </p>
            <p data-date-value>
              Run date: {date?.toString() ?? 'none'}; range:{' '}
              {range
                ? `${range.start.toString()} / ${range.end.toString()}`
                : 'none'}
            </p>
            <p data-zoned-value>
              {zoned?.toString() ?? 'No zoned date'}; instant:{' '}
              {zoned?.toAbsoluteString() ?? 'none'}
            </p>
          </form>
          <section
            className='pui-stack date-time-resolution'
            aria-labelledby='local-time-heading'
          >
            <h3 id='local-time-heading'>Resolve a local time explicitly</h3>
            <p>
              A calendar date isn't an instant. A local date and time needs an
              IANA zone. DST gaps and repeated times need a stated policy.
            </p>
            <div className='foundation-controls'>
              <label>
                Time zone
                <NativeSelect
                  value={zone}
                  onChange={(e) => {
                    setZone(e.target.value)
                    setResolved(null)
                    setZoneError('')
                  }}
                >
                  <option value='America/New_York'>America/New_York</option>
                  <option value='Asia/Seoul'>Asia/Seoul</option>
                </NativeSelect>
              </label>
              <label>
                DST disambiguation
                <NativeSelect
                  value={policy}
                  onChange={(e) => {
                    setPolicy(e.target.value as typeof policy)
                    setResolved(null)
                    setZoneError('')
                  }}
                >
                  <option value='reject'>Reject gaps and overlaps</option>
                  <option value='earlier'>Explicit earlier instant</option>
                  <option value='later'>Explicit later instant</option>
                </NativeSelect>
              </label>
            </div>
            <DatePicker
              label='Local wall time'
              value={wall}
              onChange={(value) => {
                setWall(value)
                setResolved(null)
                setZoneError('')
              }}
              granularity='minute'
              hourCycle={24}
              description='No time zone is assumed while editing these segments.'
            />
            <div className='actions'>
              <Button
                onClick={() => {
                  if (!wall) {
                    setZoneError('Enter a complete local date and time.')
                    return
                  }
                  try {
                    setResolved(toZoned(wall, zone, policy))
                    setZoneError('')
                  } catch {
                    setResolved(null)
                    setZoneError(
                      'This local time is skipped or occurs twice in this zone. Choose an explicit earlier or later policy, or another local time.',
                    )
                  }
                }}
              >
                Resolve local time
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setWall(parseDateTime('2026-11-01T01:30'))
                  setZone('America/New_York')
                  setResolved(null)
                  setZoneError('')
                }}
              >
                DST overlap
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setWall(parseDateTime('2026-03-08T02:30'))
                  setZone('America/New_York')
                  setResolved(null)
                  setZoneError('')
                }}
              >
                DST gap
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setWall(parseDateTime('2026-10-20T09:00'))
                  setResolved(null)
                  setZoneError('')
                }}
              >
                Normal local time
              </Button>
            </div>
            {zoneError && (
              <InlineMessage.Root tone='danger' role='alert'>
                <InlineMessage.Icon tone='danger' />
                <InlineMessage.Content>
                  <InlineMessage.Title>
                    Local time needs a decision
                  </InlineMessage.Title>
                  <InlineMessage.Description>
                    {zoneError}
                  </InlineMessage.Description>
                </InlineMessage.Content>
              </InlineMessage.Root>
            )}
            <p role='status' aria-label='Resolved local time'>
              {resolved
                ? `${resolved.toString()} | instant: ${resolved.toAbsoluteString()}`
                : 'No instant resolved.'}
            </p>
          </section>
        </div>
      </DateLocaleProvider>
    </div>
  )
}
