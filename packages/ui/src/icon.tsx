"use client";
import * as React from "react";
const shapes = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m5 12 4 4L19 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10v1" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6m0 3v1" />
    </>
  ),
  warning: (
    <>
      <path d="m12 3 10 18H2L12 3Z" />
      <path d="M12 9v4m0 3v1" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  moon: <path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5 8.5 8.5 0 1 0 20.5 13.2Z" />,
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8m-4-4v4" />
    </>
  ),
  "chevron-down": <path d="m7 10 5 5 5-5" />,
  "chevron-forward": <path d="m9 6 6 6-6 6" />,
  "arrow-back": <path d="M20 12H4m7-7-7 7 7 7" />,
  "external-link": (
    <>
      <path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="13" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </>
  ),
  play: <path d="m7 3 14 9-14 9V3Z" />,
  settings: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16M9 3v6m6 0v6m-6 0v6" />
    </>
  ),
};
export type IconName = keyof typeof shapes;
export const iconNames: readonly IconName[] = Object.keys(shapes) as IconName[];
type Semantics =
  { decorative?: true; label?: never } | { decorative: false; label: string };
export type IconProps = Omit<
  React.ComponentPropsWithoutRef<"svg">,
  | "children"
  | "name"
  | "role"
  | "aria-label"
  | "aria-labelledby"
  | "aria-hidden"
  | "tabIndex"
  | "focusable"
  | "width"
  | "height"
  | "viewBox"
  | "strokeWidth"
  | "fill"
  | "stroke"
  | "title"
> &
  Semantics & { name: IconName; size?: "sm" | "md" | "lg" };
/** Static SVG only. Actions, focus, accessible button names and hit targets belong to the parent control. */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = "sm", decorative = true, label, className, ...props },
  ref,
) {
  return (
    <svg
      {...props}
      ref={ref}
      className={["pui-icon", className].filter(Boolean).join(" ")}
      data-size={size}
      data-directional={
        name === "chevron-forward" || name === "arrow-back" ? "true" : undefined
      }
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
    >
      {shapes[name]}
    </svg>
  );
});
