'use client'
import * as React from 'react'
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group'
import { skin } from './parts.js'
import { useRootRef, useResetValue } from './form-state.js'
import { ChoiceResetPaint } from './choice.js'

export const CheckboxGroup = function CheckboxGroup({
  value,
  defaultValue = [],
  onValueChange,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseCheckboxGroup> & {
  ref?: React.Ref<React.ComponentRef<typeof BaseCheckboxGroup>>
}) {
  const [element, attach] = useRootRef<HTMLDivElement>(ref)
  const [selected, setSelected, revision] = useResetValue(
    value,
    defaultValue,
    element,
  )
  return (
    <ChoiceResetPaint.Provider value={revision}>
      <BaseCheckboxGroup
        {...props}
        ref={attach}
        value={selected}
        className={skin('surf-choice-group', className)}
        onValueChange={(next, event) => {
          onValueChange?.(next, event)
          if (value === undefined && !event.isCanceled) setSelected(next)
        }}
      />
    </ChoiceResetPaint.Provider>
  )
}
