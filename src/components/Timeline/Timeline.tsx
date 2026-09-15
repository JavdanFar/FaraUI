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
      data-fara-timeline
      data-orientation={orientation}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={index}
            className={clsx(styles.item, isHorizontal && styles.itemHorizontal)}
            role="listitem"
            data-fara-timeline-item
          >
            <div
              className={clsx(styles.markerColumn, isHorizontal && styles.markerRow)}
              data-fara-timeline-marker-column
            >
              <span
                className={clsx(
                  styles.dot,
                  isHorizontal && styles.dotHorizontal,
                  item.variant === "secondary" && styles.dotSecondary,
                )}
                data-fara-timeline-dot
                data-variant={item.variant}
              />
              {!isLast && (
                <div
                  className={clsx(styles.line, isHorizontal && styles.lineHorizontal)}
                  data-fara-timeline-connector
                />
              )}
            </div>

            <div
              className={clsx(styles.content, isHorizontal && styles.contentHorizontal)}
              data-fara-timeline-content
            >
              <div className={styles.title} data-fara-timeline-title>
                {item.title}
              </div>
              {item.timestamp && (
                <div className={styles.timestamp} data-fara-timeline-timestamp>
                  {item.timestamp}
                </div>
              )}
              {item.description && (
                <div className={styles.description} data-fara-timeline-description>
                  {item.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
