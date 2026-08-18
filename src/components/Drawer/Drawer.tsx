import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import styles from "./Drawer.module.css";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  side?: "start" | "end";
  className?: string;
}

export function Drawer({ open, onClose, children, title, side = "end", className }: DrawerProps) {
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalPaddingEnd = document.body.style.paddingInlineEnd;
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingInlineEnd = `${scrollbarWidth}px`;
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingInlineEnd = originalPaddingEnd;
    };
  }, [open, onClose]);

  if (!shouldRender) return null;

  return createPortal(
    <>
      <div className={clsx(styles.overlay, isVisible && styles.overlayVisible)} onClick={onClose} />
      <div
        className={clsx(
          styles.panel,
          side === "start" ? styles.panelStart : styles.panelEnd,
          isVisible && styles.panelVisible,
          className,
        )}
      >
        <div className={styles.header}>
          {title && <h2>{title}</h2>}
          <button className={styles.closeButton} onClick={onClose} aria-label="بستن">
            ✕
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </>,
    document.body,
  );
}
