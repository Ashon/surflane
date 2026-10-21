import React, { createContext, useContext, useState } from 'react'
import { en, type Messages } from './messages'

export type Locale = 'en' | 'ko'
export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
}
let korean: typeof import('./i18n/ko') | undefined
// Korean text ships in its own chunk. The locale switches to Korean only after it loads.
export function loadKorean() {
  return korean
    ? Promise.resolve(korean)
    : import('./i18n/ko').then((bundle) => (korean = bundle))
}
export function koreanCatalog() {
  return korean?.catalogKo
}
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
    const apply = () => {
      try {
        document.cookie = `surflane-locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
      } catch {
        // Storage restrictions must not prevent an in-session language change.
      }
      document.documentElement.lang = next
      setLocaleState(next)
    }
    if (next === 'ko') void loadKorean().then(apply)
    else apply()
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
  return useLocale().locale === 'ko' && korean ? korean.messages : en
}
// An English source value with an optional Korean override, for catalog data.
export function localized<T>(locale: Locale, source: T, ko: T | undefined): T {
  return locale === 'ko' && ko !== undefined ? ko : source
}
