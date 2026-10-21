import { useLocale } from './i18n'
import { itemHref, stageLabels, type CatalogItem, type Stage } from './catalog'
import { catalogKo } from './i18n/catalog.ko'
// Catalog names, summaries, groups and stages in the reader's language.
export function useCatalogText() {
  const { locale } = useLocale()
  const ko = locale === 'ko'
  return {
    name: (item: CatalogItem) =>
      (ko && catalogKo.names[itemHref(item)]) || item.name,
    summary: (item: CatalogItem) =>
      (ko && catalogKo.summaries[itemHref(item)]) || item.summary,
    group: (group: string) => (ko && catalogKo.groups[group]) || group,
    stage: (stage: Stage) =>
      ko ? catalogKo.stages[stage] : stageLabels[stage],
  }
}
