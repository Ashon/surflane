import type { ComponentDoc } from './componentDocs'
export const appShellDocs: Record<string, ComponentDoc> = {
  'app-shell': {
    usage: [
      'Use the workspace layout to pair main content with a sidebar that holds a brand, a collapse toggle, and an account at the bottom. For documentation sites that need a global top rail, use the default header layout.',
      'AppShell provides the layout and native link styles. The caller owns the collapsed state, routes, account, and theme.',
      'The workspace sidebar collapses from 224px to 72px, and icons keep their positions. Center the 24px product mark on the navigation icon column.',
      'Set the product name on one line in the subsection role (Manrope 500, 16/24, --ink, default tracking), starting on the link label line. A long name truncates with an ellipsis and keeps its full text in title.',
      'An optional second line names the workspace in the caption role (12/18, --ink-muted). The account row mirrors the brand with a 24px Avatar and the name at body weight.',
      'The brand and account stay fixed while the menu and main content scroll in separate ScrollAreas. The content surface spans the full scrolling content, so its bottom rounded corners appear only at the end.',
      'Main content can also scroll with the document. In a full-viewport shell with no page behind it, set scrollChain="contain" so an edge scroll doesn\'t bounce the page.',
      'Derive each inner radius as max(0px, outer radius - inset) instead of stacking fixed values. The example starts from --radius-md (10px) for the content surface, then derives 22px for the shell (+12px inset) and 26px for the boundary (+3px padding, +1px border).',
      'The example sits in a fixed-height frame on the page, so its ScrollAreas keep the default scrollChain="auto" and hand the wheel to the page at their edges. Turn on Overflow navigation and Long workspace content to see the separate scrolling.',
      "Product selection and preview options sit outside the example boundary, and the theme switch sits in the account menu. The example's icon collapse is a product choice, and a real documentation site's sidebar is text-first.",
    ],
    avoid: [
      "Don't force an icon sidebar on every product. A documentation sidebar can stay text-first.",
      "Don't give links a menu role. Mark the current page with aria-current, not aria-expanded.",
      "Don't hide the desktop sidebar on mobile without other navigation. Provide a replacement, such as a bottom Sheet.",
      "Don't expect the layout module to handle permissions or sign-in. Handle them in the application.",
      "Don't fade the sidebar edge with a blur that blurs text.",
    ],
    anatomy:
      'AppShell.Root(layout=workspace) → mobile Header + Sidebar(brand, boundary toggle, ScrollArea(nav links), Footer(account + theme)) + Content(ScrollArea → Page); mobile: bottom Sheet(Header(Title, Description), Body(nav links), Footer(account, Close menu))',
    keyboard: [
      'Tab and Shift+Tab reach native links and buttons. Enter follows a link.',
      'The mobile bottom Sheet opens on the current destination. Choosing a destination closes the Sheet and moves focus to the new content heading.',
      "Base UI handles the Sheet's open button, Escape, focus trapping, and focus restoration on close. In a real product, the router owns navigation, back navigation, and scroll restoration.",
      'The toggle sets aria-expanded and aria-controls. Links keep a clear accessible name when collapsed.',
    ],
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
      <AppShell.Page>{children}</AppShell.Page>
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
        '20px / 12px; preview radius 22px',
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
        'layout slots with native attributes, className, and refs',
        'div / aside / div / div',
      ],
      [
        'Page',
        "the page surface in a workspace Content: inset from the shell on every side but the sidebar's, evenly without the sidebar at ≤760px and flush below a mobile Header; radius = max(0, radius - inset)",
        'div',
      ],
      [
        'Link',
        'native anchor: href, icon, label, aria-current, ref, and event handlers',
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
