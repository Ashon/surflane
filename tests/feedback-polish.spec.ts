import { test, expect } from "@playwright/test";
import { waitForCatalogReady } from "./catalog-ready";

test("toast entry is unhurried and a swipe never widens the document", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto("/components/toast");
  await waitForCatalogReady(page);
  await page
    .getByRole("button", { name: "Archive preview item", exact: true })
    .tap();
  const card = page.locator(".pui-toast:not([data-limited])");
  await expect(card).toBeVisible();
  await expect(card).toHaveCSS(
    "transition-duration",
    "0.36s, 0.36s, 0.32s, 0.32s",
  );
  await expect(card).not.toHaveAttribute("data-starting-style");
  await expect
    .poll(() => card.evaluate((element) => getComputedStyle(element).opacity))
    .toBe("1");
  const box = (await card.boundingBox())!;
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + 80, y: box.y + 22 }],
  });
  for (let distance = 30; distance <= 180; distance += 30) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: box.x + 80 + distance, y: box.y + 22 }],
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(card).toHaveCount(0);
  await context.close();
});

test("avatar status is a separate ringed marker and survives fallback", async ({
  page,
}) => {
  await page.goto("/components/avatar");
  await waitForCatalogReady(page);
  const avatar = page.getByRole("img", {
    name: "Preview profile",
    exact: true,
  });
  await expect(avatar).toHaveAccessibleDescription("Online");
  const marker = avatar.locator(".pui-avatar-status");
  await expect(marker).toHaveAttribute("aria-hidden", "true");
  await expect(marker).toHaveCSS("border-top-width", "2px");
  const box = (await avatar.boundingBox())!,
    dot = (await marker.boundingBox())!;
  expect(dot.width).toBeGreaterThanOrEqual(10);
  expect(dot.width).toBeLessThanOrEqual(12);
  expect(dot.x + dot.width).toBeLessThanOrEqual(box.x + box.width);
  expect(dot.y + dot.height).toBeLessThanOrEqual(box.y + box.height);
  await page
    .getByRole("button", { name: "Preview broken image", exact: true })
    .click();
  await expect(avatar.locator(".pui-avatar-fallback")).toBeVisible();
  await expect(marker).toBeVisible();
});
