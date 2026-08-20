/**
 * The explicit list of theme slots that recolour with the brand accent.
 *
 * This list exists because of the worst defect found during design review: a
 * component map that hardcoded indigo into sixteen slots while the seam
 * promised those slots follow the brand. Under a red brand that ships a red
 * primary button beside an indigo tab underline and an indigo slider — a
 * half-red, half-indigo application.
 *
 * The guard against it is ../../test/brand-coverage.test.ts, which resolves
 * every registered brand, diffs the emitted theme against the staff indigo,
 * and asserts the set of changed keys equals this list exactly. A literal hex
 * left behind in the component map surfaces as a MISSING key; a slot that
 * should have been fixed but drifted surfaces as an EXTRA one.
 *
 * Adding a brand-following slot means adding it here in the same change.
 */

export const FOLLOWS_BRAND = [
  // Seed and its generated ramp
  "token.colorPrimary",
  "token.colorPrimaryHover",
  "token.colorPrimaryActive",
  "token.colorPrimaryBg",
  "token.colorPrimaryBgHover",
  "token.colorPrimaryBorder",
  "token.colorPrimaryBorderHover",
  // Links
  "token.colorLink",
  "token.colorLinkHover",
  "token.colorLinkActive",
  // Focus
  "token.controlOutline",
  // Components
  "Menu.itemSelectedBg",
  "Menu.itemSelectedColor",
  "Menu.darkItemSelectedBg",
  "Tabs.itemSelectedColor",
  "Tabs.itemHoverColor",
  "Tabs.inkBarColor",
  "Input.activeBorderColor",
  "Input.activeShadow",
  "Select.activeBorderColor",
  "Select.optionSelectedColor",
  "Typography.colorLink",
  "Typography.colorLinkHover",
  "Button.defaultHoverBorderColor",
  "Button.defaultHoverColor",
  "Pagination.itemActiveBg",
  "Breadcrumb.linkHoverColor",
  "Switch.colorPrimary",
  "Switch.colorPrimaryHover",
  "Slider.trackBg",
  "Slider.trackHoverBg",
  "Slider.handleColor",
  "Slider.handleActiveColor",
  "Slider.dotActiveBorderColor",
  "Progress.defaultColor",
  "Steps.colorPrimary",
  "Checkbox.colorPrimary",
  "Radio.colorPrimary",
] as const;

/**
 * Slots that must NEVER follow the brand, with the reason.
 *
 * Documentation for reviewers — the coverage test enforces the positive list,
 * and anything absent from it is expected to be brand-invariant.
 */
export const NEVER_FOLLOWS_BRAND: Record<string, string> = {
  "token.colorInfo":
    "Ant Design links info to primary by default. Under a red brand that renders information messages in brand red, where they read as errors. Pinned to indigo, fleet-wide.",
  "token.colorSuccess/Warning/Error":
    "Status is semantic, not brand. A green that changes meaning per app is not a status colour.",
  "statistic.positive/negative":
    "On a red-brand dashboard a falling figure would be the accent colour, so colour would stop encoding valence.",
  "chart.series":
    "Charts get screenshotted into decks where surface context is lost. The same metric must look the same in every app.",
  "surfaces.*":
    "The ramps are the shared structure. A customer surface is not a warmer surface.",
  "text.*":
    "Same reason as the ramps.",
  "::selection":
    "An OS-level affordance whose only job is legibility of the selected characters. A saturated brand-red selection is both low contrast and reads as an error highlight.",
  "Tooltip.colorBgSpotlight":
    "A tooltip is chrome, not an accent surface.",
  "Table.rowSelectedBg":
    "A pale red wash on a selected order row is indistinguishable from the wash every fleet table uses for overdue and failed rows. Selection uses a neutral wash plus a brand edge marker instead.",
};
