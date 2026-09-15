import { createContext, useContext } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs.Tab and Tabs.Panel must be used inside Tabs.Root");
  }
  return context;
}
