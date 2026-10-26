import type { ComponentDoc } from '../componentDocs'
export const doc: ComponentDoc = {
  usage: [
    'Use the workspace layout to pair main content with a sidebar that holds a brand, a collapse toggle, and an account at the bottom. For documentation sites that need a global top rail, use the default header layout.',
    'AppShell provides the layout and native link styles; the caller owns routes, account, and theme. The shell keeps the collapsed state itself: SidebarToggle collapses the sidebar, ⌘B (Ctrl+B elsewhere) does too outside text fields, persist remembers the state in localStorage, and on the rail each Link shows its name as a tooltip. Pass collapsed and onCollapsedChange to control the state, or read a cookie into defaultCollapsed so a server-rendered first paint is right.',
    "The workspace sidebar collapses from 224px to 72px, and icons keep their positions. Brand is its top row: it centers the product mark, about 24px, on the links' icon column, and hides on the rail, where the toggle takes its place. In the header it sits on one line.",
    'Brand sets the product name on one line in the subsection role (Manrope 500, 16/24, --surf-ink, default tracking), starting on the link label line. A long name truncates with an ellipsis and keeps its full text in title. Its description is an optional second line in the caption role (12/18, --surf-ink-muted), such as the workspace.',
    'Nav stacks Links with even gaps and, in the workspace sidebar, insets them so their icons sit on the rail. Its label shows over the links, keeps its row on the rail, and names the navigation; without one, give Nav an aria-label.',
    "Link takes render. Pass a router's link to keep client navigation, such as render={<NextLink href='/resources' />}. The account row is a Link rendered as the menu's trigger, render={<Menu.Trigger />}, with a 24px Avatar as its icon, so it lines up with the links.",
    'The brand and account stay fixed while the menu and main content scroll in separate ScrollAreas. The content surface spans the full scrolling content, so its bottom rounded corners appear only at the end.',
    'Main content can also scroll with the document. In a full-viewport shell with no page behind it, set scrollChain="contain" so an edge scroll doesn\'t bounce the page.',
    "The shell fills the window, and its edge is square: it is the window's edge. Only the page surface is rounded, by --surf-app-shell-page-radius (8px by default). Give the document no margin and the chrome background, as the install guide shows, so nothing shows around it.",
    "On a phone (≤760px) the frame gives way: the page meets the screen's edges below the mobile header, with no inset and no rounding.",
    'To show a shell inside a page, as this example does, let the frame round and clip it. Here the frame clips at 22px and sets --surf-app-shell-page-radius to --surf-radius-md (10px), so the frame, the clip and the page stay concentric: 26, 22 and 10px.',
    'The example sits in a fixed-height frame on the page, so its ScrollAreas keep the default scrollChain="auto" and hand the wheel to the page at their edges. Turn on Overflow navigation and Long workspace content to see the separate scrolling.',
    "Product selection and preview options sit outside the example boundary, and the theme switch sits in the account menu. The example's icon collapse is a product choice, and a real documentation site's sidebar is text-first.",
  ],
  avoid: [
    "Don't force an icon sidebar on every product. A documentation sidebar can stay text-first.",
    "Don't give links a menu role. Mark the current page with aria-current, not aria-expanded.",
    "Don't hide the desktop sidebar on mobile without other navigation. Provide a replacement, such as a bottom Sheet or BottomNavigation.",
    "Don't expect the layout module to handle permissions or sign-in. Handle them in the application.",
    "Don't fade the sidebar edge with a blur that blurs text.",
    "Don't give two shells on one page the shortcut. Set shortcut={false} on any shell that only illustrates, such as a mockup.",
  ],
  anatomy:
    'AppShell.Root(layout=workspace) → mobile Header(Brand, MenuTrigger) + Sidebar(Brand, SidebarToggle on the edge, ScrollArea(Nav(Links)), Footer(Link as the account menu trigger)) + Content(ScrollArea → Page); mobile: bottom Sheet(Header(Title, Description), Body(Nav(Links)), Footer(account, Close menu))',
  keyboard: [
    'Tab and Shift+Tab reach native links and buttons. Enter follows a link.',
    'The mobile bottom Sheet opens on the current destination. Choosing a destination closes the Sheet and moves focus to the new content heading.',
    "Base UI handles the Sheet's open button, Escape, focus trapping, and focus restoration on close. In a real product, the router owns navigation, back navigation, and scroll restoration.",
    'SidebarToggle sets aria-expanded and aria-controls, and its tooltip names the shortcut. ⌘B or Ctrl+B toggles the sidebar unless focus is in a text field. Collapsed links keep their accessible names and show them as tooltips on hover and focus.',
  ],
  tokens: [
    '--surf-space-3',
    '--surf-space-4',
    '--surf-space-6',
    '--surf-chrome',
    '--surf-canvas',
    '--surf-selected',
    '--surf-radius-full',
    '--surf-interaction-focus',
  ],
  code: `import { AppShell, Menu, ScrollArea, Sheet } from '@surflane/ui'

<AppShell.Root layout='workspace' persist='workspace-sidebar'>
  <AppShell.Header>
    <AppShell.Brand mark={logo} name='Acme Platform' />
    <Sheet.Root side='bottom'>
      <Sheet.Trigger
        render={<AppShell.MenuTrigger label='Open navigation' />}
      />
      {mobileNavigationSheet}
    </Sheet.Root>
  </AppShell.Header>
  <AppShell.Sidebar aria-label='Workspace'>
    <AppShell.Brand
      mark={logo}
      name='Acme Platform'
      description='platform-core'
      render={<RouterLink to='/' />}
    />
    <AppShell.SidebarToggle />
    <ScrollArea orientation='vertical' label='Workspace destinations'>
      <AppShell.Nav label='Workspace'>
        <AppShell.Link
          render={<RouterLink to='/resources' />}
          label='Resources'
          icon={resourceIcon}
          aria-current={isResources ? 'page' : undefined}
        />
      </AppShell.Nav>
    </ScrollArea>
    <AppShell.Footer>
      <Menu.Root>
        <AppShell.Link
          render={<Menu.Trigger />}
          label='Kim Hana'
          icon={avatar}
          aria-label='Kim Hana, account menu'
        />
        <Menu.Portal>{accountItems}</Menu.Portal>
      </Menu.Root>
    </AppShell.Footer>
  </AppShell.Sidebar>
  <AppShell.Content>
    <ScrollArea orientation='vertical' label='Workspace content'>
      <AppShell.Page>{children}</AppShell.Page>
    </ScrollArea>
  </AppShell.Content>
</AppShell.Root>

// MenuTrigger shows at <=760px, where the Sidebar is hidden. Its bottom Sheet
// holds the same Nav (see Responsive navigation).
// AppShell.Content is a div: render the application's single main landmark yourself.
// Route, permission, session, cookie and theme ownership stay with the application.`,
  props: [
    [
      'Root style --surf-app-shell-page-radius / --surf-app-shell-inset',
      "the page surface's radius and the shell's inset; the shell itself is square",
      '8px / 12px; preview 10px',
    ],
    [
      'Root.layout',
      'header (global rail) / workspace (sidebar brand, mobile-only header)',
      'header',
    ],
    [
      'Root.collapsed / defaultCollapsed / onCollapsedChange',
      'controlled or uncontrolled collapsed state; labels stay accessible',
      '— / false / —',
    ],
    [
      'Root.persist',
      'localStorage key that remembers the state; server-rendered apps read a cookie into defaultCollapsed instead',
      '—',
    ],
    [
      'Root.collapseBelow',
      'a window width, such as 1280, below which the sidebar starts on its rail; the toggle still opens it, and only the state above the width is remembered',
      '—',
    ],
    [
      'Root.shortcut',
      '⌘B or Ctrl+B toggles the sidebar outside text fields; one shell per page',
      'true',
    ],
    [
      'SidebarToggle.labels',
      '{ collapse, expand, shortcut }: the button name and tooltip in each state, and the shortcut the tooltip shows',
      'Collapse sidebar / Expand sidebar / Kbd: ⌘B or Ctrl+B',
    ],
    [
      'Root style --surf-app-shell-rail-width',
      'the collapsed rail width',
      'header 64px / workspace 72px',
    ],
    [
      'Root style --surf-app-shell-icon-column / --surf-app-shell-brand-height / --surf-app-shell-mark-size',
      "the links' icon column, which the brand's mark and the account line up on; the brand row's height; the mark's size",
      '40px / 80px / 24px',
    ],
    [
      'Root style --surf-app-shell-sidebar-width',
      'expanded width; header: 216px / 64px; workspace: 224px / 72px',
      'layout-dependent',
    ],
    [
      'MenuTrigger',
      "label (the button's name; say what it opens). An icon button that shows only at ≤760px, where the Sidebar hides, at the header's end. Render it into Sheet.Trigger",
      'Open navigation',
    ],
    [
      'Header / Sidebar / Content / Footer',
      'layout slots with native attributes, className, and refs',
      'div / aside / div / div',
    ],
    [
      'Page',
      "the page surface in a workspace Content: inset from the shell on every side but the sidebar's, rounded by --surf-app-shell-page-radius; at ≤760px it meets the screen's edges",
      'div',
    ],
    [
      'Brand',
      "mark (decorative, about 24px), name (one line, truncates, title), description (optional second line), render (such as a link home); the sidebar's top row, hidden on the workspace rail",
      'div',
    ],
    [
      'Nav',
      'label: a visible group name that also names the navigation; otherwise aria-label. Stacks Links with even gaps and insets them in the workspace sidebar',
      'nav',
    ],
    [
      'Link',
      'native anchor: href, icon, label, aria-current, ref, and event handlers; on the collapsed rail, label is also a tooltip',
      'caller-owned route',
    ],
    [
      'Link.render',
      'another element in the same row: a router link keeps client navigation, a Menu.Trigger makes the account row',
      'a',
    ],
    [
      'Label',
      'ellipsis while expanded; visually hidden while collapsed',
      'span',
    ],
    [
      'Mobile navigation',
      'caller-provided Sheet at ≤760px; desktop Sidebar is hidden',
      'explicit composition',
    ],
  ],
}
