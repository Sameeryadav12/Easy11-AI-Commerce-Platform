'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Search, ExternalLink } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { adminNavItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AdminRole } from '@/lib/rbac';

export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: AdminRole })?.role;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const [kbdShortcut, setKbdShortcut] = useState<'⌘' | 'Ctrl'>('⌘');

  const accessibleCommands = useMemo(() => {
    if (!role) return adminNavItems;
    return adminNavItems.filter((item) => item.roles.includes(role));
  }, [role]);

  const filteredCommands = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return accessibleCommands;
    }
    return accessibleCommands.filter((item) => {
      const text = `${item.title} ${item.description}`.toLowerCase();
      return text.includes(trimmed);
    });
  }, [accessibleCommands, query]);

  useEffect(() => {
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform);
    setKbdShortcut(isMac ? '⌘' : 'Ctrl');
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  const handleSelect = (href: string) => {
    setOpen(false);
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          className="hidden md:flex h-9 w-64 items-center justify-start gap-2 rounded-xl border-border bg-transparent text-sm text-muted-foreground hover:text-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search workspace…</span>
          <kbd className="rounded border px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">
            {kbdShortcut} K
          </kbd>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-[15%] z-50 w-[90vw] max-w-xl -translate-x-1/2 rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Jump to module or action…"
              className="h-9 w-full bg-transparent text-sm focus:outline-none"
            />
          </div>

          <div className="max-h-[60vh] overflow-y-auto py-2">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No matches. Try different keywords.
              </div>
            ) : (
              filteredCommands.map((command) => (
                <button
                  key={command.href}
                  onClick={() => handleSelect(command.href)}
                  className={cn(
                    'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                    'hover:bg-muted focus:bg-muted'
                  )}
                >
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <command.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{command.title}</p>
                    <p className="text-xs text-muted-foreground">{command.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded border px-1.5 py-0.5 text-[10px] tracking-wide text-muted-foreground">
                      {command.shortcut}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </button>
              ))
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}


