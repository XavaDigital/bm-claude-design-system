/**
 * Text tones.
 *
 * Dark mode has three usable tones. Light mode has TWO — this is a measured
 * limitation, not an oversight. The light secondary #64748b sits at 4.76:1 on
 * white with almost no headroom, so any tone visibly dimmer than it fails AA.
 * `light.tertiary` is therefore restricted to disabled controls, which WCAG
 * 1.4.3 exempts. Do not use it for placeholders that carry information.
 */

import type { ColorMode } from "./surfaces.js";

export interface TextSet {
  /** Body copy and headings. */
  primary: string;
  /** Labels, meta lines, secondary descriptions. */
  secondary: string;
  /**
   * Timestamps and de-emphasised meta. In light mode this is disabled-only —
   * see the note above.
   */
  tertiary: string;
  /** Disabled control labels. */
  disabled: string;
  /**
   * Secondary text sitting on the `subtle` surface specifically. The normal
   * secondary tone measures 4.34:1 there and fails; this clears it.
   */
  secondaryOnSubtle: string;
  /** Text placed on a filled accent or status colour. */
  onAccent: string;
}

export const text: Record<ColorMode, TextSet> = {
  light: {
    primary: "#1e293b",
    secondary: "#64748b",
    tertiary: "#94a3b8",
    disabled: "#94a3b8",
    secondaryOnSubtle: "#475569",
    onAccent: "#ffffff",
  },
  dark: {
    primary: "#e2e8f0",
    secondary: "#94a3b8",
    /**
     * #8a97ad, not the older #737373. Once cards became #212121 rather than
     * chrome-coloured, #737373 dropped to 3.40:1 on the surface tertiary text
     * actually appears on. This restores 5.45:1.
     */
    tertiary: "#8a97ad",
    disabled: "#737373",
    secondaryOnSubtle: "#94a3b8",
    onAccent: "#ffffff",
  },
};

/** Corner radius. Ruled 2026-08-16: the standard moved from 8px to 6px. */
export const radius = {
  /** Chips, tags, drop zones. */
  sm: 4,
  /** The default for buttons, inputs, cards. */
  base: 6,
  /** Cards with presence, heroes, modals. */
  lg: 10,
  /** Badges, avatars, status dots. */
  pill: 999,
} as const;

/** Spacing scale, in pixels. Shared by both surfaces. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
