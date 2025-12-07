import {
  Activity,
  BrainCircuit,
  FileSearch2,
  LayoutDashboard,
  ShieldCheck,
  Store,
  Users,
  Workflow,
  Mic,
  DollarSign,
  Leaf,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AdminRole } from './rbac';

export type AdminNavSection =
  | 'Command'
  | 'Operations'
  | 'Intelligence'
  | 'Governance';

export type AdminNavItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  shortcut: string;
  section: AdminNavSection;
  roles: AdminRole[];
};

export const adminNavItems: AdminNavItem[] = [
  {
    title: 'Command Center',
    description: 'Executive overview of platform health, KPIs, and alerts.',
    href: '/dashboard',
    icon: LayoutDashboard,
    shortcut: '⌘1',
    section: 'Command',
    roles: ['system_admin', 'ops_analyst', 'ai_manager', 'support_agent', 'compliance_officer'],
  },
    {
      title: 'Retail Media',
      description: 'Manage ad campaigns, inventory, and reports.',
      href: '/dashboard/ads',
      icon: DollarSign,
      shortcut: '⌘9',
      section: 'Intelligence',
      roles: ['system_admin', 'ai_manager', 'ops_analyst'],
    },
    {
      title: 'ESG Intelligence',
      description: 'Carbon analytics, ethics, and sustainability KPIs.',
      href: '/dashboard/esg',
      icon: Leaf,
      shortcut: '⌘0',
      section: 'Intelligence',
      roles: ['system_admin', 'ops_analyst', 'compliance_officer'],
    },
  {
    title: 'Vendor Control',
    description: 'Approve, suspend, and monitor vendors with risk insights.',
    href: '/dashboard/vendors',
    icon: Store,
    shortcut: '⌘2',
    section: 'Operations',
    roles: ['system_admin', 'ops_analyst', 'support_agent'],
  },
  {
    title: 'Customer Intelligence',
    description: 'Surface churn risks, loyalty health, and intervention actions.',
    href: '/dashboard/customers',
    icon: Users,
    shortcut: '⌘3',
    section: 'Operations',
    roles: ['system_admin', 'ops_analyst', 'support_agent'],
  },
  {
    title: 'AI Control Center',
    description: 'Adjust personalization levers and monitor model health.',
    href: '/dashboard/ai',
    icon: BrainCircuit,
    shortcut: '⌘4',
    section: 'Intelligence',
    roles: ['system_admin', 'ai_manager'],
  },
  {
    title: 'Voice & AR Moderation',
    description: 'Review voice intents, AR assets, and regional policies.',
    href: '/dashboard/voice-ar',
    icon: Mic,
    shortcut: '⌘5',
    section: 'Intelligence',
    roles: ['system_admin', 'ai_manager', 'compliance_officer'],
  },
  {
    title: 'Compliance & Consent',
    description: 'Manage SARs, retention policies, and consent statuses.',
    href: '/dashboard/compliance',
    icon: ShieldCheck,
    shortcut: '⌘6',
    section: 'Governance',
    roles: ['system_admin', 'compliance_officer'],
  },
  {
    title: 'Systems Analytics',
    description: 'Monitor platform load, revenue, and anomaly diagnostics.',
    href: '/dashboard/analytics',
    icon: Activity,
    shortcut: '⌘7',
    section: 'Command',
    roles: ['system_admin', 'ops_analyst', 'ai_manager'],
  },
  {
    title: 'Activity Explorer',
    description: 'Immutable audit trail of every admin action and event.',
    href: '/dashboard/activity',
    icon: FileSearch2,
    shortcut: '⌘8',
    section: 'Governance',
    roles: ['system_admin', 'compliance_officer'],
  },
  {
    title: 'Workflow Studio',
    description: 'Automate approvals, escalations, and compliance workflows.',
    href: '/dashboard/workflows',
    icon: Workflow,
    shortcut: '⌘9',
    section: 'Operations',
    roles: ['system_admin', 'ops_analyst', 'compliance_officer', 'ai_manager'],
  },
];

export const groupedNav = adminNavItems.reduce<Record<AdminNavSection, AdminNavItem[]>>(
  (acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  },
  {
    Command: [],
    Operations: [],
    Intelligence: [],
    Governance: [],
  }
);


