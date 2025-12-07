import { Metadata } from 'next';
import CustomersChurnDashboard from '@/components/dashboard/CustomersChurnDashboard';
import CustomerDirectoryPanel from '@/components/dashboard/CustomerDirectoryPanel';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Customers & Churn - Easy11 Admin',
  description: 'Customer intelligence, RFM segmentation, and churn analysis',
};

export default function CustomersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Customer Intelligence
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Blend churn predictions, loyalty signals, and intervention workflows. Segment-level triage updates every 15 minutes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full">
            Export high-risk CSV
          </Button>
          <Button className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            Launch retention playbook
          </Button>
        </div>
      </div>

      <CustomersChurnDashboard />
      <CustomerDirectoryPanel />
    </div>
  );
}

