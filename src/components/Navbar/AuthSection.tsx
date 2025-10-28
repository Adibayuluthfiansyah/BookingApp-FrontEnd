'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger ,DropdownMenuPortal,} from '@/components/ui/dropdown-menu';
import {Avatar,AvatarFallback,} from '@/components/ui/avatar';
import {User,LogOut,CalendarDays,LayoutDashboard,Loader2, LogIn} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export default function AuthSection() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      toast.error('Logout gagal');
      setLoggingOut(false);
    }
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-10 w-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }


  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <button
            className={`flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all duration-300 
              ${scrolled
                ? 'bg-black text-white border-black hover:bg-gray-800'
                : 'bg-white text-black border-gray-300 hover:bg-gray-100'
              }`}
          >
            <LogIn size={16} />
            <span>Masuk</span>
          </button>
        </Link>
      </div>
    );
  }

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const userInitials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuPortal>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {isAdmin ? (
            <DropdownMenuItem onClick={() => handleNavigate('/admin/dashboard')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleNavigate('/my-bookings')}>
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>My Bookings</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => handleNavigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
