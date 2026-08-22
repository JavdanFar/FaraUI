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
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export function Timeline({ items, orientation = "vertical", className }: TimelineProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={clsx(styles.timeline, isHorizontal && styles.timelineHorizontal, className)}
      role="list"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={index}
            className={clsx(styles.item, isHorizontal && styles.itemHorizontal)}
            role="listitem"
          >
            <div className={clsx(styles.markerColumn, isHorizontal && styles.markerRow)}>
              <span
                className={clsx(
                  styles.dot,
                  isHorizontal && styles.dotHorizontal,
                  item.variant === "secondary" && styles.dotSecondary,
                )}
              />
              {!isLast && (
                <div className={clsx(styles.line, isHorizontal && styles.lineHorizontal)} />
              )}
            </div>

            <div className={clsx(styles.content, isHorizontal && styles.contentHorizontal)}>
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
