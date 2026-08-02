import type { ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";
import styles from "./Tooltip.module.css";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <span className={clsx(styles.tooltip, isVisible && styles.visible)} role="tooltip">
        {content}
      </span>
    </span>
  );
}
