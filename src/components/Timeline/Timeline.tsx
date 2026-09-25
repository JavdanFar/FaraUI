import type { HTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./Timeline.module.css";

export interface TimelineItem {
  title: string;
  description?: ReactNode;
  timestamp?: string;
  variant?: "primary" | "secondary";
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: TimelineItem[];
  orientation?: "vertical" | "horizontal";
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Timeline({
  items,
  orientation = "vertical",
  className,
  ref,
  ...rest
}: TimelineProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      {...rest}
      ref={ref}
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
