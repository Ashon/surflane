"use client";
import * as React from "react";
import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { Combobox } from "./advanced-forms.js";
import { skin, part } from "./parts.js";
import { useResetValue, useRootRef } from "./form-state.js";
const AutocompleteRoot: typeof BaseAutocomplete.Root =
  function AutocompleteRoot({
    children,
    form,
    value,
    defaultValue,
    onValueChange,
    ...props
  }: React.ComponentProps<typeof BaseAutocomplete.Root>) {
    const anchor = React.useRef<HTMLSpanElement>(null);
    const [query, setQuery, revision] = useResetValue(
      value,
      defaultValue ?? "",
      anchor,
      form,
    );
    return (
      <BaseAutocomplete.Root
        key={revision}
        {...props}
        form={form}
        value={query}
        onValueChange={(next, event) => {
          onValueChange?.(next, event);
          if (value === undefined && !event.isCanceled) setQuery(next);
        }}
      >
        <span hidden ref={anchor} />
        {children}
      </BaseAutocomplete.Root>
    );
  };
const AutoTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Trigger>
>(function AutoTrigger({ className, children, ...props }, ref) {
  return (
    <BaseAutocomplete.Trigger
      aria-label="Show suggestions"
      {...props}
      ref={ref}
      className={skin("pui-combobox-action", className)}
    >
      {children ?? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      )}
    </BaseAutocomplete.Trigger>
  );
});
const AutoClear = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Clear>
>(function AutoClear(props, ref) {
  return <Combobox.Clear aria-label="Clear input" {...props} ref={ref} />;
});
export const Autocomplete = {
  ...BaseAutocomplete,
  Root: AutocompleteRoot,
  Content: Combobox.Content,
  Popup: Combobox.Popup,
  Positioner: Combobox.Positioner,
  Input: Combobox.Input,
  List: Combobox.List,
  Empty: Combobox.Empty,
  Status: Combobox.Status,
  Group: Combobox.Group,
  GroupLabel: Combobox.GroupLabel,
  Clear: AutoClear,
  Trigger: AutoTrigger,
  InputGroup: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseAutocomplete.InputGroup>
  >(BaseAutocomplete.InputGroup, "pui-combobox-group"),
  Item: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Item>
  >(BaseAutocomplete.Item, "pui-combobox-item"),
  Separator: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Separator>
  >(BaseAutocomplete.Separator, "pui-combobox-separator"),
};
function SliderRoot<Value extends number | readonly number[]>({
  value,
  defaultValue,
  onValueChange,
  ref,
  className,
  form,
  thumbAlignment = "edge",
  ...props
}: BaseSlider.Root.Props<Value> & { ref?: React.Ref<HTMLDivElement> }) {
  const [element, attach] = useRootRef(ref);
  const [selected, setSelected] = useResetValue(
    value,
    (defaultValue ?? props.min ?? 0) as Value,
    element,
    form,
  );
  return (
    <BaseSlider.Root<Value>
      {...props}
      form={form}
      ref={attach}
      value={selected}
      thumbAlignment={thumbAlignment}
      className={skin("pui-slider", className)}
      onValueChange={(next, event) => {
        onValueChange?.(next, event);
        if (value === undefined && !event.isCanceled)
          setSelected(next as Value);
      }}
    />
  );
}
export const Slider = {
  ...BaseSlider,
  Root: SliderRoot,
  Label: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Label>
  >(BaseSlider.Label, "pui-slider-label"),
  Value: part<
    HTMLOutputElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Value>
  >(BaseSlider.Value, "pui-slider-value"),
  Control: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Control>
  >(BaseSlider.Control, "pui-slider-control"),
  Track: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Track>
  >(BaseSlider.Track, "pui-slider-track"),
  Indicator: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Indicator>
  >(BaseSlider.Indicator, "pui-slider-indicator"),
  Thumb: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseSlider.Thumb>
  >(BaseSlider.Thumb, "pui-slider-thumb"),
};

// Flat names for React Server Components, which cannot dot into client exports.
export { AutocompleteRoot, SliderRoot };
export const {
  Arrow: AutocompleteArrow,
  Backdrop: AutocompleteBackdrop,
  Clear: AutocompleteClear,
  Collection: AutocompleteCollection,
  Empty: AutocompleteEmpty,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Icon: AutocompleteIcon,
  Input: AutocompleteInput,
  InputGroup: AutocompleteInputGroup,
  Item: AutocompleteItem,
  List: AutocompleteList,
  Popup: AutocompletePopup,
  Portal: AutocompletePortal,
  Positioner: AutocompletePositioner,
  Row: AutocompleteRow,
  Separator: AutocompleteSeparator,
  Status: AutocompleteStatus,
  Trigger: AutocompleteTrigger,
  Value: AutocompleteValue,
  Content: AutocompleteContent,
} = Autocomplete;
export const {
  Control: SliderControl,
  Indicator: SliderIndicator,
  Label: SliderLabel,
  Thumb: SliderThumb,
  Track: SliderTrack,
  Value: SliderValue,
} = Slider;
