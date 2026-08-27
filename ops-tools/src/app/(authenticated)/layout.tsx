'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { MainMenu } from '@lib/components/main-menu';
import { LanguageSwitcher } from '@lib/components/language-switcher';
import { Button } from '@lib/components/ui/button';
import { useTranslation } from '@lib/i18n/locale-provider';

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen">
      <MainMenu />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b flex items-center justify-end gap-2 px-6">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/api/auth/signout">
              <LogOut className="size-4" />
              {t('header.signOut')}
            </Link>
          </Button>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
