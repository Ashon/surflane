"use client";
import * as React from "react";
import { useComponentSize, type ComponentSizeAlias } from "./sizing.js";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import { Meter as BaseMeter } from "@base-ui/react/meter";
import { part } from "./parts.js";

export const Progress = {
  ...BaseProgress,
  Root: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseProgress.Root>
  >(BaseProgress.Root, "pui-gauge pui-progress"),
  Label: part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof BaseProgress.Label>
  >(BaseProgress.Label, "pui-gauge-label"),
  Value: part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof BaseProgress.Value>
  >(BaseProgress.Value, "pui-gauge-value"),
  Track: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseProgress.Track>
  >(BaseProgress.Track, "pui-gauge-track"),
  Indicator: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseProgress.Indicator>
  >(BaseProgress.Indicator, "pui-gauge-indicator"),
};
export const Meter = {
  ...BaseMeter,
  Root: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMeter.Root>
  >(BaseMeter.Root, "pui-gauge pui-meter"),
  Label: part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof BaseMeter.Label>
  >(BaseMeter.Label, "pui-gauge-label"),
  Value: part<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<typeof BaseMeter.Value>
  >(BaseMeter.Value, "pui-gauge-value"),
  Track: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMeter.Track>
  >(BaseMeter.Track, "pui-gauge-track"),
  Indicator: part<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof BaseMeter.Indicator>
  >(BaseMeter.Indicator, "pui-gauge-indicator"),
};
export type SpinnerProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children"
> & {
  label?: string;
  decorative?: boolean;
  size?: ComponentSizeAlias;
};
/** Use decorative within a loading region that already owns the announcement. */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner(
    { label = "Loading", decorative = false, size, className, ...props },
    ref,
  ) {
    const scheme = useComponentSize(size);
    return (
      <span
        {...props}
        ref={ref}
        className={["pui-spinner", className].filter(Boolean).join(" ")}
        data-size={size}
        data-ui-size={scheme}
        role={decorative ? undefined : "status"}
        aria-hidden={decorative || undefined}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" opacity=".2" />
          <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
        </svg>
        {!decorative && <span className="pui-feedback-sr">{label}</span>}
      </span>
    );
  },
);
export type SkeletonProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children"
> & {
  shape?: "text" | "block" | "circle";
};
/** Decorative placeholder; the owning region provides aria-busy and loading text. */
export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(
  function Skeleton({ shape = "text", className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        className={["pui-skeleton", className].filter(Boolean).join(" ")}
        data-shape={shape}
        aria-hidden="true"
      />
    );
  },
);

// Flat names for React Server Components, which cannot dot into client exports.
export const {
  Indicator: MeterIndicator,
  Label: MeterLabel,
  Root: MeterRoot,
  Track: MeterTrack,
  Value: MeterValue,
} = Meter;
export const {
  Indicator: ProgressIndicator,
  Label: ProgressLabel,
  Root: ProgressRoot,
  Track: ProgressTrack,
  Value: ProgressValue,
} = Progress;
