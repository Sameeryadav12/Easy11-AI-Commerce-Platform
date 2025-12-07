import type { AdminNavItem } from './navigation';

export type AdminRole =
  | 'system_admin'
  | 'compliance_officer'
  | 'ai_manager'
  | 'ops_analyst'
  | 'support_agent';

export type AdminDepartment = 'Platform' | 'Compliance' | 'Data Science' | 'Operations' | 'Support';

export interface RoleMetadata {
  role: AdminRole;
  label: string;
  department: AdminDepartment;
  description: string;
}

export const ROLE_DEFINITIONS: Record<AdminRole, RoleMetadata> = {
  system_admin: {
    role: 'system_admin',
    label: 'System Admin',
    department: 'Platform',
    description: 'Full access to all modules, security configuration, and audit tooling.',
  },
  compliance_officer: {
    role: 'compliance_officer',
    label: 'Compliance Officer',
    department: 'Compliance',
    description: 'Manages SARs, retention policies, and privacy workflows.',
  },
  ai_manager: {
    role: 'ai_manager',
    label: 'AI Manager',
    department: 'Data Science',
    description: 'Oversees recommendation, pricing, and voice/AR ML systems.',
  },
  ops_analyst: {
    role: 'ops_analyst',
    label: 'Ops Analyst',
    department: 'Operations',
    description: 'Reviews vendors, customers, analytics, and operational alerts.',
  },
  support_agent: {
    role: 'support_agent',
    label: 'Support Agent',
    department: 'Support',
    description: 'Read access with ability to assist customers and vendors.',
  },
};

export type RoutePolicy = {
  matcher: RegExp;
  roles: AdminRole[];
  description: string;
};

export const ROUTE_POLICIES: RoutePolicy[] = [
  {
    matcher: /^\/dashboard(\/)?$/,
    roles: ['system_admin', 'ops_analyst', 'ai_manager', 'support_agent', 'compliance_officer'],
    description: 'Command center is visible to all authenticated roles.',
  },
  {
    matcher: /^\/dashboard\/vendors/,
    roles: ['system_admin', 'ops_analyst', 'support_agent'],
    description: 'Vendor operations restricted to platform and ops personas.',
  },
  {
    matcher: /^\/dashboard\/customers/,
    roles: ['system_admin', 'ops_analyst', 'support_agent'],
    description: 'Customer intelligence shared across ops and support.',
  },
  {
    matcher: /^\/dashboard\/ai/,
    roles: ['system_admin', 'ai_manager'],
    description: 'Only platform admins and AI managers can adjust models.',
  },
  {
    matcher: /^\/dashboard\/voice-ar/,
    roles: ['system_admin', 'ai_manager', 'compliance_officer'],
    description: 'Voice/AR moderation spans AI and privacy leadership.',
  },
  {
    matcher: /^\/dashboard\/compliance/,
    roles: ['system_admin', 'compliance_officer'],
    description: 'Compliance console restricted to privacy roles.',
  },
  {
    matcher: /^\/dashboard\/analytics/,
    roles: ['system_admin', 'ops_analyst', 'ai_manager'],
    description: 'Systems analytics accessible to platform, ops, and AI.',
  },
  {
    matcher: /^\/dashboard\/activity/,
    roles: ['system_admin', 'compliance_officer'],
    description: 'Immutable audit explorer gated by platform + compliance.',
  },
  {
    matcher: /^\/dashboard\/workflows/,
    roles: ['system_admin', 'ops_analyst', 'compliance_officer', 'ai_manager'],
    description: 'Workflow studio limited to leadership roles.',
  },
];

export function isRoleAuthorized(pathname: string, role?: AdminRole | null): boolean {
  if (!role) return false;
  for (const policy of ROUTE_POLICIES) {
    if (policy.matcher.test(pathname)) {
      return policy.roles.includes(role);
    }
  }
  return false;
}

export type DirectoryProfile = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  department: AdminDepartment;
};

const DIRECTORY: Record<string, DirectoryProfile> = {
  'admin@easy11.com': {
    id: 'user-system-admin',
    email: 'admin@easy11.com',
    name: 'Avery Chen',
    role: 'system_admin',
    department: 'Platform',
  },
  'compliance@easy11.com': {
    id: 'user-compliance',
    email: 'compliance@easy11.com',
    name: 'Morgan Patel',
    role: 'compliance_officer',
    department: 'Compliance',
  },
  'ai@easy11.com': {
    id: 'user-ai',
    email: 'ai@easy11.com',
    name: 'Jordan Rivera',
    role: 'ai_manager',
    department: 'Data Science',
  },
  'ops@easy11.com': {
    id: 'user-ops',
    email: 'ops@easy11.com',
    name: 'Sasha Gupta',
    role: 'ops_analyst',
    department: 'Operations',
  },
  'support@easy11.com': {
    id: 'user-support',
    email: 'support@easy11.com',
    name: 'Quinn Harper',
    role: 'support_agent',
    department: 'Support',
  },
};

export function resolveDirectoryProfile(email: string | null | undefined): DirectoryProfile | null {
  if (!email) return null;
  return DIRECTORY[email.toLowerCase()] ?? null;
}

export function listDirectoryProfiles(): DirectoryProfile[] {
  return Object.values(DIRECTORY);
}


