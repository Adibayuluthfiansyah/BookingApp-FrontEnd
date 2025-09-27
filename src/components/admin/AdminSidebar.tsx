'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Building, 
  Grid3x3, 
  Settings 
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
}

const menuItems = [
  {
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard'
  },
  {
    href: '/admin/bookings',
    icon: Calendar,
    label: 'Bookings'
  },
  {
    href: '/admin/venues',
    icon: Building,
    label: 'Venues'
  },
  {
    href: '/admin/fields',
    icon: Grid3x3,
    label: 'Fields'
  },
  {
    href: '/admin/settings',
    icon: Settings,
    label: 'Settings'
  }
];

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 z-20 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 shadow-lg ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span className="ml-3 font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}