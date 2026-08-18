'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Banknote,
  Building2,
  CreditCard,
  ExternalLink,
  FileSpreadsheet,
  IdCard,
  MapPin,
  Percent,
  Plug,
  Users,
  Wallet,
  Zap,
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
    items: [
      { href: '/locations', label: 'Locations', icon: <MapPin className={size} /> },
      { href: '/evses', label: 'EVSEs', icon: <Zap className={size} /> },
      { href: '/connectors', label: 'Connectors', icon: <Plug className={size} /> },
    ],
  },
  {
    label: 'Tariffs',
    items: [{ href: '/tariffs', label: 'Tariffs', icon: <Percent className={size} /> }],
  },
  {
    label: 'Payments',
    items: [
      { href: '/checkouts', label: 'Checkouts', icon: <CreditCard className={size} /> },
      {
        href: '/meter-value-history',
        label: 'Meter Value History',
        icon: <Zap className={size} />,
      },
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
      {
        href: '/rfid-subscriptions',
        label: 'RFID Subscriptions',
        icon: <IdCard className={size} />,
      },
      { href: '/rfid-cards', label: 'RFID Cards', icon: <IdCard className={size} /> },
    ],
  },
  {
    label: 'Operators',
    items: [
      { href: '/operators', label: 'Operators', icon: <Building2 className={size} /> },
      { href: '/operator-infos', label: 'Operator Infos', icon: <Building2 className={size} /> },
    ],
  },
  {
    label: 'Tools',
    items: [
      {
        href: '/export-transactions',
        label: 'Export Transactions',
        icon: <FileSpreadsheet className={size} />,
      },
    ],
  },
];

// External link to Operator-UI. URL comes from an env var rather than being
// hardcoded, so this keeps working if the Operator-UI domain (or the whole
// CitrineOS-side deployment it points at) changes later — only the env var
// needs updating, not this component.
const operatorUiUrl = process.env.NEXT_PUBLIC_OPERATOR_UI_URL;
if (operatorUiUrl) {
  groups.push({
    label: 'External',
    items: [{ href: operatorUiUrl, label: 'Operator UI', icon: <ExternalLink className={size} /> }],
  });
}

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
                const isExternal = item.href.startsWith('http');
                const active = !isExternal && pathname?.startsWith(item.href);
                const linkClassName = cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                );
                return isExternal ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href} className={linkClassName}>
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
