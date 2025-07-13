'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Archive, Bell, User, Menu, ShieldCheck, HelpCircle, Settings, Sun, Home, Languages, MessageSquare, LogOut, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { signOut } from 'next-auth/react';
import { useTheme } from "next-themes"; // Import the useTheme hook

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState('');
  const { theme, setTheme } = useTheme(); // Get theme state and setter

  useEffect(() => {
    const updateDateTime = () => {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = now.getUTCDate().toString().padStart(2, '0');
        const hours = now.getUTCHours().toString().padStart(2, '0');
        const minutes = now.getUTCMinutes().toString().padStart(2, '0');
        const seconds = now.getUTCSeconds().toString().padStart(2, '0');
        setTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} GMT`);
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); 
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {/* --- HEADER (No Changes) --- */}
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-50">
        {/* ... header content is unchanged ... */}
         <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-foreground font-bold text-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span className="hidden md:inline">Derivify</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link href="/dashboard" className="flex items-center gap-2 text-foreground transition-colors hover:text-primary">
                    <Home className="h-4 w-4" />
                    Dashboard
                </Link>
                <Link href="/orders" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                    <Archive className="h-4 w-4" />
                    My Orders
                </Link>
            </nav>
        </div>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground relative hover:text-primary">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full">
                        <User className="h-5 w-5" />
                        <span className="sr-only">User Profile</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                         <Link href="/profile" className="flex items-center cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                         <Link href="/admin/dashboard" className="flex items-center cursor-pointer">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                         <LogOut className="mr-2 h-4 w-4" />
                         <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-card border-r-border">
                    <nav className="grid gap-6 text-lg font-medium mt-6">
                        <Link href="/dashboard" className="flex items-center gap-4 px-2.5 text-foreground hover:text-primary">
                           <Home className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link href="/orders" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary">
                           <Archive className="h-5 w-5" />
                            My Orders
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 py-8 md:gap-8">
        <div className="container mx-auto">
            {children}
        </div>
      </main>

      {/* --- UPDATED FOOTER --- */}
      <footer className="sticky bottom-0 flex h-10 items-center gap-4 border-t bg-card px-4 md:px-6 z-50 text-muted-foreground">
          <div className="flex items-center gap-4 text-sm flex-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div className="text-xs">{time || 'Loading...'}</div>
            <div className="hidden md:flex items-center gap-4">
                {/* Live Chat Icon - Opens a link in a new tab */}
                <a href="https://tawk.to/" target="_blank" rel="noopener noreferrer" aria-label="Live Chat">
                  <MessageSquare className="h-4 w-4 cursor-pointer hover:text-primary" />
                </a>
                {/* Status Page Icon - Internal navigation */}
                <Link href="/status" aria-label="System Status">
                  <ShieldCheck className="h-4 w-4 cursor-pointer hover:text-primary" />
                </Link>
                {/* Theme Toggle Button */}
                <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    aria-label="Toggle theme"
                    className="text-muted-foreground hover:text-primary"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </button>
                {/* Help Page Icon - Internal navigation */}
                <Link href="/help" aria-label="Help Center">
                  <HelpCircle className="h-4 w-4 cursor-pointer hover:text-primary" />
                </Link>
            </div>
          </div>
          {/* Language Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                <Languages className="h-4 w-4"/>
                EN
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-0">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem disabled>Español</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </footer>
    </div>
  );
}