import type { HTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./Skeleton.module.css";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "rectangle";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  style,
  ...rest
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        styles.skeleton,
        variant === "text" && styles.text,
        variant === "circle" && styles.circle,
        variant === "rectangle" && styles.rectangle,
        className,
      )}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
}
