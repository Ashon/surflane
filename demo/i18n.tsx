import React, { createContext, useContext, useState } from 'react'
import { en, ko, type Messages } from './messages'

export type Locale = 'en' | 'ko'
export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
}
const messages: Record<Locale, Messages> = { en, ko }
// The boot script in index.html sets <html lang> from the cookie or the browser before paint.
export function documentLocale(): Locale {
  return document.documentElement.lang.startsWith('ko') ? 'ko' : 'en'
}
const LocaleContext = createContext<{
  locale: Locale
  setLocale: (next: Locale) => void
}>({ locale: 'en', setLocale: () => {} })
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState(documentLocale)
  const setLocale = (next: Locale) => {
    try {
      document.cookie = `surflane-locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
    } catch {
      // Storage restrictions must not prevent an in-session language change.
    }
    document.documentElement.lang = next
    setLocaleState(next)
  }
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}
export function useLocale(): {
  locale: Locale
  setLocale: (next: Locale) => void
} {
  return useContext(LocaleContext)
}
export function useMessages(): Messages {
  return messages[useLocale().locale]
}
// An English source value with an optional Korean override, for catalog data.
export function localized<T>(locale: Locale, source: T, ko: T | undefined): T {
  return locale === 'ko' && ko !== undefined ? ko : source
}
