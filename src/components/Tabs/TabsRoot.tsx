import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useState } from "react";
import { TabsContext } from "./TabsContext";

export interface TabsRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function TabsRoot({
  children,
  defaultValue,
  value,
  onValueChange,
  className,
  ref,
  ...rest
}: TabsRootProps) {
  const [uncontrolledTab, setUncontrolledTab] = useState(defaultValue ?? "");

  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : uncontrolledTab;

  function setActiveTab(next: string) {
    if (!isControlled) setUncontrolledTab(next);
    onValueChange?.(next);
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div {...rest} ref={ref} className={className} data-fara-tabs>
        {children}
      </div>
    </TabsContext.Provider>
  );
}
