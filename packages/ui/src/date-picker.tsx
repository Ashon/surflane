'use client'
import * as React from 'react'
import { Icon } from './icon.js'
import {
  ComponentSizeContext,
  useComponentSize,
  type ComponentSize,
} from './sizing.js'
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
/** The names every other Surflane field takes. react-aria's spellings keep working. */
type FieldStates<Change> = {
  /** The field's and its calendar's size; without it, the surrounding SizeProvider's. */
  size?: ComponentSize
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  /** Marks the value invalid, as aria-invalid does on other fields. */
  invalid?: boolean
  onValueChange?: Change
  /** @deprecated Use `disabled`. Removed in a later minor. */
  isDisabled?: boolean
  /** @deprecated Use `readOnly`. Removed in a later minor. */
  isReadOnly?: boolean
  /** @deprecated Use `required`. Removed in a later minor. */
  isRequired?: boolean
  /** @deprecated Use `invalid`. Removed in a later minor. */
  isInvalid?: boolean
  /** @deprecated Use `onValueChange`. Removed in a later minor. */
  onChange?: Change
}
type PopupStates = {
  /** Whether the calendar is open, controlled. */
  open?: boolean
  /** @deprecated Use `open`. Removed in a later minor. */
  isOpen?: boolean
}
type AriaNames =
  | 'children'
  | 'isDisabled'
  | 'isReadOnly'
  | 'isRequired'
  | 'isInvalid'
  | 'isOpen'
  | 'onChange'
export type DatePickerProps<T extends DateValue> = Omit<
  AriaDatePickerProps<T>,
  AriaNames
> &
  FieldContent &
  CalendarContent &
  FieldStates<AriaDatePickerProps<T>['onChange']> &
  PopupStates
export type DateRangePickerProps<T extends DateValue> = Omit<
  AriaDateRangePickerProps<T>,
  AriaNames
> &
  FieldContent &
  CalendarContent &
  FieldStates<AriaDateRangePickerProps<T>['onChange']> &
  PopupStates
export type TimeFieldProps<T extends TimeValue> = Omit<
  AriaTimeFieldProps<T>,
  AriaNames
> &
  FieldContent &
  FieldStates<AriaTimeFieldProps<T>['onChange']>
/** Surflane's field names to react-aria's, the new spelling first. */
function ariaStates<Change>({
  size: _size,
  disabled,
  readOnly,
  required,
  invalid,
  onValueChange,
  isDisabled,
  isReadOnly,
  isRequired,
  isInvalid,
  onChange,
  open,
  isOpen,
}: FieldStates<Change> & PopupStates) {
  const opened = open ?? isOpen
  return {
    isDisabled: disabled ?? isDisabled,
    isReadOnly: readOnly ?? isReadOnly,
    isRequired: required ?? isRequired,
    isInvalid: invalid ?? isInvalid,
    onChange: onValueChange ?? onChange,
    ...(opened === undefined ? {} : { isOpen: opened }),
  }
}
const stateNames = [
  'size',
  'disabled',
  'readOnly',
  'required',
  'invalid',
  'onValueChange',
  'isDisabled',
  'isReadOnly',
  'isRequired',
  'isInvalid',
  'onChange',
  'open',
  'isOpen',
] as const
/** The props a react-aria field passes on, without the names ariaStates maps. */
function rest<Props extends object>(props: Props) {
  const copy = { ...props } as Record<string, unknown>
  for (const name of stateNames) delete copy[name]
  return copy as Omit<Props, (typeof stateNames)[number]>
}
/** An explicit size scopes the field and the calendar it opens. */
function SizedField({
  size,
  children,
}: {
  size?: ComponentSize
  children: (scheme: ReturnType<typeof useComponentSize>) => React.ReactNode
}) {
  const scheme = useComponentSize(size)
  return (
    <ComponentSizeContext.Provider value={scheme}>
      {children(size ? scheme : undefined)}
    </ComponentSizeContext.Provider>
  )
}

function Segments({ slot }: { slot?: 'start' | 'end' }) {
  return (
    <DateInput slot={slot} className='surf-date-input'>
      {(segment) => (
        <DateSegment segment={segment} className='surf-date-segment' />
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
        <Text slot='description' className='surf-field-description'>
          {description}
        </Text>
      )}
      <FieldError className='surf-field-error'>{errorMessage}</FieldError>
    </>
  )
}
function CalendarButton() {
  return (
    <Button className='surf-date-trigger'>
      <Icon name='calendar' />
    </Button>
  )
}
function CalendarContents() {
  const { locale } = useLocale()
  return (
    <>
      <div className='surf-calendar-header'>
        <Button slot='previous' className='surf-calendar-nav'>
          <Icon name='chevron-back' />
        </Button>
        <Heading className='surf-calendar-heading' />
        <Button slot='next' className='surf-calendar-nav'>
          <Icon name='chevron-forward' />
        </Button>
      </div>
      <CalendarGrid className='surf-calendar-grid' weekdayStyle='short'>
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className='surf-calendar-weekday'>
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell date={date} className='surf-calendar-day'>
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
      className='surf-date-popover'
      offset={8}
      placement='bottom start'
    >
      <Dialog aria-label={label} className='surf-date-dialog'>
        {range ? (
          <RangeCalendar className='surf-calendar'>
            <CalendarContents />
          </RangeCalendar>
        ) : (
          <Calendar className='surf-calendar'>
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
    <SizedField size={props.size}>
      {(scheme) => (
        <AriaDatePicker
          {...rest(props)}
          {...ariaStates(props)}
          data-ui-size={scheme}
          className={skin('surf-date-picker', className)}
        >
          <Label className='surf-field-label'>{label}</Label>
          <Group className='surf-date-group'>
            <Segments />
            <CalendarButton />
          </Group>
          <FieldHelp description={description} errorMessage={errorMessage} />
          <CalendarPopup label={calendarLabel ?? label} />
        </AriaDatePicker>
      )}
    </SizedField>
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
    <SizedField size={props.size}>
      {(scheme) => (
        <AriaDateRangePicker
          {...rest(props)}
          {...ariaStates(props)}
          data-ui-size={scheme}
          className={skin('surf-date-picker surf-date-range-picker', className)}
        >
          <Label className='surf-field-label'>{label}</Label>
          <Group className='surf-date-group'>
            <div className='surf-date-range-inputs'>
              <Segments slot='start' />
              <span aria-hidden='true' className='surf-date-range-separator'>
                –
              </span>
              <Segments slot='end' />
            </div>
            <CalendarButton />
          </Group>
          <FieldHelp description={description} errorMessage={errorMessage} />
          <CalendarPopup label={calendarLabel ?? label} range />
        </AriaDateRangePicker>
      )}
    </SizedField>
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
    <SizedField size={props.size}>
      {(scheme) => (
        <AriaTimeField
          {...rest(props)}
          {...ariaStates(props)}
          data-ui-size={scheme}
          className={skin('surf-time-field', className)}
        >
          <Label className='surf-field-label'>{label}</Label>
          <div className='surf-date-group'>
            <Segments />
          </div>
          <FieldHelp description={description} errorMessage={errorMessage} />
        </AriaTimeField>
      )}
    </SizedField>
  )
}
