'use client';

import Link from 'next/link';
import { AdminNav } from './AdminNav';
import { Package2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSidebar() {
  return (
    <aside className={cn(
      "hidden border-r border-border bg-background",
      "md:block"
    )}>
      <div className="flex h-full max-h-screen flex-col">
        {/* Logo/Header Sidebar */}
        <div className="flex h-14 sm:h-16 items-center border-b border-border px-4 lg:px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
            <Package2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <span className="text-sm sm:text-base truncate">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3 sm:py-4">
          <AdminNav className="px-3 lg:px-4" />
        </div>
      </div>
    </aside>
  );
}
