import type { HTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Card.module.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Card({ className, ref, ...rest }: CardProps) {
  return <div ref={ref} className={clsx(styles.card, className)} {...rest} />;
}
