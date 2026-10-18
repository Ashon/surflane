"use client";
import * as React from "react";
/** Share the actual DOM node, including React 19 callback-ref cleanup semantics. */
export function useRootRef<Element extends HTMLElement>(
  forwarded: React.Ref<Element> | undefined,
) {
  const element = React.useRef<Element>(null);
  const attach = React.useCallback(
    (node: Element | null) => {
      element.current = node;
      const cleanup =
        typeof forwarded === "function" ? forwarded(node) : undefined;
      if (forwarded && typeof forwarded !== "function")
        forwarded.current = node;
      return () => {
        if (element.current === node) element.current = null;
        if (typeof cleanup === "function") cleanup();
        else if (typeof forwarded === "function") forwarded(null);
        else if (forwarded) forwarded.current = null;
      };
    },
    [forwarded],
  );
  return [element, attach] as const;
}
/** Reset stateful primitives with their native form, without firing change callbacks. */
export function useResetValue<Value>(
  controlled: Value | undefined,
  initial: Value,
  element: React.RefObject<HTMLElement | null>,
  formId?: string,
  afterReset?: () => void,
) {
  const [local, setLocal] = React.useState(initial);
  const [revision, refresh] = React.useReducer((value: number) => value + 1, 0);
  const latest = React.useRef({ controlled, initial, afterReset });
  latest.current = { controlled, initial, afterReset };
  React.useEffect(() => {
    const node = element.current;
    const owner =
      (formId ? node?.ownerDocument.getElementById(formId) : undefined) ??
      node?.closest("form") ??
      Array.from(node?.querySelectorAll("input") ?? []).find(
        (input) => input.form,
      )?.form;
    if (!owner || owner.tagName !== "FORM") return;
    const pending = new Set<ReturnType<typeof setTimeout>>();
    const reset = (event: Event) => {
      // Native dispatch can run microtasks between listeners. Wait for all cancel handlers.
      const timer = setTimeout(() => {
        pending.delete(timer);
        if (event.defaultPrevented) return;
        if (latest.current.controlled === undefined)
          setLocal(latest.current.initial);
        else refresh(); // Reassert controlled hidden inputs after the browser's native reset.
        latest.current.afterReset?.();
      }, 0);
      pending.add(timer);
    };
    owner.addEventListener("reset", reset);
    return () => {
      owner.removeEventListener("reset", reset);
      pending.forEach(clearTimeout);
    };
  }, [element, formId]);
  return [
    controlled === undefined ? local : controlled,
    setLocal,
    revision,
  ] as const;
}
