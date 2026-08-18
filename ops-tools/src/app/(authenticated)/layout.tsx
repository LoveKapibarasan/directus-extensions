import type { ReactNode } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { MainMenu } from '@lib/components/main-menu';
import { Button } from '@lib/components/ui/button';

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <MainMenu />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b flex items-center justify-end px-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/api/auth/signout">
              <LogOut className="size-4" />
              Sign out
            </Link>
          </Button>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
