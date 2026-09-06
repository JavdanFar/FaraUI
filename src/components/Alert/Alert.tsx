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
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleClose() {
    setIsVisible(false);
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
      className={clsx(styles.alert, styles[variant], isVisible && styles.visible, className)}
      {...rest}
    >
      {icon}
      <div className={styles.content}>{children}</div>
      {closable && (
        <button type="button" className={styles.closeButton} aria-label={closeLabel} onClick={handleClose}>
          ✕
        </button>
      )}
    </div>
  );
}
