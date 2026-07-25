'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

const EmbedAuthContext = createContext<string | null>(null);

export function EmbedAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (window.self === window.top) return;

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      if (event.data?.type === 'host:auth' && event.data.token) {
        setToken(event.data.token);
      }
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'extension:ready' }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <EmbedAuthContext.Provider value={token}>
      {children}
    </EmbedAuthContext.Provider>
  );
}

export function useEmbedToken() {
  return useContext(EmbedAuthContext);
}

export function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

// fetch() does not respect Next.js basePath automatically (unlike <Link>),
// so any client-side call to our own API routes must go through this.
export function apiUrl(path: string): string {
  return `${BASE_PATH}${path}`;
}
