import { waitForCatalogReady } from "./catalog-ready";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("four sheet edges fit the viewport and restore focus after nested selection", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/patterns/interaction-lab");
    await waitForCatalogReady(page);
    for (const side of ["left", "right", "top", "bottom"]) {
      const trigger = page.getByRole("button", {
        name: `Open ${side} sheet`,
        exact: true,
      });
      await trigger.click();
      const panel = page.getByRole("dialog", {
        name: `${side[0].toUpperCase() + side.slice(1)} sheet`,
        exact: true,
      });
      await expect(panel).toBeVisible();
      await expect(panel).not.toHaveAttribute("data-starting-style", "");
      const box = await panel.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(box!.y + box!.height).toBeLessThanOrEqual(850);
      const body = panel.locator(".pui-panel-body");
      expect(
        await body.evaluate((el) => el.scrollHeight > el.clientHeight),
      ).toBe(true);
      await panel.getByRole("combobox").click();
      await page
        .getByRole("option", { name: "Production", exact: true })
        .click();
      await expect(panel.getByRole("combobox")).toHaveAttribute(
        "data-value",
        "production",
      );
      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
      await expect(trigger).toBeFocused();
    }
  }
});

test("drawer traps focus, supports a nested sheet and maintains its draft", async ({
  page,
}) => {
  await page.goto("/patterns/interaction-lab");
  await waitForCatalogReady(page);
  await page
    .getByRole("button", { name: "Open bottom drawer", exact: true })
    .click();
  const drawer = page.getByRole("dialog", {
    name: "Prepare deployment",
    exact: true,
  });
  await expect(drawer).toBeVisible();
  await drawer
    .getByRole("textbox", { name: "Run name" })
    .fill("Temporary review");
  await drawer.getByRole("combobox").click();
  await page.getByRole("option", { name: "Production", exact: true }).click();
  const review = drawer.getByRole("button", { name: "Review drawer details" });
  await review.click();
  const nested = page.getByRole("dialog", {
    name: "Deployment details",
    exact: true,
  });
  await expect(nested).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(nested).toBeHidden();
  await expect(review).toBeFocused();
  await expect(drawer.getByRole("textbox", { name: "Run name" })).toHaveValue(
    "Temporary review",
  );
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    await expect
      .poll(() => drawer.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Open bottom drawer", exact: true }),
  ).toBeFocused();
});

test("panels share themes, remain accessible and dismiss on outside press", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390])
    for (const dark of [false, true]) {
      await page.setViewportSize({ width, height: 850 });
      for (const kind of ["right sheet", "bottom drawer"]) {
        await page.goto("about:blank");
        await page.context().addCookies([
          {
            name: "surflane-theme",
            value: dark ? "dark" : "light",
            url: "http://127.0.0.1:8066/",
          },
        ]);
        await page.goto("/patterns/interaction-lab");
        await waitForCatalogReady(page);
        await expect(page.locator("html")).toHaveAttribute(
          "data-theme",
          dark ? "dark" : "light",
        );
        await page
          .getByRole("button", { name: `Open ${kind}`, exact: true })
          .click();
        const panel = page.getByRole("dialog");
        await expect(panel).toBeVisible();
        await expect(panel).not.toHaveAttribute("data-starting-style", "");
        expect(
          (
            await new AxeBuilder({ page })
              .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
              .analyze()
          ).violations,
        ).toEqual([]);
        await page.screenshot({
          path: `.data/${kind.replace(" ", "-")}-${width}-${dark ? "dark" : "light"}.png`,
        });
        await panel.getByRole("button", { name: "Cycle panel theme" }).click();
        await expect(page.locator("html")).not.toHaveAttribute(
          "data-theme-switching",
          "",
        );
        expect(
          await panel.evaluate((el) => getComputedStyle(el).backgroundColor),
        ).toBe(
          await page.evaluate(() => {
            const probe = document.createElement("span");
            probe.style.backgroundColor = "var(--canvas)";
            document.body.append(probe);
            const color = getComputedStyle(probe).backgroundColor;
            probe.remove();
            return color;
          }),
        );
        await page.mouse.click(2, 2);
        await expect(panel).toBeHidden();
      }
    }
});

test("drawer can be dragged closed and returns focus", async ({ page }) => {
  await page.goto("/patterns/interaction-lab");
  await waitForCatalogReady(page);
  const trigger = page.getByRole("button", {
    name: "Open bottom drawer",
    exact: true,
  });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Prepare deployment" });
  await expect(drawer).toBeVisible();
  const handle = drawer.locator(".pui-drawer-handle");
  await handle.hover();
  const b = await handle.boundingBox();
  await page.mouse.move(b!.x + b!.width / 2, b!.y + 2);
  await page.mouse.down();
  await page.mouse.move(b!.x + b!.width / 2, b!.y + 320, { steps: 15 });
  await page.mouse.up();
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("mobile touch swipe dismisses the drawer", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 850 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:8066/patterns/interaction-lab");
    await waitForCatalogReady(page);
    await page
      .getByRole("button", { name: "Open bottom drawer", exact: true })
      .tap();
    const drawer = page.getByRole("dialog", { name: "Prepare deployment" });
    await expect(drawer).not.toHaveAttribute("data-starting-style", "");
    await drawer.evaluate((el) =>
      Promise.all(
        el
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      ),
    );
    const b = await drawer.locator(".pui-drawer-handle").boundingBox();
    const client = await context.newCDPSession(page);
    const x = b!.x + b!.width / 2,
      y = b!.y + 2;
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    for (let i = 1; i <= 12; i++)
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y: y + (Math.min(300, 840 - y) * i) / 12 }],
      });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(drawer).toBeHidden();
  } finally {
    await context.close();
  }
});
