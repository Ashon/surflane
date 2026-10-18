import React, { useEffect, useRef, useState } from "react";
import {
  AppShell,
  Button,
  Checkbox,
  Icon,
  type IconName,
  Menu,
  PageHeader,
  ScrollArea,
  Sheet,
} from "@surflane/ui";
const destinations: [string, IconName][] = [
  ["Overview", "monitor"],
  ["Resources", "copy"],
  ["Activity", "play"],
  ["Settings", "settings"],
];
export function AppShellExample({
  toggleTheme,
  id,
}: {
  toggleTheme: () => void;
  id?: string;
}) {
  const responsive = id === "responsive-navigation";
  const [longContent, setLongContent] = useState(false),
    [longNavigation, setLongNavigation] = useState(false);
  const contentViewport = useRef<HTMLDivElement>(null);
  const [longLabels, setLongLabels] = useState(false),
    [readOnly, setReadOnly] = useState(false);
  const sidebar = useRef<HTMLElement>(null);
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState("Overview"),
    [account, setAccount] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    selectedInPanel = useRef(false);
  const profile = "Surflane";
  const previewId = React.useId();
  // The dialog must close when its desktop navigation becomes available.
  useEffect(() => {
    const media = matchMedia("(max-width: 760px)");
    let lastFocused: Element | null = document.activeElement;
    const trackFocus = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target !== document.body)
        lastFocused = event.target;
    };
    document.addEventListener("focusin", trackFocus);
    const update = () => {
      if (!media.matches) setMobileOpen(false);
      else if (
        sidebar.current?.contains(document.activeElement) ||
        sidebar.current?.contains(lastFocused)
      )
        trigger.current?.focus({ preventScroll: true });
    };
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("focusin", trackFocus);
    };
  }, []);
  const links = (panel = false) => (
    <nav
      aria-label={
        panel ? "Mobile workspace navigation" : "Workspace navigation"
      }
    >
      {[
        ...destinations,
        ...(longNavigation
          ? Array.from({ length: 16 }, (_, index): [string, IconName] => [
              `Saved view ${index + 1}`,
              "copy",
            ])
          : []),
      ]
        .filter(([label]) => !readOnly || label !== "Settings")
        .map(([label, icon]) => (
          <AppShell.Link
            key={label}
            href={`#${previewId}-workspace`}
            label={
              longLabels && label === "Resources"
                ? "Resources / services and deployment pipelines by environment"
                : label
            }
            icon={<Icon name={icon} decorative />}
            aria-current={view === label ? "page" : undefined}
            onClick={(e) => {
              if (e.button || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)
                return;
              e.preventDefault();
              setView(label);
              contentViewport.current?.scrollTo({ top: 0 });
              setAccount(false);
              if (panel) {
                selectedInPanel.current = true;
                setMobileOpen(false);
              } else heading.current?.focus({ preventScroll: true });
            }}
          />
        ))}
    </nav>
  );
  const accountMenu = (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button
            variant="ghost"
            className="app-shell-account"
            aria-label="Preview user account menu"
          />
        }
      >
        <span className="pui-app-shell-icon">
          <Icon name="info" decorative />
        </span>
        <AppShell.Label>Preview user</AppShell.Label>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content>
          <Menu.Item
            onClick={() => {
              setAccount(true);
              contentViewport.current?.scrollTo({ top: 0 });
            }}
          >
            View preview profile
          </Menu.Item>
          <Menu.Item onClick={toggleTheme}>Rotate application theme</Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
  return (
    <>
      <div className="actions app-shell-preview-options">
        <label className="pui-choice-label">
          <Checkbox.Root
            checked={longNavigation}
            onCheckedChange={setLongNavigation}
          >
            <Checkbox.Indicator />
          </Checkbox.Root>
          Overflow navigation
        </label>
        <label className="pui-choice-label">
          <Checkbox.Root checked={longContent} onCheckedChange={setLongContent}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          Long workspace content
        </label>
      </div>
      {responsive && (
        <div className="actions app-shell-responsive-options">
          <label className="pui-choice-label">
            <Checkbox.Root checked={longLabels} onCheckedChange={setLongLabels}>
              <Checkbox.Indicator />
            </Checkbox.Root>
            Long navigation labels
          </label>
          <label className="pui-choice-label">
            <Checkbox.Root
              checked={readOnly}
              onCheckedChange={(checked) => {
                setReadOnly(checked);
                if (checked && view === "Settings") setView("Overview");
              }}
            >
              <Checkbox.Indicator />
            </Checkbox.Root>
            Read-only navigation
          </label>
        </div>
      )}
      <div
        className="catalog-example-frame"
        data-kind="pattern"
        data-content="workspace"
      >
        <AppShell.Root
          layout="workspace"
          collapsed={collapsed}
          className="app-shell-preview"
        >
          <AppShell.Header>
            <div className="app-shell-mobile-brand">
              <Icon name="monitor" decorative />
              <strong>{profile}</strong>
            </div>
            <Sheet.Root
              side="left"
              open={mobileOpen}
              onOpenChange={(open) => setMobileOpen(open)}
            >
              <Sheet.Trigger
                render={
                  <Button
                    ref={trigger}
                    variant="ghost"
                    size="icon"
                    className="app-shell-mobile-trigger"
                    aria-label="Open workspace navigation"
                    onClick={() => {
                      selectedInPanel.current = false;
                    }}
                  />
                }
              >
                <Icon name="menu" decorative />
              </Sheet.Trigger>
              <Sheet.Content
                className="app-shell-mobile-panel"
                aria-modal="true"
                closeLabel="Close workspace navigation"
                finalFocus={() => {
                  if (matchMedia("(min-width: 761px)").matches)
                    return (
                      sidebar.current?.querySelector<HTMLElement>(
                        'a[aria-current="page"]',
                      ) ?? heading.current
                    );
                  return selectedInPanel.current
                    ? heading.current
                    : trigger.current;
                }}
              >
                <Sheet.Title>Workspace navigation</Sheet.Title>
                <Sheet.Description>
                  Choose a local preview page.
                </Sheet.Description>
                {links(true)}
                {accountMenu}
              </Sheet.Content>
            </Sheet.Root>
          </AppShell.Header>
          <AppShell.Sidebar
            ref={sidebar}
            aria-label="Example workspace sidebar"
          >
            <div className="app-shell-brand" data-blueprint-guide>
              <Icon name="monitor" decorative />
              <AppShell.Label>
                <strong>{profile}</strong>
              </AppShell.Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="app-shell-collapse"
              aria-expanded={!collapsed}
              aria-controls={`${previewId}-navigation`}
              aria-label={
                collapsed
                  ? "Expand workspace sidebar"
                  : "Collapse workspace sidebar"
              }
              onClick={() => setCollapsed(!collapsed)}
            >
              <Icon name="menu" decorative />
            </Button>
            <ScrollArea
              orientation="vertical"
              label="Workspace destinations"
              rootClassName="app-shell-menu-scroll"
              className="app-shell-menu-viewport"
            >
              <div id={`${previewId}-navigation`}>
                <p className="app-shell-section-label">
                  <AppShell.Label>Workspace</AppShell.Label>
                </p>
                {links()}
              </div>
            </ScrollArea>
            <AppShell.Footer>{accountMenu}</AppShell.Footer>
          </AppShell.Sidebar>
          <AppShell.Content
            id={`${previewId}-workspace`}
            ref={(element) => {
              heading.current = element?.querySelector("h3") ?? null;
            }}
          >
            <ScrollArea
              ref={contentViewport}
              orientation="vertical"
              label="Workspace content"
              rootClassName="app-shell-content-scroll"
              className="app-shell-content-viewport"
            >
              <div className="app-shell-workspace-sheet">
                <PageHeader
                  title={view}
                  level={3}
                  headingProps={{ tabIndex: -1 }}
                  description={`${profile} / local workspace preview`}
                />
                <p>
                  Navigation and content stay separate, and icons keep their
                  horizontal position when the menu collapses.
                </p>
                <p>
                  The product manages accounts, permissions, routes and data
                  requests.
                </p>
                {longContent &&
                  Array.from({ length: 12 }, (_, index) => (
                    <section key={index}>
                      <h4>Workspace section {index + 1}</h4>
                      <p>
                        Local preview content for inspecting scrolling.
                        Navigation and the account footer remain available while
                        this content scrolls.
                      </p>
                    </section>
                  ))}
                {account && (
                  <p role="status">
                    Preview profile / no account service is connected.
                  </p>
                )}
              </div>
            </ScrollArea>
          </AppShell.Content>
        </AppShell.Root>
      </div>
    </>
  );
}
