'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export interface DashboardMobileMenu {
  isOpen: boolean;
  open(): void;
  close(): void;
  toggle(): void;
}

export function useDashboardMobileMenu(): DashboardMobileMenu {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [close, isOpen]);

  return { isOpen, open, close, toggle };
}
