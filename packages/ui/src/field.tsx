'use client'
import * as React from 'react'
import { Field as BaseField } from '@base-ui/react/field'
import { part } from './parts.js'

const FieldRoot = /* @__PURE__ */ part<
  React.ComponentRef<typeof BaseField.Root>,
  React.ComponentPropsWithoutRef<typeof BaseField.Root>
>(BaseField.Root, 'pui-field')
const FieldLabel = /* @__PURE__ */ part<
  React.ComponentRef<typeof BaseField.Label>,
  React.ComponentPropsWithoutRef<typeof BaseField.Label>
>(BaseField.Label, 'pui-field-label')
const FieldControl = /* @__PURE__ */ part<
  React.ComponentRef<typeof BaseField.Control>,
  React.ComponentPropsWithoutRef<typeof BaseField.Control>
>(BaseField.Control, 'pui-input')
const FieldDescription = /* @__PURE__ */ part<
  React.ComponentRef<typeof BaseField.Description>,
  React.ComponentPropsWithoutRef<typeof BaseField.Description>
>(BaseField.Description, 'pui-field-description')
const FieldError = /* @__PURE__ */ part<
  React.ComponentRef<typeof BaseField.Error>,
  React.ComponentPropsWithoutRef<typeof BaseField.Error>
>(BaseField.Error, 'pui-field-error')
const FieldItem = /* @__PURE__ */ part<
  React.ComponentRef<typeof BaseField.Item>,
  React.ComponentPropsWithoutRef<typeof BaseField.Item>
>(BaseField.Item, 'pui-field-item')
export const Field = {
  ...BaseField,
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
  Item: FieldItem,
}
// Flat names for React Server Components, which cannot dot into client exports.
export {
  FieldControl,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
  FieldRoot,
}
export const { Validity: FieldValidity } = Field
