// Catalog metadata describes roles; values always come from the CSS source.
export const categories = [
  'Color',
  'Typography',
  'Layout',
  'Spacing',
  'Shape',
  'Controls',
  'Status',
  'Motion',
  'Layers',
]
// Names carry the --surf- namespace; the rules read the name after it.
const bare = (name) => name.replace(/^--surf-/, '--')
export function category(prefixed) {
  const name = bare(prefixed)
  if (/^--(font|type|weight|tracking)/.test(name)) return 'Typography'
  if (/^--space-/.test(name)) return 'Spacing'
  if (/^--(radius|logo-size|avatar-size|icon-|chart-line-)/.test(name))
    return 'Shape'
  if (/^--(status|badge)-/.test(name)) return 'Status'
  if (/^--(duration|ease|motion|dialog-|toast-|theme-transition)/.test(name))
    return 'Motion'
  if (/^--layer-/.test(name)) return 'Layers'
  if (/^--(size-|control|menu|interaction|scrollbar|focus-ring)/.test(name))
    return 'Controls'
  if (
    /^--(layout|density|ui-density|sheet-inset|collection|page-header|grid-cell|grid-major-cell|grid-base|grid-halo|veil)/.test(
      name,
    )
  )
    return 'Layout'
  return 'Color'
}
export function type(prefixed) {
  const name = bare(prefixed)
  if (/^--(font|weight|tracking|type)/.test(name)) return 'typography'
  if (
    /^(--chrome|--canvas|--surface|--plane|--recessed|--code-bg|--hover|--selected|--selected-edge|--slider-track|--line|--ink.*|--syntax-.+|--brand.*|--on-brand|--success|--caution|--danger|--info|--trend-(up|down)|--grid-minor|--grid-major|--guide|--skeleton.*)$/.test(
      name,
    ) ||
    /--(status-.+-(fg|bg|border|mark)|badge-.+-bg|menu-.+|tooltip-.+|chart-series-\d+|chart-category-\d+|trend-(up|down)-(fg|bg)|trend-flat-fg|selection-(background|foreground)|interaction-.+|control-(border|background|hover-.+|focus(-ring|-background)?|placeholder|disabled-background|choice-(border|hover-border|selected-.+))|scrollbar-(track|thumb.*))$/.test(
      name,
    )
  )
    return 'color'
  if (/^--shadow/.test(name)) return 'shadow'
  if (
    /duration|^--duration|^--motion-(feedback|reveal|enter|exit|spin|pulse)$/.test(
      name,
    )
  )
    return 'duration'
  return 'value'
}
export const descriptions = {
  '--surf-info':
    'Base blue for information that asks for no action, apart from the green of success',
  '--surf-trend-up':
    'Base color of a rise. Markets that read red as a rise swap it with --surf-trend-down',
  '--surf-trend-down': 'Base color of a fall; the danger red by default',
  '--surf-trend-flat-fg': 'Text and marks for a change of zero',
  '--surf-selection-background':
    "Opaque text selection surface in each theme's neutral gray",
  '--surf-selection-foreground':
    'Text color that keeps contrast on the text selection surface',
  '--surf-layer-chrome':
    'Global layer for fixed app chrome, such as BottomNavigation, below every overlay',
  '--surf-size-bottom-navigation':
    'Height of BottomNavigation above the safe area; pad scrolling content by it',
  '--surf-layer-backdrop': 'Global layer for the Dialog backdrop',
  '--surf-layer-dialog': 'Global layer for Dialog and Sheet/Drawer positioners',
  '--surf-layer-popup':
    'Global layer for select lists, menus, popovers and toasts',
  '--surf-layer-tooltip':
    'Global layer for non-interactive, descriptive tooltip positioners',
  '--surf-toast-enter-duration':
    'Unhurried fade-and-rise duration for toast entry',
  '--surf-tooltip-background':
    'Tooltip surface with contrast inverted from the surrounding theme',
  '--surf-tooltip-foreground': 'Text color on the inverted tooltip surface',
  '--surf-toast-stack-ease':
    'Gentle deceleration curve for adding, expanding and collapsing the toast stack',
  '--surf-toast-stack-duration':
    'Duration for repositioning toasts in the stack',
  '--surf-font-japanese': 'Noto Sans JP fallback for Japanese glyphs',
  '--surf-control-focus-background':
    'Input surface that stays steady on hover while focused',
  '--surf-control-choice-selected-hover-bg':
    'Hover surface that keeps the selected color',
  '--surf-control-choice-border':
    'Soft default border for checkboxes, radios and switches',
  '--surf-control-choice-hover-border':
    'Stronger border for choice controls on hover',
  '--surf-control-choice-selected-border':
    'State border that matches the selected surface',
  '--surf-icon-stroke-width': 'Shared stroke width within a 24×24 viewBox',
  '--surf-status-success-mark':
    'A success mark without words, such as a dot: 3:1 on every plane',
  '--surf-status-danger-mark':
    'A danger mark without words, such as a dot: 3:1 on every plane',
  '--surf-status-caution-mark':
    'A caution mark without words, such as a dot: 3:1 on every plane',
  '--surf-status-info-mark':
    'An info mark without words, such as a dot: 3:1 on every plane',
  '--surf-status-progress-mark':
    'A mark for what is under way, such as a working dot: the brand mark',
  '--surf-status-neutral-mark':
    'A mark for a resting state, such as an idle dot: muted ink',
  '--surf-status-dot-size':
    "A status dot's diameter, and the smallest an avatar's status marker gets",
  '--surf-chart-line-width':
    "A chart series line's weight, which the legend's swatches follow",
  '--surf-chart-line-quiet-ratio':
    'The share of the line weight a comparison or a plan draws at; 1 gives every line the same weight',
  '--surf-radius-pill':
    'Buttons, badges, chips, switches and segments: half the tallest control, so pills; scales with the radius',
  '--surf-selected-edge':
    'The edge of a selected row: the focus color, faint, over --surf-selected',
  '--surf-brand-mark':
    'Brand as a mark on the sheet, such as a progress fill; darker in light themes for 3:1',
  '--surf-plane':
    'The plane a component sits on: the canvas on the sheet, the surface inside a Card or Surface',
  '--surf-recessed':
    'One step recessed from --surf-plane: tracks, read-only values, tab lists and toolbars',
  '--surf-slider-track':
    'Deprecated: a slider track is --surf-recessed, which follows its plane',
  '--surf-type-display-size': 'Fluid 32–40px page title',
  '--surf-type-title-size': 'Fluid 28–32px heading',
  '--surf-type-workspace-title-size': 'Earlier name for the display size',
  '--surf-type-document-title-size': 'Earlier name for the display size',
  '--surf-type-document-section-size': 'Earlier name for the title size',
  '--surf-type-page-size': '24px heading for standard pages',
  '--surf-type-label-leading': '20px at 14px: single-line controls',
  '--surf-type-compact-size':
    '13px dense secondary text: details beside data, notifications',
  '--surf-type-table-size':
    'Deprecated: the compact role under its earlier name; write --surf-type-compact-size',
  '--surf-type-table-leading':
    'Deprecated: the compact role under its earlier name; write --surf-type-compact-leading',
  '--surf-menu-selected-background':
    'Deprecated: a selected item takes --surf-selected',
  '--surf-grid-minor': 'Deprecated: the blueprint grid is no longer drawn',
  '--surf-grid-major': 'Deprecated: the blueprint grid is no longer drawn',
  '--surf-guide': 'Deprecated: the blueprint grid is no longer drawn',
  '--surf-grid-cell': 'Deprecated: the blueprint grid is no longer drawn',
  '--surf-grid-major-cell': 'Deprecated: the blueprint grid is no longer drawn',
  '--surf-grid-base-opacity':
    'Deprecated: the blueprint grid is no longer drawn',
  '--surf-grid-halo': 'Deprecated: the blueprint grid is no longer drawn',
  '--surf-veil-spread': 'Deprecated: the blueprint grid is no longer drawn',
  '--surf-veil-blur': 'Deprecated: the blueprint grid is no longer drawn',
  '--surf-type-caption-tracking': 'Opens 12px text slightly',
  '--surf-type-display-tracking':
    'Tightens large titles; Manrope has no optical size axis',
  '--surf-type-hangul-word-spacing':
    "Widens Korean word spaces to Pretendard's width while Manrope leads the stack",
  '--surf-chrome':
    'Background for the header, sidebar and area outside the sheet',
  '--surf-canvas': 'Main content surface that holds work or documents',
  '--surf-surface':
    'Secondary surface inside the sheet for code and highlighted areas',
  '--surf-ink': 'Headings and key information',
  '--surf-ink-body': 'Body text and descriptions',
  '--surf-ink-muted': 'Captions and secondary information',
  '--surf-brand': 'Surface for primary actions and limited emphasis',
  '--surf-success':
    'Base green for success status, apart from the brand so a success never reads as the main action. Accent themes leave it unchanged',
  '--surf-brand-ink':
    'Link and brand text color with contrast against the background',
  '--surf-font-display':
    'Manrope for Latin headings → Pretendard fallback for Korean',
  '--surf-font-body':
    'Manrope for Latin body text → Pretendard fallback for Korean',
  '--surf-font-code':
    'JetBrains Mono for identifiers and code → Korean fallback',
  '--surf-layout-workspace':
    'Default maximum content width for operational tools',
  '--surf-layout-reading': 'Maximum width for documentation body text',
  '--surf-layout-reading-measure':
    'Line length for reading text: about 70 Latin or 50 Hangul characters',
  '--surf-layout-wide': 'Maximum width for dense tables and comparison screens',
  '--surf-layout-gutter':
    'Gutter between blocks: 24px, 16px on a phone, 12px in compact density',
  '--surf-layout-page-inset':
    "A page's inset: 24px, 16px on a phone, 12px in compact density",
  '--surf-layout-section-gap':
    'Gap between sections: 40px, 32px on a phone, 24px in compact density',
  '--surf-density-item-compact':
    'Compact space between the items of a run, such as actions or chips',
  '--surf-density-inset-compact':
    "Compact space between a block's parts, such as a card's header and body",
  '--surf-density-padding-compact':
    "Compact space inside a surface's edge: a card, a panel, a dialog",
  '--surf-density-gap-compact':
    'Compact space between blocks: cards in a grid, Dashboard panels',
  '--surf-density-section-compact': 'Compact space between sections',
  '--surf-density-row-padding-compact':
    "Compact space above and below a row's content: table cells, list items",
  '--surf-density-row-compact':
    'Compact height of a row that holds a control: menu items, sidebar links',
  '--surf-ui-density-item':
    'Set by a compact scope; a part reads it before its own item gap',
  '--surf-ui-density-inset':
    'Set by a compact scope; a part reads it before its own gap between parts',
  '--surf-ui-density-padding':
    'Set by a compact scope; a surface reads it before its own padding',
  '--surf-ui-density-gap':
    'Set by a compact scope; a layout reads it before its own gap between blocks',
  '--surf-ui-density-section':
    'Set by a compact scope; the gap between sections',
  '--surf-ui-density-row-padding':
    'Set by a compact scope; a row reads it before its own block padding',
  '--surf-ui-density-row':
    'Set by a compact scope; a row that holds a control reads it before its height',
  '--surf-ui-density-title-size':
    "Set by a compact scope: a card's or a panel's title takes the label role",
  '--surf-ui-density-title-leading':
    "Set by a compact scope: a card's or a panel's title takes the label role",
  '--surf-ui-density-title-tracking':
    "Set by a compact scope: a card's or a panel's title takes the label role",
  '--surf-control-target-size':
    'The target a control keeps on touch: 44px, or 24px in compact density',
  '--surf-control-target-size-enhanced':
    'The 44px target of WCAG 2.5.5, which a default control grows to on touch',
  '--surf-control-target-size-min':
    'The 24px target of WCAG 2.2 AA (2.5.8), the least a compact control keeps',
  '--surf-layout-columns': 'Base grid: 12 → 6 → 4 columns',
  '--surf-layout-column-tile':
    'Narrowest auto Grid column for a figure and its label',
  '--surf-layout-column-brief':
    'Narrowest auto Grid column for a brief card: a name and a line or two',
  '--surf-layout-column-card':
    'Narrowest auto Grid column for a card, and a Dashboard panel',
  '--surf-layout-column-wide':
    'Narrowest auto Grid column for a chart or a table of a few columns',
  '--surf-page-header-gap': 'Spacing between the heading and description',
  '--surf-page-header-breadcrumb-gap':
    'Spacing between the breadcrumb and the heading group',
  '--surf-dialog-enter-duration': 'Fade-and-rise duration for dialog entry',
  '--surf-dialog-exit-duration':
    'Closing completes immediately without waiting',
  '--surf-control-height': '36px on desktop, 44px on narrow screens and touch',
  '--surf-scrollbar-size': 'Thickness of native scrollbars in scrolling panels',
  '--surf-scrollbar-indicator-size':
    "ScrollArea's overlay thumb: 6px with a pointer, 3px on touch where it only shows the position",
  '--surf-control-text-min-size':
    'Smallest text in a text field: none on desktop, 16px on narrow screens and touch so iOS does not zoom',
}
