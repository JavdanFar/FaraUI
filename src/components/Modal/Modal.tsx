"use client";

import { useIsClient } from "../../hooks/useIsClient";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import styles from "./Modal.module.css";
import { lockBodyScroll, unlockBodyScroll } from "../../utils/bodyScrollLock";
import { registerOverlay } from "../../utils/overlayStack";

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Modal({ open, onClose, children, title, className, ref, ...rest }: ModalProps) {
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

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    return registerOverlay(() => onCloseRef.current());
  }, [open]);

  const shouldLock = open || isVisible;

  useEffect(() => {
    if (!shouldLock) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [shouldLock]);

  const isClient = useIsClient();

  if (!isClient || (!open && !isVisible)) {
    return null;
  }

  return createPortal(
    <div
      className={clsx(styles.overlay, open && isVisible && styles.overlayVisible)}
      data-fara-modal-overlay
      data-open={(open && isVisible) || undefined}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        {...rest}
        ref={ref}
        className={clsx(styles.modal, open && isVisible && styles.modalVisible, className)}
        data-fara-modal
        data-open={(open && isVisible) || undefined}
      >
        <div className={styles.header} data-fara-modal-header>
          {title && <h2 data-fara-modal-title>{title}</h2>}
          <button
            className={styles.closeButton}
            data-fara-modal-close
            onClick={onClose}
            aria-label="بستن"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
