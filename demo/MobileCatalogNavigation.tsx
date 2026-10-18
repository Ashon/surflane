import React, { useLayoutEffect, useRef } from "react";
import { Button, Dialog } from "@surflane/ui";

/** Modal bottom sheet: centered navigation and a thumb-accessible close action. */
export default function MobileCatalogNavigation({
  open,
  onOpenChange,
  area,
  finalFocus,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  area: string;
  finalFocus: () => HTMLElement | null;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!open) return;
    const viewport = panel.current?.querySelector<HTMLElement>(
      ".catalog-navigation-viewport",
    );
    const active = viewport?.querySelector<HTMLElement>(
      'a[aria-current="page"]',
    );
    if (!viewport || !active) return;
    const row = active.getBoundingClientRect(),
      bounds = viewport.getBoundingClientRect();
    if (row.top < bounds.top + 16)
      viewport.scrollTop -= bounds.top + 16 - row.top;
    else if (row.bottom > bounds.bottom - 16)
      viewport.scrollTop += row.bottom - bounds.bottom + 16;
  }, [open, area]);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        ref={panel}
        className="catalog-mobile-navigation"
        closeLabel="Close catalog navigation"
        initialFocus={() =>
          panel.current?.querySelector<HTMLElement>('a[aria-current="page"]') ??
          panel.current
        }
        finalFocus={finalFocus}
      >
        <Dialog.Header>
          <Dialog.Title>{area} navigation</Dialog.Title>
          <Dialog.Description>
            Choose a page in this section.
          </Dialog.Description>
        </Dialog.Header>
        <div className="catalog-mobile-navigation-body">{children}</div>
        <Dialog.Footer>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close menu
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
