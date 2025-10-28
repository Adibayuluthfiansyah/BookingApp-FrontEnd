import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, LogOut, User, LogIn } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  pathname: string;
  isAuthenticated: boolean;
  user: any; 
  onClose: () => void;
  isScrolled: boolean; 
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navItems,
  pathname,
  isAuthenticated,
  user,
  onClose,
  isScrolled, 
}) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success('Berhasil keluar');
      onClose(); 
    } catch (error) {
      toast.error('Gagal keluar');
    } finally {
      setLoggingOut(false);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login'; 
    if (user.role === 'admin' || user.role === 'super_admin') return '/admin/dashboard';
    return '/my-bookings'; 
  };

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <div className={cn(
      "md:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out shadow-lg",
      isScrolled ? "bg-background border-t border-border" : "bg-background border-t border-border", 
      isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
    )}>
      <div className="px-4 py-6 space-y-2">
        {/* Nav Items */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'block px-4 py-3 rounded-md text-base font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {item.label}
            </Link>
          );
        })}

        {/* Auth Section */}
        <div className="pt-4 mt-4 border-t border-border space-y-2">
          {isAuthenticated && user ? (
            <>
              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-3 mb-2">
                <Avatar className="h-10 w-10 border">
                   <AvatarFallback className="bg-muted text-muted-foreground">{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                   <span className={cn(
                     "inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded uppercase",
                     (user.role === 'admin' || user.role === 'super_admin')
                       ? 'bg-secondary text-secondary-foreground'
                       : 'bg-muted text-muted-foreground'
                   )}>
                     {user.role}
                   </span>
                </div>
              </div>

              {/* Menu Links for Logged In User */}
              <Link
                href={getDashboardLink()}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/my-bookings"
                onClick={onClose}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === '/my-bookings' && "bg-accent text-accent-foreground" 
                )}
              >
                <Calendar size={20} />
                <span>Booking Saya</span>
              </Link>

              <Link
                href="/profile"
                onClick={onClose}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                     pathname === '/profile' && "bg-accent text-accent-foreground" 
                )}              >
                <User size={20} />
                <span>Profil Saya</span>
              </Link>

              {/* Logout Button */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full justify-start px-4 py-3 text-base font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                {loggingOut ? (
                  <Loader2 size={20} className="mr-3 animate-spin" />
                ) : (
                  <LogOut size={20} className="mr-3" />
                )}
                <span>{loggingOut ? 'Keluar...' : 'Keluar'}</span>
              </Button>
            </>
          ) : (
             // Login Button
             <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                 <Link href="/login" onClick={onClose}>
                     <LogIn size={20} className="mr-2" />
                     Masuk / Daftar
                 </Link>
             </Button>
          )}
        </div>
      </div>
    </div>
  );
};