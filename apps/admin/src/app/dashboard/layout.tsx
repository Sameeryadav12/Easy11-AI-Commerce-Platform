import { ReactNode } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

