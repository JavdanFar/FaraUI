import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Timeline.module.css";

export interface TimelineItem {
  title: string;
  description?: ReactNode;
  timestamp?: string;
  variant?: "primary" | "secondary";
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={clsx(styles.timeline, className)} role="list">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className={styles.item} role="listitem">
            <div className={styles.markerColumn}>
              <span
                className={clsx(styles.dot, item.variant === "secondary" && styles.dotSecondary)}
              />
              {!isLast && <div className={styles.line} />}
            </div>

            <div className={styles.content}>
              <div className={styles.title}>{item.title}</div>
              {item.timestamp && <div className={styles.timestamp}>{item.timestamp}</div>}
              {item.description && <div className={styles.description}>{item.description}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
