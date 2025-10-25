'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, User } from 'lucide-react';
import Navbar from '@/app/utilities/navbar/page'; 
import Footer from '@/app/utilities/footer/page';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';

const menuItems = [
  {
    label: 'Booking Saya',
    icon: Calendar,
    path: '/my-bookings',
  },
  {
    label: 'Profile Saya',
    icon: User,
    path: '/profile',
  },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Lindungi rute ini jika user belum login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  if (user.role !== 'customer') {
     router.push('/'); // Redirect ke home jika bukan customer
     return null; 
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigasi */}
            <aside className="lg:col-span-1">
              <Card className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const isActive = pathname.endsWith(item.path);
                    return (
                      <Link
                        key={item.label}
                        href={item.path} 
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-lg transition group
                          ${
                            isActive
                              ? 'bg-orange-500 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </Card>
            </aside>

            {/* Konten Utama */}
            <main className="lg:col-span-3">
              {children}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}