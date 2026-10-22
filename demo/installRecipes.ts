// Install guide recipes: the commands and files for a framework and its options.
// Plain data, so demo/InstallGuide.tsx renders them and scripts/check-install-guide.mjs
// builds them into real apps.
export type Framework = 'next' | 'vite' | 'react-router' | 'astro'
export type Manager = 'npm' | 'pnpm' | 'yarn' | 'bun'
export type Extra =
  'chart' | 'date-picker' | 'markdown' | 'tree' | 'highlighting'
export type Setup = {
  framework: Framework
  manager: Manager
  tailwind: boolean
  fonts: boolean
  remember: boolean
  /** Components that need their own libraries, which @surflane/ui keeps optional. */
  extras: Extra[]
}
/** What a file does in the setup; the guide explains each kind in one line. */
export type FileKind =
  'config' | 'styles' | 'entry' | 'document' | 'page' | 'island' | 'switch'
export type GuideFile = {
  file: string
  kind: FileKind
  language: string
  code: string
}
export const frameworks: [Framework, string][] = [
  ['next', 'Next.js'],
  ['vite', 'Vite'],
  ['react-router', 'React Router'],
  ['astro', 'Astro'],
]
export const managers: Manager[] = ['npm', 'pnpm', 'yarn', 'bun']
export const defaults: Setup = {
  framework: 'next',
  manager: 'npm',
  tailwind: false,
  fonts: true,
  remember: false,
  extras: [],
}
export const flags = ['tailwind', 'fonts', 'remember'] as const
export const extras: { id: Extra; packages: string[]; imports?: string }[] = [
  {
    id: 'chart',
    packages: ['recharts'],
    imports: "import { Chart } from '@surflane/ui/chart'",
  },
  {
    id: 'date-picker',
    packages: ['react-aria-components'],
    imports:
      "import { DatePicker, DateRangePicker, TimeField } from '@surflane/ui/date-picker'",
  },
  {
    id: 'markdown',
    packages: ['react-markdown', 'remark-gfm'],
    imports: "import { Markdown } from '@surflane/ui/markdown'",
  },
  {
    id: 'tree',
    packages: [
      '@headless-tree/core',
      '@headless-tree/react',
      '@tanstack/react-virtual',
    ],
    imports: "import { Tree } from '@surflane/ui/tree'",
  },
  { id: 'highlighting', packages: ['shiki'] },
]
const chosen = (setup: Setup) =>
  extras.filter(({ id }) => setup.extras.includes(id))
/** Import lines for the chosen components that live on their own entry points. */
export function extraImports(setup: Setup) {
  return lines(...chosen(setup).flatMap(({ imports }) => imports ?? []))
}
const highlights = (setup: Setup) => setup.extras.includes('highlighting')
const highlightImport =
  "import { SyntaxHighlighting } from '@surflane/ui/syntax-highlighting'"

export function createCommand({ framework, manager, tailwind }: Setup) {
  const create = (pkg: string, npm: string) =>
    manager === 'npm' ? npm : `${manager} create ${pkg}`
  const astro = manager === 'npm' ? 'npx astro' : `${manager} astro`
  return [
    {
      next: `${create('next-app', 'npx create-next-app@latest')} my-app --yes${tailwind ? '' : ' --no-tailwind'}`,
      vite: `${create('vite', 'npm create vite@latest')} my-app ${manager === 'npm' ? '-- ' : ''}--template react-ts`,
      'react-router': `${create('react-router', 'npx create-react-router@latest')} my-app`,
      astro: `${manager === 'pnpm' ? 'pnpm create astro@latest' : create('astro', 'npm create astro@latest')} my-app`,
    }[framework],
    'cd my-app',
    ...(framework === 'astro'
      ? [`${astro} add react`, ...(tailwind ? [`${astro} add tailwind`] : [])]
      : []),
  ].join('\n')
}
export function installCommand(setup: Setup) {
  const { framework, manager, tailwind, fonts } = setup
  return [
    manager === 'npm' ? 'npm install' : `${manager} add`,
    '@surflane/ui @surflane/design-tokens',
    ...(fonts
      ? [
          '@fontsource-variable/manrope @fontsource-variable/jetbrains-mono pretendard',
        ]
      : []),
    ...(tailwind && framework === 'vite'
      ? ['tailwindcss @tailwindcss/vite']
      : []),
    ...chosen(setup).flatMap(({ packages }) => packages),
  ].join(' ')
}

