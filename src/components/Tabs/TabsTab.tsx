import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./Tabs.module.css";
import { useTabsContext } from "./TabsContext";

export interface TabsTabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

export function TabsTab({
  value,
  children,
  disabled,
  className,
  ref,
  onClick,
  ...rest
}: TabsTabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      {...rest}
      ref={ref}
      role="tab"
      type="button"
      aria-selected={isActive}
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      className={clsx(styles.tab, isActive && styles.tabActive, className)}
      data-fara-tabs-tab
      data-value={value}
      data-active={isActive || undefined}
      data-disabled={disabled || undefined}
      onClick={(event) => {
        setActiveTab(value);
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
}
