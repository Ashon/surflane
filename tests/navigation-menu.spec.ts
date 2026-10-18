import { waitForCatalogReady } from "./catalog-ready";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.use({ reducedMotion: "reduce" });
test("Navigation menu keeps navigation semantics, current location and native link destinations", async ({
  page,
}) => {
  await page.goto("/components/navigation-menu");
  await waitForCatalogReady(page);
  const nav = page.getByRole("navigation", {
    name: "Platform navigation",
    exact: true,
  });
  await expect(nav.locator("ul")).toHaveCount(1);
  const products = nav.getByRole("button", { name: "Products", exact: true });
  await products.focus();
  await products.press("Enter");
  const popup = page.getByRole("navigation", {
    name: "Platform navigation destinations",
    exact: true,
  });
  await expect(popup).toBeVisible();
  await expect(page.getByRole("menu")).toHaveCount(0);
  await page.keyboard.press("Tab");
  const workspace = popup.getByRole("link", { name: /^Workspace/ });
  await expect(workspace).toBeFocused();
  await expect(workspace).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("ArrowDown");
  const inventory = popup.getByRole("link", { name: /^Inventory/ });
  await expect(inventory).toBeFocused();
  await expect(inventory).toHaveAttribute("href", "#navigation-inventory");
  await inventory.press("Enter");
  await expect(popup).toHaveCount(0);
  await expect(page).toHaveURL(/#navigation-inventory$/);
  await expect(page.locator("#navigation-inventory")).toBeFocused();
  await products.click();
  await expect(popup.getByRole("link", { name: /^Inventory/ })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    popup.getByRole("link", { name: /^Workspace/ }),
  ).not.toHaveAttribute("aria-current", "page");
});
test("Top-level arrows, disabled triggers and Escape preserve keyboard navigation", async ({
  page,
}) => {
  await page.goto("/components/navigation-menu");
  await waitForCatalogReady(page);
  const nav = page.getByRole("navigation", {
      name: "Platform navigation",
      exact: true,
    }),
    products = nav.getByRole("button", { name: "Products", exact: true }),
    learn = nav.getByRole("button", { name: "Learn", exact: true }),
    guide = nav.getByRole("link", { name: "Guide", exact: true });
  await products.focus();
  await products.press("ArrowRight");
  await expect(learn).toBeFocused();
  await learn.press("ArrowRight");
  await expect(guide).toBeFocused();
  await guide.press("ArrowLeft");
  await learn.press("ArrowLeft");
  await expect(products).toBeFocused();
  await products.press("ArrowDown");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /^Workspace/ })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(products).toBeFocused();
  await expect(products).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("checkbox", { name: "Disable Learn" }).check();
  await expect(learn).toHaveAttribute("aria-disabled", "true");
  await learn.focus();
  await learn.press("Enter");
  await expect(page.locator(".pui-navigation-popup")).toHaveCount(0);
});
test("Orientation and RTL match rendered layout and controlled changes can be canceled", async ({
  page,
}) => {
  await page.goto("/components/navigation-menu");
  await waitForCatalogReady(page);
  const products = page.getByRole("button", { name: "Products", exact: true }),
    learn = page.getByRole("button", { name: "Learn", exact: true });
  await page.getByRole("checkbox", { name: "RTL preview" }).check();
  await products.focus();
  await products.press("ArrowLeft");
  await expect(learn).toBeFocused();
  await page.getByRole("checkbox", { name: "Vertical navigation" }).check();
  await expect(page.locator(".pui-navigation-menu")).toHaveAttribute(
    "data-orientation",
    "vertical",
  );
  await products.focus();
  await products.press("ArrowDown");
  await expect(learn).toBeFocused();
  await learn.press("ArrowLeft");
  await expect(page.locator(".pui-navigation-popup")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("checkbox", { name: "Cancel changes" }).check();
  await products.click();
  await expect(page.locator(".pui-navigation-popup")).toHaveCount(0);
});
test("Hover switches sections without stealing focus and outside click dismisses", async ({
  page,
}) => {
  await page.goto("/components/navigation-menu");
  await waitForCatalogReady(page);
  await page.getByRole("heading", { level: 1 }).focus();
  await page.getByRole("button", { name: "Products", exact: true }).hover();
  await expect(page.locator(".pui-navigation-popup")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.getByRole("button", { name: "Learn", exact: true }).hover();
  await expect(
    page.getByRole("link", { name: /^Layout foundations/ }),
  ).toBeVisible();
  await page.locator(".pui-navigation-popup").hover();
  await expect(page.locator(".pui-navigation-popup")).toBeVisible();
  await page.getByRole("heading", { level: 1 }).click();
  await expect(page.locator(".pui-navigation-popup")).toHaveCount(0);
});
for (const theme of ["light", "dark"])
  test(`Navigation menu remains accessible and fits narrow/enlarged layouts in ${theme}`, async ({
    page,
  }) => {
    await page.goto("/components/navigation-menu");
    await waitForCatalogReady(page);
    await page.evaluate(
      (theme) => (document.documentElement.dataset.theme = theme),
      theme,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.getByRole("button", { name: "Products", exact: true }).click();
    expect(
      (
        await new AxeBuilder({ page })
          .exclude("[data-base-ui-focus-guard]")
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.keyboard.press("Escape");
    await page.setViewportSize({ width: 320, height: 800 });
    await page.getByRole("button", { name: "Products", exact: true }).click();
    const popup = (await page.locator(".pui-navigation-popup").boundingBox())!;
    expect(popup.x).toBeGreaterThanOrEqual(0);
    expect(popup.x + popup.width).toBeLessThanOrEqual(320);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await page.evaluate(
      () => (document.documentElement.style.fontSize = "200%"),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("Touch can open and follow links without hover", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8066/components/navigation-menu");
  await waitForCatalogReady(page);
  await page.getByRole("button", { name: "Products", exact: true }).tap();
  await expect(page.locator(".pui-navigation-popup")).toBeVisible();
  await page.getByRole("link", { name: /^Documentation/ }).tap();
  await expect(page).toHaveURL(/#navigation-docs$/);
  await expect(page.locator(".pui-navigation-popup")).toHaveCount(0);
  await context.close();
});
test("Navigation focus sentinels redirect focus and mobile popup geometry stays stable", async ({
  page,
}) => {
  await page.goto("/components/navigation-menu");
  await waitForCatalogReady(page);
  await page.getByRole("button", { name: "Products", exact: true }).click();
  const guards = page.locator('[data-base-ui-focus-guard][tabindex="0"]');
  expect(await guards.count()).toBeGreaterThan(0);
  for (let index = 0; index < (await guards.count()); index++) {
    await guards.nth(index).focus();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.activeElement?.hasAttribute("data-base-ui-focus-guard") ??
            false,
        ),
      )
      .toBe(false);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.activeElement?.closest('[aria-hidden="true"]') !== null,
        ),
      )
      .toBe(false);
  }
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Products", exact: true }).click();
  const rects = await page
    .locator(".pui-navigation-popup")
    .evaluate(async (el) => {
      const samples: { x: number; y: number; width: number; height: number }[] =
        [];
      for (let n = 0; n < 25; n++) {
        await new Promise(requestAnimationFrame);
        const r = el.getBoundingClientRect();
        samples.push({ x: r.x, y: r.y, width: r.width, height: r.height });
      }
      return samples.slice(10);
    });
  for (const rect of rects) {
    expect(rect.x).toBeGreaterThanOrEqual(0);
    expect(rect.x + rect.width).toBeLessThanOrEqual(390);
    expect(Math.abs(rect.y - rects[0].y)).toBeLessThan(1);
  }
});
