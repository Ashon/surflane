# Release and compatibility validation

The release unit is three packages: `@surflane/design-tokens`, `@surflane/css` and `@surflane/ui`. They always share one version. `@surflane/ui` declares the other two as peers at `^<version>`, and `@base-ui/react` at `^1.9.0`. Classes are `surf-*` and custom properties `--surf-*`. All catalog data is fictional; host applications own routing, authentication, persistence and real transport.

## Checks

1. Run `npm ci`, `npm run build:catalog`, `npm run test:unit`, `npm run check:package`, `npm run check:ssr` and `npm run check:public`.
2. Install Playwright engines and run `npm run test:browsers`. Run `npm test` for the full Chromium suite. The browser gate uses the production catalog.
3. Run `npm run check:examples` to install packed tarballs into the Vite, Next.js, React Router and Astro examples, build them and verify server HTML, hydration and dialog focus in Chromium. See [framework integration](frameworks.md).
4. Run `npm run pack` to create local, content-addressed tarballs under `artifacts/`. Tarballs are versioned `<release version>-dev.<hash>` from staged copies; the repository manifests and lockfile keep the release version. `pack:local` performs the same local operation. Neither command touches sibling repositories or publishes packages.
5. Run `npm run export:source` for a source-only archive without repository history or local files.
6. Run `npm run test:visual` to compare the package's screenshots with their baselines in the Playwright Linux image. It renders the built package with only its own CSS.

`check:package` validates public export targets, root/subpath type compatibility, rejected Button variant/size typos, flat exports for every namespace part and a bundled Button fixture. Both import forms must remain below 16 KiB minified JS and 6 KiB gzip, with less than 256 bytes difference. React and CSS are excluded from this fixture budget.

`check:ssr` type-checks a fixture of the public components and renders it with `react-dom/static` in plain Node, without a DOM. Rendering must not throw or log errors.

## Public API

Button variants are primary, secondary, outline, ghost, destructive and link. A Button without a variant is primary. `default` is a deprecated alias for primary. Sizes are small/default/large, plus icon/icon-small/icon-large for square buttons. The short sm/md/lg spellings and xs, icon-sm, icon-xs and icon-lg are deprecated and go in a later minor.

Every namespace part has a flat export with the same component (`Dialog.Root` and `DialogRoot`). React Server Components cannot dot into client exports, so flat names are the Server Component form. New namespace parts need a flat export; `check:package` enforces this.

Dialog.Content and AlertDialog.Content accept focusBoundaryLabel, defaulting to “Continue dialog navigation”. Localize it with the dialog. It names the direct WebKit focus boundaries without changing focus handling. Custom raw Portal compositions remain the caller’s responsibility.

## Releasing to npm

1. Add a `## <version>` section to [CHANGELOG.md](../CHANGELOG.md).
2. Run `npm run release:version -- <version>`. It sets every package version and the Surflane peer ranges, and refreshes the lockfile.
3. Run `npm run release:verify -- v<version>`, commit, and tag the commit on `main` after the validation workflow passes: `git tag v<version> && git push origin v<version>`.
4. The [release workflow](../.github/workflows/release.yml) verifies the tag against the manifests and changelog, builds, runs the package, SSR and public-source checks, publishes unpublished packages with npm trusted publishing and creates a GitHub release from the changelog section. Versions with a prerelease suffix (`0.2.0-beta.1`) publish to the `next` dist-tag; others publish to `latest`.

npm generates provenance automatically for trusted publishing from this public repository. `repository.url` in every manifest must stay `git+https://github.com/Ashon/surflane.git`.

### First publish and trusted publishers

npm may not accept a trusted publisher for a package that does not exist yet. For the first version:

1. Run `npm login` with an account that can publish to the `surflane` organization.
2. Run `npm run release:publish -- --dry-run` and review each file list.
3. Run `npm run release:publish -- --otp=<code>`. npm requires two-factor authentication to publish, so enable it for authorization and writes first and pass the current one-time code. The script builds through `prepack`, publishes `@surflane/design-tokens`, `@surflane/css` and then `@surflane/ui`, and skips versions that are already published.
4. For each package, add a trusted publisher on npmjs.com (package settings → Trusted publishing) or with `npm trust github <package> --repo Ashon/surflane --file release.yml --env npm --allow-publish`. Use owner `Ashon`, repository `surflane`, workflow `release.yml` and environment `npm`. Allow `npm publish`: the workflow runs it, and without that permission the OIDC exchange fails with E403.
5. Optionally require 2FA and disallow token publishing in the package settings, so only the workflow can publish.

Later releases only need a pushed tag. A package added later, such as `@surflane/css` in 0.10, needs these steps once for its first version.

## Catalog site

`.github/workflows/pages.yml` deploys the catalog to GitHub Pages on every push to `main` and on manual runs. Enable it once in the repository settings: Pages → Build and deployment → Source: GitHub Actions. The site is served at https://surflane.page, the custom domain in the repository's Pages settings. The domain is verified in the account's Pages settings. Its DNS at name.com has apex A/AAAA records for GitHub Pages and a `www` CNAME to `ashon.github.io`.

`npm run build:pages` builds the same site into `artifacts/pages`. The workflow reads the base path from the Pages settings: `/` with the custom domain, or `/surflane/` (`--base /surflane/`) for a project site without one. Catalog routes stay root-relative in code: `demo/router.tsx` adds the base to links and strips it from the location. Use `Link` or `withBase()` for root-relative hrefs and `public/` assets. Pages has no single-page-app fallback, so `404.html` is a copy of `index.html`. Deep links render the catalog, but their first load returns HTTP 404.

## CI and manual validation

Pull requests run builds, API/bundle checks, SSR rendering, source-context scanning, local packing, core Chromium/Firefox/WebKit tests and the framework examples. Main and manual runs also run the full Chromium suite. Pushes to `main` also deploy the catalog site. Only the tag-triggered release workflow publishes to npm. Remote execution must be reviewed after the workflow is pushed.

Automated checks cover native form behavior, keyboard focus, dismissal, scrolling, reflow, themes and Axe. Separately record manual VoiceOver/NVDA, actual touch devices, zoom, OS forced colors, IME and HiDPI checks with OS/browser/AT versions and findings. Playwright emulation does not establish real-device or manual accessibility certification. Unsupported engine capabilities are recorded in test annotations.

## Release cadence

During 0.x, a minor carries breaking API or visual changes, and a patch only fixes. Batch the breaking changes: let them collect in `Unreleased` and ship them in one minor, so adopters migrate once rather than every few days. Ship a fix as a patch whenever it is ready.

- Give each breaking change a Migration entry with the old and the new spelling.
- Deprecate an alias in one minor and remove it in a later one.
