import PublicHeader from "./PublicHeader"; // Import the new client component
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
       <PublicHeader /> {/* Use the new component here */}
       <main className="flex-1">
          {children}
       </main>
       <footer className="border-t bg-card">
        <div className="container mx-auto py-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Derivify. All rights reserved.</p>
             <div className="flex justify-center gap-4 mt-2">
                <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            </div>
        </div>
       </footer>
    </div>
  );
}