import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Providers } from '@lib/providers';
import './globals.css';

export const metadata = { title: 'CitrineOS Ops Tools' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
