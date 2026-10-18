'use client'
import * as React from 'react'
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
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.7'
        aria-hidden='true'
      >
        <rect x='3' y='5' width='18' height='16' rx='3' />
        <path d='M7 3v4m10-4v4M3 11h18m-12 4h2' />
      </svg>
    </Button>
  )
}
function CalendarContents() {
  const { locale } = useLocale()
  return (
    <>
      <div className='pui-calendar-header'>
        <Button slot='previous' className='pui-calendar-nav'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.7'
            aria-hidden='true'
          >
            <path d='m15 6-6 6 6 6' />
          </svg>
        </Button>
        <Heading className='pui-calendar-heading' />
        <Button slot='next' className='pui-calendar-nav'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.7'
            aria-hidden='true'
          >
            <path d='m9 6 6 6-6 6' />
          </svg>
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
              {({ formattedDate }) =>
                locale.startsWith('ko') ? `${formattedDate}일` : formattedDate
              }
            </CalendarCell>
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </>
  )
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
