// The number formatting every screen shares: locale, sign, precision and missing values.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  missingValue,
} from '@surflane/ui'

test('numbers follow the locale', () => {
  assert.equal(formatNumber(1234.5, { locale: 'en-US' }), '1,234.5')
  assert.equal(formatNumber(1234.5, { locale: 'de-DE' }), '1.234,5')
})

test('a missing value reads as missing, and zero is a value', () => {
  assert.equal(missingValue, '—')
  for (const value of [null, undefined, Number.NaN, Infinity])
    assert.equal(formatNumber(value), missingValue)
  assert.equal(formatNumber(undefined, { missing: 'n/a' }), 'n/a')
  assert.equal(formatNumber(0, { locale: 'en-US' }), '0')
})

test('signed values mark gains and losses, and zero stays unsigned', () => {
  assert.equal(formatPercent(0.05, { signed: true, locale: 'en-US' }), '+5%')
  assert.equal(formatPercent(-0.05, { signed: true, locale: 'en-US' }), '-5%')
  assert.equal(formatNumber(0, { signed: true, locale: 'en-US' }), '0')
})

test('precision takes an exact count or a range', () => {
  assert.equal(formatNumber(3.14159, { precision: 2, locale: 'en-US' }), '3.14')
  assert.equal(formatNumber(2, { precision: [0, 2], locale: 'en-US' }), '2')
  assert.equal(formatPercent(0.123, { locale: 'en-US' }), '12.3%')
})

test('compact figures shorten by the locale’s own units', () => {
  assert.equal(formatNumber(1200, { compact: true, locale: 'en-US' }), '1.2K')
  assert.equal(formatNumber(12000, { compact: true, locale: 'ko-KR' }), '1.2만')
})

test('currency places its symbol by locale', () => {
  assert.equal(formatCurrency(1200, 'KRW', { locale: 'ko-KR' }), '₩1,200')
  assert.equal(formatCurrency(12.5, 'USD', { locale: 'en-US' }), '$12.50')
})
