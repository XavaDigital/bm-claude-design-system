/**
 * Component overrides, as a FUNCTION of the resolved brand.
 *
 * This must never become a static object with accent colours written in as
 * literals. Every accent value here reads from the passed ramp; that is what
 * makes a red-brand app render red everywhere rather than in the primary
 * button alone.
 *
 * Many dark values differ from what bm-sales ships today. They were re-derived
 * because the dark page ground moved from #141414 to #191919 and that value is
 * now chrome only — so an override that meant "same as the page" now means
 * "same as the chrome", which is a different and usually wrong relationship.
 * Each such change carries its measurement.
 */

import type { ThemeConfig } from "antd";
import type { BrandRamp } from "../brands.js";
import type { ColorMode } from "../tokens/surfaces.js";
import { surfaces, borderSet, controlBorders } from "../tokens/surfaces.js";
import { text } from "../tokens/text.js";
import { elevation } from "../tokens/elevation.js";
import type { SurfaceKind } from "../tokens/typography.js";

type Components = NonNullable<ThemeConfig["components"]>;

export function buildComponents(
  ramp: BrandRamp,
  mode: ColorMode,
  kind: SurfaceKind,
): Components {
  const s = surfaces[mode];
  const b = borderSet(kind, mode);
  const t = text[mode];
  const ctl = controlBorders[kind][mode];
  const dark = mode === "dark";

  /**
   * Selected data rows use a neutral wash on every brand, with the brand
   * carried by a 3px left edge instead. A pale accent flood on a red brand is
   * indistinguishable from the wash fleet tables use for overdue and failed
   * rows.
   */
  const rowSelected = dark ? "#2a2a2a" : "#f1f5f9";

  return {
    Layout: {
      headerBg: s.chrome,
      siderBg: s.chrome,
      bodyBg: s.page,
      triggerBg: dark ? s.panel : s.subtle,
      ...(dark ? {} : { triggerColor: t.secondary }),
    },

    Menu: {
      // Menu chrome carries no data semantics, so selection DOES take the
      // brand fill here — unlike Table and Select below.
      itemBg: "transparent",
      subMenuItemBg: dark ? "transparent" : s.page,
      itemSelectedBg: ramp.soft,
      itemSelectedColor: ramp.link,
      itemHoverBg: dark ? s.panel : s.subtle,
      // transparent, not a hex: this binds the menu to Layout.siderBg
      // permanently so the two can never desynchronise again. A literal here
      // was ambiguous between "chrome" and "page" before the ramp split.
      ...(dark
        ? {
            darkItemBg: "transparent",
            darkSubMenuItemBg: "transparent",
            darkItemSelectedBg: ramp.solid,
            darkItemHoverBg: s.panel,
            darkPopupBg: s.elevated,
          }
        : {}),
    },

    Card: {
      // Was #141414 in dark. Chrome-coloured cards on a lighter page read as
      // holes cut into the page rather than panels raised above it.
      colorBgContainer: s.panel,
      // Ant Design draws the card edge from the SECONDARY border, which is the
      // quietest value in the set. Customer surfaces take the full-strength
      // border instead, so cards are clearly outlined for people who see the
      // page once — David's call, 2026-08-17. Interior dividers stay quiet.
      colorBorderSecondary: kind === "customer" ? b.base : b.secondary,
      boxShadowTertiary: elevation[mode].resting,
    },

    Table: {
      colorBgContainer: s.panel,
      // Was #1f1f1f, which is DARKER than a #212121 body at 1.02:1 —
      // effectively invisible. bm-order-confirmation ships that bug today.
      headerBg: dark ? s.elevated : s.page,
      // Was #262626: a clear lift off #141414, but 1.06:1 off #212121.
      rowHoverBg: dark ? "#303030" : s.subtle,
      rowSelectedBg: rowSelected,
      rowSelectedHoverBg: rowSelected,
      // Newly load-bearing. With header/body separation down to 1.12:1, the
      // band has to be carried by a rule rather than by fill alone.
      headerSplitColor: b.base,
      borderColor: b.secondary,
    },

    Form: {
      labelColor: t.primary,
    },

    Input: {
      // Was #1f1f1f, a recessed well against a #141414 card. Against a
      // #212121 panel it measures 1.02:1 and the field vanishes; the well is
      // carried by the border instead.
      colorBgContainer: s.panel,
      colorBorder: ctl.rest,
      hoverBorderColor: ctl.hover,
      colorText: t.primary,
      activeBorderColor: ramp.base,
      activeShadow: focusRing(ramp.base, mode),
    },

    Select: {
      colorBgContainer: s.panel,
      colorBorder: ctl.rest,
      hoverBorderColor: ctl.hover,
      colorText: t.primary,
      // Select has no activeShadow token, unlike Input — its focus ring comes
      // from the global controlOutline. Do not add one here; it will not
      // typecheck and the global token already covers it.
      activeBorderColor: ramp.base,
      optionSelectedBg: rowSelected,
      optionSelectedColor: ramp.link,
    },

    Button: {
      // defaultBg, not colorBgContainer — Ant Design 5 reads defaultBg here.
      // The old override used the wrong token and therefore did nothing.
      defaultBg: dark ? "#101010" : "#ffffff",
      defaultHoverBg: dark ? "#262626" : s.subtle,
      defaultBorderColor: ctl.rest,
      defaultHoverBorderColor: ramp.base,
      defaultHoverColor: ramp.link,
      defaultColor: t.primary,
      primaryShadow: "none",
    },

    Modal: {
      // Was #141414. Under the new ramp that is a near-black slab on a
      // lighter page behind a dim mask. Modals are elevated surfaces.
      contentBg: s.elevated,
      headerBg: s.elevated,
      footerBg: s.elevated,
    },

    Drawer: {
      colorBgElevated: s.elevated,
    },

    Dropdown: {
      // Was #1f1f1f, which sat just above the old page but sits BELOW the
      // panel its trigger lives on — an inverted popup.
      colorBgElevated: s.elevated,
      colorBorder: b.floating,
    },

    Popover: {
      colorBgElevated: s.elevated,
    },

    Tooltip: {
      colorBgSpotlight: dark ? "#262626" : "#1e293b",
      colorTextLightSolid: "#ffffff",
    },

    Typography: {
      colorText: t.primary,
      colorTextSecondary: t.secondary,
      colorTextTertiary: t.tertiary,
      colorLink: ramp.link,
      colorLinkHover: ramp.linkHover,
    },

    Divider: {
      colorSplit: b.base,
    },

    Tabs: {
      itemSelectedColor: ramp.link,
      itemHoverColor: ramp.linkHover,
      inkBarColor: ramp.base,
      // Card-type tabs need a tone BELOW the panel. Under the old ramp the
      // container was already the darkest surface, so this was inexpressible.
      cardBg: dark ? s.subtle : s.page,
    },

    Segmented: {
      // Same story as Tabs.cardBg — the new ramp makes this component
      // styleable for the first time, which is plausibly why no fleet app has
      // ever styled it.
      trackBg: dark ? s.page : s.subtle,
      itemSelectedBg: dark ? "#333333" : "#ffffff",
    },

    Collapse: {
      headerBg: dark ? s.subtle : s.page,
      contentBg: s.panel,
    },

    Steps: {
      colorPrimary: ramp.base,
      colorFillContent: dark ? "#333333" : s.subtle,
    },

    Pagination: {
      itemBg: s.panel,
      itemActiveBg: ramp.soft,
    },

    Breadcrumb: {
      linkHoverColor: ramp.link,
      colorText: t.secondary,
    },

    Switch: {
      colorPrimary: ramp.base,
      colorPrimaryHover: ramp.solidHover,
      // The fleet quaternary is a TEXT tone; reused as a track fill on a
      // #212121 panel it is a 2.4:1 blob.
      colorTextQuaternary: dark ? "#4d4d4d" : "#cbd5e1",
    },

    Slider: {
      railBg: dark ? "#333333" : "#e2e8f0",
      railHoverBg: dark ? "#4d4d4d" : "#cbd5e1",
      trackBg: ramp.base,
      trackHoverBg: ramp.solidHover,
      handleColor: ramp.base,
      handleActiveColor: ramp.solidActive,
      dotActiveBorderColor: ramp.base,
    },

    Checkbox: { colorPrimary: ramp.base },
    Radio: { colorPrimary: ramp.base },
    Progress: { defaultColor: ramp.base },

    Empty: {
      // Tuned for a near-black ground; invisible on the #212121 panels where
      // empty states actually render, inside cards and tables.
      ...(dark ? { opacityImage: 0.5 } : {}),
    },

    Badge: {
      // Badge rings its dot in colorBgContainer. While Card and Table were
      // overridden to chrome against a panel-coloured global, every badge on
      // a card had a mismatched ring. Fixing Card resolves it; pinned so the
      // fix is not later mistaken for a regression.
      colorBgContainer: s.panel,
    },
  };
}

/**
 * The focus ring. One definition, brand-derived, referenced by every focusable
 * control — a focused input must match a focused button, and per-component
 * rings drift apart.
 *
 * Under a red brand the ring KEEPS the brand: it is the strongest "you are
 * here" signal. The invalid-field state shifts instead, to the dark maroon
 * family with a heavier border and a required icon, so a bright thin glow
 * means focused and a heavy dark edge means wrong. Without that split, a
 * payment form cannot distinguish the two.
 */
export function focusRing(accent: string, mode: ColorMode): string {
  const alpha = mode === "dark" ? 0.28 : 0.2;
  return `0 0 0 3px ${withAlpha(accent, alpha)}`;
}

/** Accepts #rgb, #rrggbb, or an existing rgba() string (returned unchanged). */
export function withAlpha(color: string, alpha: number): string {
  if (!color.startsWith("#")) return color;
  const hex = color.slice(1);
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const n = Number.parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
