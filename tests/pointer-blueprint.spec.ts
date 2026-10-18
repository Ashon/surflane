import { test, expect, type Locator } from "@playwright/test";
import { waitForCatalogReady } from "./catalog-ready";

async function pixels(canvas: Locator, point?: { x: number; y: number }) {
  return canvas.evaluate((node, point) => {
    const c = node as HTMLCanvasElement;
    const ctx = c.getContext("2d")!;
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    const dpr = devicePixelRatio;
    let count = 0,
      distant = 0,
      maximum = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (!data[i]) continue;
      count++;
      maximum = Math.max(maximum, data[i]);
      const index = (i - 3) / 4;
      if (
        point &&
        Math.hypot(
          (index % c.width) / dpr - point.x,
          Math.floor(index / c.width) / dpr - point.y,
        ) > 222
      )
        distant++;
    }
    return { count, distant, maximum, width: c.width, height: c.height };
  }, point);
}

for (const dpr of [1, 2, 3]) {
  test(`pointer guides track DOM edges in one device pixel at DPR ${dpr}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: dpr,
      reducedMotion: "reduce",
    });
    try {
      const page = await context.newPage();
      await page.goto("http://127.0.0.1:8066/components/button");
      await waitForCatalogReady(page);
      const button = page.getByRole("button", {
        name: "Run preview",
        exact: true,
      });
      await button.scrollIntoViewIfNeeded();
      const before = await button.boundingBox();
      const point = {
        x: before!.x + before!.width / 2,
        y: before!.y + before!.height / 2,
      };
      const canvas = page.locator(".pointer-blueprint");
      await page.mouse.move(point.x, point.y);
      await expect
        .poll(async () => (await pixels(canvas)).count)
        .toBeGreaterThan(100);
      expect(await button.boundingBox()).toEqual(before);
      const image = await pixels(canvas, point);
      expect(image.distant).toBe(0);
      expect(image.maximum).toBeLessThanOrEqual(77);
      expect(image.width).toBe(1440 * dpr);
      expect(image.height).toBe(1000 * dpr);
      const edge = await canvas.evaluate((node, rect) => {
        const c = node as HTMLCanvasElement,
          ctx = c.getContext("2d")!,
          dpr = devicePixelRatio;
        // Sample a horizontal edge away from intersecting vertical guides.
        const x = Math.floor((rect!.x + 27) * dpr),
          y = Math.floor(rect!.y * dpr);
        return [-1, 0, 1].map(
          (offset) => ctx.getImageData(x, y + offset, 1, 1).data[3],
        );
      }, before);
      expect(edge[0]).toBe(0);
      expect(edge[1]).toBeGreaterThan(0);
      expect(edge[2]).toBe(0);
      await button.click();
      await expect(
        page.getByText("Primary action previewed.", { exact: true }),
      ).toBeVisible();
      await page.keyboard.press("Tab");
      await expect.poll(async () => (await pixels(canvas)).count).toBe(0);
      await page.mouse.move(point.x + 2, point.y);
      await expect
        .poll(async () => (await pixels(canvas)).count)
        .toBeGreaterThan(0);
      await page.dispatchEvent("body", "pointerout", {
        pointerType: "mouse",
        relatedTarget: null,
      });
      await expect.poll(async () => (await pixels(canvas)).count).toBe(0);
    } finally {
      await context.close();
    }
  });
}

test("guides update for local scroll, DOM resize, route changes, and viewport resize", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/components/button");
  await waitForCatalogReady(page);
  const canvas = page.locator(".pointer-blueprint");
  const button = page.getByRole("button", { name: "Run preview", exact: true });
  await button.scrollIntoViewIfNeeded();
  const box = (await button.boundingBox())!;
  const point = { x: box.x + 25, y: box.y + 15 };
  await page.mouse.move(point.x, point.y);
  await expect
    .poll(async () => (await pixels(canvas)).count)
    .toBeGreaterThan(0);
  const edgeAlpha = async () =>
    canvas.evaluate(
      (node, p) => {
        const c = node as HTMLCanvasElement;
        return c
          .getContext("2d")!
          .getImageData(Math.floor(p.x), Math.floor(p.y), 1, 1).data[3];
      },
      { x: box.x + 27, y: box.y + box.height },
    );
  await expect.poll(edgeAlpha).toBeGreaterThan(0);
  await page.locator(".catalog-document-scroll").evaluate((el) => {
    el.scrollTop += 57;
  });
  await expect.poll(edgeAlpha).toBe(0);
  // Resize a live DOM control without moving the mouse; observer updates the guide.
  await page.locator(".catalog-document-scroll").evaluate((el) => {
    el.scrollTop -= 57;
  });
  await expect.poll(edgeAlpha).toBeGreaterThan(0);
  await button.evaluate((el) => {
    el.style.height = "64px";
  });
  await expect.poll(edgeAlpha).toBe(0);
  await page.setViewportSize({ width: 1100, height: 850 });
  await expect.poll(async () => (await pixels(canvas)).width).toBe(1100);
  await page
    .getByRole("link", { name: "Foundations", exact: true })
    .first()
    .click();
  await waitForCatalogReady(page);
  await expect(
    page.getByRole("heading", { name: "Foundations", exact: true }),
  ).toBeVisible();
  expect(await canvas.count()).toBe(1);
  expect(
    await canvas.evaluate((el) => getComputedStyle(el).pointerEvents),
  ).toBe("none");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("touch and forced colors suppress decorative guides", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:8066/");
    await waitForCatalogReady(page);
    const canvas = page.locator(".pointer-blueprint");
    await page.touchscreen.tap(200, 300);
    expect((await pixels(canvas)).count).toBe(0);
    await page.mouse.move(200, 300);
    await expect
      .poll(async () => (await pixels(canvas)).count)
      .toBeGreaterThan(0);
    await page.emulateMedia({ forcedColors: "active" });
    await expect(canvas).toBeHidden();
    await expect.poll(async () => (await pixels(canvas)).count).toBe(0);
    await expect(canvas).toHaveAttribute("aria-hidden", "true");
  } finally {
    await context.close();
  }
});

test("individual line ends fade smoothly and the layer fades away on pointer exit", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await waitForCatalogReady(page);
  const brand = page.getByRole("link", {
    name: "Surflane home",
    exact: true,
  });
  const box = (await brand.boundingBox())!;
  const canvas = page.locator(".pointer-blueprint");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect
    .poll(async () => (await pixels(canvas)).maximum)
    .toBeGreaterThan(60);
  const samples = await canvas.evaluate((node, box) => {
    const c = node as HTMLCanvasElement,
      ctx = c.getContext("2d")!;
    return [2, 12, 32, 64].map(
      (offset) =>
        ctx.getImageData(
          Math.floor(Math.max(0, box.x - 96) + offset),
          Math.floor(box.y),
          1,
          1,
        ).data[3],
    );
  }, box);
  expect(samples[0]).toBeLessThan(samples[1]);
  expect(samples[1]).toBeLessThan(samples[2]);
  expect(samples[2]).toBeLessThan(samples[3]);
  const upward = await canvas.evaluate((node, box) => {
    const c = node as HTMLCanvasElement;
    return c.getContext("2d")!.getImageData(Math.floor(box.x), 6, 1, 1).data[3];
  }, box);
  // A screen-clipped upper tail still carries its original gradient: it must
  // remain visible above the brand, rather than beginning a new 96px fade at y=0.
  expect(upward).toBeGreaterThan(20);
  const corner = await canvas.evaluate((node, box) => {
    const ctx = (node as HTMLCanvasElement).getContext("2d")!;
    const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    return [-8, 8, -50].map((offset) => {
      const x = Math.floor(box.x + offset),
        y = Math.floor(box.y);
      const distance = Math.hypot(x + 0.5 - center.x, y + 0.5 - center.y);
      const mask =
        distance <= 77
          ? 0.3 - (distance / 77) * 0.14
          : 0.16 * (1 - (distance - 77) / 143);
      return ctx.getImageData(x, y, 1, 1).data[3] / (255 * mask);
    });
  }, box);
  // Spatial spotlight fades everything equally. After accounting for it, the
  // corner and the first 12px extension must stay opaque; only the tail fades.
  expect(corner[0]).toBeGreaterThan(0.94);
  expect(corner[1]).toBeGreaterThan(0.94);
  expect(corner[2]).toBeGreaterThan(0.2);
  expect(corner[2]).toBeLessThan(0.8);
  await page.dispatchEvent("body", "pointerout", {
    pointerType: "mouse",
    relatedTarget: null,
  });
  await expect.poll(async () => (await pixels(canvas)).count).toBe(0);
  // The decorative layer never enters keyboard navigation or the accessibility tree.
  await expect(canvas).toHaveAttribute("aria-hidden", "true");
  expect(await canvas.getAttribute("tabindex")).toBeNull();
});

test("localized definition rows and values receive guides without moving or changing content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/foundations/content");
  await waitForCatalogReady(page);
  const row = page.locator(".content-value-list > div").nth(3);
  await row.scrollIntoViewIfNeeded();
  const canvas = page.locator(".pointer-blueprint");
  for (const selector of ["dt", "dd"]) {
    const cell = row.locator(selector);
    const before = (await cell.boundingBox())!;
    const text = await cell.textContent();
    await page.mouse.move(before.x + 35, before.y + before.height / 2);
    await expect
      .poll(() =>
        canvas.evaluate((node, box) => {
          const ctx = (node as HTMLCanvasElement).getContext("2d")!;
          return ctx.getImageData(
            Math.floor(box.x + 27),
            Math.floor(box.y),
            1,
            1,
          ).data[3];
        }, before),
      )
      .toBeGreaterThan(20);
    expect(await cell.boundingBox()).toEqual(before);
    expect(await cell.textContent()).toBe(text);
  }
  await page
    .getByRole("combobox", { name: "Formatting locale", exact: true })
    .click();
  await page
    .getByRole("option", { name: "English / United States", exact: true })
    .click();
  await expect(page.locator(".content-value-list dt").first()).toHaveText(
    "Recorded runs",
  );
  const updated = row.locator("dd");
  const box = (await updated.boundingBox())!;
  await page.mouse.move(box.x + 35, box.y + box.height / 2);
  await expect
    .poll(() =>
      canvas.evaluate(
        (node, box) =>
          (node as HTMLCanvasElement)
            .getContext("2d")!
            .getImageData(Math.floor(box.x + 27), Math.floor(box.y), 1, 1)
            .data[3],
        box,
      ),
    )
    .toBeGreaterThan(20);
});

for (const width of [1440, 600]) {
  test(`table cell guides follow actual cells and horizontal scrolling at ${width}px`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/components/table");
    await waitForCatalogReady(page);
    const table = page.locator("[data-preview-size] table");
    const canvas = page.locator(".pointer-blueprint");
    const checkCell = async (cell: Locator) => {
      await cell.scrollIntoViewIfNeeded();
      const box = (await cell.boundingBox())!;
      await page.mouse.move(box.x + 35, box.y + box.height / 2);
      await expect
        .poll(() =>
          canvas.evaluate(
            (node, box) =>
              (node as HTMLCanvasElement)
                .getContext("2d")!
                .getImageData(Math.floor(box.x + 27), Math.floor(box.y), 1, 1)
                .data[3],
            box,
          ),
        )
        .toBeGreaterThan(20);
      expect(await cell.boundingBox()).toEqual(box);
    };
    await checkCell(
      table.getByRole("columnheader", { name: "Cluster", exact: true }),
    );
    await checkCell(table.locator("tbody tr").nth(1).locator("td").nth(1));
    if (width === 600) {
      const viewport = page.getByRole("region", {
        name: "Environment comparison",
        exact: true,
      });
      const overflow = await viewport.evaluate(
        (el) => el.scrollWidth - el.clientWidth,
      );
      expect(overflow).toBeGreaterThan(0);
      await viewport.evaluate((el) => {
        el.scrollLeft = el.scrollWidth;
      });
      await expect
        .poll(() => viewport.evaluate((el) => el.scrollLeft))
        .toBeGreaterThan(0);
      await checkCell(table.locator("tbody tr").nth(1).locator("td").nth(2));
    }
    const checkbox = table.getByRole("checkbox", {
      name: "Select Documentation",
      exact: true,
    });
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });
}

test("scroll events paint the current geometry synchronously before the next frame", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/components/button");
  await waitForCatalogReady(page);
  const button = page.getByRole("button", { name: "Run preview", exact: true });
  await button.scrollIntoViewIfNeeded();
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + 35, box.y + box.height / 2);
  await expect
    .poll(async () => (await pixels(page.locator(".pointer-blueprint"))).count)
    .toBeGreaterThan(0);
  const events = await page.evaluate(() => {
    const viewport = document.querySelector<HTMLElement>(
      ".catalog-document-scroll",
    )!;
    const target = document.querySelector<HTMLElement>(
      '[data-preview-size] button[data-variant="primary"]',
    )!;
    const ctx = document
      .querySelector<HTMLCanvasElement>(".pointer-blueprint")!
      .getContext("2d")!;
    const results: number[] = [];
    const sample = () => {
      const bounds = target.getBoundingClientRect();
      results.push(
        ctx.getImageData(Math.floor(bounds.x + 27), Math.floor(bounds.y), 1, 1)
          .data[3],
      );
    };
    // This observer runs later in the SAME scroll dispatch, with no RAF/poll in
    // between: stale pixels from the old position cannot satisfy the assertion.
    document.addEventListener("scroll", sample, true);
    for (let step = 0; step < 5; step++) {
      viewport.scrollTop += 13;
      viewport.dispatchEvent(new Event("scroll"));
    }
    document.removeEventListener("scroll", sample, true);
    return results;
  });
  expect(events).toHaveLength(5);
  for (const alpha of events) expect(alpha).toBeGreaterThan(20);
});

test("table horizontal scroll repaints cell edges in the same event dispatch", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 600, height: 1000 });
  await page.goto("/components/table");
  await waitForCatalogReady(page);
  const cell = page
    .locator("[data-preview-size] tbody tr")
    .nth(1)
    .locator("td")
    .nth(1);
  await cell.scrollIntoViewIfNeeded();
  const box = (await cell.boundingBox())!;
  await page.mouse.move(box.x + 35, box.y + box.height / 2);
  await expect
    .poll(async () => (await pixels(page.locator(".pointer-blueprint"))).count)
    .toBeGreaterThan(0);
  const samples = await cell.evaluate((target) => {
    const viewport = target.closest<HTMLElement>(".pui-scroll-viewport")!;
    const ctx = document
      .querySelector<HTMLCanvasElement>(".pointer-blueprint")!
      .getContext("2d")!;
    const samples: number[] = [];
    const listener = () => {
      const bounds = target.getBoundingClientRect();
      samples.push(
        ctx.getImageData(Math.floor(bounds.x), Math.floor(bounds.y + 20), 1, 1)
          .data[3],
      );
    };
    document.addEventListener("scroll", listener, true);
    for (let step = 0; step < 4; step++) {
      viewport.scrollLeft += 11;
      viewport.dispatchEvent(new Event("scroll"));
    }
    document.removeEventListener("scroll", listener, true);
    return samples;
  });
  expect(samples).toHaveLength(4);
  for (const alpha of samples) expect(alpha).toBeGreaterThan(20);
});

test("Command modal input and result options paint above the portal and keep keyboard behavior", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/patterns/command-search");
  await waitForCatalogReady(page);
  await page
    .getByRole("button", { name: "Search documentation", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Command search",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  const canvas = page.locator(".pointer-blueprint");
  expect(
    await canvas.evaluate((el) => el.parentElement === document.body),
  ).toBe(true);
  const input = dialog.getByRole("combobox", {
    name: "Search pages and actions",
    exact: true,
  });
  await expect(input).toBeFocused();
  for (const target of [input, dialog.getByRole("option").first()]) {
    const box = (await target.boundingBox())!;
    await page.mouse.move(box.x + 35, box.y + box.height / 2);
    await expect
      .poll(() =>
        canvas.evaluate(
          (node, box) =>
            (node as HTMLCanvasElement)
              .getContext("2d")!
              .getImageData(Math.floor(box.x + 27), Math.floor(box.y), 1, 1)
              .data[3],
          box,
        ),
      )
      .toBeGreaterThan(20);
    expect(await target.boundingBox()).toEqual(box);
  }
  await input.fill("Button");
  await expect(dialog.getByRole("option", { name: /Button/ })).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect.poll(async () => (await pixels(canvas)).count).toBe(0);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Search documentation", exact: true }),
  ).toBeFocused();
  expect(await canvas.count()).toBe(1);
});
