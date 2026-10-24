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
  if (/^--(radius|logo-size|avatar-size|icon-)/.test(name)) return 'Shape'
  if (/^--(status|badge)-/.test(name)) return 'Status'
  if (/^--(duration|ease|motion|dialog-|toast-|theme-transition)/.test(name))
    return 'Motion'
  if (/^--layer-/.test(name)) return 'Layers'
  if (/^--(size-|control|menu|interaction|scrollbar)/.test(name))
    return 'Controls'
  if (
    /^--(layout|sheet-inset|collection|page-header|grid-cell|grid-major-cell|grid-base|grid-halo|veil)/.test(
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
    /^(--chrome|--canvas|--surface|--code-bg|--hover|--selected|--line|--ink.*|--syntax-.+|--brand.*|--on-brand|--success|--caution|--danger|--info|--trend-(up|down)|--grid-minor|--grid-major|--guide|--skeleton.*)$/.test(
      name,
    ) ||
    /--(status-.+-(fg|bg|border)|badge-.+-bg|menu-.+|tooltip-.+|chart-series-\d+|chart-category-\d+|trend-(up|down)-(fg|bg)|trend-flat-fg|selection-(background|foreground)|interaction-.+|control-(border|background|hover-.+|focus.*|placeholder|disabled-background|choice-(border|hover-border|selected-.+))|scrollbar-(track|thumb.*))$/.test(
      name,
    )
  )
    return 'color'
  if (/^--shadow/.test(name)) return 'shadow'
  if (/duration|^--duration|^--motion-(feedback|reveal|enter|exit)$/.test(name))
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
  '--surf-icon-size-sm': 'Deprecated: use --surf-size-icon-default',
  '--surf-icon-size-md': 'Deprecated: use --surf-size-icon-large',
  '--surf-icon-size-lg': 'Deprecated: 24px, off the size scale',
  '--surf-avatar-size-sm': 'Deprecated: use --surf-size-avatar-small',
  '--surf-avatar-size-md': 'Deprecated: use --surf-size-avatar-default',
  '--surf-avatar-size-lg': 'Deprecated: use --surf-size-avatar-large',
  '--surf-icon-stroke-width': 'Shared stroke width within a 24×24 viewBox',
  '--surf-radius-pill':
    'Buttons, badges, chips, switches and segments: half the tallest control, so pills; scales with the radius',
  '--surf-selected-edge':
    'The edge of a selected row: the focus color, faint, over --surf-selected',
  '--surf-brand-mark':
    'Brand as a mark on the sheet, such as a progress fill; darker in light themes for 3:1',
  '--surf-slider-track': "A slider's track, 3:1 against the brand indicator",
  '--surf-type-display-size': 'Fluid 32–40px page title',
  '--surf-type-title-size': 'Fluid 28–32px heading',
  '--surf-type-workspace-title-size': 'Earlier name for the display size',
  '--surf-type-document-title-size': 'Earlier name for the display size',
  '--surf-type-document-section-size': 'Earlier name for the title size',
  '--surf-type-page-size': '24px heading for standard pages',
  '--surf-type-label-leading': '20px at 14px: single-line controls',
  '--surf-type-compact-size':
    '13px dense secondary text: tables, notifications',
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
  '--surf-layout-gutter': 'Grid gutter that responds to screen size',
  '--surf-layout-columns': 'Base grid: 12 → 6 → 4 columns',
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
