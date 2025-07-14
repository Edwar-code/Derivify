// File Path: src/app/providers.tsx

'use client';

import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // This component's ONLY job is to provide the session context.
  return <SessionProvider>{children}</SessionProvider>;
}