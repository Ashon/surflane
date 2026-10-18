"use client";
import * as React from "react";

/** Animate a scalar so the color-mix expression, not a browser's default
 * color interpolation space, determines every intermediate status color. */
export function useToneTransition<Element extends HTMLElement>(
  tone: string,
  forwardedRef: React.ForwardedRef<Element>,
) {
  const ref = React.useRef<Element>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current!, []);
  const previous = React.useRef<string | undefined>(undefined);
  const paint = React.useRef<string[]>([]);
  const animation = React.useRef<Animation | null>(null);
  const read = (element: Element) => {
    const style = getComputedStyle(element);
    return [style.backgroundColor, style.color, style.borderTopColor];
  };
  const clear = React.useCallback(() => {
    animation.current?.cancel();
    animation.current = null;
    const element = ref.current;
    element?.removeAttribute("data-status-transition");
    for (let i = 0; i < 3; i++) {
      element?.style.removeProperty(`--pui-status-from-${i}`);
      element?.style.removeProperty(`--pui-status-to-${i}`);
    }
  }, []);
  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const from = animation.current ? read(element) : paint.current;
    clear();
    const to = read(element);
    const changed = previous.current !== undefined && previous.current !== tone;
    previous.current = tone;
    paint.current = to;
    if (
      !changed ||
      !element.animate ||
      matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)")
        .matches ||
      document.documentElement.hasAttribute("data-theme-switching")
    )
      return;
    const durationToken = getComputedStyle(element)
      .getPropertyValue("--motion-feedback")
      .trim();
    const duration =
      parseFloat(durationToken) * (durationToken.endsWith("ms") ? 1 : 1000);
    if (!Number.isFinite(duration) || duration <= 0) return;
    from.forEach((value, i) =>
      element.style.setProperty(`--pui-status-from-${i}`, value),
    );
    to.forEach((value, i) =>
      element.style.setProperty(`--pui-status-to-${i}`, value),
    );
    element.setAttribute("data-status-transition", "");
    animation.current = element.animate(
      [{ "--pui-status-progress": "0" }, { "--pui-status-progress": "1" }],
      {
        duration,
        easing:
          getComputedStyle(element).getPropertyValue("--ease-out").trim() ||
          "ease-out",
      },
    );
    animation.current.onfinish = clear;
  }, [tone, clear]);
  React.useLayoutEffect(() => {
    const refresh = () => {
      clear();
      if (ref.current) paint.current = read(ref.current);
    };
    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-theme-switching"],
    });
    const media = [
      matchMedia("(prefers-reduced-motion: reduce)"),
      matchMedia("(forced-colors: active)"),
      matchMedia("(prefers-color-scheme: light)"),
    ];
    media.forEach((query) => query.addEventListener("change", refresh));
    return () => {
      observer.disconnect();
      media.forEach((query) => query.removeEventListener("change", refresh));
      clear();
    };
  }, [clear]);
  return ref;
}
