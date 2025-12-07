import type { Metadata } from 'next';
import { CalendarClock, CheckCircle2, Workflow } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Workflow Studio - Easy11 Admin',
  description: 'Automate approvals, escalations, and compliance workflows.',
};

const workflowRoadmap = [
  {
    title: 'Dual approval for AI overrides',
    status: 'In design',
    eta: 'Week 3',
    impact: 'Ensures any model change has secondary reviewer.',
  },
  {
    title: 'Automated SAR routing',
    status: 'In development',
    eta: 'Week 4',
    impact: 'Routes SARs to right region team automatically.',
  },
  {
    title: 'Fraud escalation ladder',
    status: 'Backlog',
    eta: 'Week 5',
    impact: 'Links vendor suspensions to finance + legal chain.',
  },
];

export default function WorkflowPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workflow Studio
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Define reusable automations for admin actions. Command palette shortcuts will be added
            to jump directly into workflow runs.
          </p>
        </div>
        <Badge className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white">
          Automation engine · Sprint 16 foundation
        </Badge>
      </div>

      <Card className="border border-slate-200/70 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Roadmap</CardTitle>
          <CardDescription>Forthcoming workflow templates and their impact.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          {workflowRoadmap.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200/80 px-4 py-3 dark:border-slate-700"
            >
              <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Workflow className="h-3.5 w-3.5" />
                  {item.status}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {item.eta}
                </span>
              </div>
              <p className="mt-2 text-sm">{item.impact}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-slate-200/70 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Upcoming builder</CardTitle>
          <CardDescription>Drag-and-drop workflow canvas arrives later this sprint.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400 dark:border-slate-700">
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="h-6 w-6" />
            No-code workflow builder placeholder
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


