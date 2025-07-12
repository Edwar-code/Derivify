import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // <-- Make sure this import is correct
import { Toaster } from "@/components/ui/toaster";

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
        {/* The Providers component must wrap your page content */}
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}