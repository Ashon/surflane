import React from 'react'
import { Badge } from '@surflane/ui'
import { type CatalogItem } from './catalog'
import { useCatalogText } from './catalogText'
export function StageLabel({ item }: { item: CatalogItem }) {
  const text = useCatalogText()
  return (
    <Badge
      className='catalog-stage'
      data-stage={item.stage}
      tone={
        item.stage === 'available'
          ? 'success'
          : item.stage === 'primitive'
            ? 'caution'
            : 'neutral'
      }
    >
      {text.stage(item.stage)}
    </Badge>
  )
}
