import type { HTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./Tabs.module.css";
import { useTabsContext } from "./TabsContext";

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function TabsPanel({
  value,
  children,
  className,
  ref,
  ...rest
}: TabsPanelProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <div
      {...rest}
      ref={ref}
      hidden={!isActive}
      className={clsx(styles.panel, className)}
      role="tabpanel"
      data-fara-tabs-panel
      data-active={isActive || undefined}
    >
      {children}
    </div>
  );
}
