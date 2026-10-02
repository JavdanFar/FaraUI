"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import clsx from "clsx";
import styles from "./Sidebar.module.css";
import { useSidebarContext } from "./SidebarContext";

export interface SidebarItemProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children: ReactNode;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  ref?: Ref<HTMLElement>;
}

export function SidebarItem({
  children,
  icon,
  active,
  disabled,
  href,
  target,
  rel,
  className,
  ref,
  ...rest
}: SidebarItemProps) {
  const { collapsed } = useSidebarContext();
  const hasIcon = icon !== undefined && icon !== null && icon !== false;
  const textLabel = typeof children === "string" ? children : undefined;
  const hiddenLabel = collapsed && hasIcon ? textLabel : undefined;

  const common = {
    className: clsx(
      styles.item,
      active && styles.itemActive,
      disabled && styles.itemDisabled,
      !hasIcon && styles.itemNoIcon,
      className,
    ),
    "data-fara-sidebar-item": true,
    "data-active": active || undefined,
    "data-disabled": disabled || undefined,
    "data-has-icon": hasIcon || undefined,
    "aria-current": active ? ("page" as const) : undefined,
    title: rest.title ?? hiddenLabel,
    "aria-label": rest["aria-label"] ?? hiddenLabel,
  };

  const content = (
    <>
      {hasIcon && (
        <span className={styles.itemIcon} data-fara-sidebar-item-icon aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.itemLabel} data-fara-sidebar-item-label>
        {children}
      </span>
    </>
  );

  if (href !== undefined && !disabled) {
    return (
      <a
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        {...common}
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      {...common}
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled}
    >
      {content}
    </button>
  );
}
