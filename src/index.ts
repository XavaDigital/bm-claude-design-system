/**
 * @beastmode/ui — the shared BeastMode fleet design system.
 *
 * Most apps need exactly two things:
 *
 *   import { BeastModeRoot } from "@beastmode/ui";
 *   import "@beastmode/ui/vars.css";
 *
 * and then wrap the app once. Apps containing a customer-facing section also
 * use `Surface` to mark it.
 */

export { BeastModeRoot, type BeastModeRootProps } from "./react/BeastModeRoot.js";
export { Surface, useSurface, type SurfaceProps, type SurfaceState } from "./react/Surface.js";
export {
  Modal,
  Drawer,
  Tooltip,
  Popover,
  Popconfirm,
  Dropdown,
  useOverlayProps,
} from "./react/overlays.js";

export { buildTheme, resolveFlat, cssVarKey, type SurfaceSpec } from "./theme/buildTheme.js";
export { focusRing, withAlpha } from "./theme/components.js";
export { FOLLOWS_BRAND, NEVER_FOLLOWS_BRAND } from "./theme/followsBrand.js";

export { brands, resolveBrand, isRedBrand, redBrands, type Brand, type BrandKey, type BrandRamp } from "./brands.js";

export * from "./tokens/index.js";
