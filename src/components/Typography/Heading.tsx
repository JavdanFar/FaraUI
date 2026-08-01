import type { HTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Typography.module.css";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
  ref?: Ref<HTMLHeadingElement>;
}

export function Heading({ as = "h2", className, ref, ...rest }: HeadingProps) {
  const Component = as;

  return <Component ref={ref} className={clsx(styles.heading, styles[as], className)} {...rest} />;
}
