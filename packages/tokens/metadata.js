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
export function category(name) {
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
export function type(name) {
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
  '--info':
    'Base blue for information that asks for no action, apart from the cyan of success',
  '--trend-up':
    'Base color of a rise. Markets that read red as a rise swap it with --trend-down',
  '--trend-down': 'Base color of a fall; the danger red by default',
  '--trend-flat-fg': 'Text and marks for a change of zero',
  '--selection-background':
    "Opaque text selection surface in each theme's neutral gray",
  '--selection-foreground':
    'Text color that keeps contrast on the text selection surface',
  '--layer-backdrop': 'Global layer for the Dialog backdrop',
  '--layer-dialog': 'Global layer for Dialog and Sheet/Drawer positioners',
  '--layer-popup': 'Global layer for select lists, menus, popovers and toasts',
  '--layer-tooltip':
    'Global layer for non-interactive, descriptive tooltip positioners',
  '--toast-enter-duration': 'Unhurried fade-and-rise duration for toast entry',
  '--tooltip-background':
    'Tooltip surface with contrast inverted from the surrounding theme',
  '--tooltip-foreground': 'Text color on the inverted tooltip surface',
  '--toast-stack-ease':
    'Gentle deceleration curve for adding, expanding and collapsing the toast stack',
  '--toast-stack-duration': 'Duration for repositioning toasts in the stack',
  '--font-japanese': 'Noto Sans JP fallback for Japanese glyphs',
  '--control-focus-background':
    'Input surface that stays steady on hover while focused',
  '--control-choice-selected-hover-bg':
    'Hover surface that keeps the selected color',
  '--control-choice-border':
    'Soft default border for checkboxes, radios and switches',
  '--control-choice-hover-border':
    'Stronger border for choice controls on hover',
  '--control-choice-selected-border':
    'State border that matches the selected surface',
  '--icon-size-sm': 'Default SVG size for compact controls',
  '--icon-size-md': 'SVG size for general UI',
  '--icon-size-lg': 'SVG size for emphasis',
  '--icon-stroke-width': 'Shared stroke width within a 24×24 viewBox',
  '--type-display-size': 'Fluid 32–40px page title',
  '--type-title-size': 'Fluid 28–32px heading',
  '--type-workspace-title-size': 'Earlier name for the display size',
  '--type-document-title-size': 'Earlier name for the display size',
  '--type-document-section-size': 'Earlier name for the title size',
  '--type-page-size': '24px heading for standard pages',
  '--type-label-leading': '20px at 14px: single-line controls',
  '--type-compact-size': '13px dense secondary text: tables, notifications',
  '--type-caption-tracking': 'Opens 12px text slightly',
  '--type-display-tracking':
    'Tightens large titles; Manrope has no optical size axis',
  '--type-hangul-word-spacing':
    "Widens Korean word spaces to Pretendard's width while Manrope leads the stack",
  '--chrome': 'Background for the header, sidebar and area outside the sheet',
  '--canvas': 'Main content surface that holds work or documents',
  '--surface':
    'Secondary surface inside the sheet for code and highlighted areas',
  '--ink': 'Headings and key information',
  '--ink-body': 'Body text and descriptions',
  '--ink-muted': 'Captions and secondary information',
  '--brand': 'Surface for primary actions and limited emphasis',
  '--success':
    'Base color for success status. It matches the default accent, and accent themes leave it unchanged',
  '--brand-ink':
    'Link and brand text color with contrast against the background',
  '--font-display':
    'Manrope for Latin headings → Pretendard fallback for Korean',
  '--font-body': 'Manrope for Latin body text → Pretendard fallback for Korean',
  '--font-code': 'JetBrains Mono for identifiers and code → Korean fallback',
  '--layout-workspace': 'Default maximum content width for operational tools',
  '--layout-reading': 'Maximum width for documentation body text',
  '--layout-reading-measure':
    'Line length for reading text: about 70 Latin or 50 Hangul characters',
  '--layout-wide': 'Maximum width for dense tables and comparison screens',
  '--layout-gutter': 'Grid gutter that responds to screen size',
  '--layout-columns': 'Base grid: 12 → 6 → 4 columns',
  '--page-header-gap': 'Spacing between the heading and description',
  '--page-header-breadcrumb-gap':
    'Spacing between the breadcrumb and the heading group',
  '--dialog-enter-duration': 'Fade-and-rise duration for dialog entry',
  '--dialog-exit-duration': 'Closing completes immediately without waiting',
  '--control-height': '36px on desktop, 44px on narrow screens and touch',
}
