'use client';

import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // This component provides the session context to all its children.
  return <SessionProvider>{children}</SessionProvider>;
}