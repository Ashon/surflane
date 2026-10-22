'use client'
import * as React from 'react'
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset'
import { part } from './parts.js'

export const Fieldset = {
  ...BaseFieldset,
  Root: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseFieldset.Root>,
    React.ComponentPropsWithoutRef<typeof BaseFieldset.Root>
  >(BaseFieldset.Root, 'pui-fieldset'),
  Legend: /* @__PURE__ */ part<
    React.ComponentRef<typeof BaseFieldset.Legend>,
    React.ComponentPropsWithoutRef<typeof BaseFieldset.Legend>
  >(BaseFieldset.Legend, 'pui-fieldset-legend'),
}
// Flat names for React Server Components, which cannot dot into client exports.
export const { Legend: FieldsetLegend, Root: FieldsetRoot } = Fieldset
