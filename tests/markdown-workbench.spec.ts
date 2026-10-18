import { test, expect } from "@playwright/test";
import { waitForCatalogReady } from "./catalog-ready";

for (const width of [1440, 320]) {
  test(`Markdown workbench preserves edits between views at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/components/markdown");
    await waitForCatalogReady(page);
    const editor = page.getByRole("textbox", {
      name: "Markdown source",
      exact: true,
    });
    const article = page.getByRole("article", {
      name: "Markdown preview",
      exact: true,
    });
    const sourceBox = await editor.boundingBox();
    const previewBox = await page
      .locator(".markdown-preview-pane")
      .boundingBox();
    expect(sourceBox).toBeTruthy();
    expect(previewBox).toBeTruthy();
    if (width === 1440)
      expect(previewBox!.x).toBeGreaterThan(
        sourceBox!.x + sourceBox!.width - 1,
      );
    else
      expect(previewBox!.y).toBeGreaterThan(
        sourceBox!.y + sourceBox!.height - 1,
      );
    await editor.fill("# Local draft\n\nEdited **live** result.");
    await expect(
      article.getByRole("heading", { name: "Local draft" }),
    ).toBeVisible();
    const views = page.getByRole("group", { name: "Markdown view" });
    await views.getByRole("button", { name: "Preview", exact: true }).click();
    await expect(editor).toBeHidden();
    await expect(article).toBeVisible();
    await views.getByRole("button", { name: "Source", exact: true }).click();
    await expect(article).toBeHidden();
    await expect(editor).toHaveValue(
      "# Local draft\n\nEdited **live** result.",
    );
    await views.getByRole("button", { name: "Side by side" }).click();
    await expect(article).toBeVisible();
    await expect(
      views.getByRole("button", { name: "Side by side" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".markdown-preview-scroll")).toHaveCSS(
      "overflow-y",
      "auto",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Restore Markdown example" })
      .click();
    await expect(editor).toContainText("Deployment");
  });
}
