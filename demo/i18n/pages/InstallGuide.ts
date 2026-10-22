import type { Locale } from '../../i18n'
import type { Extra, FileKind, Setup } from '../../installRecipes'

// Text between backticks renders as inline code.
const en = {
  setupTitle: 'Your setup',
  setupIntro:
    'The steps below follow these choices, and the page address keeps them.',
  framework: 'Framework',
  manager: 'Package manager',
  options: 'Options',
  tailwind: 'Tailwind CSS v4',
  tailwindHint: 'Utilities read Surflane tokens and override components.',
  fonts: 'Brand fonts',
  fontsHint: 'Manrope, Pretendard and JetBrains Mono. Off, system fonts.',
  remember: 'Remember the theme',
  rememberHint: "Saves the reader's light or dark choice. Off, always light.",
  step: (n: number, title: string) => `${n}. ${title}`,
  installTitle: 'Install',
  installIntro: 'Both packages ship with the same version and need React 19.',
  installLabel: 'Packages',
  extrasLabel: 'Extra components',
  extrasHint:
    'Each brings its own library. Pick only what you use; the rest stays out of your install.',
  extraNames: {
    chart: 'Chart',
    'date-picker': 'DatePicker',
    markdown: 'Markdown',
    tree: 'Tree',
    highlighting: 'Code highlighting',
  } as Record<Extra, string>,
  importsIntro: 'Import them from their own entry points:',
  importsLabel: 'Imports',
  newAppTitle: 'Start a new app',
  createLabel: 'New app',
  newAppNote: (framework: string, tailwind: boolean) =>
    ({
      next: tailwind
        ? '`--yes` keeps the defaults, Tailwind CSS included.'
        : '`--yes` keeps the other defaults: TypeScript, the App Router and Turbopack.',
      'react-router': tailwind
        ? 'The default template already sets up Tailwind CSS v4.'
        : 'The default template sets up Tailwind CSS; remove `tailwindcss()` from `vite.config.ts` if you skip it.',
    })[framework] ?? '',
  filesTitle: 'Add the files',
  filesIntro: 'Replace each file, or create it where it is missing.',
  filesLabel: 'Files',
  fileNotes: (kind: FileKind, { framework, tailwind, remember }: Setup) => {
    if (kind === 'config') return 'Add the Tailwind CSS plugin.'
    if (kind === 'styles')
      return "One line imports every Surflane stylesheet into Tailwind's `components` layer: above Preflight, below utilities. Keep no other rules from the template here."
    if (kind === 'page')
      return framework === 'next'
        ? 'Pages stay Server Components; use flat part names such as `DialogRoot` there.'
        : framework === 'astro'
          ? 'A React component, rendered as an island from the page.'
          : 'Every part ships its own styles.'
    if (kind === 'island')
      return '`client:load` makes the component interactive.'
    if (kind === 'switch')
      return '`ThemeSwitch` saves the choice in the `theme` cookie and crossfades with `transitionTheme`.'
    const styles = tailwind
      ? ''
      : "`@surflane/ui/all.css` loads every Surflane stylesheet. Drop the template's own stylesheet: its unlayered rules would override Surflane. "
    if (kind === 'entry')
      return styles || 'Load the fonts and the stylesheet once.'
    return (
      (framework === 'vite' ? '' : styles) +
      (!remember
        ? '`data-theme` picks the theme before the first paint; `pui-typography` applies document typography.'
        : framework === 'react-router'
          ? 'The root `loader` reads the saved theme, so the server renders it.'
          : framework === 'next'
            ? 'A `<head>` script applies the saved theme before the first paint. Reading `cookies()` here instead fails the build under Cache Components.'
            : 'A `<head>` script applies the saved theme before the first paint.')
    )
  },
  highlightNote:
    '`SyntaxHighlighting` colors the code in every `CodeBlock` inside it; each grammar loads on first use.',
  checkTitle: 'Check',
  checks: {
    highlighting: 'The code block colors its tokens.',
    theme: 'The page source has `data-theme` on `<html>`.',
    button:
      'The button fills with the brand color. Plain text means the styles did not load.',
    tailwind: 'Add `className="px-8"` to the button: the padding grows.',
    remember: 'Switch the theme and reload: it opens in the saved theme.',
  },
  layersTitle: 'Your CSS and the layers',
  layerRules: {
    unlayered:
      'Surflane keeps its rules in `surflane.*` cascade layers, so your own unlayered CSS overrides them, whatever the specificity.',
    reset:
      'A reset stays below Surflane when you declare its layer first, as in the example under “Layer order”.',
    tailwind:
      'With Tailwind CSS, utilities override Surflane, and Surflane overrides Preflight.',
  },
  layerOrderTitle: 'Layer order',
  layer: 'Layer',
  contents: 'Contents',
  layerRows: [
    ['surflane.tokens', 'Custom properties and inherited rendering hints'],
    ['surflane.themes', 'Theme presets; they override the tokens'],
    ['surflane.base', 'Composition, document typography and theme motion'],
    ['surflane.components', 'Controls, presentation classes and components'],
    [
      'surflane.sizes',
      'The size scheme and size variants, over component defaults',
    ],
  ] as [string, string][],
  layersCaption: 'Surflane cascade layers, lowest first',
  resetLabel: 'A reset below Surflane',
  themesLink: 'Themes',
  frameworksLink: 'Framework integration',
  examplesLink: 'Example apps',
  copyLabel: 'Copy code',
  copiedLabel: 'Copied',
}

