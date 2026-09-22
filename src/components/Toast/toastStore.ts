export interface ToastItem {
  id: string;
  message: string;
  variant: "info" | "success" | "danger";
  duration: number;
}

interface ToastTimer {
  remaining: number;
  startedAt: number;
  timeout: number;
}

let toastCounter = 0;
let toasts: ToastItem[] = [];
let listeners: Array<() => void> = [];
const timers = new Map<string, ToastTimer>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function getToasts() {
  return toasts;
}

export function subscribeToToasts(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((item) => item !== listener);
  };
}

function removeTimer(id: string) {
  const entry = timers.get(id);
  if (entry) {
    clearTimeout(entry.timeout);
    timers.delete(id);
  }
}

export function dismissToast(id: string) {
  removeTimer(id);
  toasts = toasts.filter((toast) => toast.id !== id);
  notify();
}

export function showToast(
  message: string,
  variant: ToastItem["variant"] = "info",
  duration = 3000,
) {
  if (typeof window === "undefined") return;

  const id = `fara-toast-${Date.now().toString(36)}-${toastCounter++}`;
  toasts = [...toasts, { id, message, variant, duration }];

  timers.set(id, {
    remaining: duration,
    startedAt: Date.now(),
    timeout: window.setTimeout(() => dismissToast(id), duration),
  });

  notify();
}

export function pauseToastTimer(id: string) {
  const entry = timers.get(id);
  if (!entry) return;
  clearTimeout(entry.timeout);
  entry.remaining = Math.max(0, entry.remaining - (Date.now() - entry.startedAt));
}

export function resumeToastTimer(id: string) {
  const entry = timers.get(id);
  if (!entry) return;
  entry.startedAt = Date.now();
  entry.timeout = window.setTimeout(() => dismissToast(id), entry.remaining);
}
