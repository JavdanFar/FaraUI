import type { ReactNode } from "react";
import { useEffect } from "react";
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
  useEffect(() => {
    if (!open) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={clsx(styles.modal, className)} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          {title && <h2>{title}</h2>}
          <button className={styles.closeButton} onClick={onClose} aria-label="بستن">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
