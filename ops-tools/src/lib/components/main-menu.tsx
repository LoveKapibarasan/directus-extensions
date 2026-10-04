'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Banknote,
  BellRing,
  Building2,
  CalendarClock,
  Coins,
  CreditCard,
  ExternalLink,
  FileSpreadsheet,
  Flag,
  IdCard,
  ImageIcon,
  KeyRound,
  Link2,
  Mail,
  MapPin,
  Megaphone,
  Package,
  Palette,
  Percent,
  Plug,
  Radio,
  ScrollText,
  Server,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Star,
  Ticket,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { cn } from '@lib/utils/cn';
import { useTranslation } from '@lib/i18n/locale-provider';
import type { TranslationKey } from '@lib/i18n/translations';

interface NavItem {
  href: string;
  labelKey: TranslationKey;
  icon: React.ReactNode;
}

interface NavGroup {
  groupKey: TranslationKey;
  items: NavItem[];
}

const size = 'size-4';

const groups: NavGroup[] = [
  {
    groupKey: 'group.locations',
    items: [
      { href: '/locations', labelKey: 'nav.locations', icon: <MapPin className={size} /> },
      { href: '/location-photos', labelKey: 'nav.locationPhotos', icon: <ImageIcon className={size} /> },
      { href: '/evses', labelKey: 'nav.evses', icon: <Zap className={size} /> },
      { href: '/connectors', labelKey: 'nav.connectors', icon: <Plug className={size} /> },
    ],
  },
  {
    groupKey: 'group.tariffs',
    items: [{ href: '/tariffs', labelKey: 'nav.tariffs', icon: <Percent className={size} /> }],
  },
  {
    groupKey: 'group.payments',
    items: [
      { href: '/checkouts', labelKey: 'nav.checkouts', icon: <CreditCard className={size} /> },
      {
        href: '/meter-value-history',
        labelKey: 'nav.meterValueHistory',
        icon: <Zap className={size} />,
      },
      { href: '/point-entries', labelKey: 'nav.pointEntries', icon: <Coins className={size} /> },
    ],
  },
  {
    groupKey: 'group.reservations',
    items: [
      { href: '/reservations', labelKey: 'nav.reservations', icon: <CalendarClock className={size} /> },
    ],
  },
  {
    groupKey: 'group.users',
    items: [
      { href: '/users', labelKey: 'nav.users', icon: <Users className={size} /> },
      {
        href: '/user-notification-settings',
        labelKey: 'nav.userNotificationSettings',
        icon: <BellRing className={size} />,
      },
      {
        href: '/user-security-credentials',
        labelKey: 'nav.userSecurityCredentials',
        icon: <KeyRound className={size} />,
      },
      { href: '/push-devices', labelKey: 'nav.pushDevices', icon: <Smartphone className={size} /> },
    ],
  },
  {
    groupKey: 'group.subscriptions',
    items: [
      { href: '/subscription-plans', labelKey: 'nav.subscriptionPlans', icon: <Wallet className={size} /> },
      {
        href: '/rfid-subscriptions',
        labelKey: 'nav.rfidSubscriptions',
        icon: <IdCard className={size} />,
      },
      { href: '/rfid-cards', labelKey: 'nav.rfidCards', icon: <IdCard className={size} /> },
    ],
  },
  {
    groupKey: 'group.hosts',
    items: [
      { href: '/operators', labelKey: 'nav.operators', icon: <Building2 className={size} /> },
      { href: '/operator-infos', labelKey: 'nav.operatorInfos', icon: <Building2 className={size} /> },
      { href: '/stations', labelKey: 'nav.stations', icon: <Server className={size} /> },
      { href: '/station-readers', labelKey: 'nav.stationReaders', icon: <Radio className={size} /> },
      {
        href: '/station-connection-attempts',
        labelKey: 'nav.stationConnectionAttempts',
        icon: <ScrollText className={size} />,
      },
      { href: '/host-cards', labelKey: 'nav.hostCards', icon: <IdCard className={size} /> },
      { href: '/host-invites', labelKey: 'nav.hostInvites', icon: <Mail className={size} /> },
      { href: '/invoice-branding', labelKey: 'nav.invoiceBranding', icon: <Palette className={size} /> },
    ],
  },
  {
    groupKey: 'group.shop',
    items: [
      { href: '/shop-products', labelKey: 'nav.shopProducts', icon: <Package className={size} /> },
      { href: '/shop-product-photos', labelKey: 'nav.shopProductPhotos', icon: <ImageIcon className={size} /> },
      {
        href: '/shop-product-relations',
        labelKey: 'nav.shopProductRelations',
        icon: <Link2 className={size} />,
      },
      { href: '/shop-orders', labelKey: 'nav.shopOrders', icon: <ShoppingCart className={size} /> },
      { href: '/shop-partner-ads', labelKey: 'nav.shopPartnerAds', icon: <Megaphone className={size} /> },
    ],
  },
  {
    groupKey: 'group.reviews',
    items: [
      { href: '/charger-reviews', labelKey: 'nav.chargerReviews', icon: <Star className={size} /> },
      { href: '/review-reports', labelKey: 'nav.reviewReports', icon: <Flag className={size} /> },
    ],
  },
  {
    groupKey: 'group.system',
    items: [
      {
        href: '/processed-stripe-events',
        labelKey: 'nav.processedStripeEvents',
        icon: <Ticket className={size} />,
      },
    ],
  },
  {
    groupKey: 'group.tools',
    items: [
      {
        href: '/export-transactions',
        labelKey: 'nav.exportTransactions',
        icon: <FileSpreadsheet className={size} />,
      },
      {
        href: '/consistency-check',
        labelKey: 'nav.consistencyCheck',
        icon: <ShieldCheck className={size} />,
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
    groupKey: 'group.external',
    items: [{ href: operatorUiUrl, labelKey: 'nav.operatorUi', icon: <ExternalLink className={size} /> }],
  });
}

export function MainMenu() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="w-60 shrink-0 border-r bg-card min-h-screen p-4 space-y-6">
      <div className="flex items-center gap-2 px-2">
        <Banknote className="size-5 text-primary" />
        <span className="font-semibold">{t('app.title')}</span>
      </div>
      <nav className="space-y-5">
        {groups.map((group) => (
          <div key={group.groupKey}>
            <div className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {t(group.groupKey)}
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
                    {t(item.labelKey)}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href} className={linkClassName}>
                    {item.icon}
                    {t(item.labelKey)}
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
