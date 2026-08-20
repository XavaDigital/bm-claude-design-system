/**
 * Status colours — semantic, never brand.
 *
 * These seeds are the values six to seven fleet apps each already ship. They
 * were promoted into the standard on that evidence and must not be swapped for
 * a different green or amber: doing so recolours status badges across eight
 * apps for no reason, which is exactly the drift this package exists to stop.
 *
 * `text` variants exist because the seeds fail as coloured TEXT on light
 * grounds (#52c41a measures 2.27:1 on white, #faad14 measures 1.90:1) while
 * being perfectly fine as fills. Ant Design renders Tag and Alert content in
 * the seed by default, which is the case these variants fix. Both pass
 * comfortably in dark mode, so the dark `text` values are the seeds.
 *
 * The pale bg/border tints are FROZEN here rather than derived at runtime.
 * Runtime derivation would make each app's tints depend on its own Ant Design
 * minor version, and would make the PDF, email and pre-paint outputs
 * impossible — those consumers cannot execute a colour algorithm.
 */

import type { ColorMode } from "./surfaces.js";

export interface StatusTone {
  /** Fills, icons, borders, chart-free indicators. */
  base: string;
  /** The same meaning as coloured text. Differs from base in light mode. */
  text: string;
  /** Pale background wash. */
  bg: string;
  /** Border for alerts and tags. */
  border: string;
}

export interface StatusSet {
  success: StatusTone;
  warning: StatusTone;
  error: StatusTone;
  /**
   * Pinned to the indigo accent, brand-invariant.
   *
   * Ant Design links the info colour to the primary accent by default. Under a
   * red brand that renders information messages in brand red, where they read
   * as errors. Pinning to indigo keeps info distinct on customer surfaces
   * without introducing a colour outside the ruling. Consequence: chart series
   * 1 must not be indigo either — see ./charts.ts.
   */
  info: StatusTone;
}

export const status: Record<ColorMode, StatusSet> = {
  light: {
    success: { base: "#52c41a", text: "#237804", bg: "#f6ffed", border: "#b7eb8f" },
    warning: { base: "#faad14", text: "#ad6800", bg: "#fff7e6", border: "#ffd591" },
    error: { base: "#ff4d4f", text: "#cf1322", bg: "#fff2f0", border: "#ffccc7" },
    info: { base: "#4f46e5", text: "#4338ca", bg: "#eef2ff", border: "#c7d2fe" },
  },
  dark: {
    success: { base: "#52c41a", text: "#73d13d", bg: "#162312", border: "#389e0d" },
    warning: { base: "#faad14", text: "#ffc53d", bg: "#2d1b08", border: "#d48806" },
    error: { base: "#ff4d4f", text: "#ff7875", bg: "#2a1215", border: "#a8071a" },
    info: { base: "#6366f1", text: "#a5b4fc", bg: "#1e1b3a", border: "#4338ca" },
  },
};

/**
 * Big-number colours for dashboard statistics.
 *
 * A darker, deliberately different green/red pair from the status set — the
 * status colours are illegible at large bold weights. Four fleet apps arrived
 * at the same light-mode pair independently.
 *
 * The light values are light-mode-only. Shipping them into dark mode is a live
 * bug in any app that does so: #3f8600 measures 3.54:1 on a dark panel.
 *
 * These never follow the brand. On a red-brand dashboard a "revenue down"
 * figure would otherwise be the same colour as the accent, so the colour would
 * stop encoding anything — which is also why statistics must always carry an
 * up or down glyph, never colour alone.
 */
export const statistic: Record<ColorMode, { positive: string; negative: string }> = {
  /** #3f8600 measures 4.34:1 on the page ground; #357000 clears it. */
  light: { positive: "#357000", negative: "#cf1322" },
  dark: { positive: "#73d13d", negative: "#ff7875" },
};

/**
 * The solid fill reserved for destructive confirmation under a red brand.
 *
 * Brand red and error red measure 9.1 degrees apart in hue — the same colour to
 * a user. This value separates by DARKNESS instead, and reads as grave rather
 * than alarming. White on it measures 10.02:1.
 *
 * It is the only solid danger fill permitted on a customer surface. Everywhere
 * else, destructive actions are outlined. See ../theme/danger.ts.
 */
export const dangerSolid = "#7f1d1d";
