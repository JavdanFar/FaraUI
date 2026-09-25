import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Alert.module.css";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  icon?: ReactNode;
  closable?: boolean;
  closeLabel?: string;
  onClose?: () => void;
  ref?: Ref<HTMLDivElement>;
}

export function Alert({
  variant = "info",
  icon,
  closable = false,
  closeLabel = "بستن",
  onClose,
  className,
  children,
  ref,
  ...rest
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const [closing, setClosing] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  function handleClose() {
    if (closing) return;
    setClosing(true);
    timeoutRef.current = window.setTimeout(() => {
      setDismissed(true);
      onClose?.();
    }, 250);
  }

  if (dismissed) return null;

  return (
    <div
      ref={ref}
      role="alert"
      data-fara-alert
      data-variant={variant}
      data-open={!closing || undefined}
      className={clsx(styles.alert, styles[variant], closing && styles.closing, className)}
      {...rest}
    >
      {icon}
      <div className={styles.content} data-fara-alert-content>
        {children}
      </div>
      {closable && (
        <button
          type="button"
          className={styles.closeButton}
          data-fara-alert-close
          aria-label={closeLabel}
          onClick={handleClose}
        >
          ✕
        </button>
      )}
    </div>
  );
}
