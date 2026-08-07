import DashboardShell from '../../components/dashboard/DashboardShell';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'iLMIFY MailMetric — Dashboard',
};

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}
