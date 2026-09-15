import type { ReactNode } from "react";
import styles from "./Tabs.module.css";
import { useTabsContext } from "./TabsContext";

export interface TabsPanelProps {
  value: string;
  children: ReactNode;
}

export function TabsPanel({ value, children }: TabsPanelProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return (
    <div className={styles.panel} role="tabpanel" data-fara-tabs-panel>
      {children}
    </div>
  );
}
