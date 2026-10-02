"use client";

import type { HTMLAttributes, Ref, ReactNode } from "react";
import { useMemo } from "react";
import clsx from "clsx";
import styles from "./Sidebar.module.css";
import { SidebarContext } from "./SidebarContext";

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  collapsed?: boolean;
  ref?: Ref<HTMLElement>;
}

export function Sidebar({
  title,
  children,
  className,
  collapsed = false,
  ref,
  ...rest
}: SidebarProps) {
  const contextValue = useMemo(() => ({ collapsed }), [collapsed]);

  return (
    <SidebarContext.Provider value={contextValue}>
      <aside
        {...rest}
        ref={ref}
        className={clsx(styles.sidebar, collapsed && styles.collapsed, className)}
        data-fara-sidebar
        data-collapsed={collapsed || undefined}
      >
        {title && (
          <div className={styles.header} data-fara-sidebar-header>
            {title}
          </div>
        )}

        <div className={styles.body} data-fara-sidebar-body>
          {children}
        </div>
      </aside>
    </SidebarContext.Provider>
  );
}
