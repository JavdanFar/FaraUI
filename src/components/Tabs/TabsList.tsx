import type { ReactNode } from "react";
import styles from "./Tabs.module.css";

export interface TabsListProps {
  children: ReactNode;
}

export function TabsList({ children }: TabsListProps) {
  return (
    <div className={styles.list} role="tablist" data-fara-tabs-list>
      {children}
    </div>
  );
}
