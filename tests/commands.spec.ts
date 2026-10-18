import { waitForCatalogReady } from "./catalog-ready";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { commandExampleIds } from "../demo/CommandExamples";
test.use({ reducedMotion: "reduce" });
test("Toggle has stable labels and pressed semantics, supports cancellation and blocks disabled activation", async ({
  page,
}) => {
  await page.goto("/components/toggle");
  await waitForCatalogReady(page);
  const pin = page.getByRole("button", { name: "Pin logs", exact: true }),
    timings = page.getByRole("button", { name: "Show timings", exact: true });
  await expect(pin).toHaveAttribute("aria-pressed", "false");
  await pin.focus();
  await pin.press("Space");
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  await expect(pin).toHaveCSS("border-left-width", "1px");
  await expect(pin).toHaveCSS("border-right-width", "1px");
  await expect(timings).toHaveAttribute("aria-pressed", "true");
  await timings.click();
  await expect(timings).toHaveAttribute("aria-pressed", "false");
  await page
    .getByRole("button", { name: "Cancel changes", exact: true })
    .click();
  await pin.click();
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  await timings.click();
  await expect(timings).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.getByRole("button", { name: "Unavailable mode", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("checkbox", { name: "Disable commands", exact: true })
    .check();
  await expect(pin).toBeDisabled();
});
test("ToggleGroup navigates without selecting, skips disabled items and permits a single selection to clear", async ({
  page,
}) => {
  await page.goto("/components/toggle-group");
  await waitForCatalogReady(page);
  const group = page.getByRole("group", {
      name: "Log source",
      exact: true,
    }),
    live = group.getByRole("button", { name: "Live", exact: true }),
    simulation = group.getByRole("button", { name: "Simulation", exact: true });
  await live.focus();
  await live.press("ArrowRight");
  await expect(simulation).toBeFocused();
  await expect(live).toHaveAttribute("aria-pressed", "true");
  await expect(simulation).toHaveAttribute("aria-pressed", "false");
  await simulation.press("Enter");
  await expect(simulation).toHaveAttribute("aria-pressed", "true");
  await expect(live).toHaveAttribute("aria-pressed", "false");
  await simulation.press("ArrowRight");
  await expect(live).toBeFocused();
  await live.press("End");
  await expect(simulation).toBeFocused();
  await simulation.press("Space");
  await expect(simulation).toHaveAttribute("aria-pressed", "false");
  await page
    .getByRole("button", { name: "Cancel source changes", exact: true })
    .click();
  await live.click();
  await expect(live).toHaveAttribute("aria-pressed", "false");
});
test("Multiple ToggleGroup retains independent values and synchronizes vertical/RTL navigation with layout", async ({
  page,
}) => {
  await page.goto("/components/toggle-group");
  await waitForCatalogReady(page);
  const group = page.getByRole("group", {
    name: "Visible log details",
    exact: true,
  });
  await group.getByRole("button", { name: "Timings", exact: true }).click();
  await expect(
    group.getByRole("button", { name: "Requests", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    group.getByRole("button", { name: "Timings", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await group.getByRole("button", { name: "Errors", exact: true }).click();
  await expect(
    group.getByRole("button", { name: "Errors", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page
    .getByRole("checkbox", { name: "Vertical layout", exact: true })
    .check();
  await group.getByRole("button", { name: "Requests", exact: true }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    group.getByRole("button", { name: "Errors", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("checkbox", { name: "Vertical layout", exact: true })
    .uncheck();
  await page
    .getByRole("checkbox", { name: "Right to left", exact: true })
    .check();
  await group.getByRole("button", { name: "Requests", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(
    group.getByRole("button", { name: "Errors", exact: true }),
  ).toBeFocused();
});
test("Toolbar roving focus composes real toggles without nested buttons and keeps disabled commands discoverable but inactive", async ({
  page,
}) => {
  await page.goto("/components/toolbar");
  await waitForCatalogReady(page);
  const bar = page.getByRole("toolbar", { name: "Run tools", exact: true }),
    refresh = bar.getByRole("button", { name: "Refresh", exact: true }),
    pin = bar.getByRole("button", { name: "Pin results", exact: true }),
    unavailable = bar.getByRole("button", { name: "Delete runs", exact: true });
  await refresh.focus();
  await refresh.press("ArrowRight");
  await expect(pin).toBeFocused();
  await pin.press("Space");
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  await expect(bar.locator("button button")).toHaveCount(0);
  await pin.press("ArrowRight");
  await expect(unavailable).toBeFocused();
  await expect(unavailable).toHaveAttribute("aria-disabled", "true");
  await unavailable.press("Enter");
  await expect(page.locator('#preview p[role="status"]')).toHaveText(
    "No command executed.",
  );
  await refresh.click();
  await expect(page.locator('#preview p[role="status"]')).toHaveText(
    "Run list refreshed.",
  );
});
test("Toolbar preserves input caret editing, native links and menu command focus restoration", async ({
  page,
}) => {
  await page.goto("/components/toolbar");
  await waitForCatalogReady(page);
  const bar = page.getByRole("toolbar", { name: "Run tools", exact: true }),
    input = bar.getByRole("textbox", {
      name: "Filter services",
      exact: true,
    });
  await input.fill("abc");
  await input.press("ArrowLeft");
  await expect(input).toBeFocused();
  expect(
    await input.evaluate((e) => (e as HTMLInputElement).selectionStart),
  ).toBe(2);
  const more = bar.getByRole("button", { name: "More actions", exact: true });
  await more.click();
  await page
    .getByRole("menuitem", { name: "Export logs", exact: true })
    .click();
  await expect(more).toBeFocused();
  await expect(page.locator('#preview p[role="status"]')).toHaveText(
    "Log export previewed.",
  );
  await bar.getByRole("link", { name: "Toolbar help", exact: true }).click();
  await expect(page).toHaveURL(/#toolbar-help$/);
});
test("Toolbar disabled state blocks actions while preserving native link navigation", async ({
  page,
}) => {
  await page.goto("/components/toolbar");
  await waitForCatalogReady(page);
  const bar = page.getByRole("toolbar", { name: "Run tools", exact: true });
  await page
    .getByRole("checkbox", { name: "Disable commands", exact: true })
    .check();
  const refresh = bar.getByRole("button", { name: "Refresh", exact: true });
  await expect(refresh).toHaveAttribute("aria-disabled", "true");
  await refresh.click({ force: true });
  await expect(page.locator('#preview p[role="status"]')).toHaveText(
    "No command executed.",
  );
  await expect(
    bar.getByRole("link", { name: "Toolbar help", exact: true }),
  ).toHaveAttribute("href", "#toolbar-help");
});
test("Menubar opens and switches application menus with keyboard and restores its active trigger on Escape", async ({
  page,
}) => {
  await page.goto("/components/menubar");
  await waitForCatalogReady(page);
  const bar = page.getByRole("menubar", {
      name: "Deployment commands",
      exact: true,
    }),
    run = bar.getByRole("menuitem", { name: "Run", exact: true }),
    view = bar.getByRole("menuitem", { name: "View", exact: true });
  await run.focus();
  await run.press("ArrowRight");
  await expect(view).toBeFocused();
  await view.press("ArrowDown");
  await expect(
    page.getByRole("menuitemcheckbox", {
      name: "Show passed checks",
      exact: true,
    }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(view).toBeFocused();
  await expect(page.getByRole("menu")).toHaveCount(0);
});
test("Shared Menu skins support checkbox/radio states and submenu commands without manual classes", async ({
  page,
}) => {
  await page.goto("/components/menubar");
  await waitForCatalogReady(page);
  const bar = page.getByRole("menubar", {
    name: "Deployment commands",
    exact: true,
  });
  await bar.getByRole("menuitem", { name: "View", exact: true }).click();
  const passed = page.getByRole("menuitemcheckbox", {
    name: "Show passed checks",
    exact: true,
  });
  await expect(passed).toHaveClass(/pui-menu-item/);
  await expect(passed).toHaveAttribute("aria-checked", "true");
  await passed.click();
  await expect(passed).toHaveAttribute("aria-checked", "false");
  await page
    .getByRole("menuitemradio", { name: "Compact", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#preview")).toContainText(
    "Passed checks: hidden / Detail: compact",
  );
  await bar.getByRole("menuitem", { name: "Run", exact: true }).click();
  const sub = page.getByRole("menuitem", { name: "More tools", exact: true });
  await sub.focus();
  await sub.press("ArrowRight");
  await page
    .getByRole("menuitem", { name: "Validate package", exact: true })
    .click();
  await expect(page.locator('#preview p[role="status"]')).toHaveText(
    "Package validation previewed.",
  );
});
test("Command components fit light/dark narrow layouts, audit closed pages and scoped open menus, and preserve enlarged reflow", async ({
  page,
}) => {
  for (const id of commandExampleIds) {
    await page.goto(`/components/${id}`);
    await waitForCatalogReady(page);
    await page.setViewportSize({ width: 320, height: 1000 });
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      expect(
        (await new AxeBuilder({ page }).analyze()).violations,
        `${id} ${theme}`,
      ).toEqual([]);
      if (id === "menubar") {
        await page
          .getByRole("menubar", { name: "Deployment commands", exact: true })
          .getByRole("menuitem", { name: "Run", exact: true })
          .click();
        expect(
          (await new AxeBuilder({ page }).include(".pui-menu").analyze())
            .violations,
        ).toEqual([]);
        await page.keyboard.press("Escape");
        await page
          .getByRole("menubar", { name: "Deployment commands", exact: true })
          .getByRole("menuitem", { name: "View", exact: true })
          .click();
        expect(
          (await new AxeBuilder({ page }).include(".pui-menu").analyze())
            .violations,
        ).toEqual([]);
        await page.keyboard.press("Escape");
      }
    }
    await page.evaluate(
      () => (document.documentElement.style.fontSize = "200%"),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
});

test("Menubar vertical and RTL variants keep the expected command focus order and disabled triggers do not open menus", async ({
  page,
}) => {
  await page.goto("/components/menubar");
  await waitForCatalogReady(page);
  const bar = page.getByRole("menubar", {
    name: "Deployment commands",
    exact: true,
  });
  await bar.getByRole("menuitem", { name: "View", exact: true }).click();
  await page
    .getByRole("menuitemradio", { name: "Compact", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await page
    .getByRole("checkbox", { name: "Vertical layout", exact: true })
    .check();
  await bar.getByRole("menuitem", { name: "Run", exact: true }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    bar.getByRole("menuitem", { name: "View", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("menuitemcheckbox", {
      name: "Show passed checks",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("menuitemradio", { name: "Compact", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Escape");
  await page
    .getByRole("checkbox", { name: "Vertical layout", exact: true })
    .uncheck();
  await page
    .getByRole("checkbox", { name: "Right to left", exact: true })
    .check();
  await bar.getByRole("menuitem", { name: "Run", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(
    bar.getByRole("menuitem", { name: "View", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("checkbox", { name: "Disable commands", exact: true })
    .check();
  await bar
    .getByRole("menuitem", { name: "View", exact: true })
    .click({ force: true });
  await expect(page.getByRole("menu")).toHaveCount(0);
});
test("Toolbar vertical focus order follows its visible layout and pressed toggles remain visible in forced colors", async ({
  page,
}) => {
  await page.goto("/components/toolbar");
  await waitForCatalogReady(page);
  await page
    .getByRole("checkbox", { name: "Vertical layout", exact: true })
    .check();
  const bar = page.getByRole("toolbar", { name: "Run tools", exact: true });
  await bar.getByRole("button", { name: "Refresh", exact: true }).focus();
  await page.keyboard.press("ArrowDown");
  const pin = bar.getByRole("button", { name: "Pin results", exact: true });
  await expect(pin).toBeFocused();
  await pin.press("Space");
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  await page.emulateMedia({ forcedColors: "active" });
  expect(await pin.evaluate((e) => getComputedStyle(e).outlineWidth)).toBe(
    "2px",
  );
  expect(
    await pin.evaluate((e) => getComputedStyle(e, "::after").borderTopWidth),
  ).toBe("1px");
});
