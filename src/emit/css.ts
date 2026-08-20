/**
 * CSS emitters.
 *
 * Two outputs, for two consumers that cannot use the React layer:
 *
 * - `emitVarsCss` produces plain custom properties for bm-identity, the fleet
 *   login page. It is vanilla HTML, CSS and JS served by an Express service
 *   with no build step by deliberate design, and it is the screen every staff
 *   member passes through before every other app.
 * - `emitGlobalCss` produces the rules Ant Design has no token for — chiefly
 *   Archivo on headings, which has no heading-font token at all.
 */

import { surfaces, borders } from "../tokens/surfaces.js";
import { text, radius } from "../tokens/text.js";
import { status } from "../tokens/status.js";
import { elevation } from "../tokens/elevation.js";
import { chartSeries } from "../tokens/charts.js";
import { families, headings } from "../tokens/typography.js";
import { brands, type BrandKey } from "../brands.js";
import type { ColorMode } from "../tokens/surfaces.js";

function varsFor(mode: ColorMode): string[] {
  const s = surfaces[mode];
  const b = borders[mode];
  const t = text[mode];
  const st = status[mode];
  const e = elevation[mode];

  return [
    `--bm-chrome: ${s.chrome};`,
    `--bm-page: ${s.page};`,
    `--bm-panel: ${s.panel};`,
    `--bm-elevated: ${s.elevated};`,
    `--bm-subtle: ${s.subtle};`,
    ``,
    `--bm-border: ${b.base};`,
    `--bm-border-secondary: ${b.secondary};`,
    `--bm-border-floating: ${b.floating};`,
    ``,
    `--bm-text: ${t.primary};`,
    `--bm-text-secondary: ${t.secondary};`,
    `--bm-text-tertiary: ${t.tertiary};`,
    `--bm-text-disabled: ${t.disabled};`,
    ``,
    `--bm-success: ${st.success.base};`,
    `--bm-success-text: ${st.success.text};`,
    `--bm-warning: ${st.warning.base};`,
    `--bm-warning-text: ${st.warning.text};`,
    `--bm-error: ${st.error.base};`,
    `--bm-error-text: ${st.error.text};`,
    `--bm-info: ${st.info.base};`,
    ``,
    `--bm-shadow-resting: ${e.resting};`,
    `--bm-shadow-raised: ${e.raised};`,
    `--bm-shadow-floating: ${e.floating};`,
    ``,
    ...chartSeries[mode].map((c, i) => `--bm-chart-${i + 1}: ${c};`),
  ];
}

function accentVars(brand: BrandKey, mode: ColorMode): string[] {
  const r = brands[brand].ramp[mode];
  return [
    `--bm-accent: ${r.base};`,
    `--bm-accent-solid: ${r.solid};`,
    `--bm-accent-hover: ${r.solidHover};`,
    `--bm-accent-link: ${r.link};`,
    `--bm-accent-soft: ${r.soft};`,
    `--bm-on-accent: ${r.onSolid};`,
  ];
}

const indent = (lines: string[], pad = "  ") =>
  lines.map((l) => (l ? pad + l : "")).join("\n");

/**
 * The three-state theme pattern. An explicit choice stamps `data-bm-mode` on
 * the root; the default "system" setting stamps nothing, so only the media
 * query separates light from dark. Every colour is defined in the bare `:root`
 * block first — a value whose only definition sits inside a media query never
 * applies in the unstamped state, which renders one theme's text on the
 * other theme's background.
 */
