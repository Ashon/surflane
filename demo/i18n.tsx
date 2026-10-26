import React, { createContext, useContext, useEffect } from 'react'
import { LabelsProvider } from '@surflane/ui/labels'
import { en, type Messages } from './messages'
import { switchLocale, urlLocale, useUrlLocale, type Locale } from './router'

export type { Locale }
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
// The URL names the language: Korean pages live under /ko.
export function documentLocale(): Locale {
  return urlLocale()
}
const LocaleContext = createContext<{
  locale: Locale
  setLocale: (next: Locale) => void
}>({ locale: 'en', setLocale: () => {} })
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useUrlLocale()
  // History can move between languages too; <html lang> follows the URL.
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  // The cookie keeps the choice: the boot script sends an English URL to Korean then.
  const setLocale = (next: Locale) => {
    const apply = () => {
      try {
        document.cookie = `surflane-locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
      } catch {
        // Storage restrictions must not prevent an in-session language change.
      }
      switchLocale(next)
    }
    if (next === 'ko') void loadKorean().then(apply)
    else apply()
  }
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {/* Components write their own names and messages in the page's language. */}
      <LabelsProvider
        labels={locale === 'ko' ? korean?.componentLabels : undefined}
      >
        {children}
      </LabelsProvider>
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
