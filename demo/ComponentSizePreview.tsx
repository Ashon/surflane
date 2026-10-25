import React, { useState } from 'react'
import {
  Button,
  SizeProvider,
  type ComponentSize,
  type TableDensity,
  type TableVariant,
  Toggle,
  ToggleGroup,
} from '@surflane/ui'
import { ComponentExample } from './ComponentExamples'
import { exampleOwnsFrame } from './exampleGroups'
import type { CatalogItem } from './catalog'
import { routeHref } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ComponentSizePreview'
import {
  PreviewDensityContext,
  PreviewTableVariantContext,
} from './previewOptions'
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
// Examples whose tables follow the style chosen in the handle.
const styleExamples = new Set(['table', 'data-table'])
const variants = ['plain', 'lined', 'grid', 'striped'] as const
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
  const [variant, setVariant] = useState<TableVariant>('plain')
  const labels = {
    small: t.sizeSmall,
    default: t.sizeDefault,
    large: t.sizeLarge,
  }
  const densityLabels = {
    default: t.densityDefault,
    compact: t.densityCompact,
  }
  const variantLabels = {
    plain: t.stylePlain,
    lined: t.styleLined,
    grid: t.styleGrid,
    striped: t.styleStriped,
  }
  const sized = item.kind === 'component' || sizedPatterns.has(item.id)
  const withDensity = densityExamples.has(item.id)
  const withStyle = styleExamples.has(item.id)
  // With two groups, each shows its name, so their Default buttons tell apart.
  const named = (label: string, group: React.ReactNode) =>
    withDensity || withStyle ? (
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
            <ToggleGroup
              aria-label={t.groupLabel}
              className='component-size-options'
              value={[size]}
              onValueChange={(next) => next[0] && setSize(next[0])}
            >
              {componentSizes.map((value) => (
                <Toggle
                  key={value}
                  value={value}
                  aria-label={t.previewSize(labels[value])}
                >
                  {labels[value]}
                </Toggle>
              ))}
            </ToggleGroup>,
          )}
          {withDensity &&
            named(
              t.densityName,
              <ToggleGroup
                aria-label={t.densityGroupLabel}
                className='component-size-options'
                value={[density]}
                onValueChange={(next) => next[0] && setDensity(next[0])}
              >
                {densities.map((value) => (
                  <Toggle
                    key={value}
                    value={value}
                    aria-label={t.previewDensity(densityLabels[value])}
                  >
                    {densityLabels[value]}
                  </Toggle>
                ))}
              </ToggleGroup>,
            )}
          {withStyle &&
            named(
              t.styleName,
              <ToggleGroup
                aria-label={t.styleGroupLabel}
                className='component-size-options'
                value={[variant]}
                onValueChange={(next) => next[0] && setVariant(next[0])}
              >
                {variants.map((value) => (
                  <Toggle
                    key={value}
                    value={value}
                    aria-label={t.previewStyle(variantLabels[value])}
                  >
                    {variantLabels[value]}
                  </Toggle>
                ))}
              </ToggleGroup>,
            )}
          <p>
            {withDensity
              ? t.descriptionDensity
              : withStyle
                ? t.descriptionStyle
                : t.description}{' '}
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
              <PreviewTableVariantContext.Provider value={variant}>
                {example}
              </PreviewTableVariantContext.Provider>
            </PreviewDensityContext.Provider>
          </SizeProvider>
        ) : (
          example
        )}
      </div>
    </>
  )
}
