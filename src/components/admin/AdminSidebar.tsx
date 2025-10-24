'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  MapPin,  
  Settings,
  X,
  Home,
  RectangleHorizontal 
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
  },
  {
    label: 'Bookings',
    icon: Calendar,
    path: '/admin/bookings',
  },
  {
    label: 'Venues',
    icon: MapPin,
    path: '/admin/venues',
  },
  {
    label: 'Fields',
    icon: RectangleHorizontal, // Menggunakan icon baru
    path: '/admin/fields',
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/admin/settings',
  },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:top-[57px]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-57px)]">
          {/* Back to Site */}
          <button
            onClick={() => handleNavigation('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition group"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Site</span>
          </button>

          <div className="border-t my-4"></div>

          {/* Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin/dashboard');
            const isDashboardActive = (pathname === '/admin/dashboard' && item.path === '/admin/dashboard');
            const finalIsActive = (item.path === '/admin/dashboard') ? isDashboardActive : isActive;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition group
                  ${
                    finalIsActive
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}