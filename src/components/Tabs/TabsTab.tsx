import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Tabs.module.css";
import { useTabsContext } from "./TabsContext";

export interface TabsTabProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

export function TabsTab({ value, children, disabled }: TabsTabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      disabled={disabled}
      className={clsx(styles.tab, isActive && styles.tabActive)}
      data-fara-tabs-tab
      data-active={isActive || undefined}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}
