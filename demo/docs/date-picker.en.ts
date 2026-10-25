import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage:
    "Enter a date, date range, or time in a locale format, or pick one from a calendar. It composes React Aria's segmented input, calendar grid, and range selection on the shared form surface. DateLocaleProvider sets the locale format. The examples cover Korean, English, and RTL. Min and max, unavailable dates, required values, form submission, and reset are validated.",
  avoid: [
    "Don't interchange date types. Use CalendarDate for calendar dates, CalendarDateTime for local date-times, ZonedDateTime for instants, and Time for wall-clock times.",
    "Don't convert date-only values to UTC midnight. Keep them as CalendarDate.",
    "Don't store real execution times without an IANA time zone and an explicit DST policy.",
    "Don't pick earlier or later on the user's behalf for an ambiguous or nonexistent local time. By default, the examples reject these times.",
    "Don't treat this library as a replacement for Temporal or server-side schedule and permission validation.",
    "Don't mutate date objects or mix their types. Keep them immutable and of the same type.",
    "Don't expect form reset to restore controlled values. Reset them yourself in onReset.",
  ],
  keyboard: [
    'Tab, Shift+Tab, and the Left and Right arrow keys move between segments.',
    'Type digits to fill a segment. Up and Down increment and decrement it, and Home, End, Backspace, and Delete edit it.',
    'In the calendar, arrow keys move by day, and Page Up and Page Down move by month. Shift+Page Up and Shift+Page Down move by year.',
    'Enter or Space on the calendar button opens the calendar. In the calendar, Enter or Space selects a date, or the start and end of a range.',
    'Escape closes the calendar and returns focus to the trigger.',
    "Disabled values can't be edited. Read-only values can be navigated and read, but not changed.",
    'The popup avoids collisions, and touch selection works.',
    'Each date and time segment is a spinbutton.',
  ],
  anatomy:
    'DateLocaleProvider → DatePicker / DateRangePicker / TimeField → Label + Group + DateInput segments + calendar trigger → Popover + Dialog + Calendar/RangeCalendar → month navigation + weekday headers + grid cells; description + FieldError',
  tokens: [
    '--surf-control-height',
    '--surf-control-background',
    '--surf-control-border',
    '--surf-control-hover-border',
    '--surf-control-focus',
    '--surf-control-focus-background',
    '--surf-radius-lg',
    '--surf-radius-sm',
    '--surf-selected',
    '--surf-brand',
    '--surf-on-brand',
    '--surf-shadow-float',
    '--surf-layer-popup',
  ],
  code: `// Needs React Aria Components: npm install react-aria-components
import {
  DatePicker,
  DateRangePicker,
  TimeField,
  DateLocaleProvider,
} from '@surflane/ui/date-picker'
import {
  parseDate,
  parseDateTime,
  Time,
  toZoned,
} from '@internationalized/date'

<DateLocaleProvider locale='en-US'>
  <DatePicker
    label='Run date'
    name='runDate'
    value={date}
    onValueChange={setDate}
    minValue={parseDate('2026-10-01')}
    maxValue={parseDate('2026-12-31')}
    required
    description='October–December 2026'
  />
  <DateRangePicker
    label='Release window'
    startName='from'
    endName='to'
    value={range}
    onValueChange={setRange}
  />
  <TimeField
    label='Start time'
    name='time'
    defaultValue={new Time(9, 30)}
    hourCycle={24}
  />
</DateLocaleProvider>

// A local time is not an instant. Resolve explicitly and handle rejection.
try {
  const instant = toZoned(
    parseDateTime('2026-11-01T01:30'),
    'America/New_York',
    'reject',
  )
  console.log(instant.toAbsoluteString())
} catch {
  /* Ask for another time or an explicit earlier/later decision. */
}
// Controlled form reset: explicitly restore date/range state in onReset.`,
  props: [
    [
      'DatePicker / DateRangePicker / TimeField',
      'generic date/time value; label string is required',
      'named exports',
    ],
    [
      'value / defaultValue / onValueChange',
      'CalendarDate, CalendarDateTime, ZonedDateTime; TimeField also accepts Time; range uses {start,end}',
      'controlled or uncontrolled',
    ],
    [
      'DateLocaleProvider.locale',
      'locale + optional calendar extension; the field value keeps its original calendar',
      'environment locale',
    ],
    [
      'minValue / maxValue / isDateUnavailable',
      "typed value bounds; unavailable callback for date/date-range; by default, ranges can't cross unavailable dates",
      'optional',
    ],
    [
      'name / startName / endName',
      'native ISO form values; range uses separate start/end names',
      'optional',
    ],
    [
      'required / invalid / validate / validationBehavior',
      'required, caller/server error flag, custom validation; native submit validation or aria mode',
      'native',
    ],
    [
      'disabled / readOnly',
      'disabled prevents interaction; read-only keeps the accessible value',
      'false',
    ],
    [
      'size',
      "small | default | large: the field and its calendar; react-aria's isDisabled, isReadOnly, isRequired, isInvalid, isOpen and onChange still work and are deprecated",
      'surrounding size',
    ],
    [
      'description / errorMessage',
      'associated help and validation errors; error can render ValidationResult',
      'optional',
    ],
    [
      'granularity / hourCycle / hideTimeZone',
      'day/hour/minute/second; 12 or 24; keep zone visible for zoned values',
      'value / locale / false',
    ],
    [
      'calendarLabel / open / onOpenChange',
      'calendar dialog name defaults to field label; controlled overlay supported',
      'label / uncontrolled',
    ],
    [
      'ref / className',
      'root div ref; string or upstream state render function',
      'optional',
    ],
  ],
}
