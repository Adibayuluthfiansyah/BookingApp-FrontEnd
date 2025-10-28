// src/components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { AdminNav } from './AdminNav'; 
import { Package2 } from 'lucide-react'; 

export default function AdminSidebar() {
  return (
    <aside className="hidden border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Logo/Header Sidebar */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6 text-primary" /> 
            <span className="">Admin Panel</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          <AdminNav className="px-4" />
        </div>
      </div>
    </aside>
  );
}