function lines(...parts: (string | false)[]) {
  return parts.filter((part) => part !== false).join('\n')
}
// Reads the saved choice while the HTML parses, before the first paint.
const themeRead =
  "document.cookie.match(/(?:^|; )theme=(light|dark)/)?.[1] ?? 'light'"
const stylesFile: Record<Framework, string> = {
  next: 'app/globals.css',
  vite: 'src/index.css',
  'react-router': 'app/app.css',
  astro: 'src/styles/global.css',
}
const dir = { next: 'app', vite: 'src', 'react-router': 'app', astro: 'src' }

// One import brings every Surflane stylesheet. With Tailwind CSS it goes through the
// Tailwind entry file, inside Tailwind's components layer.
function styleImports({ framework, fonts, tailwind }: Setup, from: string) {
  return [
    ...(fonts
      ? [
          "import '@fontsource-variable/manrope'",
          "import '@fontsource-variable/jetbrains-mono'",
          "import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'",
        ]
      : []),
    tailwind
      ? `import '${from}${stylesFile[framework].split('/').pop()}'`
      : "import '@surflane/ui/all.css'",
  ]
}
function stylesheet(): GuideFile {
  return {
    file: '',
    kind: 'styles',
    language: 'css',
    code: lines(
      "@import 'tailwindcss';",
      "@import '@surflane/ui/all.css' layer(components);",
      "@import '@surflane/design-tokens/tailwind.css';",
    ),
  }
}
const viteConfig = lines(
  "import { defineConfig } from 'vite'",
  "import react from '@vitejs/plugin-react'",
  "import tailwindcss from '@tailwindcss/vite'",
  '',
  'export default defineConfig({',
  '  plugins: [react(), tailwindcss()],',
  '})',
)

