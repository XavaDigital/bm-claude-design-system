import * as React from "react";
import { App as AntApp } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { Surface } from "./Surface.js";
import type { BrandKey } from "../brands.js";
import type { ColorMode } from "../tokens/surfaces.js";
import type { SurfaceKind } from "../tokens/typography.js";

export interface BeastModeRootProps {
  /**
   * Defaults to `staff`, which is the safe default: an unmarked surface
   * rendering indigo is an internal cosmetic miss, whereas an unmarked surface
   * rendering brand red puts a customer identity on an internal screen. It
   * also makes every customer surface in the fleet greppable.
   */
  surface?: SurfaceKind;
  brand?: BrandKey;
  /** `system` follows the operating system and updates live. */
  mode?: ColorMode | "system";
  children: React.ReactNode;
}

function useResolvedMode(mode: ColorMode | "system"): ColorMode {
  const [systemDark, setSystemDark] = React.useState(false);

  React.useEffect(() => {
    if (mode !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  if (mode === "system") return systemDark ? "dark" : "light";
  return mode;
}

/**
 * Mount once per app, at the root.
 *
 * Owns everything that must exist exactly once: the style layer, the Ant
 * Design `App` that backs message and notification, and the implicit outer
 * surface. An entirely staff app writes this and nothing else.
 *
 * Two things it deliberately does NOT do:
 *
 * - It does not gate rendering on fonts loading. Doing so converts a instant
 *   theme application into a blank screen on a cold cache. Fonts arrive via
 *   `font-display: swap` with metric-matched fallbacks instead.
 * - It does not replace an app's pre-paint anti-flash script. That script must
 *   stay inline in the document head, BEFORE any stylesheet link, because an
 *   external stylesheet blocks execution of inline scripts that follow it —
 *   which would reintroduce exactly the flash the script exists to prevent.
 */
export function BeastModeRoot({
  surface = "staff",
  brand = "beastmode",
  mode = "system",
  children,
}: BeastModeRootProps): React.ReactElement {
  const resolved = useResolvedMode(mode);

  return (
    // `layer` wraps Ant Design's styles in a CSS layer so the package's own
    // unlayered rules (Archivo headings, for one) win without specificity
    // hacks. `hashed` must stay on: with hashing off, two surfaces emit
    // identical class names and the second silently overwrites the first,
    // collapsing staff and customer into one theme.
    <StyleProvider layer hashPriority="low">
      <Surface kind={surface} brand={brand} mode={resolved} as="div" className="bm-root">
        {/*
          Static message.success() and Modal.confirm() imported from antd
          cannot reach React context and render unthemed. Every app must use
          App.useApp() instead, which requires this provider to be mounted.

          `component` must stay a real element rather than `false`: in
          CSS-variable mode Ant Design needs a node to hang the variable scope
          on, and passing false makes it warn and drop the scope.
        */}
        <AntApp component="div" style={{ height: "100%" }}>
          {children}
        </AntApp>
      </Surface>
    </StyleProvider>
  );
}
