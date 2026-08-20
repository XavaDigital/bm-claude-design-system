/**
 * Surface ramps. Ruled by David 2026-08-16.
 *
 * The dark ramp has four steps, not one background. `chrome` is DARKER than
 * `page`: the header and sidebar recede, the working area sits above them.
 * Getting this backwards inverts the depth model of every screen — it is the
 * single most common mistake when migrating an app onto this package.
 */

export type ColorMode = "light" | "dark";

/** Roles, ordered from the back of the screen forward. */
export interface SurfaceRamp {
  /** Header and sidebar. Dark: the darkest surface. Light: white. */
  chrome: string;
  /** The page ground the working area sits on. */
  page: string;
  /** Cards, panels, table containers. */
  panel: string;
  /** Dropdowns, popovers, modals — anything floating above the page. */
  elevated: string;
  /** Hover fills and subtle bands. Not a container surface. */
  subtle: string;
}

export const surfaces: Record<ColorMode, SurfaceRamp> = {
  light: {
    chrome: "#ffffff",
    page: "#f8fafc",
    panel: "#ffffff",
    elevated: "#ffffff",
    subtle: "#f1f5f9",
  },
  dark: {
    /** #151515 matches the beastmode.co.nz ground. Ruled 2026-08-21 (was #141414). */
    chrome: "#151515",
    page: "#191919",
    panel: "#212121",
    elevated: "#2a2a2a",
    subtle: "#1d1d1d",
  },
};

/**
 * Borders.
 *
 * `rim` values are the light-source edge that carries depth in dark mode,
 * where shadows are near-invisible. They step up with elevation. See
 * ./elevation.ts — the rim IS the border; never apply both a rim and a
 * separate card edge, or floating surfaces get a double outline.
 */
export interface BorderSet {
  /** Non-floating dividers and control edges. */
  base: string;
  /** Interior dividers and the resting-panel rim. */
  secondary: string;
  /** Dropdown, popover, select and date-picker edges. */
  floating: string;
  /** Modal and drawer edges. */
  dialog: string;
}

export const borders: Record<ColorMode, BorderSet> = {
  light: {
    base: "#e2e8f0",
    secondary: "#eef2f7",
    floating: "#e2e8f0",
    dialog: "#cbd5e1",
  },
  dark: {
    base: "#333333",
    secondary: "#2e2e2e",
    floating: "#3d3d3d",
    dialog: "#414141",
  },
};

/**
 * Customer-facing surfaces get a heavier border ramp — one clear step up from
 * the staff set.
 *
 * David's call, 2026-08-17: the quiet borders read well in the staff tools, but
 * card and panel edges need more definition on the customer side. That is the
 * same reasoning behind the control-border split below, extended from form
 * fields to container edges: people using the storefront once are not people
 * who have learned where the boundaries are.
 */
const customerBorders: Record<ColorMode, BorderSet> = {
  light: {
    base: "#cbd5e1",
    secondary: "#e2e8f0",
    floating: "#cbd5e1",
    dialog: "#94a3b8",
  },
  dark: {
    base: "#4d4d4d",
    secondary: "#3d3d3d",
    floating: "#4d4d4d",
    dialog: "#5c5c5c",
  },
};

/** Resolve the border ramp for a surface. Staff keeps the quiet set. */
export function borderSet(kind: "staff" | "customer", mode: ColorMode): BorderSet {
  return kind === "customer" ? customerBorders[mode] : borders[mode];
}

/**
 * Form-control borders, which vary by surface.
 *
 * WCAG 1.4.11 requires 3:1 for boundaries that identify a control. The fleet's
 * quiet borders do not meet it: dark #333333 on #212121 measures 1.27:1 and
 * light #e2e8f0 on #ffffff measures 1.23:1.
 *
 * David ruled 2026-08-16 to accept that gap on internal tools. It is NOT
 * accepted on customer-facing surfaces, which include a live storefront taking
 * payments and a public donation flow. Hence the split: `staff` keeps the
 * quiet look, `customer` uses conformant values.
 *
 * To make the fleet uniform again, point both keys at the same set.
 */
export const controlBorders = {
  staff: {
    light: { rest: "#cbd5e1", hover: "#94a3b8" },
    dark: { rest: "#4d4d4d", hover: "#6b6b6b" },
  },
  customer: {
    /** #7c8ba3 on #ffffff = 3.45:1 — clears 1.4.11. */
    light: { rest: "#7c8ba3", hover: "#64748b" },
    /** #6b6b6b on #212121 = 3.02:1 — clears 1.4.11. */
    dark: { rest: "#6b6b6b", hover: "#8a8a8a" },
  },
} as const;
