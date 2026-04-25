import { useSyncExternalStore } from "react";

type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  action?: unknown;
};

const listeners = new Set<() => void>();
let toasts: ToastItem[] = [];

function notify() {
  listeners.forEach((listener) => listener());
}

export function toast({
  title,
  description,
  action,
  duration = 3000,
}: {
  title: string;
  description?: string;
  action?: unknown;
  duration?: number;
}) {
  const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const newToast: ToastItem = { id, title, description, action };
  toasts = [...toasts, newToast];
  notify();

  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      toasts = toasts.filter((toastItem) => toastItem.id !== id);
      notify();
    }, duration);
  }

  return id;
}

export function useToast() {
  return {
    toasts: useSyncExternalStore(
      (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      () => toasts,
      () => toasts,
    ),
    toast,
  };
}
