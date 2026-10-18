import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { catalog } from "../demo/catalog";
import { exampleGroups, exampleGroupFor } from "../demo/exampleGroups";
import { waitForCatalogReady } from "./catalog-ready";
test.use({ reducedMotion: "reduce" });
const modules = [
  "RichContentExamples",
  "ChartExample",
  "DatePickerExample",
  "TreeExample",
  "CommandSearchExample",
  "AsyncJobExample",
  "ErrorRecoveryExample",
  "DocumentationExample",
  "DataTableExample",
  "AppShellExample",
  "BasicExamples",
  "FormExamples",
  "NavigationExamples",
  "FeedbackExamples",
  "DataExamples",
  "ContentExamples",
  "AdvancedFormExamples",
  "InputExtensionExamples",
  "CommandExamples",
  "ContextOverlayExamples",
  "FileUploadExample",
  "ToastExample",
  "OTPFieldExample",
  "NavigationMenuExample",
  "PageHeaderExample",
  "FilterBarExample",
  "ResourceListExample",
  "FormWorkflowExample",
];
function isModule(url: string, name: string) {
  return new RegExp(`/${name}(?:-[^/]+\\.js|\\.tsx)$`).test(
    new URL(url).pathname,
  );
}
const modulePattern = (name: string) =>
  new RegExp(`/${name}(?:-[^/]+\\.js|\\.tsx)(?:\\?|$)`);
