import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import styles from "./Modal.module.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Modal({ open, onClose, children, title, className }: ModalProps) {
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

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [open, onClose]);

  if (!open && !isVisible) return null;

  return createPortal(
    <div
      className={clsx(styles.overlay, open && isVisible && styles.overlayVisible)}
      data-fara-modal-overlay
      data-open={(open && isVisible) || undefined}
      onMouseDown={onClose}
    >
      <div
        className={clsx(styles.modal, open && isVisible && styles.modalVisible, className)}
        data-fara-modal
        data-open={(open && isVisible) || undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header} data-fara-modal-header>
          {title && <h2 data-fara-modal-title>{title}</h2>}
          <button className={styles.closeButton} data-fara-modal-close onClick={onClose} aria-label="بستن">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
