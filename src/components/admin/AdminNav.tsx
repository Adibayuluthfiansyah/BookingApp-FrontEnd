// src/components/admin/AdminNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {LayoutDashboard, Calendar, MapPin,   Settings,Home,RectangleHorizontal,Clock, Sparkles,Icon as LucideIcon} from 'lucide-react';
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
  { label: 'Time Slots (Harga)', icon: Clock, path: '/admin/timeslots' },
  { label: 'Facilities', icon: Sparkles, path: '/admin/facilities' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

interface AdminNavProps {
  className?: string;
  onLinkClick?: () => void; 
}

export function AdminNav({ className, onLinkClick }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col gap-1', className)}>
      {/* Back to Site */}
      <Button
        asChild
        variant="ghost"
        className="justify-start text-muted-foreground"
        onClick={onLinkClick}
      >
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Back to Site
        </Link>
      </Button>

      <div className="border-t my-2"></div>

      {/* Menu Items */}
      {menuItems.map((item) => {
        const isActive = (item.path === '/admin/dashboard')
          ? pathname === item.path
          : pathname.startsWith(item.path);

        return (
          <Button
            key={item.path}
            asChild
            variant={isActive ? 'secondary' : 'ghost'}
            className="justify-start"
            onClick={onLinkClick}
          >
            <Link href={item.path}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}