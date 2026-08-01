import type { HTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Typography.module.css";

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "md" | "lg";
  muted?: boolean;
  ref?: Ref<HTMLParagraphElement>;
}

const sizeClassMap = {
  sm: styles.textSm,
  md: styles.textMd,
  lg: styles.textLg,
};

export function Text({ size = "md", muted = false, className, ref, ...rest }: TextProps) {
  return (
    <p
      ref={ref}
      className={clsx(styles.text, sizeClassMap[size], muted && styles.muted, className)}
      {...rest}
    />
  );
}
