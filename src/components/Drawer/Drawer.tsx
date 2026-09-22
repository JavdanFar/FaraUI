import { useIsClient } from "../../hooks/useIsClient";
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => cancelAnimationFrame(raf);
    }

    const timeout = setTimeout(() => setIsVisible(false), 250);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalPaddingRight = document.body.style.paddingRight;
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [open, onClose]);

  const isClient = useIsClient();

  if (!isClient || (!open && !isVisible)) {
    return null;
  }

  return createPortal(
    <>
      <div
        className={clsx(styles.overlay, open && isVisible && styles.overlayVisible)}
        data-fara-drawer-overlay
        data-open={(open && isVisible) || undefined}
        onClick={onClose}
      />
      <div
        className={clsx(
          styles.panel,
          side === "start" ? styles.panelStart : styles.panelEnd,
          open && isVisible && styles.panelVisible,
          className,
        )}
        data-fara-drawer
        data-open={(open && isVisible) || undefined}
        data-side={side}
      >
        <div className={styles.header} data-fara-drawer-header>
          {title && <h2 data-fara-drawer-title>{title}</h2>}
          <button
            className={styles.closeButton}
            data-fara-drawer-close
            onClick={onClose}
            aria-label="بستن"
          >
            ✕
          </button>
        </div>
        <div className={styles.body} data-fara-drawer-body>
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
}
