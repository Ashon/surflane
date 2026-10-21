import { koreanCatalog, useLocale } from './i18n'
import { itemHref, stageLabels, type CatalogItem, type Stage } from './catalog'
// Catalog names, summaries, groups and stages in the reader's language.
export function useCatalogText() {
  const { locale } = useLocale()
  const ko = locale === 'ko' ? koreanCatalog() : undefined
  return {
    name: (item: CatalogItem) => ko?.names[itemHref(item)] || item.name,
    summary: (item: CatalogItem) =>
      ko?.summaries[itemHref(item)] || item.summary,
    group: (group: string) => ko?.groups[group] || group,
    stage: (stage: Stage) => ko?.stages[stage] ?? stageLabels[stage],
  }
}
