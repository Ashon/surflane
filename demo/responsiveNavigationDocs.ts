import type { ComponentDoc } from "./componentDocs";
export const responsiveNavigationDocs: Record<string, ComponentDoc> = {
  "responsive-navigation": {
    usage:
      "Define the current area's destinations in a single model and render the same links in the desktop sidebar and the mobile Sheet. An open Sheet closes and moves focus using the same matchMedia condition as AppShell's 760px breakpoint. The example reuses the App shell module and also lets you try long menu names and read-only navigation. The actual catalog uses a global top rail and a collapsible contextual sidebar; choose whichever fits your product's screen structure.",
    avoid:
      "Don't remove important destinations because the screen is narrow. Don't automatically put external links or account and theme controls inside the modal menu. Don't hide desktop links with CSS and leave focus on a link that has disappeared. Keep navigation destinations as native a elements, and don't impose app-menu arrow-key rules. The read-only checkbox in the example is a local display condition; real permission checks happen on the server and in the product router.",
    anatomy:
      "Shared destination model → desktop nav(AppShell.Sidebar + ScrollArea) / mobile trigger → Sheet(Title, Description, native nav links, Close) → workspace heading",
    keyboard:
      "The menu button works with Tab and Enter/Space. The mobile Sheet has a meaningful title and description, and Base UI manages initial focus, focus trapping, and Escape. Closing by canceling returns focus to the menu button, choosing a destination moves focus to the content heading, and widening to desktop with the Sheet open moves focus to the current desktop link. Narrowing to mobile while a desktop link has focus returns focus to the mobile menu button. Long names keep their full accessible name even when visually truncated.",
    tokens: [
      "--space-3",
      "--space-4",
      "--control-focus",
      "--selected",
      "--radius-md",
      "--radius-sheet",
      "--chrome",
      "--canvas",
    ],
    code: `import {AppShell, Sheet, Button, ScrollArea} from "@surflane/ui";\n\nconst navigation = destinations.filter(canAccess).map(item =>\n  <AppShell.Link key={item.id} href={item.href} label={item.label}\n    icon={item.icon} aria-current={isCurrent(item) ? "page" : undefined} />\n);\n\n<AppShell.Sidebar><ScrollArea orientation="vertical" label="Destinations">\n  <nav aria-label="Workspace navigation">{navigation}</nav>\n</ScrollArea></AppShell.Sidebar>\n\n<Sheet.Root side="left" open={open} onOpenChange={setOpen}>\n  <Sheet.Trigger render={<Button aria-label="Open navigation" />}>Menu</Sheet.Trigger>\n  <Sheet.Content finalFocus={resolveReturnFocus}>\n    <Sheet.Title>Workspace navigation</Sheet.Title>\n    <Sheet.Description>Choose a workspace page.</Sheet.Description>\n    <nav aria-label="Mobile workspace navigation">{navigation}</nav>\n  </Sheet.Content>\n</Sheet.Root>\n\n// Match AppShell's <=760px CSS breakpoint. Close the Sheet on desktop resize.\n// Resolve return focus: cancel -> trigger; navigation -> heading; desktop resize -> current link.\n// Revalidate routes and permissions in the product, including browser back/forward.`,
    props: [
      [
        "Destination model",
        "stable IDs, href, label, icon and allowed/current state shared by both presentations",
        "caller-owned",
      ],
      [
        "Breakpoint",
        "desktop Sidebar hidden and mobile trigger shown at <=760px",
        "AppShell CSS contract",
      ],
      [
        "Sheet.open / onOpenChange",
        "controlled mobile disclosure; close when desktop becomes available",
        "false",
      ],
      [
        "Sheet.Content.finalFocus",
        "resolve trigger, destination heading or visible desktop link",
        "caller-owned resolver",
      ],
      [
        "Long navigation labels",
        "full accessible names survive ellipsis and collapse",
        "local preview toggle",
      ],
      [
        "Read-only navigation",
        "hides Settings; falls back to Overview if Settings was current",
        "local preview toggle",
      ],
    ],
  },
};
