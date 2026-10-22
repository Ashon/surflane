import React from 'react'
import { LayoutPreview } from './LayoutFoundation'
import { TypeScale, TypeSpecimens } from './TypographyFoundation'
import { useLocale } from './i18n'
import { text as layoutText } from './i18n/pages/LayoutFoundation'
import { text as typographyText } from './i18n/pages/TypographyFoundation'

/** The foundation lab's layout and type previews, without the pages' guidance. */
export function FoundationLab() {
  const { locale } = useLocale()
  return (
    <>
      <section aria-labelledby='layout-title' id='layout'>
        <h2 id='layout-title'>{layoutText[locale].labTitle}</h2>
        <LayoutPreview />
      </section>
      <section aria-labelledby='typography-title' id='typography'>
        <h2 id='typography-title'>{typographyText[locale].labTitle}</h2>
        <TypeSpecimens />
        <TypeScale />
      </section>
    </>
  )
}
