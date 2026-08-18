import type { HTMLAttributes, Ref, ReactNode } from "react";
import clsx from "clsx";
import styles from "./Sidebar.module.css";
import { CollapseIcon } from "./CollapseIcon";

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  ref?: Ref<HTMLElement>;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({
  title,
  children,
  className,
  ref,
  collapsed = false,
  onCollapsedChange,
  ...rest
}: SidebarProps) {
  const isCollapsible = onCollapsedChange !== undefined;

  return (
    <aside
      ref={ref}
      className={clsx(styles.sidebar, collapsed && styles.collapsed, className)}
      {...rest}
    >
      <div className={styles.header}>
        {title && (
          <div className={clsx(styles.headerContent, collapsed && styles.headerContentHidden)}>
            {title}
          </div>
        )}

        {isCollapsible && (
          <button
            type="button"
            className={clsx(styles.toggleButton, collapsed && styles.toggleButtonCollapsed)}
            onClick={() => onCollapsedChange(!collapsed)}
            aria-label={collapsed ? "باز کردن منو" : "بستن منو"}
          >
            <CollapseIcon />
          </button>
        )}
      </div>

      <div className={styles.body}>{children}</div>
    </aside>
  );
}
