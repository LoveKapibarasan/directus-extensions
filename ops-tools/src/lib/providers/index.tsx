'use client';

import { Refine, type NotificationProvider } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster, toast } from 'sonner';
import { useState } from 'react';

import dataProvider from '@lib/providers/data-provider';
import { authProvider } from '@lib/providers/auth-provider';
import { resources } from '@lib/resources';

const notificationProvider: NotificationProvider = {
  open: ({ message, description, type }) => {
    if (type === 'error') {
      toast.error(message, { description });
    } else {
      toast.success(message, { description });
    }
  },
  close: () => {},
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            authProvider={authProvider}
            notificationProvider={notificationProvider}
            resources={resources}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              disableTelemetry: true,
            }}
          >
            {children}
          </Refine>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
