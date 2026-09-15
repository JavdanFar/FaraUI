import styles from "./Breadcrumb.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

export function Breadcrumb({ items, separator = "/", className }: BreadcrumbProps) {
  return (
    <nav aria-label="مسیر ناوبری" className={className} data-fara-breadcrumb>
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
              ) : (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className={styles.link}
                  data-fara-breadcrumb-link
                >
                  {item.label}
                </a>
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
