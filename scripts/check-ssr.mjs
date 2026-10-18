import assert from "node:assert/strict";
import { mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { format } from "node:util";
import { build } from "esbuild";

// Plain Node: browser globals stay absent so render-time DOM access throws.
for (const name of ["window", "document", "matchMedia", "ResizeObserver"])
  assert.equal(typeof globalThis[name], "undefined", `${name} is defined`);

// Classes proving each fixture section rendered its components.
// Base UI portals mount after hydration, so overlays (even defaultOpen) emit
// only their triggers; Tree items build after mount, so only its frame renders.
const markers = {
  foundations: [
    "pui-size-scope",
    "pui-container",
    "pui-page-header",
    "pui-breadcrumbs",
    "pui-stack",
    "pui-heading",
    "pui-text",
    "pui-inline",
    "pui-badge",
    "pui-grid",
    "pui-grid-item",
    "pui-surface",
    "pui-prose",
    "pui-separator",
    "pui-link",
    "ssr-slot",
    "pui-icon",
  ],
  controls: [
    "pui-button",
    "pui-input",
    "pui-select-trigger",
    "pui-form",
    "pui-fieldset",
    "pui-field",
    "pui-textarea",
    "pui-checkbox",
    "pui-radio",
    "pui-switch",
    "pui-number-field",
    "pui-combobox-input",
    "pui-slider",
    "pui-otp-field",
    "pui-date-picker",
    "pui-date-range-picker",
    "pui-time-field",
    "pui-file-upload",
  ],
  commands: [
    "pui-toggle",
    "pui-toggle-group",
    "pui-toolbar",
    "pui-menubar",
    "pui-menu-trigger",
    "pui-context-trigger",
    "pui-navigation-menu",
  ],
  overlays: ["ssr-open-popover", "ssr-open-dialog", "pui-preview-trigger"],
  disclosure: [
    "pui-tabs",
    "pui-tabs-panel",
    "pui-accordion",
    "pui-accordion-panel",
    "pui-collapsible-panel",
    "pui-avatar-fallback",
    "pui-scroll-root",
  ],
  feedback: [
    "pui-progress",
    "pui-meter",
    "pui-spinner",
    "pui-skeleton",
    "pui-message",
    "pui-empty",
    "pui-toast-viewport",
    "pui-toast-title",
  ],
  data: [
    "pui-table",
    "pui-list",
    "pui-card",
    "pui-pagination",
    "pui-filter-bar",
    "pui-tree-scroll",
    "pui-chart",
    "pui-chart-table",
  ],
  content: ["pui-code-block", "pui-syntax", "pui-markdown"],
  shell: ["pui-app-shell", "pui-app-shell-sidebar", "pui-app-shell-link"],
};

const root = resolve(import.meta.dirname, "..");
const dir = mkdtempSync(join(tmpdir(), "surflane-ssr-"));
try {
  // Bare imports stay external; the linked node_modules resolves them to the built dist.
  symlinkSync(
    join(root, "node_modules"),
    join(dir, "node_modules"),
    "junction",
  );
  const outfile = join(dir, "fixture.mjs");
  await build({
    entryPoints: [join(root, "tests/ssr/fixture.tsx")],
    outfile,
    bundle: true,
    platform: "node",
    format: "esm",
    jsx: "automatic",
    packages: "external",
    logLevel: "warning",
  });
  const errors = [];
  const consoleError = console.error;
  console.error = (...args) => errors.push(format(...args));
  let html = "";
  try {
    const [{ SsrFixture }, { createElement }, { prerenderToNodeStream }] =
      await Promise.all([
        import(pathToFileURL(outfile).href),
        import("react"),
        import("react-dom/static"),
      ]);
    // prerender waits for Suspense boundaries, unlike a streamed shell.
    const { prelude } = await prerenderToNodeStream(createElement(SsrFixture), {
      signal: AbortSignal.timeout(30_000),
      onError(error, info) {
        errors.push(`${error?.stack ?? error}${info?.componentStack ?? ""}`);
      },
    });
    for await (const chunk of prelude) html += chunk;
  } catch (error) {
    errors.push(error?.stack ?? String(error));
  } finally {
    console.error = consoleError;
  }
  assert(!errors.length, `SSR render failed:\n\n${errors.join("\n\n")}`);
  const classes = new Set(
    [...html.matchAll(/class="([^"]*)"/g)].flatMap(([, value]) =>
      value.split(/\s+/),
    ),
  );
  const missing = Object.entries(markers).flatMap(([section, names]) => [
    ...(html.includes(`data-ssr="${section}"`) ? [] : [`${section}: section`]),
    ...names
      .filter((name) => !classes.has(name))
      .map((name) => `${section}: ${name}`),
  ]);
  assert.deepEqual(missing, [], "SSR markup is missing markers");
  const pui = [...classes].filter((name) => name.startsWith("pui-"));
  console.log(
    `SSR: ${Buffer.byteLength(html)} bytes HTML, ${pui.length} distinct pui- classes`,
  );
} finally {
  rmSync(dir, { recursive: true, force: true });
}
