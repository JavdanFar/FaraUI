import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import clsx from "clsx";
import styles from "./Tabs.module.css";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs.Tab and Tabs.Panel must be used inside Tabs.Root");
  }
  return context;
}

export interface TabsRootProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

function Root({ defaultValue, children, className }: TabsRootProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
}

function List({ children }: TabsListProps) {
  return (
    <div className={styles.list} role="tablist">
      {children}
    </div>
  );
}

export interface TabsTabProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

function Tab({ value, children, disabled }: TabsTabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      disabled={disabled}
      className={clsx(styles.tab, isActive && styles.tabActive)}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export interface TabsPanelProps {
  value: string;
  children: ReactNode;
}

function Panel({ value, children }: TabsPanelProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return (
    <div className={styles.panel} role="tabpanel">
      {children}
    </div>
  );
}

export const Tabs = {
  Root,
  List,
  Tab,
  Panel,
};