function track(page: Page) {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  return requests;
}
function navigation(page: Page) {
  return page.getByRole("navigation", {
    name: "Catalog navigation",
    exact: true,
  });
}
test("Every available component/pattern has exactly one lightweight example group", () => {
  const ready = catalog
    .filter((item) => item.stage === "available" && item.kind !== "foundation")
    .map((item) => item.id)
    .sort();
  const ids = Object.values(exampleGroups).flat();
  expect(new Set(ids).size).toBe(ids.length);
  expect([...ids].sort()).toEqual(ready);
  for (const id of ready) expect(exampleGroupFor(id)).toBeDefined();
});
test("Overview and indexes do not request component examples", async ({
  page,
}) => {
  const requests = track(page);
  await page.goto("/");
  await waitForCatalogReady(page);
  expect(
    modules.filter((name) => requests.some((url) => isModule(url, name))),
  ).toEqual([]);
  await page
    .getByRole("navigation", { name: "Primary navigation", exact: true })
    .getByRole("link", { name: "Components", exact: true })
    .click();
  await expect(page.locator("#page-title")).toHaveText("Components");
  await waitForCatalogReady(page);
  await expect(
    page.getByRole("searchbox", { name: "Search catalog" }),
  ).toBeVisible();
  expect(
    modules.filter((name) => requests.some((url) => isModule(url, name))),
  ).toEqual([]);
});
test("Only the requested example group loads, with route focus and state preserved on theme updates", async ({
  page,
}) => {
  const requests = track(page);
  await page.goto("/components/toast");
  await waitForCatalogReady(page);
  expect(
    modules.filter((name) => requests.some((url) => isModule(url, name))),
  ).toEqual(["ToastExample"]);
  await expect(
    page.getByRole("button", { name: "Show success", exact: true }),
  ).toBeVisible();
  await navigation(page)
    .getByRole("link", { name: "Textarea", exact: true })
    .click();
  await expect(page.locator("#page-title")).toBeFocused();
  await waitForCatalogReady(page);
  const input = page.getByRole("textbox", { name: "Description", exact: true });
  await input.fill("보존할 입력 / keep this draft");
  const before = requests.filter((url) => isModule(url, "FormExamples")).length;
  await page
    .getByRole("button", { name: "Toggle theme: Light", exact: true })
    .click();
  await expect(input).toHaveValue("보존할 입력 / keep this draft");
  expect(requests.filter((url) => isModule(url, "FormExamples")).length).toBe(
    before,
  );
  expect(requests.some((url) => isModule(url, "FileUploadExample"))).toBe(
    false,
  );
});
test("Delayed preview leaves documentation, title and navigation available", async ({
  page,
}) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route(modulePattern("ToastExample"), async (route) => {
    await held;
    await route.continue();
  });
  await page.goto("/components/toast", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#page-title")).toHaveText("Toast");
  await expect(page.locator('[data-catalog-loading="preview"]')).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Usage", exact: true }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  release();
  await waitForCatalogReady(page);
  await expect(
    page.getByRole("button", { name: "Show success", exact: true }),
  ).toBeVisible();
});
test("Leaving a delayed route prevents its eventual response from replacing the current page", async ({
  page,
}) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route(modulePattern("ToastExample"), async (route) => {
    await held;
    await route.continue();
  });
  await page.goto("/components/toast", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-catalog-loading="preview"]')).toBeVisible();
  await navigation(page)
    .getByRole("link", { name: "Input", exact: true })
    .click();
  await expect(page.locator("#page-title")).toHaveText("Input");
  await waitForCatalogReady(page);
  const finished = page.waitForResponse((response) =>
    isModule(response.url(), "ToastExample"),
  );
  release();
  await finished;
  await expect(page.locator("#page-title")).toHaveText("Input");
  await expect(
    page.getByRole("button", { name: "Show success", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator("[data-catalog-error]")).toHaveCount(0);
});
test("Failed preview has a reviewable recovery UI and Reload retries a new document", async ({
  page,
}) => {
  const pattern = modulePattern("ToastExample");
  await page.route(pattern, (route) => route.abort("failed"));
  await page.goto("/components/toast");
  await expect(page.locator('[data-catalog-error="preview"]')).toBeVisible();
  await expect(page.locator("#page-title")).toHaveText("Toast");
  await expect(
    page.getByRole("heading", { name: "Usage", exact: true }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.unroute(pattern);
  await Promise.all([
    page.waitForEvent("domcontentloaded"),
    page.getByRole("button", { name: "Reload page", exact: true }).click(),
  ]);
  await waitForCatalogReady(page);
  await expect(
    page.getByRole("button", { name: "Show success", exact: true }),
  ).toBeVisible();
});
test("Failed page chunk keeps the shell usable and another route clears the error", async ({
  page,
}) => {
  await page.route(modulePattern("DetailPage"), (route) =>
    route.abort("failed"),
  );
  await page.goto("/components/toast");
  await expect(page.locator('[data-catalog-error="page"]')).toBeVisible();
  await expect(page.locator("#page-title")).toHaveText("Toast");
  await page
    .getByRole("navigation", { name: "Primary navigation", exact: true })
    .getByRole("link", { name: "Overview", exact: true })
    .click();
  await expect(page.locator("#page-title")).toHaveText(
    "The interface layer for platform teams.",
  );
  await waitForCatalogReady(page);
  await expect(page.locator("[data-catalog-error]")).toHaveCount(0);
});
test("A direct fragment scrolls to the section after lazy content settles, and history still restores the page", async ({
  page,
}) => {
  await page.goto("/components/textarea#api");
  await waitForCatalogReady(page);
  await expect
    .poll(() =>
      page.locator("#api").evaluate((el) => {
        const viewport = el.closest<HTMLElement>(".catalog-document-scroll")!;
        const top =
          el.getBoundingClientRect().top - viewport.getBoundingClientRect().top;
        // scrollIntoView honors the viewport's scroll padding and the section's scroll margin.
        const inset =
          parseFloat(getComputedStyle(viewport).scrollPaddingTop) +
          parseFloat(getComputedStyle(el).scrollMarginTop);
        const maximumScroll = viewport.scrollHeight - viewport.clientHeight;
        const expectedScroll = Math.min(
          viewport.scrollTop + top - inset,
          maximumScroll,
        );
        return Math.abs(viewport.scrollTop - expectedScroll);
      }),
    )
    .toBeLessThan(4);
  await page
    .getByRole("navigation", { name: "Primary navigation", exact: true })
    .getByRole("link", { name: "Components", exact: true })
    .click();
  await expect(page.locator("#page-title")).toHaveText("Components");
  await waitForCatalogReady(page);
  await page.goBack();
  await expect(page.locator("#page-title")).toHaveText("Textarea");
  await waitForCatalogReady(page);
  await expect(
    page.getByRole("textbox", { name: "Description", exact: true }),
  ).toBeVisible();
});

test("command search loads its own composition and defers destination examples until selection", async ({
  page,
}) => {
  const requests = track(page);
  await page.goto("/patterns/command-search");
  await waitForCatalogReady(page);
  expect(
    modules.filter((name) => requests.some((url) => isModule(url, name))),
  ).toEqual(["CommandSearchExample"]);
  await page
    .getByRole("button", { name: "Search documentation", exact: true })
    .click();
  const search = page.getByRole("combobox", {
    name: "Search pages and actions",
    exact: true,
  });
  await search.fill("button actions");
  expect(requests.some((url) => isModule(url, "BasicExamples"))).toBe(false);
  await search.press("Enter");
  await expect(page).toHaveURL(/\/components\/button$/);
  await waitForCatalogReady(page);
  expect(requests.some((url) => isModule(url, "BasicExamples"))).toBe(true);
  await expect(page.locator("#page-title")).toBeFocused();
});

test("Tree hierarchy and virtualization load only on its component route", async ({
  page,
}) => {
  const requests = track(page);
  await page.goto("/");
  await waitForCatalogReady(page);
  expect(requests.some((url) => isModule(url, "TreeExample"))).toBe(false);
  await page.goto("/components/tree");
  await waitForCatalogReady(page);
  expect(
    modules.filter((name) => requests.some((url) => isModule(url, name))),
  ).toEqual(["TreeExample"]);
  const tree = page.getByRole("tree", {
    name: "Resource hierarchy",
    exact: true,
  });
  await expect(
    tree.getByRole("treeitem", { name: "Projects", exact: true }),
  ).toBeVisible();
  await tree
    .getByRole("treeitem", { name: "Staging environment", exact: true })
    .press("ArrowRight");
  await expect(
    tree.getByRole("treeitem", { name: "Alpha service", exact: true }),
  ).toBeVisible();
});

test("Date/time picker composition is deferred and opens a real calendar on its own route", async ({
  page,
}) => {
  const requests = track(page);
  await page.goto("/");
  await waitForCatalogReady(page);
  expect(requests.some((url) => isModule(url, "DatePickerExample"))).toBe(
    false,
  );
  await page.goto("/components/date-picker");
  await waitForCatalogReady(page);
  expect(
    modules.filter((name) => requests.some((url) => isModule(url, name))),
  ).toEqual(["DatePickerExample"]);
  await page
    .getByRole("button", { name: "Calendar Run date", exact: true })
    .click();
  await expect(
    page
      .getByRole("dialog", { name: "Run date", exact: true })
      .getByRole("grid"),
  ).toHaveAccessibleName("October 2026");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Calendar Run date", exact: true }),
  ).toBeFocused();
});

test("Chart composition is deferred until its own route and renders keyboard-readable measurements", async ({
  page,
}) => {
  const requests = track(page);
  await page.goto("/");
  await waitForCatalogReady(page);
  expect(requests.some((url) => isModule(url, "ChartExample"))).toBe(false);
  await page.goto("/components/chart");
  await waitForCatalogReady(page);
  expect(
    modules.filter((name) => requests.some((url) => isModule(url, name))),
  ).toEqual(["ChartExample"]);
  const chart = page.getByRole("application", {
    name: "Pipeline activity",
  });
  await chart.focus();
  await chart.press("ArrowRight");
  await expect(
    page.getByRole("status", { name: "Pipeline activity values" }),
  ).toContainText("18 runs");
});

test("rich content and grammar engine stay deferred until the documentation route", async ({
  page,
}) => {
  const requests = track(page);
  await page.goto("/");
  await waitForCatalogReady(page);
  expect(
    requests.some(
      (url) =>
        isModule(url, "RichContentExamples") ||
        /\/syntax-engine(?:-[^/]+)?\.js/.test(new URL(url).pathname),
    ),
  ).toBe(false);
  await page.goto("/components/markdown");
  await waitForCatalogReady(page);
  const article = page.getByRole("article", {
    name: "Markdown preview",
    exact: true,
  });
  await expect(article.getByRole("table")).toBeVisible();
  await expect(article.locator('code[data-language="tsx"]')).toHaveAttribute(
    "data-highlighted",
    "true",
  );
  expect(
    modules.filter((name) => requests.some((url) => isModule(url, name))),
  ).toEqual(["RichContentExamples"]);
  expect(
    requests.some((url) =>
      /\/syntax-engine(?:-[^/]+)?\.js/.test(new URL(url).pathname),
    ),
  ).toBe(true);
  expect(requests.some((url) => /\.wasm(?:\?|$)/.test(url))).toBe(false);
});
