'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import { useComponentSize } from './sizing.js'
import {
  DatePicker as AriaDatePicker,
  DateInput,
  DateSegment,
  Group,
  Label,
  Text,
  FieldError,
  Calendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarCell,
  Button,
  Popover,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
  type ValidationResult,
} from 'react-aria-components/DatePicker'
import {
  DateRangePicker as AriaDateRangePicker,
  RangeCalendar,
  type DateRangePickerProps as AriaDateRangePickerProps,
} from 'react-aria-components/DateRangePicker'
import {
  TimeField as AriaTimeField,
  type TimeFieldProps as AriaTimeFieldProps,
  type TimeValue,
} from 'react-aria-components/TimeField'
import { Heading } from 'react-aria-components/Heading'
import { Dialog } from 'react-aria-components/Dialog'
import { skin } from './parts.js'
import { useLocale } from 'react-aria-components/I18nProvider'
export { I18nProvider as DateLocaleProvider } from 'react-aria-components/I18nProvider'
export type { DateValue, TimeValue }

type FieldContent = {
  label: string
  description?: React.ReactNode
  errorMessage?:
    React.ReactNode | ((validation: ValidationResult) => React.ReactNode)
  ref?: React.Ref<HTMLDivElement>
}
type CalendarContent = { calendarLabel?: string }
export type DatePickerProps<T extends DateValue> = Omit<
  AriaDatePickerProps<T>,
  'children'
> &
  FieldContent &
  CalendarContent
export type DateRangePickerProps<T extends DateValue> = Omit<
  AriaDateRangePickerProps<T>,
  'children'
> &
  FieldContent &
  CalendarContent
export type TimeFieldProps<T extends TimeValue> = Omit<
  AriaTimeFieldProps<T>,
  'children'
> &
  FieldContent

function Segments({ slot }: { slot?: 'start' | 'end' }) {
  return (
    <DateInput slot={slot} className='pui-date-input'>
      {(segment) => (
        <DateSegment segment={segment} className='pui-date-segment' />
      )}
    </DateInput>
  )
}
function FieldHelp({
  description,
  errorMessage,
}: Pick<FieldContent, 'description' | 'errorMessage'>) {
  return (
    <>
      {description && (
        <Text slot='description' className='pui-field-description'>
          {description}
        </Text>
      )}
      <FieldError className='pui-field-error'>{errorMessage}</FieldError>
    </>
  )
}
function CalendarButton() {
  return (
    <Button className='pui-date-trigger'>
      <Icon name='calendar' />
    </Button>
  )
}
function CalendarContents() {
  const { locale } = useLocale()
  return (
    <>
      <div className='pui-calendar-header'>
        <Button slot='previous' className='pui-calendar-nav'>
          <Icon name='chevron-back' />
        </Button>
        <Heading className='pui-calendar-heading' />
        <Button slot='next' className='pui-calendar-nav'>
          <Icon name='chevron-forward' />
        </Button>
      </div>
      <CalendarGrid className='pui-calendar-grid' weekdayStyle='short'>
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className='pui-calendar-weekday'>
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell date={date} className='pui-calendar-day'>
              {({ formattedDate }) => {
                const [before, after] = dayAffixes(locale)
                return `${before}${formattedDate}${after}`
              }}
            </CalendarCell>
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </>
  )
}
// The words a locale writes around a day number, such as 일 in Korean or 日 in
// Japanese. react-aria gives the number alone.
const affixes = new Map<string, readonly [string, string]>()
function dayAffixes(locale: string) {
  let pair = affixes.get(locale)
  if (!pair) {
    const parts = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      timeZone: 'UTC',
    }).formatToParts(Date.UTC(2026, 0, 1))
    const day = parts.findIndex((part) => part.type === 'day')
    const join = (list: Intl.DateTimeFormatPart[]) =>
      list.map((part) => part.value).join('')
    pair = [join(parts.slice(0, day)), join(parts.slice(day + 1))] as const
    affixes.set(locale, pair)
  }
  return pair
}
function CalendarPopup({ label, range }: { label: string; range?: boolean }) {
  const scheme = useComponentSize()
  return (
    <Popover
      data-ui-size={scheme}
      className='pui-date-popover'
      offset={8}
      placement='bottom start'
    >
      <Dialog aria-label={label} className='pui-date-dialog'>
        {range ? (
          <RangeCalendar className='pui-calendar'>
            <CalendarContents />
          </RangeCalendar>
        ) : (
          <Calendar className='pui-calendar'>
            <CalendarContents />
          </Calendar>
        )}
      </Dialog>
    </Popover>
  )
}
/** Locale-aware segmented entry with a keyboard and touch calendar. DateValue
 * retains calendar/time-zone semantics; conversion to an instant is caller-owned. */
export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  calendarLabel,
  className,
  ...props
}: DatePickerProps<T>) {
  return (
    <AriaDatePicker {...props} className={skin('pui-date-picker', className)}>
      <Label className='pui-field-label'>{label}</Label>
      <Group className='pui-date-group'>
        <Segments />
        <CalendarButton />
      </Group>
      <FieldHelp description={description} errorMessage={errorMessage} />
      <CalendarPopup label={calendarLabel ?? label} />
    </AriaDatePicker>
  )
}
export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  calendarLabel,
  className,
  ...props
}: DateRangePickerProps<T>) {
  return (
    <AriaDateRangePicker
      {...props}
      className={skin('pui-date-picker pui-date-range-picker', className)}
    >
      <Label className='pui-field-label'>{label}</Label>
      <Group className='pui-date-group'>
        <div className='pui-date-range-inputs'>
          <Segments slot='start' />
          <span aria-hidden='true' className='pui-date-range-separator'>
            –
          </span>
          <Segments slot='end' />
        </div>
        <CalendarButton />
      </Group>
      <FieldHelp description={description} errorMessage={errorMessage} />
      <CalendarPopup label={calendarLabel ?? label} range />
    </AriaDateRangePicker>
  )
}
export function TimeField<T extends TimeValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: TimeFieldProps<T>) {
  return (
    <AriaTimeField {...props} className={skin('pui-time-field', className)}>
      <Label className='pui-field-label'>{label}</Label>
      <div className='pui-date-group'>
        <Segments />
      </div>
      <FieldHelp description={description} errorMessage={errorMessage} />
    </AriaTimeField>
  )
}
