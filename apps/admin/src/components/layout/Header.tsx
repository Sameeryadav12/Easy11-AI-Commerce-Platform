'use client';

import { useSession, signOut } from 'next-auth/react';
import { Activity, Bell, LogOut, Server, Settings, ShieldAlert, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import CommandPalette from './CommandPalette';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';
import { ROLE_DEFINITIONS, type AdminRole } from '@/lib/rbac';

const statusHighlights = [
  {
    label: 'System Health',
    value: 'Operational',
    icon: Server,
    tone: 'text-emerald-500',
  },
  {
    label: 'Active Alerts',
    value: '3 open',
    icon: ShieldAlert,
    tone: 'text-amber-500',
  },
  {
    label: 'Realtime Sessions',
    value: '1,284',
    icon: Activity,
    tone: 'text-blue-500',
  },
];

export default function Header() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: AdminRole })?.role;
  const roleLabel = role ? ROLE_DEFINITIONS[role].label : 'Admin';

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="relative z-30 border-b border-slate-200 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <div className="flex flex-1 items-center gap-3">
          <div className="hidden flex-col md:flex">
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
              Admin Intelligence
            </span>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Easy11 Control Center
            </h1>
          </div>
          <CommandPalette />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-slate-500 transition-colors hover:border-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    {getInitials(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left leading-tight md:block">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {session?.user?.name || 'Admin User'}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                    {roleLabel}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-7xl px-6 pb-4 lg:block">
        <div className="grid gap-3 md:grid-cols-3">
          {statusHighlights.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm ring-1 ring-transparent transition hover:ring-blue-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:ring-cyan-600/30"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </p>
              </div>
              <item.icon className={cn('h-5 w-5', item.tone)} />
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
