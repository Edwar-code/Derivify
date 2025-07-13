import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./../providers"; // Assuming providers.tsx is in app/
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header"; // Import the new Header

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
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}