export const text: Record<Locale, typeof en> = {
  en,
  ko: {
    setupTitle: '설정',
    setupIntro: '아래 단계는 이 선택을 따르며, 페이지 주소에 선택이 남습니다.',
    framework: '프레임워크',
    manager: '패키지 관리자',
    options: '옵션',
    tailwind: 'Tailwind CSS v4',
    tailwindHint:
      '유틸리티가 Surflane 토큰을 읽고 컴포넌트 스타일을 덮어씁니다.',
    fonts: '브랜드 글꼴',
    fontsHint:
      'Manrope, Pretendard, JetBrains Mono. 끄면 시스템 글꼴을 씁니다.',
    remember: '테마 기억',
    rememberHint:
      '고른 라이트·다크 테마를 저장합니다. 끄면 항상 라이트 테마입니다.',
    step: (n: number, title: string) => `${n}. ${title}`,
    installTitle: '설치',
    installIntro: '두 패키지는 같은 버전으로 배포되며 React 19가 필요합니다.',
    installLabel: '패키지',
    extrasLabel: '추가 컴포넌트',
    extrasHint:
      '각자 라이브러리를 함께 설치합니다. 쓰는 것만 고르면 나머지는 설치되지 않습니다.',
    extraNames: {
      chart: 'Chart',
      'date-picker': 'DatePicker',
      markdown: 'Markdown',
      tree: 'Tree',
      highlighting: '코드 하이라이팅',
    },
    importsIntro: '각자의 진입점에서 불러오세요.',
    importsLabel: 'import',
    newAppTitle: '새 앱 만들기',
    createLabel: '새 앱',
    newAppNote: (framework: string, tailwind: boolean) =>
      ({
        next: tailwind
          ? '`--yes`는 Tailwind CSS를 포함한 기본값을 그대로 씁니다.'
          : '`--yes`는 TypeScript, App Router, Turbopack 같은 나머지 기본값을 그대로 씁니다.',
        'react-router': tailwind
          ? '기본 템플릿에 Tailwind CSS v4가 이미 설정되어 있습니다.'
          : '기본 템플릿은 Tailwind CSS를 설정합니다. 쓰지 않으려면 `vite.config.ts`에서 `tailwindcss()`를 지우세요.',
      })[framework] ?? '',
    filesTitle: '파일 추가',
    filesIntro: '각 파일을 바꾸고, 없는 파일은 새로 만드세요.',
    filesLabel: '파일',
    fileNotes: (kind: FileKind, { framework, tailwind, remember }: Setup) => {
      if (kind === 'config') return 'Tailwind CSS 플러그인을 추가하세요.'
      if (kind === 'styles')
        return '한 줄로 모든 Surflane 스타일시트를 Tailwind의 `components` 레이어에 불러옵니다. Preflight보다 위, 유틸리티보다 아래입니다. 템플릿의 다른 규칙은 남기지 마세요.'
      if (kind === 'page')
        return framework === 'next'
          ? '페이지는 Server Component로 둡니다. 여기서는 `DialogRoot` 같은 평면 파트 이름을 쓰세요.'
          : framework === 'astro'
            ? '페이지에서 아일랜드로 렌더링하는 React 컴포넌트입니다.'
            : '모든 파트가 자체 스타일을 갖고 있습니다.'
      if (kind === 'island')
        return '`client:load`가 컴포넌트를 상호작용하게 만듭니다.'
      if (kind === 'switch')
        return '`ThemeSwitch`가 선택을 `theme` 쿠키에 저장하고 `transitionTheme`으로 교차 페이드합니다.'
      const styles = tailwind
        ? ''
        : '`@surflane/ui/all.css`가 모든 Surflane 스타일시트를 불러옵니다. 템플릿의 스타일시트는 빼세요. 레이어 밖의 규칙이라 Surflane을 덮어씁니다. '
      if (kind === 'entry')
        return styles || '글꼴과 스타일시트를 한 번 불러옵니다.'
      return (
        (framework === 'vite' ? '' : styles) +
        (!remember
          ? '`data-theme`이 첫 페인트 전에 테마를 정하고, `pui-typography`가 문서 타이포그래피를 적용합니다.'
          : framework === 'react-router'
            ? '루트 `loader`가 저장된 테마를 읽으므로 서버가 그 테마로 렌더링합니다.'
            : framework === 'next'
              ? '`<head>`의 스크립트가 첫 페인트 전에 저장된 테마를 적용합니다. 여기서 `cookies()`를 읽으면 Cache Components에서 빌드가 실패합니다.'
              : '`<head>`의 스크립트가 첫 페인트 전에 저장된 테마를 적용합니다.')
      )
    },
    highlightNote:
      '`SyntaxHighlighting` 안의 모든 `CodeBlock`이 하이라이팅되며, 문법은 처음 쓸 때 불러옵니다.',
    checkTitle: '확인',
    checks: {
      highlighting: '코드 블록의 토큰에 색이 입혀집니다.',
      theme: '페이지 소스의 `<html>`에 `data-theme`이 있습니다.',
      button:
        '버튼이 브랜드 색으로 채워집니다. 글자만 보이면 스타일을 불러오지 못한 것입니다.',
      tailwind: '버튼에 `className="px-8"`을 더하면 안쪽 여백이 커집니다.',
      remember: '테마를 바꾸고 새로고침하면 저장된 테마로 열립니다.',
    },
    layersTitle: '앱 CSS와 레이어',
    layerRules: {
      unlayered:
        'Surflane은 규칙을 `surflane.*` 캐스케이드 레이어에 두므로, 레이어 밖의 앱 CSS가 명시도와 관계없이 Surflane을 덮어씁니다.',
      reset:
        '리셋은 “레이어 순서”의 예시처럼 레이어를 먼저 선언하면 Surflane 아래에 놓입니다.',
      tailwind:
        'Tailwind CSS와 쓰면 유틸리티가 Surflane을, Surflane이 Preflight를 덮어씁니다.',
    },
    layerOrderTitle: '레이어 순서',
    layer: '레이어',
    contents: '내용',
    layerRows: [
      ['surflane.tokens', '사용자 정의 속성과 상속되는 렌더링 힌트'],
      ['surflane.themes', '토큰을 덮어쓰는 테마 프리셋'],
      ['surflane.base', '구성, 문서 타이포그래피, 테마 모션'],
      ['surflane.components', '컨트롤, 프레젠테이션 클래스, 컴포넌트'],
      ['surflane.sizes', '컴포넌트 기본값을 덮어쓰는 크기 체계와 크기 변형'],
    ],
    layersCaption: 'Surflane 캐스케이드 레이어, 낮은 것부터',
    resetLabel: 'Surflane 아래에 두는 리셋',
    themesLink: '테마',
    frameworksLink: '프레임워크 통합',
    examplesLink: '예제 앱',
    copyLabel: '코드 복사',
    copiedLabel: '복사됨',
  },
}
