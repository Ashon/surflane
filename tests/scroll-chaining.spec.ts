import { test, expect } from "@playwright/test";
import { waitForCatalogReady } from "./catalog-ready";
test.use({ reducedMotion: "reduce" });
const doc = (page: import("@playwright/test").Page) =>
  page.locator(".catalog-document-scroll");
for (const width of [1440, 320])
  test(`vertical wheel over a horizontal-only color table scrolls the document at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/foundations/color");
    await waitForCatalogReady(page);
    const region = page.getByRole("region", {
      name: "Semantic color contrast",
      exact: true,
    });
    await region.scrollIntoViewIfNeeded();
    const before = await doc(page).evaluate((el) => el.scrollTop);
    await region.hover();
    await page.mouse.wheel(0, 350);
    await expect
      .poll(() => doc(page).evaluate((el) => el.scrollTop))
      .toBeGreaterThan(before + 100);
    await expect(region).toHaveCSS("overflow-y", "hidden");
    await expect(region).toHaveCSS("overscroll-behavior-y", "auto");
    expect(
      await doc(page).evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    if (width === 320) {
      await region.hover();
      await page.mouse.wheel(250, 0);
      await expect
        .poll(() => region.evaluate((el) => el.scrollLeft))
        .toBeGreaterThan(0);
    }
  });

test("wheel over a code block passes vertically to the document while preserving horizontal scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/foundations/motion");
  await waitForCatalogReady(page);
  const code = page.getByRole("region", {
    name: "React theme integration",
    exact: true,
  });
  await code.scrollIntoViewIfNeeded();
  const before = await doc(page).evaluate((el) => el.scrollTop);
  await code.hover();
  await page.mouse.wheel(0, -300);
  await expect
    .poll(() => doc(page).evaluate((el) => el.scrollTop))
    .toBeLessThan(before - 100);
  await code.scrollIntoViewIfNeeded();
  await code.hover();
  await page.mouse.wheel(300, 0);
  await expect
    .poll(() => code.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
});

test("a two-axis embedded region scrolls internally then chains to the document at its edge", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/patterns/interaction-lab");
  await waitForCatalogReady(page);
  const region = page.getByRole("region", {
    name: "Build revisions",
    exact: true,
  });
  await region.scrollIntoViewIfNeeded();
  await region.hover();
  await page.mouse.wheel(300, 100);
  await expect
    .poll(() => region.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0);
  await expect
    .poll(() => region.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await region.evaluate((el) => (el.scrollTop = 0));
  const before = await doc(page).evaluate((el) => el.scrollTop);
  await page.mouse.wheel(0, -250);
  await expect
    .poll(() => doc(page).evaluate((el) => el.scrollTop))
    .toBeLessThan(before - 80);
});

test("sidebar containment prevents an edge wheel from unexpectedly moving the document", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/components/fieldset");
  await waitForCatalogReady(page);
  const region = page.getByRole("region", {
    name: "Catalog sections",
    exact: true,
  });
  await region.evaluate((el) => (el.scrollTop = el.scrollHeight));
  await region.hover();
  await page.mouse.wheel(0, 400);
  await expect(region).toHaveCSS("overscroll-behavior-y", "contain");
  expect(await doc(page).evaluate((el) => el.scrollTop)).toBe(0);
});

test("touch dragging over a wide table moves the document vertically without a hidden-axis trap", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 800 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/foundations/color");
  await waitForCatalogReady(page);
  const region = page.getByRole("region", {
    name: "Semantic color contrast",
    exact: true,
  });
  await region.scrollIntoViewIfNeeded();
  const before = await doc(page).evaluate((el) => el.scrollTop);
  const rect = (await region.boundingBox())!,
    y = Math.min(650, Math.max(250, rect.y + 180));
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 200, y }],
  });
  for (let distance = 30; distance <= 180; distance += 30) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 200, y: y - distance }],
    });
    await page.evaluate(() => new Promise(requestAnimationFrame));
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => doc(page).evaluate((el) => el.scrollTop))
    .toBeGreaterThan(before + 60);
  await context.close();
});
