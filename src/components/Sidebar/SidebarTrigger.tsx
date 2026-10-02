"use client";

import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./Sidebar.module.css";
import { HamburgerIcon } from "./HamburgerIcon";

export interface SidebarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  collapsed?: boolean;
  icon?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

export function SidebarTrigger({
  collapsed,
  icon,
  children,
  className,
  ref,
  ...rest
}: SidebarTriggerProps) {
  const label =
    collapsed === undefined ? "باز و بسته کردن منو" : collapsed ? "باز کردن منو" : "بستن منو";

  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={collapsed === undefined ? undefined : !collapsed}
      {...rest}
      ref={ref}
      className={clsx(styles.trigger, className)}
      data-fara-sidebar-trigger
      data-collapsed={collapsed || undefined}
    >
      {children ?? icon ?? <HamburgerIcon />}
    </button>
  );
}
