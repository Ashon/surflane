import type { ComponentDoc } from "./componentDocs";
export const pageHeaderDocs: Record<string, ComponentDoc> = {
  "page-header": {
    usage:
      "Brings a page's path, title, description, and related actions together as a single starting point. Product profiles and preview options sit outside the border, and only the actual page header example is wrapped in the shared border. The catalog's own page headers use the same primitive. Use workspace for operational screens, page for dense lists, and document for reading screens.",
    avoid:
      "Don't truncate titles or pick heading levels to get a certain size. The product decides which actions appear and their execution state based on loading, errors, and permissions; when you hide an unavailable action, explain why. Don't nest cards or separate backgrounds.",
    keyboard:
      "Don't add extra keyboard behavior to a static header. Links run with Enter and buttons with Enter/Space. After SPA navigation, move focus to the title using headingProps' id and tabIndex=-1. Give the breadcrumb a named navigation landmark and aria-current=page.",
    anatomy:
      "PageHeader → optional breadcrumb → copy (semantic Heading + optional description) + optional wrapping action group",
    tokens: [
      "--page-header-breadcrumb-gap",
      "--page-header-gap",
      "--layout-description-measure",
      "--space-4",
      "--space-2",
      "--type-title-size",
      "--type-workspace-title-size",
      "--type-document-title-size",
    ],
    code: 'import { PageHeader, Button } from "@surflane/ui";\n\n<PageHeader as="header" title="Registered resources" level={1} size="page"\n  headingProps={{ id: "page-title", tabIndex: -1 }}\n  description="Discover and inspect registered resources."\n  breadcrumb={breadcrumb}\n  actionsLabel="Resource actions"\n  actions={<Button onClick={openRegistration}>Register resource</Button>} />',
    props: [
      [
        "title / description / breadcrumb / actions",
        "ReactNode; supporting slots optional",
        "title required",
      ],
      ["as", "div | header", "div"],
      ["level", "1–6; semantic heading rank", "1"],
      ["size", "title | page | workspace | document; visual role", "title"],
      [
        "headingProps",
        "heading HTML attributes including id and tabIndex",
        "undefined",
      ],
      ["actionsLabel", "optional accessible group name", "undefined"],
    ],
  },
};
