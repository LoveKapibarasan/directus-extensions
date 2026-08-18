'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Banknote,
  CreditCard,
  Download,
  FileSpreadsheet,
  MapPin,
  Percent,
  Building2,
  Users,
  Wallet,
} from 'lucide-react';
import { cn } from '@lib/utils/cn';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const size = 'size-4';

const groups: NavGroup[] = [
  {
    label: 'Locations',
    items: [{ href: '/locations', label: 'Locations', icon: <MapPin className={size} /> }],
  },
  {
    label: 'Tariffs',
    items: [{ href: '/tariffs', label: 'Tariffs', icon: <Percent className={size} /> }],
  },
  {
    label: 'Payments',
    items: [
      { href: '/checkouts', label: 'Checkouts', icon: <CreditCard className={size} /> },
    ],
  },
  {
    label: 'Users',
    items: [{ href: '/users', label: 'Users', icon: <Users className={size} /> }],
  },
  {
    label: 'Subscriptions',
    items: [
      { href: '/subscription-plans', label: 'Plans', icon: <Wallet className={size} /> },
    ],
  },
  {
    label: 'Operators',
    items: [{ href: '/operators', label: 'Operators', icon: <Building2 className={size} /> }],
  },
  {
    label: 'Tools',
    items: [
      {
        href: '/export-transactions',
        label: 'Export Transactions',
        icon: <FileSpreadsheet className={size} />,
      },
      { href: '/payments', label: 'Legacy Payments Viewer', icon: <Download className={size} /> },
    ],
  },
];

export function MainMenu() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r bg-card min-h-screen p-4 space-y-6">
      <div className="flex items-center gap-2 px-2">
        <Banknote className="size-5 text-primary" />
        <span className="font-semibold">CitrineOS Ops Tools</span>
      </div>
      <nav className="space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                      active
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
