import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import styles from "./Toast.module.css";
import {
  dismissToast,
  getToasts,
  pauseToastTimer,
  resumeToastTimer,
  subscribeToToasts,
  type ToastItem,
} from "./toastStore";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToasterProps {
  position?: ToastPosition;
}

const positionClasses: Record<ToastPosition, string> = {
  "top-left": styles.topLeft,
  "top-center": styles.topCenter,
  "top-right": styles.topRight,
  "bottom-left": styles.bottomLeft,
  "bottom-center": styles.bottomCenter,
  "bottom-right": styles.bottomRight,
};

export function Toaster({ position = "bottom-center" }: ToasterProps) {
  const [items, setItems] = useState<ToastItem[]>(getToasts);

  useEffect(() => subscribeToToasts(() => setItems([...getToasts()])), []);

  return createPortal(
    <div
      className={clsx(styles.container, positionClasses[position])}
      data-fara-toaster
      data-position={position}
    >
      {items.map((toast) => (
        <div
          key={toast.id}
          className={clsx(styles.toast, styles[toast.variant])}
          data-fara-toast
          data-variant={toast.variant}
          onMouseEnter={() => pauseToastTimer(toast.id)}
          onMouseLeave={() => resumeToastTimer(toast.id)}
        >
          <span className={styles.message} data-fara-toast-message>{toast.message}</span>
          <button
            type="button"
            className={styles.closeButton}
            data-fara-toast-close
            onClick={() => dismissToast(toast.id)}
            aria-label="بستن"
          >
            ✕
          </button>
          <span
            className={styles.progress}
            data-fara-toast-progress
            style={{ animationDuration: `${toast.duration}ms` }}
          />
        </div>
      ))}
    </div>,
    document.body,
  );
}