export function emitVarsCss(): string {
  return `/* @beastmode/ui — generated. Do not edit by hand. */
/* For consumers with no build step. Import before your own stylesheet. */

:root {
${indent(varsFor("light"))}
${indent(accentVars("beastmode", "light"))}

  --bm-radius-sm: ${radius.sm}px;
  --bm-radius: ${radius.base}px;
  --bm-radius-lg: ${radius.lg}px;
  --bm-radius-pill: ${radius.pill}px;

  --bm-font-heading: ${families.heading};
  --bm-font-body: ${families.staffBody};
  --bm-font-mono: ${families.mono};

  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-bm-mode="light"]) {
${indent(varsFor("dark"), "    ")}
${indent(accentVars("beastmode", "dark"), "    ")}
    color-scheme: dark;
  }
}

:root[data-bm-mode="dark"] {
${indent(varsFor("dark"))}
${indent(accentVars("beastmode", "dark"))}
  color-scheme: dark;
}

/*
  Mode-scoped copies.

  The :root blocks above cover the normal case, where one app is in one mode.
  They are NOT enough when a surface of one mode is nested inside a page of
  another — a staff shell previewing a customer page, a side-by-side comparison,
  a Storybook grid. Without these, the nested surface gets Ant Design's tokens
  right and every --bm-* variable wrong, which renders one mode's text on the
  other mode's background.
*/
.bm-mode--light {
${indent(varsFor("light"))}
${indent(accentVars("beastmode", "light"))}
  color-scheme: light;
}

.bm-mode--dark {
${indent(varsFor("dark"))}
${indent(accentVars("beastmode", "dark"))}
  color-scheme: dark;
}

.bm-surface--customer {
  --bm-font-body: ${families.customerBody};
}

${(["estore", "gotyaback"] as BrandKey[])
  .map(
    (b) => `.bm-brand--${b}.bm-mode--light {
${indent(accentVars(b, "light"))}
}

.bm-brand--${b}.bm-mode--dark {
${indent(accentVars(b, "dark"))}
}`,
  )
  .join("\n\n")}
`;
}

/**
 * Rules Ant Design cannot express as tokens.
 *
 * The heading selector list has to include `.ant-modal-title` and
 * `.ant-drawer-title` explicitly: those render through portals, outside the
 * surface element, so a descendant selector alone misses them and dialog
 * titles silently fall back to the body font.
 */
export function emitGlobalCss(): string {
  return `/* @beastmode/ui — generated. Do not edit by hand. */

.bm-surface {
  background: var(--bm-page);
  color: var(--bm-text);
  font-family: var(--bm-font-body);
}

.bm-surface h1, .bm-surface h2, .bm-surface h3,
.bm-surface h4, .bm-surface h5, .bm-surface h6,
.bm-surface .ant-typography h1, .bm-surface .ant-typography h2,
.bm-surface .ant-typography h3, .bm-surface .ant-typography h4,
.bm-surface .ant-typography h5,
.bm-portal .ant-modal-title,
.bm-portal .ant-drawer-title,
.bm-portal .ant-popover-title {
  font-family: var(--bm-font-heading);
  font-weight: ${headings.h3.weight};
  letter-spacing: ${headings.h3.tracking}em;
  text-wrap: balance;
}

.bm-surface h1 { font-size: ${headings.h1.size}px; line-height: ${headings.h1.lineHeight}; letter-spacing: ${headings.h1.tracking}em; }
.bm-surface h2 { font-size: ${headings.h2.size}px; line-height: ${headings.h2.lineHeight}; letter-spacing: ${headings.h2.tracking}em; }
.bm-surface h3 { font-size: ${headings.h3.size}px; line-height: ${headings.h3.lineHeight}; }
.bm-surface h4 { font-size: ${headings.h4.size}px; line-height: ${headings.h4.lineHeight}; }
.bm-surface h5 { font-size: ${headings.h5.size}px; line-height: ${headings.h5.lineHeight}; }

.bm-overline {
  font-family: var(--bm-font-heading);
  font-size: ${headings.overline.size}px;
  font-weight: ${headings.overline.weight};
  letter-spacing: ${headings.overline.tracking}em;
  text-transform: uppercase;
}

/* Order numbers, SKUs, tracking codes. Slashed zero matters when a customer
   reads a reference back over the phone. */
.bm-mono, .bm-surface code, .bm-surface kbd, .bm-surface samp {
  font-family: var(--bm-font-mono);
  font-variant-numeric: tabular-nums slashed-zero;
}

/* Any column of numbers. Proportional digits stop columns lining up and make
   a re-rendering value visibly jump. */
.bm-surface .ant-table-cell-align-right,
.bm-surface .ant-statistic-content,
.bm-tabular {
  font-variant-numeric: tabular-nums;
}

.bm-surface :focus-visible {
  outline: 2px solid var(--bm-accent);
  outline-offset: 2px;
  border-radius: var(--bm-radius-sm);
}

/* Neutral in every brand. A saturated brand-red selection is both low contrast
   and reads as an error highlight; selection only has to make the selected
   characters legible. */
.bm-mode--light ::selection { background: #dbe2ea; color: #0f172a; }
.bm-mode--dark ::selection { background: #3a3f4b; color: #ffffff; }

@media (prefers-reduced-motion: reduce) {
  .bm-surface *, .bm-portal * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
}
