"use client";
import * as React from "react";
import {
  useComponentSize,
  normalizeSize,
  type ComponentSizeAlias,
} from "./sizing.js";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";

export type PanelSide = "left" | "right" | "top" | "bottom";
type PanelOptions = { size?: ComponentSizeAlias; closeLabel?: string };
const SheetSide = React.createContext({
  side: "right" as PanelSide,
  modal: true as boolean | "trap-focus",
});
const DrawerSide = React.createContext({
  side: "bottom" as PanelSide,
  modal: true as boolean | "trap-focus",
});
const cx = (...values: (string | undefined)[]) =>
  values.filter(Boolean).join(" ");
function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
function SheetRoot({
  side = "right",
  modal = true,
  ...props
}: React.ComponentProps<typeof BaseDialog.Root> & { side?: PanelSide }) {
  return (
    <SheetSide.Provider value={{ side, modal }}>
      <BaseDialog.Root {...props} modal={modal} />
    </SheetSide.Provider>
  );
}
function DrawerRoot({
  side = "bottom",
  modal = true,
  ...props
}: Omit<React.ComponentProps<typeof BaseDrawer.Root>, "swipeDirection"> & {
  side?: PanelSide;
}) {
  const direction = {
    left: "left",
    right: "right",
    top: "up",
    bottom: "down",
  } as const;
  return (
    <DrawerSide.Provider value={{ side, modal }}>
      <BaseDrawer.Root
        {...props}
        modal={modal}
        swipeDirection={direction[side]}
      />
    </DrawerSide.Provider>
  );
}
const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> & PanelOptions
>(function SheetContent(
  { size, closeLabel = "Close panel", className, children, ...props },
  ref,
) {
  const scheme = useComponentSize(size);
  const { side, modal } = React.useContext(SheetSide);
  return (
    <BaseDialog.Portal>
      <div className="pui-panel-layer" data-ui-size={scheme}>
        {modal === true && (
          <BaseDialog.Backdrop className="pui-panel-backdrop" />
        )}
        <div className="pui-panel-viewport" data-side={side}>
          <BaseDialog.Popup
            {...props}
            ref={ref}
            className={cx(
              "pui-panel",
              typeof className === "string" ? className : undefined,
            )}
            data-side={side}
            data-size={
              size
                ? normalizeSize(size) === "small"
                  ? "sm"
                  : normalizeSize(size) === "large"
                    ? "lg"
                    : "md"
                : "md"
            }
          >
            <BaseDialog.Close
              className="pui-panel-close pui-icon-button"
              aria-label={closeLabel}
            >
              <CloseIcon />
            </BaseDialog.Close>
            {children}
          </BaseDialog.Popup>
        </div>
      </div>
    </BaseDialog.Portal>
  );
});
const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDrawer.Popup> & PanelOptions
>(function DrawerContent(
  { size, closeLabel = "Close panel", className, children, ...props },
  ref,
) {
  const scheme = useComponentSize(size);
  const { side, modal } = React.useContext(DrawerSide);
  const KeyboardProvider =
    side === "bottom" ? BaseDrawer.VirtualKeyboardProvider : React.Fragment;
  return (
    <KeyboardProvider>
      <BaseDrawer.Portal>
        <div className="pui-panel-layer" data-ui-size={scheme}>
          {modal === true && (
            <BaseDrawer.Backdrop className="pui-panel-backdrop" />
          )}
          <BaseDrawer.Viewport className="pui-panel-viewport" data-side={side}>
            <BaseDrawer.Popup
              {...props}
              ref={ref}
              className={cx(
                "pui-panel pui-drawer",
                typeof className === "string" ? className : undefined,
              )}
              data-side={side}
              data-size={
                size
                  ? normalizeSize(size) === "small"
                    ? "sm"
                    : normalizeSize(size) === "large"
                      ? "lg"
                      : "md"
                  : "lg"
              }
            >
              <div className="pui-drawer-handle" aria-hidden="true" />
              <BaseDrawer.Close
                className="pui-panel-close pui-icon-button"
                aria-label={closeLabel}
              >
                <CloseIcon />
              </BaseDrawer.Close>
              <BaseDrawer.Content className="pui-panel-content">
                {children}
              </BaseDrawer.Content>
            </BaseDrawer.Popup>
          </BaseDrawer.Viewport>
        </div>
      </BaseDrawer.Portal>
    </KeyboardProvider>
  );
});
function Header({ className, ...props }: React.ComponentProps<"div">) {
  return <div {...props} className={cx("pui-panel-header", className)} />;
}
const Body = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  function Body({ className, ...props }, ref) {
    return (
      <div {...props} ref={ref} className={cx("pui-panel-body", className)} />
    );
  },
);
function Footer({ className, ...props }: React.ComponentProps<"div">) {
  return <div {...props} className={cx("pui-panel-footer", className)} />;
}
function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      {...props}
      className={cx(
        "pui-panel-title",
        typeof className === "string" ? className : undefined,
      )}
    />
  );
}
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      {...props}
      className={cx(
        "pui-panel-description",
        typeof className === "string" ? className : undefined,
      )}
    />
  );
}
function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseDrawer.Title>) {
  return (
    <BaseDrawer.Title
      {...props}
      className={cx(
        "pui-panel-title",
        typeof className === "string" ? className : undefined,
      )}
    />
  );
}
function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseDrawer.Description>) {
  return (
    <BaseDrawer.Description
      {...props}
      className={cx(
        "pui-panel-description",
        typeof className === "string" ? className : undefined,
      )}
    />
  );
}
export const Sheet = {
  ...BaseDialog,
  Root: SheetRoot,
  Content: SheetContent,
  Header,
  Body,
  Footer,
  Title: SheetTitle,
  Description: SheetDescription,
};
export const Drawer = {
  ...BaseDrawer,
  Root: DrawerRoot,
  Content: DrawerContent,
  PrimitiveContent: BaseDrawer.Content,
  Header,
  Body,
  Footer,
  Title: DrawerTitle,
  Description: DrawerDescription,
};

// Flat names for React Server Components, which cannot dot into client exports.
export {
  DrawerContent,
  DrawerDescription,
  DrawerRoot,
  DrawerTitle,
  SheetDescription,
  SheetRoot,
  SheetTitle,
  SheetContent,
};
export const {
  Backdrop: DrawerBackdrop,
  Close: DrawerClose,
  Handle: DrawerHandle,
  Indent: DrawerIndent,
  IndentBackground: DrawerIndentBackground,
  Popup: DrawerPopup,
  Portal: DrawerPortal,
  Provider: DrawerProvider,
  SwipeArea: DrawerSwipeArea,
  Trigger: DrawerTrigger,
  Viewport: DrawerViewport,
  VirtualKeyboardProvider: DrawerVirtualKeyboardProvider,
  PrimitiveContent: DrawerPrimitiveContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
} = Drawer;
export const {
  Backdrop: SheetBackdrop,
  Close: SheetClose,
  Handle: SheetHandle,
  Popup: SheetPopup,
  Portal: SheetPortal,
  Trigger: SheetTrigger,
  Viewport: SheetViewport,
  Header: SheetHeader,
  Body: SheetBody,
  Footer: SheetFooter,
} = Sheet;
