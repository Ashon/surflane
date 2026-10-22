'use client'
import * as React from 'react'
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group'
import { skin } from './parts.js'
import { useRootRef, useResetValue } from './form-state.js'
import { ChoiceResetPaint } from './choice.js'

export const CheckboxGroup = /* @__PURE__ */ React.forwardRef<
  React.ComponentRef<typeof BaseCheckboxGroup>,
  React.ComponentPropsWithoutRef<typeof BaseCheckboxGroup>
>(function CheckboxGroup(
  { value, defaultValue = [], onValueChange, className, ...props },
  ref,
) {
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
        className={skin('pui-choice-group', className)}
        onValueChange={(next, event) => {
          onValueChange?.(next, event)
          if (value === undefined && !event.isCanceled) setSelected(next)
        }}
      />
    </ChoiceResetPaint.Provider>
  )
})
