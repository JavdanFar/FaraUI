import type { HTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./Tabs.module.css";
import { useTabsContext } from "./TabsContext";
import { nextActiveIndex } from "../../utils/nextActiveIndex";

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function TabsList({
  children,
  className,
  ref,
  onKeyDown,
  ...rest
}: TabsListProps) {
  const { setActiveTab } = useTabsContext();

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    );
    const current = tabs.indexOf(event.target as HTMLButtonElement);
    if (current === -1) {
      onKeyDown?.(event);
      return;
    }

    const isRtl = window.getComputedStyle(event.currentTarget).direction === "rtl";
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = nextActiveIndex(current, isRtl ? -1 : 1, tabs.length);
        break;
      case "ArrowLeft":
        next = nextActiveIndex(current, isRtl ? 1 : -1, tabs.length);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = tabs.length - 1;
        break;
      default:
        onKeyDown?.(event);
        return;
    }

    event.preventDefault();
    const target = tabs[next];
    const targetValue = target.dataset.value;
    target.focus();
    if (targetValue !== undefined) setActiveTab(targetValue);
    onKeyDown?.(event);
  }

  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(styles.list, className)}
      role="tablist"
      data-fara-tabs-list
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
