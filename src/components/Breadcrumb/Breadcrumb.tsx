import type { HTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Breadcrumb.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
  ref?: Ref<HTMLElement>;
}

export function Breadcrumb({
  items,
  separator = "/",
  className,
  ref,
  ...rest
}: BreadcrumbProps) {
  return (
    <nav
      {...rest}
      ref={ref}
      aria-label="مسیر ناوبری"
      className={className}
      data-fara-breadcrumb
    >
      <ol className={styles.list} data-fara-breadcrumb-list>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={index}
              className={styles.item}
              data-fara-breadcrumb-item
              data-current={isLast || undefined}
            >
              {isLast ? (
                <span
                  className={styles.current}
                  data-fara-breadcrumb-current
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className={styles.link}
                  data-fara-breadcrumb-link
                >
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className={clsx(styles.link, styles.linkButton)}
                  data-fara-breadcrumb-link
                >
                  {item.label}
                </button>
              )}

              {!isLast && (
                <span className={styles.separator} data-fara-breadcrumb-separator>
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
