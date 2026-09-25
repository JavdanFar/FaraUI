import type { HTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Skeleton.module.css";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "rectangle";
  width?: string | number;
  height?: string | number;
  ref?: Ref<HTMLDivElement>;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  style,
  ref,
  ...rest
}: SkeletonProps) {
  return (
    <div
      ref={ref}
      className={clsx(
        styles.skeleton,
        variant === "text" && styles.text,
        variant === "circle" && styles.circle,
        variant === "rectangle" && styles.rectangle,
        className,
      )}
      data-fara-skeleton
      data-variant={variant}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
}
