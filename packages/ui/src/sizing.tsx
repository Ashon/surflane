"use client";
import * as React from "react";

export type ComponentSize = "small" | "default" | "large";
export type ComponentSizeAlias = ComponentSize | "sm" | "md" | "lg";
export const ComponentSizeContext = React.createContext<
  ComponentSize | undefined
>(undefined);
export function normalizeSize(
  size?: ComponentSizeAlias,
): ComponentSize | undefined {
  return size === "sm"
    ? "small"
    : size === "md"
      ? "default"
      : size === "lg"
        ? "large"
        : size;
}
/** Explicit sizes override the surrounding scheme; portals retain React context. */
export function useComponentSize(size?: ComponentSizeAlias) {
  const inherited = React.useContext(ComponentSizeContext);
  return normalizeSize(size) ?? inherited;
}
/** No layout box: grid/flex items and semantic children retain their own layout.
 * For table internals, place the provider outside the table, never inside tbody. */
export function SizeProvider({
  size,
  children,
}: {
  size: ComponentSize;
  children: React.ReactNode;
}) {
  return (
    <ComponentSizeContext.Provider value={size}>
      <div className="pui-size-scope" data-ui-size={size}>
        {children}
      </div>
    </ComponentSizeContext.Provider>
  );
}
