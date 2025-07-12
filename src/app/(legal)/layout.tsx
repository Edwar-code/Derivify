import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
       <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base text-primary"
          >
            <ShieldCheck className="h-6 w-6" />
            <span className="font-bold">Derivify</span>
          </Link>
       </header>
       <main className="flex-1">
        <div className="container mx-auto max-w-4xl py-12">
            <div className="prose dark:prose-invert">
                 {children}
            </div>
        </div>
       </main>
       <footer className="border-t">
        <div className="container mx-auto py-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Derivify. All rights reserved.</p>
            <p><Link href="/dashboard" className="underline">Back to App</Link></p>
        </div>
       </footer>
    </div>
  );
}
