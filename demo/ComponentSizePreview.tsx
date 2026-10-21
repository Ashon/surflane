import React, { useState } from 'react'
import { Button, SizeProvider, type ComponentSize } from '@surflane/ui'
import { ComponentExample } from './ComponentExamples'
import { exampleOwnsFrame } from './exampleGroups'
import type { CatalogItem } from './catalog'
import { withBase } from './router'
import { useLocale } from './i18n'
import { text } from './i18n/pages/ComponentSizePreview'
export const componentSizes = ['small', 'default', 'large'] as const
export const sizeLabels = {
  small: 'Small',
  default: 'Default',
  large: 'Large',
}
export function ComponentSizePreview({
  item,
  toggleTheme,
}: {
  item: CatalogItem
  toggleTheme: () => void
}) {
  const t = text[useLocale().locale]
  const [size, setSize] = useState<ComponentSize>('default')
  const labels = {
    small: t.sizeSmall,
    default: t.sizeDefault,
    large: t.sizeLarge,
  }
  return (
    <>
      {item.kind === 'component' && (
        <div className='component-size-controls'>
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
          </div>
          <p>
            {t.description}{' '}
            <a href={withBase('/foundations/layout#component-sizes')}>
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
        {item.kind === 'component' ? (
          <SizeProvider size={size}>
            <ComponentExample id={item.id} toggleTheme={toggleTheme} />
          </SizeProvider>
        ) : (
          <ComponentExample id={item.id} toggleTheme={toggleTheme} />
        )}
      </div>
    </>
  )
}
