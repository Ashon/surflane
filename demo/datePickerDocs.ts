import type { ComponentDoc } from './componentDocs'
export const datePickerDocs: Record<string, ComponentDoc> = {
  'date-picker': {
    usage:
      "Use it to enter a date, date range, or time in a locale format or to pick one from a calendar. It composes React Aria's segmented input, calendar grid, and range selection on the shared form surface. DateLocaleProvider sets the locale format, and the examples cover Korean, English, and RTL. Min/max, unavailable dates, required values, form submission, and reset are validated.",
    avoid:
      "Distinguish calendar dates (CalendarDate), local date-times (CalendarDateTime), instants (ZonedDateTime), and wall-clock times (Time). Don't convert date-only values to UTC midnight. Real execution times need an IANA time zone and an explicit DST policy; the examples reject ambiguous or nonexistent local times by default. Choosing earlier/later is an explicit user decision. This library doesn't replace Temporal or server-side schedule and permission validation. Keep immutable date objects and the same date type, and let the caller handle resetting controlled values.",
    keyboard:
      "Each date and time segment is a spinbutton. Tab/Shift+Tab and Left/Right move between segments; type digits, use Up/Down to increment and decrement, and use Home/End and Backspace/Delete to edit. Enter/Space on the calendar button opens the calendar; in the calendar, arrow keys move by day, PageUp/PageDown by month, and Shift+PageUp/PageDown by year. Enter/Space selects a date, or the start and end of a range. Escape closes the calendar and returns focus to the trigger. Disabled values can't be edited, and read-only values can be navigated and read but not changed. Popup collision avoidance and touch selection are supported.",
    anatomy:
      'DateLocaleProvider → DatePicker / DateRangePicker / TimeField → Label + Group + DateInput segments + calendar trigger → Popover + Dialog + Calendar/RangeCalendar → month navigation + weekday headers + grid cells; description + FieldError',
    tokens: [
      '--control-height',
      '--control-background',
      '--control-border',
      '--control-hover-border',
      '--control-focus',
      '--control-focus-background',
      '--radius-lg',
      '--radius-sm',
      '--selected',
      '--brand',
      '--on-brand',
      '--shadow-float',
      '--layer-popup',
    ],
    code: `import {
  DatePicker,
  DateRangePicker,
  TimeField,
  DateLocaleProvider,
} from '@surflane/ui'
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
    onChange={setDate}
    minValue={parseDate('2026-10-01')}
    maxValue={parseDate('2026-12-31')}
    isRequired
    description='October–December 2026'
  />
  <DateRangePicker
    label='Release window'
    startName='from'
    endName='to'
    value={range}
    onChange={setRange}
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
        'value / defaultValue / onChange',
        'CalendarDate, CalendarDateTime, ZonedDateTime; TimeField also accepts Time; range uses {start,end}',
        'controlled or uncontrolled',
      ],
      [
        'DateLocaleProvider.locale',
        'locale + optional calendar extension; field value retains its original calendar',
        'environment locale',
      ],
      [
        'minValue / maxValue / isDateUnavailable',
        'typed value bounds; unavailable callback for date/date-range; ranges cannot cross unavailable dates by default',
        'optional',
      ],
      [
        'name / startName / endName',
        'native ISO form values; range uses separate start/end names',
        'optional',
      ],
      [
        'isRequired / isInvalid / validate / validationBehavior',
        'required, caller/server error flag, custom validation; native submit validation or aria mode',
        'native',
      ],
      [
        'isDisabled / isReadOnly',
        'disabled prevents interaction; readonly preserves accessible value',
        'false',
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
        'calendarLabel / isOpen / onOpenChange',
        'calendar dialog name defaults to field label; controlled overlay supported',
        'label / uncontrolled',
      ],
      [
        'ref / className',
        'root div ref; string or upstream state render function',
        'optional',
      ],
    ],
  },
}
