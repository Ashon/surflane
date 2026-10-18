# Framework examples

Minimal applications that consume `@surflane/ui` and `@surflane/design-tokens` the way a host application would. Each renders the same page: layout, a field, tabs and a dialog. The Next.js page renders it from a Server Component.

| Example                      | Framework                   | Start                        |
| ---------------------------- | --------------------------- | ---------------------------- |
| [vite](vite)                 | Vite + React                | `npm install && npm run dev` |
| [next](next)                 | Next.js App Router          | `npm install && npm run dev` |
| [react-router](react-router) | React Router framework mode | `npm install && npm run dev` |
| [astro](astro)               | Astro + React islands       | `npm install && npm run dev` |

The examples install the published packages. To verify them against the current source instead, run from the repository root:

```sh
npm run check:examples              # all examples
npm run check:examples -- next      # one example
```

The check packs local tarballs, installs them into a temporary copy of each example, builds it, serves the production output and verifies server HTML, hydration, dialog focus return and token loading in Chromium. See [framework integration](../docs/frameworks.md).
