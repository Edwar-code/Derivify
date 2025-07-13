// src/components/auth/logout-button.tsx

'use client';

import { signOut } from 'next-auth/react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  return (
    <DropdownMenuItem
      onSelect={() => signOut({ callbackUrl: '/' })} // Redirect to homepage after logout
      className="cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Logout</span>
    </DropdownMenuItem>
  );
}