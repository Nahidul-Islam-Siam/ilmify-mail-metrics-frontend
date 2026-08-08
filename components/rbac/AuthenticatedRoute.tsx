'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { usePermission } from '@/features/auth/usePermission';

export default function AuthenticatedRoute({ children }: { children: ReactNode }) {
  const { loading, token, user } = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!token || !user)) router.replace('/login');
  }, [loading, router, token, user]);

  if (loading || !token || !user) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#667085' }}>Loading account…</div>;
  }

  return children;
}
