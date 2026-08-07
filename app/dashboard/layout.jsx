import DashboardShell from '../../components/dashboard/DashboardShell';

export const metadata = {
  title: 'iLMIFY MailMetric — Dashboard',
};

export default function DashboardLayout({ children }) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}
