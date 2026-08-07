'use client';
import { createContext, useContext, useState, useRef, useCallback } from 'react';
import Toast from './Toast.jsx';
import type { ChildrenProps } from '../types/rbac';
import type { ToastFunction } from '../types/ui';

const ToastContext = createContext<ToastFunction | null>(null);

export const useToast = (): ToastFunction => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export default function ToastProvider({ children }: ChildrenProps) {
  const [toast, setToast] = useState({ message: '', show: false });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ message, show: true });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast message={toast.message} show={toast.show} />
    </ToastContext.Provider>
  );
}
