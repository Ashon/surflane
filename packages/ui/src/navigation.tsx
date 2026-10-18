"use client";
import * as React from "react";
import { useComponentSize, type ComponentSizeAlias } from "./sizing.js";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { skin, part } from "./parts.js";
export const Tabs = {
  ...BaseTabs,
  Root: part<
    React.ComponentRef<typeof BaseTabs.Root>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.Root>
  >(BaseTabs.Root, "pui-tabs"),
  List: part<
    React.ComponentRef<typeof BaseTabs.List>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.List>
  >(BaseTabs.List, "pui-tabs-list"),
  Tab: part<
    React.ComponentRef<typeof BaseTabs.Tab>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>
  >(BaseTabs.Tab, "pui-tabs-tab"),
  Panel: part<
    React.ComponentRef<typeof BaseTabs.Panel>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.Panel>
  >(BaseTabs.Panel, "pui-tabs-panel"),
  Indicator: part<
    React.ComponentRef<typeof BaseTabs.Indicator>,
    React.ComponentPropsWithoutRef<typeof BaseTabs.Indicator>
  >(BaseTabs.Indicator, "pui-tabs-indicator"),
};
function Chevron() {
  return (
    <svg
      className="pui-disclosure-chevron"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
function AccordionRoot<Value = string>({
  className,
  ...props
}: BaseAccordion.Root.Props<Value>) {
  return (
    <BaseAccordion.Root<Value>
      {...props}
      className={skin("pui-accordion", className)}
    />
  );
}
const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseAccordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger> & {
    indicator?: React.ReactNode;
  }
>(function AccordionTrigger({ className, children, indicator, ...props }, ref) {
  return (
    <BaseAccordion.Trigger
      {...props}
      ref={ref}
      className={skin("pui-disclosure-trigger", className)}
    >
      <span className="pui-disclosure-label">{children}</span>
      {indicator === undefined ? <Chevron /> : indicator}
    </BaseAccordion.Trigger>
  );
});
const AccordionPanel = React.forwardRef<
  React.ComponentRef<typeof BaseAccordion.Panel>,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel>
>(function AccordionPanel({ className, children, render, ...props }, ref) {
  return (
    <BaseAccordion.Panel
      {...props}
      ref={ref}
      className={skin("pui-accordion-panel", className)}
      render={
        render ??
        ((panelProps, state) => (
          <div
            {...panelProps}
            inert={state.transitionStatus === "ending" || undefined}
            aria-hidden={state.transitionStatus === "ending" || undefined}
          />
        ))
      }
    >
      <div className="pui-disclosure-body">{children}</div>
    </BaseAccordion.Panel>
  );
});
export const Accordion = {
  ...BaseAccordion,
  Root: AccordionRoot,
  Item: part<
    React.ComponentRef<typeof BaseAccordion.Item>,
    React.ComponentPropsWithoutRef<typeof BaseAccordion.Item>
  >(BaseAccordion.Item, "pui-accordion-item"),
  Header: part<
    React.ComponentRef<typeof BaseAccordion.Header>,
    React.ComponentPropsWithoutRef<typeof BaseAccordion.Header>
  >(BaseAccordion.Header, "pui-accordion-header"),
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};
const CollapsibleTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseCollapsible.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger> & {
    indicator?: React.ReactNode;
  }
>(function CollapsibleTrigger(
  { className, children, indicator, ...props },
  ref,
) {
  return (
    <BaseCollapsible.Trigger
      {...props}
      ref={ref}
      className={skin("pui-disclosure-trigger", className)}
    >
      <span className="pui-disclosure-label">{children}</span>
      {indicator === undefined ? <Chevron /> : indicator}
    </BaseCollapsible.Trigger>
  );
});
const CollapsiblePanel = React.forwardRef<
  React.ComponentRef<typeof BaseCollapsible.Panel>,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>
>(function CollapsiblePanel({ className, children, ...props }, ref) {
  return (
    <BaseCollapsible.Panel
      {...props}
      ref={ref}
      className={skin("pui-collapsible-panel", className)}
    >
      <div className="pui-disclosure-body">{children}</div>
    </BaseCollapsible.Panel>
  );
});
export const Collapsible = {
  ...BaseCollapsible,
  Root: part<
    React.ComponentRef<typeof BaseCollapsible.Root>,
    React.ComponentPropsWithoutRef<typeof BaseCollapsible.Root>
  >(BaseCollapsible.Root, "pui-collapsible"),
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
};
const AvatarRoot = React.forwardRef<
  React.ComponentRef<typeof BaseAvatar.Root>,
  React.ComponentPropsWithoutRef<typeof BaseAvatar.Root> & {
    size?: ComponentSizeAlias;
  }
>(function AvatarRoot({ size, className, ...props }, ref) {
  const scheme = useComponentSize(size);
  return (
    <BaseAvatar.Root
      {...props}
      ref={ref}
      data-size={size}
      data-ui-size={scheme}
      className={skin("pui-avatar", className)}
    />
  );
});
function Person() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
    </svg>
  );
}
const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof BaseAvatar.Fallback>,
  React.ComponentPropsWithoutRef<typeof BaseAvatar.Fallback>
