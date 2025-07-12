
'use client'

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Home, ListOrdered, Wallet, ShieldCheck } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const navLinks = [
    { href: "/admin/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { href: "/admin/orders", icon: <ListOrdered className="h-5 w-5" />, label: "Manage Orders" },
    { href: "/admin/withdrawals", icon: <Wallet className="h-5 w-5" />, label: "Manage Withdrawals" },
  ]

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-primary">
            <ShieldCheck className="h-6 w-6" />
            <span>Derivify Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
            <div className="grid items-start px-4 text-sm font-medium">
                {navLinks.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            pathname === link.href && "bg-muted text-primary"
                        )}
                    >
                        {link.icon}
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            {/* Can add mobile nav toggle, breadcrumbs or search here later */}
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
    </div>
  );
}
