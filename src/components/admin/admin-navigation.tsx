import Link from 'next/link';
import { ShieldCheck, ListOrdered, Wallet } from 'lucide-react';

export default function AdminNavigation({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white p-4">
        <div className="mb-8">
           <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-white"
          >
            <ShieldCheck className="h-6 w-6" />
            <span className="font-bold">Derivify Admin</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
            Dashboard
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
            <ListOrdered className="h-4 w-4"/> Orders
          </Link>
          <Link href="/admin/withdrawals" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
            <Wallet className="h-4 w-4"/> Withdrawals
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-muted/40">
        {children}
      </main>
    </div>
  );
}