import React, { useState } from 'react'
import {
  Button,
  SizeProvider,
  type ComponentSize,
  type TableDensity,
} from '@surflane/ui'
import { ComponentExample } from './ComponentExamples'
import { exampleOwnsFrame } from './exampleGroups'
import type { CatalogItem } from './catalog'
import { routeHref } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ComponentSizePreview'
import { PreviewDensityContext } from './previewOptions'
export const componentSizes = ['small', 'default', 'large'] as const
export const sizeLabels = {
  small: 'Small',
  default: 'Default',
  large: 'Large',
}
// Patterns built from sized components get the same handle as component pages.
const sizedPatterns = new Set(['data-table'])
// Examples whose tables follow the density chosen in the handle.
const densityExamples = new Set(['data-table'])
const densities = ['default', 'compact'] as const
export function ComponentSizePreview({
  item,
  toggleTheme,
}: {
  item: CatalogItem
  toggleTheme: () => void
}) {
  const t = text[useLocale().locale]
  const [size, setSize] = useState<ComponentSize>('default')
  const [density, setDensity] = useState<TableDensity>('default')
  const labels = {
    small: t.sizeSmall,
    default: t.sizeDefault,
    large: t.sizeLarge,
  }
  const densityLabels = {
    default: t.densityDefault,
    compact: t.densityCompact,
  }
  const sized = item.kind === 'component' || sizedPatterns.has(item.id)
  const withDensity = densityExamples.has(item.id)
  // With two groups, each shows its name, so their Default buttons tell apart.
  const named = (label: string, group: React.ReactNode) =>
    withDensity ? (
      <div className='component-size-group'>
        <span aria-hidden='true'>{label}</span>
        {group}
      </div>
    ) : (
      group
    )
  const example = <ComponentExample id={item.id} toggleTheme={toggleTheme} />
  return (
    <>
      {sized && (
        <div className='component-size-controls'>
          {named(
            t.sizeName,
            <div
              role='group'
              aria-label={t.groupLabel}
              className='component-size-options'
            >
              {componentSizes.map((value) => (
                <Button
                  key={value}
                  variant='ghost'
                  aria-pressed={size === value}
                  aria-label={t.previewSize(labels[value])}
                  onClick={() => setSize(value)}
                >
                  {labels[value]}
                </Button>
              ))}
            </div>,
          )}
          {withDensity &&
            named(
              t.densityName,
              <div
                role='group'
                aria-label={t.densityGroupLabel}
                className='component-size-options'
              >
                {densities.map((value) => (
                  <Button
                    key={value}
                    variant='ghost'
                    aria-pressed={density === value}
                    aria-label={t.previewDensity(densityLabels[value])}
                    onClick={() => setDensity(value)}
                  >
                    {densityLabels[value]}
                  </Button>
                ))}
              </div>,
            )}
          <p>
            {withDensity ? t.descriptionDensity : t.description}{' '}
            <a href={routeHref('/foundations/layout#component-sizes')}>
              {t.sizeGuidance}
            </a>
          </p>
        </div>
      )}
      <div
        className={
          exampleOwnsFrame(item.id)
            ? 'catalog-example-container'
            : 'catalog-example-frame'
        }
        data-kind={item.kind}
        data-preview-size={size}
      >
        {sized ? (
          <SizeProvider size={size}>
            <PreviewDensityContext.Provider value={density}>
              {example}
            </PreviewDensityContext.Provider>
          </SizeProvider>
        ) : (
          example
        )}
      </div>
    </>
  )
}
