'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {LayoutDashboard,Calendar,MapPin,Settings,Home,RectangleHorizontal,Clock,Sparkles,Icon as LucideIcon,} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

const menuItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
  { label: 'Venues', icon: MapPin, path: '/admin/venues' },
  { label: 'Fields', icon: RectangleHorizontal, path: '/admin/fields' },
  { label: 'Time Slots', icon: Clock, path: '/admin/timeslots' },
  { label: 'Facilities', icon: Sparkles, path: '/admin/facilities' },
];

const settingsMenu: NavItem = { label: 'Settings', icon: Settings, path: '/admin/settings' };

interface AdminNavProps {
  className?: string;
  onLinkClick?: () => void;
}

export function AdminNav({ className, onLinkClick }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col gap-0.5 sm:gap-1', className)}>
      {/* Menu Utama */}
      {menuItems.map((item) => {
        const isActive = (item.path === '/admin/dashboard')
          ? pathname === item.path
          : pathname.startsWith(item.path);

        return (
          <Button
            key={item.path}
            asChild
            variant={isActive ? 'secondary' : 'ghost'}
            className="justify-start text-xs sm:text-sm font-medium h-9 sm:h-10 px-3"
            onClick={onLinkClick}
          >
            <Link href={item.path}>
              <item.icon className="mr-2 sm:mr-3 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          </Button>
        );
      })}
      
      {/* Menu Pengaturan dan Kembali */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border space-y-0.5 sm:space-y-1">
        <Button
          asChild
          variant={pathname.startsWith(settingsMenu.path) ? 'secondary' : 'ghost'}
          className="justify-start text-xs sm:text-sm font-medium h-9 sm:h-10 px-3"
          onClick={onLinkClick}
        >
          <Link href={settingsMenu.path}>
            <settingsMenu.icon className="mr-2 sm:mr-3 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{settingsMenu.label}</span>
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="justify-start text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground h-9 sm:h-10 px-3"
          onClick={onLinkClick}
        >
          <Link href="/">
            <Home className="mr-2 sm:mr-3 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">Kembali ke Situs</span>
          </Link>
        </Button>
      </div>
    </nav>
  );
}
