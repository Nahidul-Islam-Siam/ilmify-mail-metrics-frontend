import DashboardLayoutShell from '@/components/layouts/DashboardLayout';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'iLMIFY MailMetric — Dashboard',
};

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <DashboardLayoutShell>
      {children}
    </DashboardLayoutShell>
  );
}
