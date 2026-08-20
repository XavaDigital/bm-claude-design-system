/**
 * Brand registry.
 *
 * David ruled 2026-08-16: indigo for staff tools, red for customer-facing
 * products. His reasoning was ergonomic — red all day is hard on the eyes for
 * people who live in these apps.
 *
 * Every ramp splits `base` from `solid` and `link`, and that split is not
 * decoration. An accent that is legible as a 2px border (3:1) is often NOT
 * legible as a filled button carrying white text (4.5:1), nor as body-sized
 * link text on a panel. Collapsing them back into one value reintroduces
 * measured accessibility failures — see the notes on each ramp.
 */

import type { ColorMode } from "./tokens/surfaces.js";

export type BrandKey = "beastmode" | "estore" | "gotyaback";

export interface BrandRamp {
  /** Borders, focus rings, ink bars, switch tracks. Needs only 3:1. */
  base: string;
  /** Fills that carry text. White on this must clear 4.5:1. */
  solid: string;
  solidHover: string;
  solidActive: string;
  /** The accent used as TEXT on a surface: links, selected labels. */
  link: string;
  linkHover: string;
  /** Pale wash for selected states and accent panels. */
  soft: string;
  softHover: string;
  /** Accent-tinted border for soft panels. */
  softBorder: string;
  /** Text placed on `solid`. */
  onSolid: string;
}

export interface Brand {
  key: BrandKey;
  label: string;
  /** Which products this brand is for. Documentation, not behaviour. */
  usedBy: readonly string[];
  ramp: Record<ColorMode, BrandRamp>;
}

/**
 * Staff indigo.
 *
 * Measured: white on #4f46e5 = 6.29:1 (passes). White on #6366f1 = 4.47:1,
 * which MISSES AA normal text by 0.03 — David accepted the wider contrast
 * position on 2026-08-16, but the fix here is free: #6366f1 stays the ruled
 * accent for non-text uses, and #5b54ea (white = 5.38:1) carries text fills.
 * Dark link text uses #a5b4fc (8.08:1 on panel) because the raw accent
 * measures 3.60:1 there and fails as body text.
 *
 * Both modes DARKEN on hover for solid fills. Lightening indigo toward
 * #818cf8 drops white-label contrast below the floor at exactly the moment the
 * user is committing to the action.
 */
const beastmode: Brand = {
  key: "beastmode",
  label: "BeastMode (staff)",
  usedBy: ["bm-sales", "bm-email", "bm-designflow", "bm-team-engage", "bm-identity", "bm-configurator"],
  ramp: {
    light: {
      base: "#4f46e5",
      solid: "#4f46e5",
      solidHover: "#4338ca",
      solidActive: "#3730a3",
      link: "#4f46e5",
      linkHover: "#4338ca",
      soft: "#eef2ff",
      softHover: "#e0e7ff",
      softBorder: "#c7d2fe",
      onSolid: "#ffffff",
    },
    dark: {
      base: "#6366f1",
      solid: "#5b54ea",
      solidHover: "#4f46e5",
      solidActive: "#4338ca",
      link: "#a5b4fc",
      linkHover: "#c7d2fe",
      soft: "rgba(99,102,241,.16)",
      softHover: "rgba(99,102,241,.24)",
      softBorder: "rgba(99,102,241,.35)",
      onSolid: "#ffffff",
    },
  },
};

/**
 * THE BeastMode brand red — the storefront, the logo, and (since 2026-08-21)
 * GotYaBack too. Verified against the logo artwork (assets/) and the live
 * beastmode.co.nz theme CSS, not just the fleet audit.
 *
 * Measured: white on #bf272d = 5.93:1 (passes comfortably). Black would be
 * 3.54:1, so white is unambiguous.
 *
 * The raw brand red must NEVER appear on a dark surface — it measures 2.4:1
 * against a dark panel and disappears. Dark mode lifts to #d9363e (white =
 * 4.62:1), with #ff8a8f for link text.
 */
const estore: Brand = {
  key: "estore",
  label: "BM-estore storefront",
  usedBy: ["BM-estore (storefront only; its admin uses the staff brand)"],
  ramp: {
    light: {
      base: "#bf272d",
      solid: "#bf272d",
      solidHover: "#a81f25",
      solidActive: "#8c161c",
      link: "#bf272d",
      linkHover: "#a81f25",
      soft: "#fdf0f0",
      softHover: "#fbdcdd",
      softBorder: "#f0b3b5",
      onSolid: "#ffffff",
    },
    dark: {
      base: "#d9363e",
      solid: "#d9363e",
      solidHover: "#bf272d",
      solidActive: "#a81f25",
      link: "#ff8a8f",
      linkHover: "#ffb0b3",
      soft: "rgba(217,54,62,.16)",
      softHover: "rgba(217,54,62,.24)",
      softBorder: "rgba(217,54,62,.38)",
      onSolid: "#ffffff",
    },
  },
};

/**
 * GotYaBack.
 *
 * David ruled 2026-08-21 that GotYaBack does NOT carry its own red — it uses
 * the one BeastMode brand red, the same ramp as the estore. (The earlier
 * #C8102E was retired with the document design system work; see
 * bm-design-documents.) The brand key stays separate so apps keep a stable
 * reference and the danger protocol still applies via `redBrands`.
 */
const gotyaback: Brand = {
  key: "gotyaback",
  label: "GotYaBack",
  usedBy: ["bm-gotyaback (public campaign, sponsor and thank-you pages)"],
  ramp: estore.ramp,
};

export const brands: Record<BrandKey, Brand> = { beastmode, estore, gotyaback };

/**
 * Brands whose accent is a red close enough to the error colour that the
 * danger protocol applies. Derived from the registry rather than hardcoded, so
 * adding a fourth red brand cannot silently skip the protocol.
 */
export const redBrands: readonly BrandKey[] = ["estore", "gotyaback"];

export function isRedBrand(key: BrandKey): boolean {
  return redBrands.includes(key);
}

export function resolveBrand(key: BrandKey = "beastmode"): Brand {
  const brand = brands[key];
  if (!brand) throw new Error(`[@beastmode/ui] unknown brand "${key}"`);
  return brand;
}
