'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Menu, LogOut, User } from 'lucide-react';
import { getUser } from '@/lib/api';

interface AdminHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function AdminHeader({ isSidebarOpen, setIsSidebarOpen }: AdminHeaderProps) {
  const router = useRouter();
  const user = getUser();

  const handleLogout = async () => {
    try {
      toast.info('Logging out...', { duration: 1000 });

      // Bersihkan localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Broadcast event ke AuthContext supaya reset state
      if (typeof window !== 'undefined') {
        const event = new Event("logout");
        window.dispatchEvent(event);
      }

      toast.success('Berhasil logout!', { duration: 2000 });

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Gagal logout, coba ulangi.');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0 shadow-sm">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:bg-gray-100 cursor-pointer lg:hidden"
            >
              <Menu className="w-6 h-6 " />
            </Button>
            <Link href="/admin/dashboard" className="flex ml-2 md:mr-24">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  KASHMIR BOOKING
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider -mt-1">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
