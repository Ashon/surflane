import React, { useState } from 'react'
import { Button, SizeProvider, type ComponentSize } from '@surflane/ui'
import { ComponentExample } from './ComponentExamples'
import { exampleOwnsFrame } from './exampleGroups'
import type { CatalogItem } from './catalog'
import { withBase } from './router'
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
  const [size, setSize] = useState<ComponentSize>('default')
  return (
    <>
      {item.kind === 'component' && (
        <div className='component-size-controls'>
          <div
            role='group'
            aria-label='Component preview size'
            className='component-size-options'
          >
            {componentSizes.map((value) => (
              <Button
                key={value}
                variant='ghost'
                aria-pressed={size === value}
                aria-label={`Preview size: ${sizeLabels[value]}`}
                onClick={() => setSize(value)}
              >
                {sizeLabels[value]}
              </Button>
            ))}
          </div>
          <p>
            Compare the same example at each size. Input values and selection
            state are preserved.{' '}
            <a href={withBase('/foundations/layout#component-sizes')}>
              Size guidelines and comparisons
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
