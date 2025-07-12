
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
       <header className="sticky top-0 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 z-50">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-primary"
          >
            <ShieldCheck className="h-6 w-6" />
            <span className="font-bold">Derivify</span>
          </Link>
          <div className="flex items-center gap-4">
             <Button asChild variant="ghost">
                <Link href="/login">Log In</Link>
             </Button>
             <Button asChild>
                <Link href="/signup">Sign Up</Link>
             </Button>
          </div>
       </header>
       <main className="flex-1">
          {children}
       </main>
       <footer className="border-t bg-card">
        <div className="container mx-auto py-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Derivify. All rights reserved.</p>
             <div className="flex justify-center gap-4 mt-2">
                <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            </div>
        </div>
       </footer>
    </div>
  );
}