>(function AvatarFallback({ children, className, ...props }, ref) {
  return (
    <BaseAvatar.Fallback
      {...props}
      ref={ref}
      className={skin("pui-avatar-fallback", className)}
    >
      {children ?? <Person />}
    </BaseAvatar.Fallback>
  );
});
export const Avatar = {
  ...BaseAvatar,
  Root: AvatarRoot,
  Status: part<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
    "span",
    "pui-avatar-status",
  ),
  Fallback: AvatarFallback,
  Image: part<
    React.ComponentRef<typeof BaseAvatar.Image>,
    React.ComponentPropsWithoutRef<typeof BaseAvatar.Image>
  >(BaseAvatar.Image, "pui-avatar-image"),
};
export const Separator = React.forwardRef<
  React.ComponentRef<typeof BaseSeparator>,
  React.ComponentPropsWithoutRef<typeof BaseSeparator> & { inset?: boolean }
>(function Separator({ inset = false, className, ...props }, ref) {
  return (
    <BaseSeparator
      {...props}
      ref={ref}
      data-inset={inset || undefined}
      className={skin("pui-separator", className)}
    />
  );
});
export const Link = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(function Link({ className, ...props }, ref) {
  return (
    <a
      {...props}
      ref={ref}
      className={["pui-link", className].filter(Boolean).join(" ")}
    />
  );
});
const BreadcrumbRoot = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav">
>(function BreadcrumbRoot(
  { className, "aria-label": label = "Breadcrumb", ...props },
  ref,
) {
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={label}
      className={["pui-breadcrumbs", className].filter(Boolean).join(" ")}
    />
  );
});
const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(function BreadcrumbList({ className, role = "list", ...props }, ref) {
  return (
    <ol
      {...props}
      role={role}
      ref={ref}
      className={["pui-breadcrumb-list", className].filter(Boolean).join(" ")}
    />
  );
});
const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(function BreadcrumbItem({ className, ...props }, ref) {
  return (
    <li
      {...props}
      ref={ref}
      className={["pui-breadcrumb-item", className].filter(Boolean).join(" ")}
    />
  );
});
function BreadcrumbSeparator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={["pui-breadcrumb-separator", className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <Chevron />
    </span>
  );
}
function BreadcrumbCurrent({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={["pui-breadcrumb-current", className]
        .filter(Boolean)
        .join(" ")}
      aria-current="page"
    />
  );
}
export const Breadcrumbs = {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link,
  Separator: BreadcrumbSeparator,
  Current: BreadcrumbCurrent,
};

// Flat names for React Server Components, which cannot dot into client exports.
export {
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
  AvatarFallback,
  AvatarRoot,
  CollapsiblePanel,
  CollapsibleTrigger,
};
export const { Header: AccordionHeader, Item: AccordionItem } = Accordion;
export const { Image: AvatarImage, Status: AvatarStatus } = Avatar;
export const {
  Root: BreadcrumbsRoot,
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
  Separator: BreadcrumbsSeparator,
  Current: BreadcrumbsCurrent,
} = Breadcrumbs;
export const { Root: CollapsibleRoot } = Collapsible;
export const {
  Indicator: TabsIndicator,
  List: TabsList,
  Panel: TabsPanel,
  Root: TabsRoot,
  Tab: TabsTab,
} = Tabs;
