import type { HTMLAttributes, Ref, ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";
import styles from "./Sidebar.module.css";
import { CollapseIcon } from "./CollapseIcon";

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  ref?: Ref<HTMLElement>;
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({
  title,
  children,
  className,
  ref,
  collapsible,
  collapsed,
  defaultCollapsed,
  onCollapsedChange,
  ...rest
}: SidebarProps) {
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(
    collapsed ?? defaultCollapsed ?? false,
  );

  const isControlled = collapsed !== undefined && onCollapsedChange !== undefined;
  const isCollapsed = isControlled ? collapsed : uncontrolledCollapsed;
  const isCollapsible =
    collapsible ??
    (collapsed !== undefined ||
      defaultCollapsed !== undefined ||
      onCollapsedChange !== undefined);

  function toggleCollapsed() {
    const next = !isCollapsed;
    if (!isControlled) setUncontrolledCollapsed(next);
    onCollapsedChange?.(next);
  }

  return (
    <aside
      {...rest}
      ref={ref}
      className={clsx(styles.sidebar, isCollapsed && styles.collapsed, className)}
      data-fara-sidebar
      data-collapsed={isCollapsed || undefined}
    >
      <div className={styles.header} data-fara-sidebar-header>
        {title && (
          <div
            className={clsx(styles.headerContent, isCollapsed && styles.headerContentHidden)}
            data-fara-sidebar-header-content
          >
            {title}
          </div>
        )}

        {isCollapsible && (
          <button
            type="button"
            className={clsx(styles.toggleButton, isCollapsed && styles.toggleButtonCollapsed)}
            data-fara-sidebar-toggle
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "باز کردن منو" : "بستن منو"}
          >
            <CollapseIcon />
          </button>
        )}
      </div>

      <div className={styles.body} data-fara-sidebar-body>
        {children}
      </div>
    </aside>
  );
}
