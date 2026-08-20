/**
 * Chart palette.
 *
 * Brand-invariant and status-invariant by design. Chart colours resolve
 * identically in all nine apps regardless of which surface rendered them,
 * because charts get screenshotted into decks and PDFs where surface context
 * is lost — the same metric must not be indigo in one app and red in another.
 *
 * Series 1 is teal: the furthest hue from all six colours that already carry
 * meaning (the indigo accent, which is also the info colour; both brand reds;
 * and the three status colours).
 *
 * Validated with colour-vision-deficiency simulation at full severity rather
 * than estimated. Safety comes from two independent channels: a four-family,
 * two-level lightness grid (teal/pine, cornflower/azure, magenta/plum,
 * ochre/chestnut) so the lightness difference survives when hue collapses, and
 * a slot order that alternates between the groups dichromatic vision merges.
 *
 * All eight slots clear 3:1 on all four grounds, so 2px lines and fills are
 * legible without mandatory labels.
 *
 * Known residual: under simulated protanopia slots 2 and 7 approach error red.
 * Acceptable only because status always carries an icon and a label — see
 * ../theme/danger.ts. Do not remove that requirement.
 */

import type { ColorMode } from "./surfaces.js";

/** Fixed order. Never cycled, never renumbered on filtering. */
export const chartSeries: Record<ColorMode, readonly string[]> = {
  light: [
    "#0090a8", // 1 teal
    "#b9700c", // 2 ochre
    "#7a2f96", // 3 plum
    "#5b87e0", // 4 cornflower
    "#0a7038", // 5 pine
    "#b8309a", // 6 magenta
    "#8a4512", // 7 chestnut
    "#0f5aa8", // 8 azure
  ],
  dark: [
    "#17a0b6",
    "#bd7b18",
    "#9558b4",
    "#6b91e0",
    "#2b9159",
    "#d857b6",
    "#a4632c",
    "#2d76b8",
  ],
};

/** A ninth category is "Other" in muted ink, never a generated hue. */
export const chartOther: Record<ColorMode, string> = {
  light: "#94a3b8",
  dark: "#737373",
};

/** Sequential ramp for heatmaps and intensity, derived from the indigo accent. */
export const chartSequential: Record<ColorMode, readonly string[]> = {
  light: ["#e8e6fc", "#c3bdf7", "#9089ee", "#4f46e5", "#2b2494"],
  dark: ["#2b2757", "#3f38a0", "#5a51d6", "#8b84f0", "#c4bffa"],
};

/**
 * Diverging ramp for variance. Teal against magenta with a neutral midpoint —
 * deliberately not green against red, so it collides with neither the status
 * colours nor colour-blind vision.
 *
 * Teal is the favourable arm. Flip the mapping where "over" is the bad
 * direction. The midpoint sits close to the surface, so give a zero cell a 1px
 * hairline or it stops reading as a cell.
 */
export const chartDiverging: Record<ColorMode, readonly string[]> = {
  light: ["#a3238a", "#d783c0", "#e8ecf1", "#62b8c9", "#00768a"],
  dark: ["#e46bc2", "#a94f92", "#3a3a3a", "#2f7f8e", "#34b3c6"],
};

/**
 * Slot order for small category counts. The three-series set is validated for
 * EVERY pair, not just adjacent ones, which makes it the cap for scatter,
 * bubble and small multiples where any two marks can end up side by side.
 * Past three in those forms, fold the tail into "Other" or use facets.
 */
export const chartOrder = {
  one: [0],
  two: [0, 1],
  three: [0, 1, 2],
} as const;

/**
 * Gap between stacked-bar segments, in pixels, painted in the surface colour.
 * The palette is validated for adjacency; this gap is what stops two dark
 * slots fusing into a single block.
 */
export const chartStackGap = 2;
