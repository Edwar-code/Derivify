// File Path: src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/app/providers"; // Use the simple provider for NextAuth
import { Toaster } from "@/components/ui/toaster";
import "./globals.css"; // Assuming you have a global CSS file

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
        {/* The simple Providers component only wraps NextAuth's SessionProvider */}
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}