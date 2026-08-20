import * as React from "react";
import { ConfigProvider } from "antd";
import { buildTheme, type SurfaceSpec } from "../theme/buildTheme.js";
import type { BrandKey } from "../brands.js";
import type { ColorMode } from "../tokens/surfaces.js";
import type { SurfaceKind } from "../tokens/typography.js";

export interface SurfaceState extends SurfaceSpec {
  depth: number;
  /** Class string carrying this surface's CSS custom properties. */
  className: string;
  /** Portal container for overlays, so they inherit THIS surface's variables. */
  getPortal: () => HTMLElement | undefined;
}

const DEFAULT_STATE: SurfaceState = {
  kind: "staff",
  brand: "beastmode",
  mode: "light",
  depth: 0,
  className: "bm-surface bm-surface--staff bm-brand--beastmode bm-mode--light",
  getPortal: () => (typeof document === "undefined" ? undefined : document.body),
};

const SurfaceCtx = React.createContext<SurfaceState>(DEFAULT_STATE);

export const useSurface = (): SurfaceState => React.useContext(SurfaceCtx);

export interface SurfaceProps {
  /** Omit to inherit from the enclosing surface. */
  kind?: SurfaceKind;
  brand?: BrandKey;
  /**
   * Colour mode never flips implicitly. It is a user-level setting inherited
   * by nested surfaces; only an explicit value here changes it, which in
   * practice means preview frames and nothing else.
   */
  mode?: ColorMode;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

function surfaceClass(s: SurfaceSpec): string {
  return `bm-surface bm-surface--${s.kind} bm-brand--${s.brand} bm-mode--${s.mode}`;
}

/**
 * Portal container per surface.
 *
 * Overlays render into document.body, outside the wrapper element, so they
 * escape any CSS custom property scoped to the surface class. React context
 * still reaches them, so Ant Design's own tokens are fine — but our variables
 * and any app CSS keyed off the surface class are not. A sibling container
 * carrying the same class fixes both.
 */
function makePortalGetter(cls: string): () => HTMLElement | undefined {
  let el: HTMLElement | null = null;
  return () => {
    if (typeof document === "undefined") return undefined;
    if (!el || !el.isConnected) {
      el = document.createElement("div");
      el.className = `bm-portal ${cls}`;
      document.body.appendChild(el);
    }
    return el;
  };
}

/**
 * Declares a section as staff or customer.
 *
 * May appear at any depth, any number of times. Three fleet apps need this
 * because they contain both audiences in one bundle: bm-order-confirmation
 * (staff admin plus customer order pages), bm-designflow (staff briefs plus
 * the customer portal) and BM-estore (admin plus storefront).
 */
export function Surface({
  kind,
  brand,
  mode,
  as: Tag = "div",
  className,
  children,
}: SurfaceProps): React.ReactElement {
  const parent = useSurface();

  const resolved: SurfaceSpec = React.useMemo(
    () => ({
      kind: kind ?? parent.kind,
      brand: brand ?? parent.brand,
      mode: mode ?? parent.mode,
    }),
    [kind, brand, mode, parent.kind, parent.brand, parent.mode],
  );

  const differs =
    resolved.kind !== parent.kind ||
    resolved.brand !== parent.brand ||
    resolved.mode !== parent.mode;

  const cls = surfaceClass(resolved);
  const getPortal = React.useMemo(() => makePortalGetter(cls), [cls]);

  // Memoised: a fresh theme object on every render re-seeds Ant Design's style
  // engine and produces a visible flash plus a real performance cost.
  const themeConfig = React.useMemo(() => buildTheme(resolved), [resolved]);

  const ctx = React.useMemo<SurfaceState>(
    () => ({ ...resolved, depth: parent.depth + 1, className: cls, getPortal }),
    [resolved, parent.depth, cls, getPortal],
  );

  // A redundant <Surface> inside a matching one costs nothing.
  if (!differs && parent.depth > 0) return <>{children}</>;

  return (
    <SurfaceCtx.Provider value={ctx}>
      <ConfigProvider theme={themeConfig} getPopupContainer={getPortal as () => HTMLElement}>
        <Tag
          className={[cls, className].filter(Boolean).join(" ")}
          data-bm-surface={resolved.kind}
          data-bm-brand={resolved.brand}
          data-bm-mode={resolved.mode}
        >
          {children}
        </Tag>
      </ConfigProvider>
    </SurfaceCtx.Provider>
  );
}
