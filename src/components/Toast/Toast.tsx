import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import styles from "./Toast.module.css";

export interface ToastItem {
  id: string;
  message: string;
  variant: "info" | "success" | "danger";
  duration: number;
}

// This array lives outside any component — a single shared list for the whole app
let toasts: ToastItem[] = [];
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((listener) => listener());
}

function dismissToast(id: string) {
  toasts = toasts.filter((toast) => toast.id !== id);
  notify();
}

export function showToast(
  message: string,
  variant: ToastItem["variant"] = "info",
  duration = 3000,
) {
  const id = crypto.randomUUID();
  toasts = [...toasts, { id, message, variant, duration }];
  notify();

  setTimeout(() => {
    dismissToast(id);
  }, duration);
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>(toasts);

  useEffect(() => {
    function handleChange() {
      setItems([...toasts]);
    }

    listeners.push(handleChange);
    return () => {
      listeners = listeners.filter((listener) => listener !== handleChange);
    };
  }, []);

  return createPortal(
    <div className={styles.container}>
      {items.map((toast) => (
        <div key={toast.id} className={clsx(styles.toast, styles[toast.variant])}>
          <span className={styles.message}>{toast.message}</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => dismissToast(toast.id)}
            aria-label="بستن"
          >
            ✕
          </button>
          <span className={styles.progress} style={{ animationDuration: `${toast.duration}ms` }} />
        </div>
      ))}
    </div>,
    document.body,
  );
}
