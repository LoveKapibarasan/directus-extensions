import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = { title: 'CitrineOS Ops Tools' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', margin: 0 }}>
        <header
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <strong>CitrineOS Ops Tools</strong>
          <Link href="/export-transactions">Export Transactions</Link>
          <Link href="/payments">Payments</Link>
          <Link href="/api/auth/signout" style={{ marginLeft: 'auto' }}>
            Sign out
          </Link>
        </header>
        <main style={{ padding: 24 }}>{children}</main>
      </body>
    </html>
  );
}
