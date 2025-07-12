'use client';

import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}```

**Then, update your root layout (`src/app/layout.tsx`)**

```tsx
// Assuming your root layout file looks something like this.
// The key is to add the Providers wrapper.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // Import the new Providers component
import { Toaster } from "@/components/ui/toaster"; // Assuming you have a toaster component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Derivify",
  description: "Your document generation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers> {/* Wrap your children with the provider */}
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}