'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { groupedNav, type AdminNavItem, type AdminNavSection } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import type { AdminRole } from '@/lib/rbac';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: AdminRole })?.role;

  const filteredNav = useMemo(() => {
    const base: Record<AdminNavSection, AdminNavItem[]> = {
      Command: [],
      Operations: [],
      Intelligence: [],
      Governance: [],
    };

    (Object.entries(groupedNav) as [AdminNavSection, AdminNavItem[]][]).forEach(([section, items]) => {
      base[section] = role ? items.filter((item) => item.roles.includes(role)) : items;
    });

    return base;
  }, [role]);

  return (
    <aside className="hidden w-72 border-r border-slate-200 bg-slate-950/95 text-slate-200 backdrop-blur lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-lg text-white shadow-lg">
          E11
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">Easy11 Admin</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Control Plane</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {Object.entries(filteredNav).map(([section, items]) => {
          if (!items || items.length === 0) return null;
          return (
            <Fragment key={section}>
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {section}
              </p>
              <ul className="mt-3 space-y-1">
                {items.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-white/10 text-white shadow-lg'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition-colors',
                            isActive && 'border-white/30 bg-white/20 text-white'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1">
                          <p className="font-medium leading-5">{item.title}</p>
                          <p className="text-xs text-slate-400">{item.shortcut}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="my-5 h-px w-full bg-white/5" />
            </Fragment>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-6 py-4">
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
          <p className="font-medium text-white">Admin Portal v2</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-slate-400">
            Sprint 16 Preview
          </p>
        </div>
      </div>
    </aside>
  );
}

