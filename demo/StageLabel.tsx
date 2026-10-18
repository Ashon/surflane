import React from 'react'
import { Badge } from '@surflane/ui'
import { stageLabels, type CatalogItem } from './catalog'
export function StageLabel({ item }: { item: CatalogItem }) {
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
      {stageLabels[item.stage]}
    </Badge>
  )
}
