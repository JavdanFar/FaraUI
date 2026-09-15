import type { ReactNode } from "react";
import { useState } from "react";
import { TabsContext } from "./TabsContext";

export interface TabsRootProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export function TabsRoot({ defaultValue, children, className }: TabsRootProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className} data-fara-tabs>
        {children}
      </div>
    </TabsContext.Provider>
  );
}
