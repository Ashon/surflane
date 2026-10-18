import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForCatalogReady } from "./catalog-ready";

test("easing time slider matches browser movement and duration changes keep normalized progress", async ({
  page,
}) => {
  await page.goto("/foundations/motion#easing");
  await waitForCatalogReady(page);
  const slider = page.getByRole("slider", { name: "Preview time" });
  await slider.focus();
  await page.keyboard.press("Home");
  for (let i = 0; i < 5; i++) await page.keyboard.press("PageUp");
  await expect(slider).toHaveAttribute("aria-valuenow", "50");
  const position = () =>
    page.locator(".easing-marker").evaluate((el) => {
      const box = el.getBoundingClientRect(),
        track = el.parentElement!.getBoundingClientRect();
      return (box.left - track.left) / (track.width - box.width);
    });
  const progress =
    Number(
      (await page.locator("[data-easing-readout]").innerText()).match(
        /Progress ([\d.]+)/,
      )![1],
    ) / 100;
  expect(Math.abs((await position()) - progress)).toBeLessThan(0.002);
  expect(progress).toBeGreaterThan(0.8);
  await page.getByRole("combobox", { name: "Easing role" }).click();
  await page
    .getByRole("option", { name: "Linear comparison", exact: true })
    .click();
  await slider.focus();
  await page.keyboard.press("Home");
  for (let i = 0; i < 5; i++) await page.keyboard.press("PageUp");
  expect(await position()).toBeCloseTo(0.5, 2);
  await page.getByRole("combobox", { name: "Preview duration" }).click();
  await page
    .getByRole("option", { name: "600ms (slow preview)", exact: true })
    .click();
  await slider.focus();
  await page.keyboard.press("Home");
  for (let i = 0; i < 5; i++) await page.keyboard.press("PageUp");
  expect(await position()).toBeCloseTo(0.5, 2);
  await page
    .getByRole("button", { name: "Play easing preview", exact: true })
    .click();
  await expect(
    page.getByRole("status", { name: "Easing playback status" }),
  ).toHaveText("Completed");
  await page.getByRole("button", { name: "Reset easing preview" }).click();
  expect(await position()).toBeCloseTo(0, 2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .getByRole("button", { name: "Play easing preview", exact: true })
    .click();
  await expect(
    page.getByRole("status", { name: "Easing playback status" }),
  ).toHaveText("Completed without motion");
  expect(await position()).toBeCloseTo(1, 2);
});
for (const theme of ["light", "dark"])
  test(`easing and inverted tooltip remain accessible in ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/foundations/motion#easing");
    await waitForCatalogReady(page);
    await page.evaluate(
      (t) => (document.documentElement.dataset.theme = t),
      theme,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.goto("/components/tooltip");
    await waitForCatalogReady(page);
    await page.evaluate(
      (t) => (document.documentElement.dataset.theme = t),
      theme,
    );
    await page.getByRole("button", { name: "Inspect logs" }).focus();
    const tip = page.locator(".pui-tooltip");
    await expect(tip).toBeVisible();
    await expect(tip).toHaveCSS("border-top-width", "0px");
    const colors = await tip.evaluate((el) => {
      const probe = document.createElement("span");
      document.body.append(probe);
      const resolve = (token: string) => {
        probe.style.color = `var(${token})`;
        return getComputedStyle(probe).color;
      };
      const expectedBg = resolve("--ink"),
        expectedFg = resolve("--canvas");
      probe.remove();
      return {
        bg: getComputedStyle(el).backgroundColor,
        fg: getComputedStyle(el).color,
        expectedBg,
        expectedFg,
      };
    });
    expect(colors.bg).toBe(colors.expectedBg);
    expect(colors.fg).toBe(colors.expectedFg);
    // Base UI 1.9 tooltips are visual labels, not landmarks; check WCAG rules here.
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  });
test("table sorting has inset hover surface and inline progress replaces its status icon", async ({
  page,
}) => {
  await page.goto("/components/table");
  await waitForCatalogReady(page);
  const sort = page.getByRole("button", { name: /Name/ });
  await sort.hover();
  await expect(sort).toHaveCSS("padding-left", "12px");
  await expect(sort).toHaveCSS("padding-right", "12px");
  const textX = await sort.evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el.firstChild!);
    return range.getBoundingClientRect().left - el.getBoundingClientRect().left;
  });
  expect(textX).toBeGreaterThanOrEqual(12);
  await page.goto("/components/inline-message");
  await waitForCatalogReady(page);
  await page
    .getByRole("button", { name: "Retry preview", exact: true })
    .click();
  await expect(page.locator(".pui-message-icon .pui-spinner")).toHaveCount(1);
  await expect(page.locator(".pui-message-actions .pui-spinner")).toHaveCount(
    0,
  );
});
test("toast expansion keeps grid and animates continuous card positions", async ({
  page,
}) => {
  await page.goto("/components/toast");
  await waitForCatalogReady(page);
  await page.getByRole("combobox", { name: "Notification duration" }).click();
  await page
    .getByRole("option", { name: "Until dismissed", exact: true })
    .click();
  await page.getByRole("button", { name: "Show batch", exact: true }).click();
  const viewport = page.locator(".pui-toast-viewport");
  const cards = viewport.locator(".pui-toast:not([data-limited])");
  await expect(cards).toHaveCount(3);
  await expect(cards.first()).toHaveCSS("border-top-width", "0px");
  expect(
    await cards.first().evaluate((el) => getComputedStyle(el).boxShadow),
  ).not.toBe("none");
  await expect(viewport).toHaveCSS("display", "grid");
  await cards.first().hover();
  await expect(viewport).toHaveAttribute("data-expanded", "");
  await expect(viewport).toHaveCSS("display", "grid");
  await expect
    .poll(() =>
      cards.evaluateAll((els) => {
        const b = els
          .map((el) => el.getBoundingClientRect())
          .sort((a, b) => a.top - b.top);
        return b.every((r, i) => !i || r.top >= b[i - 1].bottom + 7);
      }),
    )
    .toBe(true);
  await expect(cards.first()).toHaveCSS(
    "transition-duration",
    "0.36s, 0.36s, 0.32s, 0.32s",
  );
});

test("pointer crossing toast gaps preserves expanded state without churn", async ({
  page,
}) => {
  await page.goto("/components/toast");
  await waitForCatalogReady(page);
  await page.getByRole("combobox", { name: "Notification duration" }).click();
  await page
    .getByRole("option", { name: "Until dismissed", exact: true })
    .click();
  await page.getByRole("button", { name: "Show batch", exact: true }).click();
  const viewport = page.locator(".pui-toast-viewport");
  const cards = viewport.locator(".pui-toast:not([data-limited])");
  await cards.first().hover();
  await expect(viewport).toHaveAttribute("data-expanded", "");
  await expect
    .poll(() =>
      cards.evaluateAll((els) => {
        const b = els
          .map((el) => el.getBoundingClientRect())
          .sort((a, b) => a.top - b.top);
        return b.every((r, i) => !i || r.top >= b[i - 1].bottom + 7);
      }),
    )
    .toBe(true);
  await viewport.evaluate((el) => {
    (window as any).__collapseCount = 0;
    new MutationObserver((records) => {
      for (const r of records)
        if (
          r.attributeName === "data-expanded" &&
          !el.hasAttribute("data-expanded")
        )
          (window as any).__collapseCount++;
    }).observe(el, { attributes: true, attributeFilter: ["data-expanded"] });
  });
  const boxes = await cards.evaluateAll((els) =>
    els
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })
      .sort((a, b) => a.y - b.y),
  );
  for (let repeat = 0; repeat < 3; repeat++)
    for (const box of [...boxes, ...[...boxes].reverse()]) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height + 4, {
        steps: 8,
      });
      await expect(viewport).toHaveAttribute("data-expanded", "");
    }
  expect(await page.evaluate(() => (window as any).__collapseCount)).toBe(0);
  await page.mouse.move(10, 10);
  await expect(viewport).not.toHaveAttribute("data-expanded");
});

test("a new toast rises while existing cards retain opacity and move in one direction", async ({
  page,
}) => {
  await page.goto("/components/toast");
  await waitForCatalogReady(page);
  await page.getByRole("combobox", { name: "Notification duration" }).click();
  await page
    .getByRole("option", { name: "Until dismissed", exact: true })
    .click();
  await page.getByRole("button", { name: "Show success", exact: true }).click();
  const first = page.locator(".pui-toast:not([data-limited])");
  await expect(first).toHaveCSS("opacity", "1");
  await expect(first).not.toHaveAttribute("data-starting-style");
  const samples = await page.evaluate(async () => {
    const old = document.querySelector<HTMLElement>(".pui-toast")!;
    const button = Array.from(document.querySelectorAll("button")).find(
      (el) => el.textContent?.trim() === "Archive preview item",
    )!;
    button.click();
    const samples: { y: number; bottom: number; opacity: number }[] = [];
    for (let i = 0; i < 32; i++) {
      await new Promise(requestAnimationFrame);
      samples.push({
        y: old.getBoundingClientRect().y,
        bottom: old.getBoundingClientRect().bottom,
        opacity: Number(getComputedStyle(old).opacity),
      });
    }
    return samples;
  });
  expect(samples.every((s) => s.opacity === 1)).toBe(true);
  expect(samples.every((s, i) => !i || s.y <= samples[i - 1].y + 0.5)).toBe(
    true,
  );
  // A taller incoming card changes the old card's top edge; the bottom keeps the deck inset.
  expect(samples[0].bottom - samples.at(-1)!.bottom).toBeGreaterThan(5);
  expect(samples[0].bottom - samples.at(-1)!.bottom).toBeLessThan(15);
});

test("dismissing from an expanded stack does not clip moving cards, and tall stacks retain scrolling", async ({
  page,
}) => {
  await page.goto("/components/toast");
  await waitForCatalogReady(page);
  await page.getByRole("combobox", { name: "Notification duration" }).click();
  await page
    .getByRole("option", { name: "Until dismissed", exact: true })
    .click();
  await page.getByRole("button", { name: "Show batch", exact: true }).click();
  const viewport = page.locator(".pui-toast-viewport");
  const cards = viewport.locator(".pui-toast:not([data-limited])");
  await cards.first().hover();
  await expect(viewport).toHaveAttribute("data-expanded", "");
  await expect(viewport).toHaveCSS("overflow-y", "visible");
  await expect(cards).toHaveCount(3);
  await page.keyboard.press("F6");
  await cards
    .first()
    .getByRole("button", { name: "Dismiss notification" })
    .click();
  await expect.poll(() => page.locator(".pui-toast").count()).toBe(3);
  await expect(viewport).toHaveCSS("overflow-y", "visible");
  await cards
    .first()
    .getByRole("button", { name: "Dismiss notification" })
    .click();
  await expect(page.locator(".pui-toast")).toHaveCount(2);
  await expect(viewport).toHaveCSS("overflow-y", "visible");
  await page.setViewportSize({ width: 320, height: 240 });
  await page
    .getByRole("button", { name: "Show batch", exact: true })
    .evaluate((el: HTMLElement) => el.click());
  await expect(viewport).toHaveAttribute("data-stack-overflow", "");
  await page.keyboard.press("F6");
  await expect(viewport).toHaveCSS("overflow-y", "auto");
  expect(
    await viewport.evaluate((el) => el.scrollHeight > el.clientHeight),
  ).toBe(true);
});

for (const width of [1440, 320])
  for (const theme of ["light", "dark"])
    test(`mixed-height rich snackbars restore full actions at ${width}px ${theme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/components/toast");
      await waitForCatalogReady(page);
      await page.evaluate(
        (value) => (document.documentElement.dataset.theme = value),
        theme,
      );
      await page
        .getByRole("combobox", { name: "Notification duration" })
        .click();
      await page
        .getByRole("option", { name: "Until dismissed", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Archive preview item", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Show success", exact: true })
        .click();
      const viewport = page.locator(".pui-toast-viewport"),
        cards = viewport.locator(".pui-toast:not([data-limited])");
      await expect(cards).toHaveCount(2);
      await expect(viewport).not.toHaveAttribute("data-expanded");
      await expect
        .poll(() =>
          cards.evaluateAll((els) => {
            const front = els[0].getBoundingClientRect();
            return els.every(
              (el) => el.getBoundingClientRect().height <= front.height + 1,
            );
          }),
        )
        .toBe(true);
      const natural = await cards.evaluateAll((els) =>
        els.map((el) =>
          parseFloat(getComputedStyle(el).getPropertyValue("--toast-height")),
        ),
      );
      expect(Math.max(...natural) - Math.min(...natural)).toBeGreaterThan(25);
      await page.keyboard.press("F6");
      await expect(viewport).toHaveAttribute("data-expanded", "");
      const rich = cards.filter({ hasText: "Preview item archived" }),
        undo = rich.getByRole("button", { name: "Undo", exact: true });
      await expect(undo).toBeVisible();
      await expect
        .poll(() =>
          rich.evaluate((el) =>
            Math.abs(
              el.getBoundingClientRect().height -
                parseFloat(
                  getComputedStyle(el).getPropertyValue("--toast-height"),
                ),
            ),
          ),
        )
        .toBeLessThan(1);
      const r = (await rich.boundingBox())!,
        u = (await undo.boundingBox())!;
      expect(u.y + u.height).toBeLessThanOrEqual(r.y + r.height - 10);
      await undo.click();
      await expect(rich).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "Archive preview item", exact: true }),
      ).toBeEnabled();
    });
