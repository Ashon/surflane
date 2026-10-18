import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForCatalogReady } from "./catalog-ready";

test.use({ reducedMotion: "reduce" });
async function open(page: Page) {
  await page.goto("/components/chart");
  await waitForCatalogReady(page);
  await expect(
    page.getByRole("application", { name: "Pipeline activity" }),
  ).toBeVisible();
}
async function choose(page: Page, name: string, value: string) {
  await page.getByRole("combobox", { name, exact: true }).click();
  await page.getByRole("option", { name: value, exact: true }).click();
}
test("keyboard values retain missing data, escape clears the readout and the complete table keeps hidden series", async ({
  page,
}) => {
  await open(page);
  const chart = page.getByRole("application", {
    name: "Pipeline activity",
  });
  const readout = page.getByRole("status", {
    name: "Pipeline activity values",
  });
  await expect(chart).toHaveAttribute("aria-describedby", /summary.*keys/);
  await chart.focus();
  await chart.press("ArrowRight");
  await expect(readout).toContainText("October 2, 2026");
  await chart.press("ArrowRight");
  await expect(readout).toContainText("Inventory: Not available");
  await expect(readout).toContainText("Workspace: 14 runs");
  await chart.press("Escape");
  await expect(readout).not.toContainText("October 3");
  await expect(chart).toBeFocused();
  await chart.press("ArrowLeft");
  await expect(readout).toContainText("October 2, 2026");
  const paths = await page
    .locator(".recharts-line-curve")
    .evaluateAll((elements) =>
      elements.map((el) => el.getAttribute("d") ?? ""),
    );
  expect(paths[1].match(/M/g)).toHaveLength(2);
  await page
    .getByRole("button", { name: "Inventory series", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Inventory series", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByText("View data table", { exact: true }).click();
  const table = page.getByRole("table").first();
  await expect(
    table.getByRole("columnheader", { name: "Inventory (runs)" }),
  ).toBeVisible();
  const row = table.getByRole("row", { name: /October 3, 2026/ });
  await expect(
    row.getByRole("cell", { name: "Not available", exact: true }),
  ).toBeVisible();
  await expect(
    row.getByRole("cell", { name: "14 runs", exact: true }),
  ).toBeVisible();
});

test("legend supports all-hidden recovery and calling-owner rejection without moving focus", async ({
  page,
}) => {
  await open(page);
  const workspace = page.getByRole("button", {
    name: "Workspace series",
    exact: true,
  });
  await workspace.click();
  await expect(workspace).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("checkbox", { name: "Lock series selection" }).check();
  await workspace.click();
  await expect(workspace).toBeFocused();
  await expect(workspace).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.getByRole("status", { name: "Chart selection result" }),
  ).toContainText("rejected");
  await page.getByRole("checkbox", { name: "Lock series selection" }).uncheck();
  for (const name of ["Inventory series", "Documentation series"])
    await page.getByRole("button", { name, exact: true }).click();
  await expect(
    page.getByText("No series selected.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("application")).toHaveCount(0);
  await page.getByRole("button", { name: "Show all series" }).click();
  await expect(workspace).toHaveAttribute("aria-pressed", "true");
  await expect(workspace).toBeFocused();
  await expect(page.getByRole("application")).toBeVisible();
});

test("bar and area modes preserve zero, negatives, non-color patterns and data changes", async ({
  page,
}) => {
  await open(page);
  await choose(page, "Chart data", "Negative and zero values");
  await choose(page, "Chart type", "Bar");
  await expect(page.locator(".recharts-bar")).toHaveCount(3);
  const geometry = await page.locator(".pui-chart-plot").evaluate((plot) => {
    const zero = plot.querySelector(
      ".recharts-reference-line-line",
    ) as SVGLineElement;
    const y = Number(zero.getAttribute("y1"));
    const boxes = Array.from(
      plot.querySelectorAll<SVGGraphicsElement>(".recharts-bar-rectangle path"),
    ).map((el) => el.getBBox());
    return {
      positive: boxes.some(
        (b) => b.y < y - 1 && Math.abs(b.y + b.height - y) < 1,
      ),
      negative: boxes.some((b) => b.height > 1 && Math.abs(b.y - y) < 1),
    };
  });
  expect(geometry).toEqual({ positive: true, negative: true });
  await expect(page.locator(".pui-chart-plot pattern path")).toHaveCount(1);
  await expect(page.locator(".pui-chart-plot pattern circle")).toHaveCount(1);
  await page.getByText("View data table", { exact: true }).click();
  await expect(
    page
      .getByRole("table")
      .first()
      .getByRole("cell", { name: "0 resources", exact: true }),
  ).toHaveCount(3);
  await choose(page, "Chart type", "Area");
  await expect(page.locator(".recharts-area-area")).toHaveCount(3);
  const app = page.getByRole("application");
  await app.focus();
  await app.press("ArrowRight");
  await expect(page.locator(".pui-chart-inspector")).toContainText("resources");
  await choose(page, "Chart data", "Trend with a missing value");
  await app.focus();
  await app.press("ArrowRight");
  await expect(page.locator(".pui-chart-inspector")).toContainText("runs");
  await expect(page.locator(".pui-chart-inspector")).not.toContainText(
    "resources",
  );
});

test("all-missing and empty data never fabricate measurements and table scrolling contains dense data", async ({
  page,
}) => {
  await open(page);
  await choose(page, "Chart data", "All values unavailable");
  await expect(page.getByRole("application")).toHaveCount(0);
  await expect(
    page.getByText("No numeric measurements to display.", { exact: true }),
  ).toBeVisible();
  await page.getByText("View data table", { exact: true }).click();
  await expect(
    page
      .getByRole("table")
      .first()
      .getByRole("cell", { name: "Not available", exact: true }),
  ).toHaveCount(6);
  await choose(page, "Chart data", "No rows");
  await expect(page.getByRole("table").first()).toContainText("No rows.");
  await choose(page, "Chart data", "120 long resource labels");
  await expect(page.locator(".recharts-line-dots circle")).toHaveCount(0);
  const viewport = page.getByRole("region", {
    name: "Pipeline activity data table",
    exact: true,
  });
  await expect(viewport.getByRole("rowheader")).toHaveCount(120);
  const sizes = await viewport.evaluate((el) => {
    el.scrollTop = 600;
    return { height: el.clientHeight, scroll: el.scrollTop };
  });
  expect(sizes.height).toBeLessThanOrEqual(320);
  expect(sizes.scroll).toBeGreaterThan(0);
  await expect(viewport.getByRole("rowheader").last()).toHaveText(
    /resource-with-a-long-identifier-120/,
  );
});

test("pointer readout, responsive themes, high contrast and reduced motion keep the chart usable", async ({
  page,
}) => {
  for (const width of [1440, 320])
    for (const theme of ["light", "dark"]) {
      await page.context().addCookies([
        {
          name: "surflane-theme",
          value: theme,
          url: "http://127.0.0.1:8066",
        },
      ]);
      await page.setViewportSize({ width, height: 1000 });
      await open(page);
      const app = page.getByRole("application");
      await app.scrollIntoViewIfNeeded();
      const box = await app.boundingBox();
      expect(box!.width).toBeGreaterThan(100);
      await app.hover({ position: { x: box!.width / 2, y: box!.height / 2 } });
      await expect(page.locator("[data-chart-readout]")).toBeVisible();
      await choose(page, "Chart data", "120 long resource labels");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.getByText("View data table", { exact: true }).click();
      const violations = (
        await new AxeBuilder({ page }).include("#preview").analyze()
      ).violations;
      expect(violations).toEqual([]);
      await page
        .locator(".pui-chart")
        .screenshot({ path: `.data/chart-${width}-${theme}.png` });
    }
  await page.emulateMedia({ forcedColors: "active" });
  await choose(page, "Chart type", "Bar");
  expect(
    await page
      .locator(".pui-chart")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--chart-series-1").trim(),
      ),
  ).toBe("CanvasText");
  await expect(page.locator(".pui-chart-plot pattern path")).toHaveCount(1);
  await page.getByRole("application").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("[data-chart-readout]")).toBeVisible();
});

test("touch exposes the same complete values without relying on hover", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await open(page);
  const app = page.getByRole("application");
  await app.scrollIntoViewIfNeeded();
  const box = await app.boundingBox();
  await page.touchscreen.tap(
    box!.x + box!.width * 0.6,
    box!.y + box!.height / 2,
  );
  await expect(page.locator("[data-chart-readout]")).toBeVisible();
  await expect(page.locator(".pui-chart-inspector")).toContainText(
    "Workspace:",
  );
  await context.close();
});
