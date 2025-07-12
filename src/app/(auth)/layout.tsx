
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="absolute top-4 left-4">
         <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-primary"
          >
            <ShieldCheck className="h-6 w-6" />
            <span className="font-bold">Derivify</span>
          </Link>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Derivify. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
            <Link href="/terms" className="hover:text-primary text-xs">Terms</Link>
            <Link href="/privacy" className="hover:text-primary text-xs">Privacy</Link>
        </div>
       </footer>
    </div>
  );
}
