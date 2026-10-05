import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Providers } from '@lib/providers';
import './globals.css';

const TITLE = 'CitrineOS Ops Tools';
const DESCRIPTION = 'AI-Charge operations console: payments, locations, sales and CitrineOS consistency.';

// Read per request: link previews need absolute URLs, and the public URL is
// NEXTAUTH_URL of the deployment, which a build-time metadata object can't see.
export function generateMetadata(): Metadata {
  const base = process.env.NEXTAUTH_URL;
  return {
    title: TITLE,
    description: DESCRIPTION,
    ...(base ? { metadataBase: new URL(base) } : {}),
    openGraph: {
      type: 'website',
      siteName: TITLE,
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: TITLE }],
    },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og.png'] },
    // An internal tool: previews yes, search results no.
    robots: { index: false, follow: false },
  };
}

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
