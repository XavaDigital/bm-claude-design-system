/**
 * Overlay wrappers.
 *
 * Ant Design's overlays render into document.body through portals, escaping
 * the surface element. React context still reaches them, so Ant Design's own
 * tokens resolve correctly — but the package's CSS custom properties and any
 * app CSS keyed off the surface class do not. Symptom: a customer-preview
 * modal renders in the correct red but the wrong font, and non-Ant Design
 * content inside it paints the parent surface's accent.
 *
 * Most overlays are fixed by `getPopupContainer`, which Surface already
 * passes. Modal and Drawer ignore it — they take `getContainer` instead, and
 * that specific gap is what this file exists for.
 *
 * Migration is a mechanical import swap. Enforce it with an eslint
 * `no-restricted-imports` rule naming these components on the `antd` path,
 * otherwise a future import quietly reintroduces the bug.
 */

import * as React from "react";
import {
  Modal as AntModal,
  Drawer as AntDrawer,
  Tooltip as AntTooltip,
  Popover as AntPopover,
  Popconfirm as AntPopconfirm,
  Dropdown as AntDropdown,
  type ModalProps,
  type DrawerProps,
  type TooltipProps,
  type PopoverProps,
  type PopconfirmProps,
  type DropdownProps,
} from "antd";
import { useSurface } from "./Surface.js";

function cx(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Props every overlay in this file needs to stay inside its own surface. */
export function useOverlayProps() {
  const { className, getPortal } = useSurface();
  return {
    rootClassName: className,
    getPopupContainer: getPortal as () => HTMLElement,
    getContainer: getPortal as () => HTMLElement,
  };
}

export function Modal({ rootClassName, ...rest }: ModalProps): React.ReactElement {
  const o = useOverlayProps();
  return (
    <AntModal
      getContainer={o.getContainer}
      rootClassName={cx(o.rootClassName, rootClassName)}
      {...rest}
    />
  );
}

export function Drawer({ rootClassName, ...rest }: DrawerProps): React.ReactElement {
  const o = useOverlayProps();
  return (
    <AntDrawer
      getContainer={o.getContainer}
      rootClassName={cx(o.rootClassName, rootClassName)}
      {...rest}
    />
  );
}

export function Tooltip({ rootClassName, ...rest }: TooltipProps): React.ReactElement {
  const o = useOverlayProps();
  return (
    <AntTooltip
      getPopupContainer={o.getPopupContainer}
      rootClassName={cx(o.rootClassName, rootClassName)}
      {...rest}
    />
  );
}

export function Popover({ rootClassName, ...rest }: PopoverProps): React.ReactElement {
  const o = useOverlayProps();
  return (
    <AntPopover
      getPopupContainer={o.getPopupContainer}
      rootClassName={cx(o.rootClassName, rootClassName)}
      {...rest}
    />
  );
}

export function Popconfirm({ rootClassName, ...rest }: PopconfirmProps): React.ReactElement {
  const o = useOverlayProps();
  return (
    <AntPopconfirm
      getPopupContainer={o.getPopupContainer}
      rootClassName={cx(o.rootClassName, rootClassName)}
      {...rest}
    />
  );
}

export function Dropdown({ rootClassName, ...rest }: DropdownProps): React.ReactElement {
  const o = useOverlayProps();
  return (
    <AntDropdown
      getPopupContainer={o.getPopupContainer}
      rootClassName={cx(o.rootClassName, rootClassName)}
      {...rest}
    />
  );
}
