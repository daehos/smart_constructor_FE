import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const pushToast = useCallback(({ kind = "info", message }) => {
    if (!message) return;
    const id = Date.now();
    setToast({ id, kind, message });
    setTimeout(() => {
      setToast((current) => (current && current.id === id ? null : current));
    }, 3000);
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ toast, pushToast, clearToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