function documentFile(setup: Setup): GuideFile[] {
  const { framework, remember } = setup
  if (framework === 'vite')
    return [
      {
        file: 'src/main.tsx',
        kind: 'entry',
        language: 'tsx',
        code: lines(
          "import { StrictMode } from 'react'",
          "import { createRoot } from 'react-dom/client'",
          ...styleImports(setup, './'),
          highlights(setup) && highlightImport,
          "import App from './App.tsx'",
          '',
          "createRoot(document.getElementById('root')!).render(",
          '  <StrictMode>',
          highlights(setup)
            ? '    <SyntaxHighlighting>\n      <App />\n    </SyntaxHighlighting>'
            : '    <App />',
          '  </StrictMode>,',
          ')',
        ),
      },
      {
        file: 'index.html',
        kind: 'document',
        language: 'html',
        code: lines(
          '<!doctype html>',
          '<html lang="en" data-theme="light">',
          '  <head>',
          '    <meta charset="UTF-8" />',
          '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
          '    <title>My app</title>',
          remember &&
            `    <script>\n      document.documentElement.dataset.theme =\n        ${themeRead}\n    </script>`,
          '  </head>',
          '  <body class="pui-typography">',
          '    <div id="root"></div>',
          '    <script type="module" src="/src/main.tsx"></script>',
          '  </body>',
          '</html>',
        ),
      },
    ]
  if (framework === 'next')
    return [
      {
        file: 'app/layout.tsx',
        kind: 'document',
        language: 'tsx',
        code: lines(
          "import type { Metadata } from 'next'",
          highlights(setup) && highlightImport,
          ...styleImports(setup, './'),
          '',
          "export const metadata: Metadata = { title: 'My app' }",
          remember &&
            `\n// The server renders light; the script applies the saved theme before the\n// first paint, so <html> may differ at hydration.\nconst themeScript = \`document.documentElement.dataset.theme = ${themeRead}\``,
          '',
          "export default function RootLayout({ children }: LayoutProps<'/'>) {",
          '  return (',
          remember
            ? "    <html lang='en' data-theme='light' suppressHydrationWarning>\n      <head>\n        <script dangerouslySetInnerHTML={{ __html: themeScript }} />\n      </head>"
            : "    <html lang='en' data-theme='light'>",
          highlights(setup)
            ? "      <body className='pui-typography'>\n        <SyntaxHighlighting>{children}</SyntaxHighlighting>\n      </body>"
            : "      <body className='pui-typography'>{children}</body>",
          '    </html>',
          '  )',
          '}',
        ),
      },
    ]
  if (framework === 'react-router')
    return [
      {
        file: 'app/root.tsx',
        kind: 'document',
        language: 'tsx',
        code: lines(
          'import {',
          '  isRouteErrorResponse,',
          '  Links,',
          '  Meta,',
          '  Outlet,',
          '  Scripts,',
          '  ScrollRestoration,',
          remember && '  useRouteLoaderData,',
          "} from 'react-router'",
          highlights(setup) && highlightImport,
          "import type { Route } from './+types/root'",
          ...styleImports(setup, './'),
          remember &&
            "\nexport function loader({ request }: Route.LoaderArgs) {\n  const theme = request.headers\n    .get('Cookie')\n    ?.match(/(?:^|;\\s*)theme=(light|dark)/)?.[1]\n  return { theme: theme ?? 'light' }\n}",
          '',
          'export function Layout({ children }: { children: React.ReactNode }) {',
          remember &&
            "  // Layout also renders the error boundary, where loader data can be missing.\n  const theme = useRouteLoaderData<typeof loader>('root')?.theme ?? 'light'",
          '  return (',
          remember
            ? "    <html lang='en' data-theme={theme}>"
            : "    <html lang='en' data-theme='light'>",
          '      <head>',
          "        <meta charSet='utf-8' />",
          "        <meta name='viewport' content='width=device-width, initial-scale=1' />",
          '        <Meta />',
          '        <Links />',
          '      </head>',
          "      <body className='pui-typography'>",
          highlights(setup)
            ? '        <SyntaxHighlighting>{children}</SyntaxHighlighting>'
            : '        {children}',
          '        <ScrollRestoration />',
          '        <Scripts />',
          '      </body>',
          '    </html>',
          '  )',
          '}',
          '',
          'export default function App() {',
          '  return <Outlet />',
          '}',
          '',
          'export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {',
          '  const message = isRouteErrorResponse(error)',
          '    ? `${error.status} ${error.statusText}`',
          "    : 'An unexpected error occurred.'",
          '  return <main>{message}</main>',
          '}',
        ),
      },
    ]
  return [
    {
      file: 'src/layouts/Layout.astro',
      kind: 'document',
      language: 'html',
      code: lines(
        '---',
        ...styleImports(setup, '../styles/'),
        '---',
        '',
        '<html lang="en" data-theme="light">',
        '  <head>',
        '    <meta charset="utf-8" />',
        '    <meta name="viewport" content="width=device-width" />',
        '    <title>My app</title>',
        remember &&
          `    <script is:inline>\n      document.documentElement.dataset.theme =\n        ${themeRead}\n    </script>`,
        '  </head>',
        '  <body class="pui-typography">',
        '    <slot />',
        '  </body>',
        '</html>',
      ),
    },
  ]
}
function pageFiles(setup: Setup): GuideFile[] {
  const { framework, remember } = setup
  const highlight = highlights(setup)
  // Astro islands are separate React roots, so the island brings its own provider.
  const provide = highlight && framework === 'astro'
  const pad = provide ? '  ' : ''
  const [file, name] = {
    next: ['app/page.tsx', 'default function Page'],
    vite: ['src/App.tsx', 'default function App'],
    'react-router': ['app/routes/home.tsx', 'default function Home'],
    astro: ['src/components/Hello.tsx', 'function Hello'],
  }[framework]
  const page: GuideFile = {
    file,
    kind: 'page',
    language: 'tsx',
    code: lines(
      highlight
        ? "import {\n  Button,\n  CodeBlock,\n  Container,\n  Heading,\n  Inline,\n  Stack,\n  Text,\n} from '@surflane/ui'"
        : "import { Button, Container, Heading, Inline, Stack, Text } from '@surflane/ui'",
      provide && highlightImport,
      remember &&
        `import { ThemeSwitch } from '${framework === 'react-router' ? '../' : './'}theme-switch'`,
      '',
      `export ${name}() {`,
      '  return (',
      provide && '    <SyntaxHighlighting>',
      ...[
        "    <Container width='reading'>",
        '      <Stack gap={4}>',
        "        <Heading level={1} size='page'>",
        '          Hello, Surflane',
        '        </Heading>',
        "        <Text color='secondary'>Tokens, components and themes are ready.</Text>",
        '        <Inline gap={2}>',
        "          <Button variant='primary'>Get started</Button>",
        remember && '          <ThemeSwitch />',
        '        </Inline>',
        highlight &&
          "        <CodeBlock code='npm install @surflane/ui' language='bash' />",
        '      </Stack>',
        '    </Container>',
      ].map((line) => line && pad + line),
      provide && '    </SyntaxHighlighting>',
      '  )',
      '}',
    ),
  }
  if (framework !== 'astro') return [page]
  return [
    page,
    {
      file: 'src/pages/index.astro',
      kind: 'island',
      language: 'html',
      code: lines(
        '---',
        "import Layout from '../layouts/Layout.astro'",
        "import { Hello } from '../components/Hello'",
        '---',
        '',
        '<Layout>',
        '  <Hello client:load />',
        '</Layout>',
      ),
    },
  ]
}
function themeSwitch({ framework }: Setup): GuideFile {
  return {
    file: `${dir[framework]}/${framework === 'astro' ? 'components/' : ''}theme-switch.tsx`,
    kind: 'switch',
    language: 'tsx',
    code: lines(
      framework === 'next' && "'use client'",
      "import { useLayoutEffect } from 'react'",
      "import { Button } from '@surflane/ui'",
      "import { transitionTheme } from '@surflane/design-tokens/theme-transition'",
      '',
      `const saved = () =>\n  ${themeRead}`,
      '',
      'export function ThemeSwitch() {',
      '  // A development remount can clear the attribute the first render set; restore it.',
      '  useLayoutEffect(() => {',
      '    document.documentElement.dataset.theme = saved()',
      '  }, [])',
      '  return (',
      '    <Button',
      '      onClick={() => {',
      "        const theme = saved() === 'dark' ? 'light' : 'dark'",
      '        document.cookie = `theme=${theme}; path=/; max-age=31536000; samesite=lax`',
      '        transitionTheme(() => {',
      '          document.documentElement.dataset.theme = theme',
      '        })',
      '      }}',
      '    >',
      '      Switch theme',
      '    </Button>',
      '  )',
      '}',
    ),
  }
}

/** Every file the setup needs, in the order a reader writes them. */
export function guideFiles(setup: Setup): GuideFile[] {
  const { framework, tailwind, remember } = setup
  return [
    ...(tailwind && framework === 'vite'
      ? [
          {
            file: 'vite.config.ts',
            kind: 'config' as const,
            language: 'typescript',
            code: viteConfig,
          },
        ]
      : []),
    ...(tailwind ? [{ ...stylesheet(), file: stylesFile[framework] }] : []),
    ...documentFile(setup),
    ...pageFiles(setup),
    ...(remember ? [themeSwitch(setup)] : []),
  ]
}

// AppShell fills the window with a square edge, so the document around it must not
// show: no browser margin, and the shell's chrome behind it.
export const appShellBody = lines(
  'body {',
  '  margin: 0;',
  '  background: var(--chrome);',
  '}',
)

export const resetExample = lines(
  '@layer reset, surflane;',
  "@import '@surflane/ui/all.css';",
  '',
  '@layer reset {',
  '  *,',
  '  ::before,',
  '  ::after {',
  '    box-sizing: border-box;',
  '  }',
  '}',
)
