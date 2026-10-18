"use client";
import * as React from "react";
import { useComponentSize, type ComponentSizeAlias } from "./sizing.js";
import { Input as BaseInput } from "@base-ui/react/input";
const cx = (...v: (string | undefined | false)[]) =>
  v.filter(Boolean).join(" ");
export const Input = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentPropsWithoutRef<"input">, "size"> & {
    size?: number | ComponentSizeAlias;
    leadingIcon?: React.ReactNode;
    wrapperClassName?: string;
  }
>(function Input(
  { className, leadingIcon, wrapperClassName, size, ...props },
  ref,
) {
  const scheme = useComponentSize(typeof size === "string" ? size : undefined);
  return (
    <span
      data-ui-size={scheme}
      className={cx("pui-control", wrapperClassName)}
      data-leading-icon={leadingIcon ? "" : undefined}
      data-disabled={props.disabled || undefined}
    >
      {leadingIcon && (
        <span className="pui-control-icon control-icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <BaseInput
        {...props}
        size={typeof size === "number" ? size : undefined}
        ref={ref}
        className={cx("pui-input", className)}
      />
    </span>
  );
});
