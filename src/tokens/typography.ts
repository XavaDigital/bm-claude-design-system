/**
 * Typography. Ruled by David 2026-08-16.
 *
 * Archivo carries headings in EVERY app — it is the constant that makes a
 * customer page and a staff page recognisably the same fleet, and it matches
 * beastmode.co.nz.
 *
 * Body text forks by surface. Customer surfaces use Montserrat, matching the
 * website exactly. Staff tools use Inter, because Montserrat is a geometric
 * display face roughly 8-10% wider and the staff CRM is mostly dense quote and
 * order tables. Brand outward, ergonomics inward.
 *
 * Ant Design has NO heading-font token. Archivo must be applied by CSS, and
 * the selector list has to include portalled titles (modal and drawer headers
 * render outside the provider's DOM subtree). See ../react/globalCss.ts.
 */

export type SurfaceKind = "staff" | "customer";

const STACK_TAIL = `ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

export const families = {
  /** Headings, both surfaces, always. */
  heading: `"Archivo Variable", "Archivo", ${STACK_TAIL}`,
  /** Body on customer-facing surfaces. */
  customerBody: `"Montserrat Variable", "Montserrat", ${STACK_TAIL}`,
  /** Body in staff tools. */
  staffBody: `"Inter Variable", "Inter", ${STACK_TAIL}`,
  /**
   * Order numbers, tracking codes, SKUs, references.
   *
   * A system stack, deliberately. Seven fleet apps hand-wrote some version of
   * this, and shipping a fourth webfont for reference numbers would repeat the
   * exact failure the audit found: a family named in the theme but never
   * actually loaded.
   */
  mono: `ui-monospace, "Cascadia Mono", Consolas, "Courier New", monospace`,
} as const;

export function bodyFamily(kind: SurfaceKind): string {
  return kind === "customer" ? families.customerBody : families.staffBody;
}

export interface TypeStep {
  size: number;
  weight: number;
  lineHeight: number;
  /** em. Archivo headings want slight negative; small Montserrat wants positive. */
  tracking: number;
}

/** Headings. Fixed across both surfaces — this is the brand voice. */
export const headings = {
  display: { size: 56, weight: 700, lineHeight: 1.05, tracking: -0.022 },
  h1: { size: 36, weight: 700, lineHeight: 1.15, tracking: -0.02 },
  h2: { size: 28, weight: 600, lineHeight: 1.2, tracking: -0.016 },
  h3: { size: 22, weight: 600, lineHeight: 1.27, tracking: -0.012 },
  h4: { size: 18, weight: 600, lineHeight: 1.33, tracking: -0.008 },
  h5: { size: 16, weight: 600, lineHeight: 1.4, tracking: -0.004 },
  /**
   * Eyebrows and field-group labels. The only place Archivo goes below 16px —
   * uppercase plus heavy tracking is what makes it hold up at that size.
   */
  overline: { size: 11, weight: 600, lineHeight: 1.45, tracking: 0.08 },
} as const satisfies Record<string, TypeStep>;

/**
 * Body scale, per surface.
 *
 * Customer body is 16px and that is load-bearing rather than taste: iOS Safari
 * force-zooms any input under 16px, and customer surfaces are where checkout
 * and contact forms live. Staff tools are desktop-only, so 14px stands and
 * buys back the density Montserrat would have cost.
 */
export const bodyScale: Record<SurfaceKind, Record<string, TypeStep>> = {
  staff: {
    lede: { size: 16, weight: 400, lineHeight: 1.6, tracking: 0 },
    body: { size: 14, weight: 400, lineHeight: 1.5714, tracking: 0 },
    bodySm: { size: 13, weight: 400, lineHeight: 1.5385, tracking: 0 },
    label: { size: 13, weight: 500, lineHeight: 1.4, tracking: 0.004 },
    caption: { size: 12, weight: 400, lineHeight: 1.5, tracking: 0.005 },
    tableHeader: { size: 12, weight: 600, lineHeight: 1.5, tracking: 0.01 },
    data: { size: 13, weight: 400, lineHeight: 1.5385, tracking: 0 },
    dataStrong: { size: 13, weight: 600, lineHeight: 1.4, tracking: 0 },
  },
  customer: {
    lede: { size: 18, weight: 400, lineHeight: 1.6, tracking: 0 },
    body: { size: 16, weight: 400, lineHeight: 1.6, tracking: 0 },
    bodySm: { size: 14, weight: 400, lineHeight: 1.5714, tracking: 0.005 },
    label: { size: 14, weight: 600, lineHeight: 1.4, tracking: 0.01 },
    caption: { size: 13, weight: 400, lineHeight: 1.5385, tracking: 0.012 },
    tableHeader: { size: 13, weight: 600, lineHeight: 1.5, tracking: 0.01 },
    /** Negative tracking: in a dense grid, width beats sparkle. */
    data: { size: 14, weight: 400, lineHeight: 1.5385, tracking: -0.006 },
    dataStrong: { size: 15, weight: 600, lineHeight: 1.4, tracking: 0 },
  },
};

/**
 * Minimum sizes below which each family stops being legible. Enforced in
 * review, not by the type system.
 */
export const sizeFloors = {
  Archivo: 11,
  Montserrat: 13,
  Inter: 12,
} as const;

/**
 * Roles that MUST render with tabular figures. This fleet is full of order
 * numbers, quantities, prices and tracking codes; proportional digits make
 * columns fail to line up and make a re-rendering number visibly jump.
 *
 * Apply as `font-variant-numeric: tabular-nums`.
 */
export const tabularRoles = [
  "data",
  "dataStrong",
  "tableHeader",
  "kpi",
] as const;
