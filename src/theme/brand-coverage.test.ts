/**
 * The guard against the worst defect found during design review.
 *
 * A component map that hardcodes the accent as a literal renders a red-brand
 * app half-red: the primary button follows the brand, the tab underline and
 * slider stay indigo. It looks like a theming bug and it is nearly invisible
 * in review, because each individual line is plausible.
 *
 * The test varies ONLY the brand — same surface kind, same mode — and asserts
 * that the set of theme values which changed is exactly the set declared in
 * followsBrand.ts. A literal left behind shows up as a MISSING key; a value
 * that should be brand-invariant but drifted shows up as an EXTRA one.
 */

import { describe, expect, it } from "vitest";
import { buildTheme, cssVarKey } from "./buildTheme.js";
import { FOLLOWS_BRAND } from "./followsBrand.js";
import type { BrandKey } from "../brands.js";
import type { ColorMode } from "../tokens/surfaces.js";
import { chartSeries } from "../tokens/charts.js";
import { status } from "../tokens/status.js";
import { surfaces } from "../tokens/surfaces.js";

type Flat = Record<string, string>;

function flatten(spec: { kind: "staff" | "customer"; brand: BrandKey; mode: ColorMode }): Flat {
  const theme = buildTheme(spec);
  const out: Flat = {};

  for (const [k, v] of Object.entries(theme.token ?? {})) {
    if (typeof v === "string" || typeof v === "number") out[`token.${k}`] = String(v);
  }
  for (const [comp, tokens] of Object.entries(theme.components ?? {})) {
    for (const [k, v] of Object.entries((tokens ?? {}) as Record<string, unknown>)) {
      if (typeof v === "string" || typeof v === "number") out[`${comp}.${k}`] = String(v);
    }
  }
  return out;
}

function changedKeys(a: Flat, b: Flat): string[] {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].filter((k) => a[k] !== b[k]).sort();
}

const MODES: ColorMode[] = ["light", "dark"];
const RED_BRANDS: BrandKey[] = ["estore", "gotyaback"];
const allowed = new Set<string>(FOLLOWS_BRAND);

describe("brand coverage", () => {
  for (const mode of MODES) {
    for (const brand of RED_BRANDS) {
      const reference = flatten({ kind: "customer", brand: "beastmode", mode });
      const branded = flatten({ kind: "customer", brand, mode });
      const changed = changedKeys(reference, branded);

      it(`${brand} / ${mode}: every changed key is declared in FOLLOWS_BRAND`, () => {
        const undeclared = changed.filter((k) => !allowed.has(k));
        expect(undeclared, `undeclared brand-varying keys: ${undeclared.join(", ")}`).toEqual([]);
      });

      it(`${brand} / ${mode}: every declared slot actually changes`, () => {
        // Some slots exist in one mode only (Menu.darkItemSelectedBg), so the
        // check is limited to slots present in this mode's theme.
        const present = FOLLOWS_BRAND.filter(
          (k) => k in reference || k in branded,
        );
        const stuck = present.filter((k) => reference[k] === branded[k]);
        expect(
          stuck,
          `declared as brand-following but did not change — likely a hardcoded literal: ${stuck.join(", ")}`,
        ).toEqual([]);
      });

      it(`${brand} / ${mode}: the accent actually reaches the components`, () => {
        // A blunt backstop for the specific failure: if only the seed changed
        // and no component did, the map is static.
        const componentChanges = changed.filter((k) => !k.startsWith("token."));
        expect(componentChanges.length).toBeGreaterThan(5);
      });
    }
  }
});

describe("brand invariants", () => {
  for (const mode of MODES) {
    it(`${mode}: status colours never follow the brand`, () => {
      for (const brand of RED_BRANDS) {
        const t = buildTheme({ kind: "customer", brand, mode });
        expect(t.token?.colorSuccess).toBe(status[mode].success.base);
        expect(t.token?.colorWarning).toBe(status[mode].warning.base);
        expect(t.token?.colorError).toBe(status[mode].error.base);
      }
    });

    it(`${mode}: the info colour is indigo on every brand`, () => {
      // Ant Design derives info from primary. Left alone, a red brand renders
      // information messages in brand red, where they read as errors.
      for (const brand of ["beastmode", ...RED_BRANDS] as BrandKey[]) {
        const t = buildTheme({ kind: "customer", brand, mode });
        expect(t.token?.colorInfo).toBe(status[mode].info.base);
      }
    });

    it(`${mode}: surface ramps never follow the brand`, () => {
      for (const brand of RED_BRANDS) {
        const t = buildTheme({ kind: "customer", brand, mode });
        expect(t.token?.colorBgLayout).toBe(surfaces[mode].page);
        expect(t.token?.colorBgContainer).toBe(surfaces[mode].panel);
        expect(t.token?.colorBgElevated).toBe(surfaces[mode].elevated);
      }
    });

    it(`${mode}: chart series 1 is neither the accent nor a brand red`, () => {
      // Charts get screenshotted into decks where surface context is lost, so
      // the same metric must not change colour between apps.
      const series1 = chartSeries[mode][0]!.toLowerCase();
      for (const brand of ["beastmode", ...RED_BRANDS] as BrandKey[]) {
        const t = buildTheme({ kind: "customer", brand, mode });
        expect(series1).not.toBe(String(t.token?.colorPrimary).toLowerCase());
      }
    });
  }

  it("the dark chrome surface is darker than the page", () => {
    // The ruling that bm-sales gets wrong today. If these ever swap, every
    // screen's depth model inverts.
    expect(surfaces.dark.chrome).toBe("#151515");
    expect(surfaces.dark.page).toBe("#191919");
  });
});

describe("nested providers", () => {
  /**
   * Every distinct surface must own a distinct key.
   *
   * The first version of this test varied only the brand, so it passed while
   * the light and dark staff surfaces both claimed "bmstaff" — and a preview
   * page showing both rendered the light one entirely in dark colours, with
   * its own swatches still displaying the correct light values. Enumerate the
   * whole matrix rather than a sample.
   */
  it("every surface and mode combination gets a distinct CSS-variable key", () => {
    const specs = (["staff", "customer"] as const).flatMap((kind) =>
      (["beastmode", "estore", "gotyaback"] as BrandKey[]).flatMap((brand) =>
        MODES.map((mode) => ({ kind, brand, mode })),
      ),
    );
    // A staff surface ignores the brand, so those collapse by design.
    const meaningful = specs.filter((s) => s.kind === "customer" || s.brand === "beastmode");
    const keys = meaningful.map(cssVarKey);
    expect(new Set(keys).size).toBe(meaningful.length);
  });

  it("light and dark of the same surface never share a key", () => {
    for (const kind of ["staff", "customer"] as const) {
      for (const brand of ["beastmode", "estore", "gotyaback"] as BrandKey[]) {
        const light = cssVarKey({ kind, brand, mode: "light" });
        const dark = cssVarKey({ kind, brand, mode: "dark" });
        expect(light, `${kind}/${brand} shares a key across modes`).not.toBe(dark);
      }
    }
  });

  it("a staff surface stays indigo even when the app declares a red brand", () => {
    const t = buildTheme({ kind: "staff", brand: "estore", mode: "light" });
    expect(t.token?.colorPrimary).toBe("#4f46e5");
  });
});
