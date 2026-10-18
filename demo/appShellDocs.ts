import type { ComponentDoc } from './componentDocs'
export const appShellDocs: Record<string, ComponentDoc> = {
  'app-shell': {
    usage:
      'As in the example, a workspace can be built from the main content plus a sidebar with a brand, a collapse toggle, and an account at the bottom. The brand is a 24px product mark centred on the navigation icon column and the product name in the subsection role (Manrope 500, 16/24, --ink, default tracking) on one line, starting on the link label line; a long name truncates with an ellipsis and keeps its full text in title. An optional second line names the workspace in the caption role (12/18, --ink-muted). The account row mirrors it with a 24px Avatar and the name at body weight. Documentation sites that need a global top rail use the default header layout. AppShell provides the layout and native link styles, while the caller controls the collapsed state, routes, account, and theme. The workspace layout collapses from 224px to 72px and keeps icon positions fixed. In the example, the theme switch is in the account menu. The brand and account stay fixed while the menu and main content scroll in separate ScrollAreas; try Overflow navigation and Long workspace content to see this. The content surface extends to the full length of the scrolling content, and its bottom rounded corners appear when you reach the end of the content. Product selection and preview options sit outside the example boundary. The example boundary has a 20px radius, the app shell inside its 1px border and 3px padding has 16px, and the content surface inset 12px inside it has 4px. Inner radii are computed as max(0px, outer radius - inset) instead of stacking fixed values. The main content can scroll with the document; in the example it sits in a fixed-height frame within the page, so its ScrollAreas keep the default scrollChain="auto" and hand the wheel to the page at their edges. In a full-viewport product shell with no page behind it, scrollChain="contain" stops an edge scroll from bouncing the page. The sidebar on a real documentation site is text-first, and the icon collapse in the example is a product choice.',
    avoid:
      "Don't force an icon sidebar on every product. Don't give links a menu role or use aria-expanded to indicate the current page. When you hide the desktop sidebar on mobile, always provide alternative navigation such as a bottom Sheet. The layout module doesn't handle permissions or sign-in. Don't use a blur fade at the sidebar edge that blurs text.",
    anatomy:
      'AppShell.Root(layout=workspace) → mobile Header + Sidebar(brand, boundary toggle, ScrollArea(nav links), Footer(account + theme)) + Content(ScrollArea); mobile: bottom Sheet(Header(Title, Description), Body(nav links), Footer(account, Close menu))',
    keyboard:
      'Tab / Shift+Tab reach native links and buttons, and Enter follows a link. Links keep a clear accessible name even when collapsed. The toggle connects aria-expanded and aria-controls. The mobile bottom Sheet opens on the current destination and leaves the open button, Escape, focus trapping, and focus restoration after closing to Base UI. Choosing a destination closes the Sheet and moves focus to the new content heading. In a real product, the product router manages navigation, back navigation, and scroll restoration.',
    tokens: [
      '--space-3',
      '--space-4',
      '--space-6',
      '--chrome',
      '--canvas',
      '--selected',
      '--radius-full',
      '--control-focus',
    ],
    code: `import { AppShell, ScrollArea, Button } from '@surflane/ui'

<AppShell.Root layout='workspace' collapsed={collapsed}>
  <AppShell.Header>
    {mobileBrand}
    {mobileNavigationTrigger}
  </AppShell.Header>
  <AppShell.Sidebar aria-label='Workspace'>
    {brand}
    <Button
      aria-expanded={!collapsed}
      aria-controls='workspace-nav'
      onClick={() => setCollapsed(!collapsed)}
    >
      Toggle sidebar
    </Button>
    <ScrollArea orientation='vertical' label='Workspace destinations'>
      <nav id='workspace-nav' aria-label='Workspace navigation'>
        <AppShell.Link
          href='/resources'
          label='Resources'
          icon={resourceIcon}
          aria-current={isResources ? 'page' : undefined}
        />
      </nav>
    </ScrollArea>
    <AppShell.Footer>{accountMenu}</AppShell.Footer>
  </AppShell.Sidebar>
  <AppShell.Content>
    <ScrollArea orientation='vertical' label='Workspace content'>
      <div className='workspace-sheet'>{children}</div>
    </ScrollArea>
  </AppShell.Content>
</AppShell.Root>

// Add a bottom Sheet navigation trigger at <=760px (see Responsive navigation).
// The desktop Sidebar is hidden.
// AppShell.Content is a div: render the application's single main landmark yourself.
// Route, permission, session, cookie and theme ownership stay with the application.`,
    props: [
      [
        'Root style --app-shell-radius / --app-shell-inset',
        'outer surface radius and spacing; inner radius = max(0, radius - inset)',
        '20px / 12px; preview radius 16px',
      ],
      [
        'Root.layout',
        'header (global rail) / workspace (sidebar brand, mobile-only header)',
        'header',
      ],
      [
        'Root.collapsed',
        'controlled sidebar width; labels remain accessible',
        'false',
      ],
      [
        'Root style --app-shell-sidebar-width',
        'expanded width; header: 216px / 64px; workspace: 224px / 72px',
        'layout-dependent',
      ],
      [
        'Header / Sidebar / Content / Footer',
        'layout slots with native attributes, className and refs',
        'div / aside / div / div',
      ],
      [
        'Link',
        'native anchor: href, icon, label, aria-current, ref and event handlers',
        'caller-owned route',
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
  },
}
