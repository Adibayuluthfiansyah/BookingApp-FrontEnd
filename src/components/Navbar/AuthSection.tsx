'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger,DropdownMenuPortal,} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, CalendarDays, LayoutDashboard, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { cn } from '@/lib/utils'; 

interface AuthSectionProps {
  isScrolled: boolean; 
}

export default function AuthSection({ isScrolled }: AuthSectionProps) { 
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth(); 
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error:unknown) {
      const message = error instanceof Error ? error.message : 'Logout gagal';
      toast.error(message);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-9 w-9">
        <Loader2 className={cn("h-5 w-5 animate-spin", isScrolled ? "text-foreground" : "text-white")} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Button asChild size="sm" variant={isScrolled ? "default" : "secondary"} className={cn(!isScrolled && "bg-white text-black hover:bg-gray-100")}>
        <Link href="/login">
          <LogIn size={16} className="mr-2" />
          Masuk
        </Link>
      </Button>
    );
  }

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const userInitials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9 border-2 border-border hover:border-primary transition-colors">
            {/* <AvatarImage src="/path-to-user-image.jpg" alt={user.name} /> */}
            <AvatarFallback className="bg-muted text-muted-foreground">{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-lg">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-foreground truncate">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />

          {isAdmin ? (
            <DropdownMenuItem onClick={() => handleNavigate('/admin/dashboard')} className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleNavigate('/my-bookings')} className="cursor-pointer">
              <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Booking Saya</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => handleNavigate('/profile')} className="cursor-pointer">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Profil Saya</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
          >
            {loggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>{loggingOut ? 'Keluar...' : 'Keluar'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}