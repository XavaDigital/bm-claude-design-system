/**
 * Elevation.
 *
 * Dark mode is the hard case. The fleet's existing shadows are black at
 * light-mode alphas, which on a #191919 ground moves a pixel by two values —
 * invisible, and no amount of tuning fixes it. Depth here comes from three
 * mechanisms in priority order:
 *
 *   1. The surface ramp step. Each level moves up ./surfaces.ts. A dropdown
 *      rendered at panel colour over a panel cannot be rescued by any shadow.
 *   2. A light-source rim border, stepping up with elevation. This is what
 *      actually replaces the shadow — if a consumer strips everything else,
 *      the rim alone still reads as depth.
 *   3. The shadow itself, at dark-mode alphas roughly 6-8x the light values.
 *
 * The rim lives in ./surfaces.ts `borders` and is applied as a border, not as
 * part of the shadow string. Never apply both a rim and a separate card edge.
 */

import type { ColorMode } from "./surfaces.js";

export type ElevationLevel = "resting" | "raised" | "floating";

export interface ElevationSet {
  /**
   * Anything permanently on the page ground: cards, panels, table containers,
   * stat tiles. The only level allowed to appear many times per screen.
   */
  resting: string;
  /**
   * Transient surfaces anchored to a trigger: dropdowns, popovers, select
   * menus, date pickers, tooltips. Sits on the `elevated` surface.
   */
  raised: string;
  /**
   * Modal-class surfaces that own the screen and come with a scrim. One at a
   * time, ever. If two things on screen are both floating, one is wrong.
   */
  floating: string;
}

/**
 * Dark shadows use rgba(2, 6, 23, ...) — a near-black with a slight slate
 * bias, kept inside the palette family. Do not tint them toward blue: at these
 * alphas a visibly blue shadow reads as a rendering bug. The leading inset
 * layer is the light-source highlight and must survive any edit.
 */
export const elevation: Record<ColorMode, ElevationSet> = {
  light: {
    resting: "0 1px 2px 0 rgba(15,23,42,.04), 0 1px 3px 0 rgba(15,23,42,.06)",
    raised: "0 2px 4px -1px rgba(15,23,42,.06), 0 6px 16px -4px rgba(15,23,42,.10)",
    floating:
      "0 4px 8px -2px rgba(15,23,42,.08), 0 12px 28px -6px rgba(15,23,42,.14), 0 24px 48px -12px rgba(15,23,42,.10)",
  },
  dark: {
    resting:
      "inset 0 1px 0 0 rgba(255,255,255,.04), 0 1px 2px 0 rgba(2,6,23,.44), 0 2px 6px -1px rgba(2,6,23,.32)",
    raised:
      "inset 0 1px 0 0 rgba(255,255,255,.06), 0 2px 6px -1px rgba(2,6,23,.50), 0 8px 20px -6px rgba(2,6,23,.44)",
    floating:
      "inset 0 1px 0 0 rgba(255,255,255,.07), 0 4px 10px -2px rgba(2,6,23,.56), 0 16px 40px -8px rgba(2,6,23,.52)",
  },
};

/** Scrim behind floating surfaces. On dark it, not the shadow, is the separator. */
export const scrim: Record<ColorMode, string> = {
  light: "rgba(15,23,42,.45)",
  dark: "rgba(2,6,23,.65)",
};

/**
 * Flat-hex approximations of the rim, for consumers that cannot composite
 * transparency: PDF renderers, email templates and the pre-paint scripts.
 * Keyed by the surface the rim sits on.
 */
export const rimFlat: Record<ColorMode, Record<ElevationLevel, string>> = {
  light: { resting: "#e2e8f0", raised: "#e2e8f0", floating: "#cbd5e1" },
  dark: { resting: "#2e2e2e", raised: "#3d3d3d", floating: "#414141" },
};
