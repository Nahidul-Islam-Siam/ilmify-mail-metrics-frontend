'use client';
import { createContext, useContext, useState, useRef, useCallback } from 'react';
import Toast from './Toast.jsx';

const ToastContext = createContext(() => {});

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', show: false });
  const timer = useRef(null);

  const showToast = useCallback((message) => {
    setToast({ message, show: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast message={toast.message} show={toast.show} />
    </ToastContext.Provider>
  );
}
