import AuthLayout from '@/components/layouts/AuthLayout';
import type { ChildrenProps } from '@/features/auth/types';

export default function Layout({ children }: Readonly<ChildrenProps>) {
  return <AuthLayout>{children}</AuthLayout>;
}
