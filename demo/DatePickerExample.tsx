import React, { useRef, useState } from 'react'
import {
  Button,
  Checkbox,
  InlineMessage,
  NativeSelect,
  ChoiceLabel,
} from '@surflane/ui'
import {
  DateLocaleProvider,
  DatePicker,
  DateRangePicker,
  TimeField,
} from '@surflane/ui/date-picker'
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
import { useLocale } from './i18n'
import { text } from './i18n/pages/DatePickerExample'

const initialDate = () => parseDate('2026-10-20')
const initialRange = () => ({
  start: parseDate('2026-10-20'),
  end: parseDate('2026-10-23'),
})
const initialZoned = () => parseZonedDateTime('2026-10-20T09:00[Asia/Seoul]')
export function DatePickerExample() {
  const t = text[useLocale().locale]
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
  const [result, setResult] = useState(t.noLocalFormSubmitted)
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
          {t.locale}
          <NativeSelect
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            <option value='en-US'>English / United States</option>
            <option value='ko-KR'>Korean / South Korea</option>
            <option value='ar-EG-u-ca-gregory'>العربية / Gregorian</option>
          </NativeSelect>
        </label>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={disabled} onCheckedChange={setDisabled}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.disableDateControls}
        </ChoiceLabel>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={readOnly} onCheckedChange={setReadOnly}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.readOnly}
        </ChoiceLabel>
        <ChoiceLabel
          control={
            <Checkbox.Root checked={weekends} onCheckedChange={setWeekends}>
              <Checkbox.Indicator />
            </Checkbox.Root>
          }
        >
          {t.unavailableWeekends}
        </ChoiceLabel>
      </div>
      <DateLocaleProvider locale={locale}>
        <div lang={locale} dir={locale.startsWith('ar') ? 'rtl' : 'ltr'}>
          {/* A native form: the date fields take part in the browser's own
              validation, which Form, built for Field, turns off. */}
          <form
            className='date-native-form'
            aria-label={t.dateTimePreview}
            onSubmit={(event) => {
              event.preventDefault()
              setResult(
                JSON.stringify(
                  Object.fromEntries(new FormData(event.currentTarget)),
                ) + ` | ${t.zonedInstant(zoned?.toAbsoluteString() ?? t.none)}`,
              )
            }}
            onReset={() => {
              setDate(initialDate())
              setRange(initialRange())
              setZoned(initialZoned())
              setResult(t.formReset)
            }}
          >
            <DatePicker
              ref={fieldRef}
              label={t.runDate}
              name='runDate'
              value={date}
              onValueChange={setDate}
              minValue={minimum}
              maxValue={maximum}
              required
              disabled={disabled}
              readOnly={readOnly}
              isDateUnavailable={
                weekends
                  ? (value) => [0, 6].includes(getDayOfWeek(value, 'en-US'))
                  : undefined
              }
              description={t.runDateDescription}
              errorMessage={t.runDateError}
            />
            <DateRangePicker
              label={t.releaseWindow}
              startName='rangeStart'
              endName='rangeEnd'
              value={range}
              onValueChange={setRange}
              minValue={minimum}
              maxValue={maximum}
              required
              disabled={disabled}
              readOnly={readOnly}
              isDateUnavailable={
                weekends
                  ? (value) => [0, 6].includes(getDayOfWeek(value, 'en-US'))
                  : undefined
              }
              description={t.releaseWindowDescription}
              errorMessage={t.releaseWindowError}
            />
            <TimeField
              label={t.startTime}
              name='startTime'
              defaultValue={new Time(9, 30)}
              minValue={new Time(9)}
              maxValue={new Time(18)}
              hourCycle={24}
              required
              disabled={disabled}
              readOnly={readOnly}
              description={t.startTimeDescription}
              errorMessage={t.startTimeError}
            />
            <DatePicker
              label={t.zonedExecution}
              name='execution'
              value={zoned}
              onValueChange={setZoned}
              granularity='minute'
              hourCycle={24}
              disabled={disabled}
              readOnly={readOnly}
              description={t.zonedExecutionDescription}
            />
            <div className='actions'>
              <Button type='submit' disabled={disabled || readOnly}>
                {t.submitLocalDates}
              </Button>
              <Button type='reset' variant='outline'>
                {t.resetLocalDates}
              </Button>
              <Button
                variant='ghost'
                disabled={disabled || readOnly}
                onClick={() => setDate(null)}
              >
                {t.clearRunDate}
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
                {t.changeDisplayZone}
              </Button>
            </div>
            <p role='status' aria-label={t.dateFormResult}>
              {result}
            </p>
            <p data-date-value>
              {t.runDateStatus(
                date?.toString() ?? t.none,
                range
                  ? `${range.start.toString()} / ${range.end.toString()}`
                  : t.none,
              )}
            </p>
            <p data-zoned-value>
              {t.zonedValueStatus(
                zoned?.toString() ?? t.noZonedDate,
                zoned?.toAbsoluteString() ?? t.none,
              )}
            </p>
          </form>
          <section
            className='date-time-resolution'
            aria-labelledby='local-time-heading'
          >
            <h3 id='local-time-heading'>{t.resolveLocalTimeHeading}</h3>
            <p>{t.resolveLocalTimeIntro}</p>
            <div className='foundation-controls'>
              <label>
                {t.timeZone}
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
                {t.dstDisambiguation}
                <NativeSelect
                  value={policy}
                  onChange={(e) => {
                    setPolicy(e.target.value as typeof policy)
                    setResolved(null)
                    setZoneError('')
                  }}
                >
                  <option value='reject'>{t.rejectGapsOverlaps}</option>
                  <option value='earlier'>{t.explicitEarlierInstant}</option>
                  <option value='later'>{t.explicitLaterInstant}</option>
                </NativeSelect>
              </label>
            </div>
            <DatePicker
              label={t.localWallTime}
              value={wall}
              onChange={(value) => {
                setWall(value)
                setResolved(null)
                setZoneError('')
              }}
              granularity='minute'
              hourCycle={24}
              description={t.localWallTimeDescription}
            />
            <div className='actions'>
              <Button
                onClick={() => {
                  if (!wall) {
                    setZoneError(t.enterCompleteLocalDateTime)
                    return
                  }
                  try {
                    setResolved(toZoned(wall, zone, policy))
                    setZoneError('')
                  } catch {
                    setResolved(null)
                    setZoneError(t.dstAmbiguousError)
                  }
                }}
              >
                {t.resolveLocalTime}
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
                {t.dstOverlap}
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
                {t.dstGap}
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setWall(parseDateTime('2026-10-20T09:00'))
                  setResolved(null)
                  setZoneError('')
                }}
              >
                {t.normalLocalTime}
              </Button>
            </div>
            {zoneError && (
              <InlineMessage.Root tone='danger' role='alert'>
                <InlineMessage.Icon tone='danger' />
                <InlineMessage.Content>
                  <InlineMessage.Title>
                    {t.localTimeNeedsDecision}
                  </InlineMessage.Title>
                  <InlineMessage.Description>
                    {zoneError}
                  </InlineMessage.Description>
                </InlineMessage.Content>
              </InlineMessage.Root>
            )}
            <p role='status' aria-label={t.resolvedLocalTime}>
              {resolved
                ? t.resolvedInstantStatus(
                    resolved.toString(),
                    resolved.toAbsoluteString(),
                  )
                : t.noInstantResolved}
            </p>
          </section>
        </div>
      </DateLocaleProvider>
    </div>
  )
}
