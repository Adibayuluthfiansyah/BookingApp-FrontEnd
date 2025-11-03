'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, Settings, Bell, Package2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger,DropdownMenuPortal,} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminNav } from './AdminNav';

export default function AdminHeader() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout gagal');
    } finally {
      setLoggingOut(false);
    }
  };

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'A';

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4 border-b bg-background px-3 sm:px-4 md:px-6">
      
      {/* Mobile Menu (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden h-9 w-9">
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-[280px] sm:w-[300px] bg-background">
          {/* Logo di dalam Sheet */}
          <div className="flex h-14 sm:h-16 items-center border-b px-4 sm:px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
              <Package2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-sm sm:text-base">Admin Panel</span>
            </Link>
          </div>
          {/* Navigasi di dalam Sheet */}
          <div className="flex-1 overflow-y-auto py-3 sm:py-4">
            <AdminNav className="px-3 sm:px-4" onLinkClick={() => setMobileMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Logo untuk Mobile (ditampilkan di tengah) */}
      <div className="flex md:hidden flex-1 justify-center">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
          <Package2 className="h-5 w-5 text-primary" />
          <span className="text-sm">Admin Panel</span>
        </Link>
      </div>

      {/* Breadcrumbs area untuk Desktop */}
      <div className="hidden md:block flex-1">
        {/* Breadcrumbs bisa ditambahkan di sini */}
      </div>

      {/* Profile Dropdown */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        {/* Notifikasi */}
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Notifikasi</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-border">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs sm:text-sm">{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end" className="w-48 sm:w-56 bg-card border-border shadow-lg">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs sm:text-sm font-medium leading-none text-foreground truncate">{user?.name || 'Admin'}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border"/>
              <DropdownMenuItem onClick={() => router.push('/admin/settings')} className="cursor-pointer text-xs sm:text-sm">
                <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border"/>
              <DropdownMenuItem onClick={handleLogout} disabled={loggingOut} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer text-xs sm:text-sm">
                {loggingOut ? (
                  <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span>{loggingOut ? 'Keluar...' : 'Keluar'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
    </header>
  );
}