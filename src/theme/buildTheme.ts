/**
 * The theme factory. One call produces the Ant Design config for a given
 * surface, brand and colour mode.
 */

import { theme as antdTheme, type ThemeConfig } from "antd";
import { resolveBrand, type BrandKey } from "../brands.js";
import { surfaces, borderSet, type ColorMode } from "../tokens/surfaces.js";
import { text, radius } from "../tokens/text.js";
import { status } from "../tokens/status.js";
import { elevation } from "../tokens/elevation.js";
import { bodyFamily, families, bodyScale, type SurfaceKind } from "../tokens/typography.js";
import { buildComponents, focusRing } from "./components.js";

export interface SurfaceSpec {
  /** `staff` gets indigo and Inter; `customer` gets the brand red and Montserrat. */
  kind: SurfaceKind;
  /** Only meaningful when kind is `customer`. */
  brand: BrandKey;
  mode: ColorMode;
}

/**
 * A stable key for Ant Design's CSS-variable mode.
 *
 * Two providers sharing a key write to the same custom-property names and the
 * second silently overwrites the first. MODE IS PART OF THE KEY: a light and a
 * dark surface rendered on the same page are two different themes, and leaving
 * mode out makes the light one render in dark colours — with its own swatches
 * still showing the correct light values, which is what makes the bug so hard
 * to spot.
 */
export function cssVarKey({ kind, brand, mode }: SurfaceSpec): string {
  const family = kind === "staff" ? "bmstaff" : `bm${brand}`;
  return `${family}-${mode}`;
}

export function buildTheme(spec: SurfaceSpec): ThemeConfig {
  const { kind, mode } = spec;
  // A staff surface is always indigo, whatever brand the app declares — the
  // brand only applies to customer-facing sections.
  const brand = resolveBrand(kind === "staff" ? "beastmode" : spec.brand);
  const ramp = brand.ramp[mode];
  const s = surfaces[mode];
  const b = borderSet(kind, mode);
  const t = text[mode];
  const st = status[mode];
  const body = bodyScale[kind];
  const dark = mode === "dark";

  return {
    algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    cssVar: { key: cssVarKey(spec) },
    hashed: true,
    token: {
      // ---- the seam: the only tokens that vary by surface ----
      colorPrimary: ramp.base,
      colorPrimaryHover: ramp.solidHover,
      colorPrimaryActive: ramp.solidActive,
      colorPrimaryBg: ramp.soft,
      colorPrimaryBgHover: ramp.softHover,
      colorPrimaryBorder: ramp.softBorder,
      colorPrimaryBorderHover: ramp.base,
      // Must be explicit. Ant Design derives colorLink from colorInfo, which
      // is pinned to indigo below — omit these and every customer link turns
      // indigo on a red page.
      colorLink: ramp.link,
      colorLinkHover: ramp.linkHover,
      colorLinkActive: ramp.solidActive,
      controlOutline: focusRing(ramp.base, mode),
      fontFamily: bodyFamily(kind),

      // ---- pinned: identical on both surfaces ----
      colorInfo: st.info.base,
      colorSuccess: st.success.base,
      colorWarning: st.warning.base,
      colorError: st.error.base,

      colorBgLayout: s.page,
      colorBgContainer: s.panel,
      colorBgElevated: s.elevated,
      colorBgSpotlight: dark ? "#262626" : "#1e293b",

      colorText: t.primary,
      colorTextSecondary: t.secondary,
      colorTextTertiary: t.tertiary,
      colorTextQuaternary: t.disabled,

      colorBorder: b.base,
      colorBorderSecondary: b.secondary,

      borderRadius: radius.base,
      borderRadiusSM: radius.sm,
      borderRadiusLG: radius.lg,

      fontSize: body.body!.size,
      lineHeight: body.body!.lineHeight,
      fontFamilyCode: families.mono,

      boxShadowTertiary: elevation[mode].resting,
      boxShadowSecondary: elevation[mode].raised,

      wireframe: false,
    },
    components: buildComponents(ramp, mode, kind),
  };
}

/**
 * Flat values for consumers that cannot run React or read CSS variables: PDF
 * renderers, email templates, canvas drawing, and the pre-paint scripts that
 * set the background before the app boots.
 *
 * Everything here is a literal string. Nothing requires compositing
 * transparency, because none of those consumers can do it.
 */
export function resolveFlat(spec: SurfaceSpec) {
  const { kind, mode } = spec;
  const brand = resolveBrand(kind === "staff" ? "beastmode" : spec.brand);
  const ramp = brand.ramp[mode];

  return {
    surface: surfaces[mode],
    border: borderSet(kind, mode),
    text: text[mode],
    status: status[mode],
    accent: {
      base: ramp.base,
      solid: ramp.solid,
      link: ramp.link,
      onSolid: ramp.onSolid,
    },
    radius,
    font: {
      heading: families.heading,
      body: bodyFamily(kind),
      mono: families.mono,
    },
  };
}
