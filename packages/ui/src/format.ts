/** Number formatting shared by every screen: one place decides the locale, the sign and
 * the precision of values, money, percentages and compact figures. Pass `locale` when
 * rendering on the server, so the client formats the same text. */
export type NumberFormatOptions = {
  /** A BCP 47 locale such as 'ko-KR'. Defaults to the runtime's. */
  locale?: string | string[]
  /** Digits after the decimal point: an exact count, or a [minimum, maximum] range. */
  precision?: number | readonly [number, number]
  /** Shows + before gains and − before losses. Zero stays unsigned. */
  signed?: boolean
  /** Shortens large values: 1.2K and 3.4M, or 1.2만 in Korean. */
  compact?: boolean
  /** Text for a missing value: null, undefined or a non-finite number. */
  missing?: string
}
/** The default text for a missing value. Zero is a value; missing is not. */
export const missingValue = '—'

const cache = new Map<string, Intl.NumberFormat>()
function formatter(
  locale: string | string[] | undefined,
  options: Intl.NumberFormatOptions,
) {
  const key = JSON.stringify([locale ?? null, options])
  let format = cache.get(key)
  if (!format) {
    format = new Intl.NumberFormat(locale, options)
    cache.set(key, format)
  }
  return format
}
function digits(precision: NumberFormatOptions['precision']) {
  if (precision === undefined) return {}
  const [minimumFractionDigits, maximumFractionDigits] =
    typeof precision === 'number' ? [precision, precision] : precision
  return { minimumFractionDigits, maximumFractionDigits }
}
function format(
  value: number | null | undefined,
  base: Intl.NumberFormatOptions,
  {
    locale,
    precision,
    signed,
    compact,
    missing = missingValue,
  }: NumberFormatOptions,
) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return missing
  return formatter(locale, {
    ...base,
    ...(compact ? { notation: 'compact' as const } : {}),
    ...(signed ? { signDisplay: 'exceptZero' as const } : {}),
    ...digits(precision),
  }).format(value)
}

/** A plain number: 1,234.5. */
export function formatNumber(
  value: number | null | undefined,
  options: NumberFormatOptions = {},
) {
  return format(value, {}, options)
}
/** An amount of money in an ISO 4217 currency: ₩1,200 or $12.50. The currency sets the
 * default precision. */
export function formatCurrency(
  value: number | null | undefined,
  currency: string,
  options: NumberFormatOptions = {},
) {
  return format(value, { style: 'currency', currency }, options)
}
/** A ratio as a percentage: 0.032 is 3.2%. Up to one decimal place unless `precision`
 * says otherwise. */
export function formatPercent(
  value: number | null | undefined,
  options: NumberFormatOptions = {},
) {
  return format(value, { style: 'percent' }, { precision: [0, 1], ...options })
}
