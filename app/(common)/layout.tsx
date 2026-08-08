import CommonLayout from '@/components/layouts/CommonLayout';
import type { ChildrenProps } from '@/features/auth/types';

export default function Layout({ children }: Readonly<ChildrenProps>) {
  return <CommonLayout>{children}</CommonLayout>;
}
